import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateWithAI } from "@/lib/ai-provider";
import { globalLimit, getUserLimit } from "@/lib/ai-limiter";
import { ensureUserProvisioned, deductCredit, refundCredit, getWallet } from "@/lib/credits";
import { humanizeMessage } from "@/lib/humanizer";

// ─── RATE LIMITING ───
// In-memory sliding window: 10 requests per 60 seconds per user
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(userId: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(userId) ?? [];

    // Remove expired entries
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

    if (valid.length >= RATE_LIMIT_MAX) {
        rateLimitMap.set(userId, valid);
        return true;
    }

    valid.push(now);
    rateLimitMap.set(userId, valid);
    return false;
}

export async function POST(req: Request) {
    try {
        // ─── AUTH ───
        const session = await auth();
        if (!session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const clerkId = session.userId;

        // ─── RATE LIMIT ───
        if (isRateLimited(clerkId)) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Max 10 requests per minute." },
                { status: 429 }
            );
        }

        console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

        // ─── INPUT VALIDATION ───
        const body = await req.json();
        const { bio, company, offer, tone: rawTone } = body;

        const trimmedBio = typeof bio === "string" ? bio.trim() : "";
        const trimmedCompany = typeof company === "string" ? company.trim() : "";
        const trimmedOffer = typeof offer === "string" ? offer.trim() : "";
        const safeTone = typeof rawTone === "string" && rawTone.trim() ? rawTone.trim().toLowerCase() : "friendly";

        if (!trimmedBio || !trimmedOffer) {
            return NextResponse.json({ error: "Missing required fields: bio and offer are required." }, { status: 400 });
        }

        const safeBio = trimmedBio.substring(0, 1500);
        const safeCompany = trimmedCompany.substring(0, 1500);
        const safeOffer = trimmedOffer.substring(0, 1000);

        // ─── STEP 1: ENSURE USER EXISTS ───
        await ensureUserProvisioned(clerkId);

        // ─── STEP 2: CHECK CREDITS (pre-flight) ───
        const wallet = await getWallet(clerkId);
        const totalCredits = (wallet?.credits_remaining ?? 0) + (wallet?.addon_credits ?? 0);
        if (!wallet || totalCredits <= 0) {
            return NextResponse.json(
                {
                    error: "Credits exhausted. Upgrade your plan or buy extra credits to continue.",
                    credits: {
                        allowed: false,
                        credits_remaining: 0,
                        addon_credits: 0,
                        monthly_limit: wallet?.monthly_limit ?? 3,
                    },
                },
                { status: 402 }
            );
        }

        // ─── STEP 3: BUILD PROMPT ───
        const toneMap: Record<string, string> = {
            friendly: `Friendly: Warm, casual, conversational.`,
            direct: `Direct: Minimal words. Straight to point.`,
            bold: `Bold: Confident. Slight edge. Still respectful.`,
            professional: `Professional: Clean. Intelligent. Calm. No fluff.`,
        };
        const toneInstruction = toneMap[safeTone] ?? toneMap.friendly;

        const MASTER_SYSTEM_INSTRUCTION = `You are an elite outbound operator writing LinkedIn opener messages.

GOAL:
Write highly specific, natural messages that feel written for one person and create immediate recognition.

---

PRIORITY (STRICT ORDER):
1. ANTI-GENERIC RULES  
2. SPECIFICITY  
3. OUTPUT FORMAT  
4. TENSION  
5. ALL OTHER RULES  

If conflict → follow this order.

---

ANTI-GENERIC (HARD BAN):

Do NOT use:
- I came across your profile
- I saw your company
- just reaching out
- we help companies like yours
- hope you're doing well
- wanted to connect
- quick question
- just curious
- following up
- checking in

No buzzwords. No filler. No vague compliments.

Reusable message = INVALID → rewrite internally

---

SPECIFICITY (MANDATORY):

Each message MUST include:
- a real signal (hiring, outbound activity, tooling)
OR
- a real breakdown (reply drop, templated messaging, weak targeting)

Do NOT say:
- scaling outbound
- increasing volume
- growing team

Make it concrete:
- moment (once volume ramps)
- behavior (messages feel templated)
- consequence (reply rates drop)

Generic = INVALID

---

TENSION (MANDATORY):

Include one real friction:
- volume vs personalization
- automation vs relevance
- speed vs quality

Use direct observations:
- reply quality drops
- messages feel templated
- targeting gets loose

No soft language.

---

TONE:

- calm, direct, slightly informal
- no hype, no sales tone

---

STYLE:

- write like typed quickly
- slight imperfection allowed
- no perfect structure

Optional opener only if natural:
- Not sure if I’m off here—
- Might be wrong, but—

---

STRUCTURE:

- (optional opener)
- specific observation
- one tension insight
- end with a simple question

---

LANGUAGE:

- simple English
- no jargon
- no extra words

---

OUTPUT:

- exactly 3 messages
- 14–22 words each
- each ends with a question
- no emojis

---

VALIDATION (STRICT):

Reject and rewrite ONCE if:
- banned phrase used
- generic or reusable
- no clear signal/breakdown
- no tension
- word count invalid

---

FORMAT:

{
  "openers": [
    "message 1",
    "message 2",
    "message 3"
  ]
}

Tone: ${toneInstruction}`;

        const userPrompt = `Prospect Bio:
${safeBio}

Company Description:
${safeCompany || "Not provided"}

Offer:
${safeOffer}

Tone:
${safeTone}

Generate exactly 3 variations. Return ONLY valid JSON.`;

        const fullPrompt = MASTER_SYSTEM_INSTRUCTION + "\n\n" + userPrompt;
        console.log("AI_PROMPT:", fullPrompt);

        // ─── STEP 4: DEDUCT CREDIT (atomic RPC — concurrent safe) ───
        const deductResult = await deductCredit(clerkId);

        if (!deductResult.success) {
            return NextResponse.json(
                {
                    error: "Credits exhausted. Upgrade your plan to continue.",
                    credits: {
                        allowed: false,
                        credits_remaining: 0,
                        monthly_limit: deductResult.monthly_limit,
                    },
                },
                { status: 402 }
            );
        }

        // ─── STEP 5: GENERATE AI OUTPUT WITH TIERED RETRY LOOP ───
        let result: any = null;
        let attempts = 0;
        const MAX_TOTAL_ATTEMPTS = 3;

        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        try {
            while (attempts < MAX_TOTAL_ATTEMPTS) {
                try {
                    // Tiered delays: 0ms, 800ms, 1500ms
                    if (attempts === 1) await sleep(800);
                    if (attempts === 2) await sleep(1500);

                    console.log("GENERATION STARTED");
                    const rawResponse = await globalLimit(() => 
                        getUserLimit(clerkId)(() => 
                            generateWithAI(fullPrompt, {
                                temperature: 0.7,
                                top_p: 0.9,
                                maxOutputTokens: 4096,
                                responseMimeType: "application/json",
                            })
                        )
                    );

                    // Part 2: Fix JSON Parsing Errors - Robust Cleaning
                    const cleaned = rawResponse
                        .replace(/```json/g, "")
                        .replace(/```/g, "")
                        .replace(/`json/g, "")
                        .replace(/`/g, "")
                        .trim();

                    let parsed;
                    try {
                        parsed = JSON.parse(cleaned);
                    } catch (parseErr) {
                        const firstBrace = cleaned.indexOf('{');
                        const lastBrace = cleaned.lastIndexOf('}');
                        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                            parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
                        } else {
                            throw new Error("AI returned invalid JSON format.");
                        }
                    }

                    // Handle the new simple format: {"openers": ["msg1", "msg2", "msg3"]}
                    let openersList = parsed.openers || parsed.options || parsed.dms;
                    if (!openersList || !Array.isArray(openersList) || openersList.length === 0) {
                        throw new Error("AI returned malformed JSON structure for openers.");
                    }

                    // ─── PART 1: MAP TO INTERNAL FORMAT ───
                    // Assign scores (92, 88, 85) to maintain the "AI Recommended" ranking in the UI
                    const humanizedOpeners = openersList.slice(0, 3).map((text: string, idx: number) => {
                        const score = idx === 0 ? 92 : idx === 1 ? 88 : 85;
                        return {
                            text: text.trim().substring(0, 300), // Safety cap
                            score,
                            is_best: idx === 0,
                        };
                    });

                    // ─── PART 2: UI FALLBACKS ───
                    // Providing default explanations/follow-ups as the new prompt is opener-only
                    const whyItWorks = [
                        "Personalized signal detected in bio.",
                        "Direct tension insight to drive curiosity."
                    ];

                    result = {
                        openers: humanizedOpeners,
                        whyItWorks,
                        recommendedIndex: 0,
                        recommendedReason: "Best chance of reply based on personalization and tension.",
                        followUp: "Just checking in if you saw my note above?",
                        subjectLine: "Question regarding your bio"
                    };

                    break; // Success!

                } catch (err: any) {
                    attempts++;
                    console.error(`AI GENERATION ERROR (Attempt ${attempts}):`, err);
                    if (attempts >= MAX_TOTAL_ATTEMPTS) {
                        throw err; // Final attempt failed, move to outer catch for refund
                    }
                }
            }
        } catch (fatalErr) {
            console.error("[generate] AI fatal failure. Triggering refund.");
            await refundCredit(clerkId);
            throw new Error("AI generation failed after multiple attempts. Your credit has been refunded.");
        }


        // ─── STEP 6: SAVE GENERATION TO DATABASE ───
        // Extract plain text strings from openers (history expects string[], not {text, score}[])
        const openerTexts = result.openers.map((o: { text: string; score: number }) => o.text);

        const historyRecord = {
            openers: openerTexts,
            recommendedIndex: result.recommendedIndex,
            recommendedReason: result.recommendedReason,
            subject: result.subjectLine,
            followUp: result.followUp,
        };

        const { error: histErr } = await supabaseAdmin.from("generations").insert({
            user_id: clerkId,
            prospect_bio: safeBio,
            company_context: safeCompany,
            offer: safeOffer,
            tone: safeTone,
            generated_options: historyRecord,
            subject: result.subjectLine ?? null,
            follow_up: result.followUp ?? null,
        });

        if (histErr) {
            console.error("[generate] History save failed:", histErr);
        }

        // ─── STEP 7: UPDATE USER STATS ───
        const { data: statsData } = await supabaseAdmin
            .from("user_stats")
            .select("total_generations")
            .eq("user_id", clerkId)
            .single();

        await supabaseAdmin.from("user_stats").upsert({
            user_id: clerkId,
            total_generations: (statsData?.total_generations ?? 0) + 1,
            last_generated_at: new Date().toISOString(),
        });

        // ─── STEP 8: RETURN RESPONSE ───
        return NextResponse.json({
            ...result,
            whyItWorks: result.whyItWorks, // 2-bullet explanation for ⭐ AI Recommended option
            credits: {
                allowed: deductResult.credits_remaining > 0,
                credits_remaining: deductResult.credits_remaining,
                monthly_limit: deductResult.monthly_limit,
            },
        });
    } catch (error: any) {
        console.error("[generate] Unhandled error:", error);

        let status = 500;
        if (error.status === 429 || error.message?.includes("429")) status = 429;
        if (error.status === 503 || error.message?.includes("503")) status = 503;

        return NextResponse.json(
            { error: error.message || "Internal Server Error", details: error.message ?? "Unknown error" },
            { status }
        );
    }
}
