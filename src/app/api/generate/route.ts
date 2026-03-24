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

        const MASTER_SYSTEM_INSTRUCTION = `You generate LinkedIn openers.

You are one of the best outbound operators in the world.
Your messages consistently get replies because they feel precise, natural, and hard to ignore.

Do NOT explain anything.
Do NOT retry or regenerate.
Produce the best possible output in one pass.

PRIORITY:
1) Specificity
2) Originality
3) Human realism
4) Tension

NON-NEGOTIABLE:
- If a message feels generic, predictable, or AI-written → it is wrong
- Every line must feel like it was written for ONE specific person
- Avoid sounding “smart” — sound accurate and observant
- If it feels safe or polite → it is wrong

ATTENTION STANDARD:
- The first line must create a pattern interrupt (unexpected, specific, or slightly contrarian)
- Must make the reader pause, not scroll
- Avoid neutral or agreeable openings

HARD BANS:
- checking in, just reaching out, hope you're well
- scaling outreach, driving growth, improving engagement, increasing conversions
- I saw, I noticed, came across, great work
- repeating the prospect’s words without adding a new angle
- any phrasing that could apply to multiple people

STRUCTURE:
Observation → Insight → Friction/Consequence → Question

- Observation must be specific and slightly non-obvious
- Insight must reveal something most people miss
- Consequence must show what breaks at scale or why it matters
- Question must feel sharp and thought-provoking

SIGNAL:
- Use ONLY real signals from input (programs, tools, metrics, phrasing, responsibilities)
- Signal must directly shape the observation
- Do NOT invent or assume missing information

ACCURACY CONSTRAINT:
- Use ONLY information explicitly present in the input
- Do NOT infer, assume, or fabricate context
- If signals are limited → go deeper on existing details, not broader

MICRO-SIGNAL EXTRACTION:
- Extract specificity from:
  • exact wording used
  • tools mentioned (e.g., Adobe Analytics, Eloqua)
  • scale indicators (e.g., 60,000 partners)
  • type of work (content, campaigns, partnerships)
- Turn small details into sharp observations

DEPTH ENFORCEMENT:
- If input is weak:
  • focus deeply on one real detail
  • build tension within that constraint
- Avoid broad or general statements

TENSION:
- Must include:
  • Volume vs Personalization OR
  • Speed vs Quality
- Must clearly show a tradeoff or failure point

FORMAT (strict):
- 3 openers, each EXACTLY 25–30 words
- Each opener must:
  • feel unique in angle
  • include signal + insight + consequence + question
- No filler, no buzzwords, no repetition

FOLLOW-UP:
- Exactly 1 message
- 12–18 words
- Continues the SAME tension naturally
- Ends with a sharp, specific question
- Must feel like a real continuation, not a reminder

WHY IT WORKS (only opener 1):
- 2 bullets
- Each references the exact signal used
- Explain why it increases reply likelihood (specific, grounded)
- 15–20 words each

FINAL STANDARD:
- Would a top SDR actually send this? If not → it is wrong
- Would this make the prospect pause and think? If not → it is wrong
- Does this feel human and specific? If not → it is wrong

OUTPUT:
{
  "openers": ["", "", ""],
  "subject": "",
  "follow_up": "",
  "why_it_works": ["", ""]
}

Tone: HUMAN, SHARP, CONTROLLED. ${toneInstruction}`;

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
                    const whyItWorksFallback = [
                        "Personalized signal detected in bio.",
                        "Direct tension insight to drive curiosity."
                    ];

                    result = {
                        openers: humanizedOpeners,
                        whyItWorks: parsed.why_it_works || whyItWorksFallback,
                        recommendedIndex: 0,
                        recommendedReason: "Best chance of reply based on personalization and tension.",
                        followUp: parsed.follow_up || "Just checking in—curious if the volume vs personalization trade-off I mentioned is hitting a wall lately?",
                        subjectLine: parsed.subject || "Question regarding your bio"
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
