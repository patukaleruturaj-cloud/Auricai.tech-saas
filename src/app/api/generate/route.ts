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
        const MASTER_SYSTEM_INSTRUCTION = `You generate LinkedIn openers.

You are a top 0.1% outbound operator. Messages feel sharp, human, and hard to ignore.

Do NOT explain. Generate correctly in one pass.

PRIORITY:
1) Specificity
2) Non-obvious insight
3) Human realism
4) Tension

NON-NEGOTIABLE:
- If it feels generic, familiar, or reusable → wrong
- Must feel written for ONE person
- Avoid polished/AI tone → keep it real
- No filler words or phrases
- Remove any unnecessary words
- Every word must add meaning or tension
- If a sentence works without a word → remove it
- Remove filler: often, usually, most, really, truly, actually
- No safe or average phrasing

HARD BANS:
- checking in, just reaching out, hope you're well
- scaling outreach, driving growth, improving engagement
- I saw, I noticed, came across, great work
- repeating their words without adding insight
- common industry statements

ATTENTION:
- First line = concrete situation + hidden problem/contradiction
- Must stop scrolling (no neutral phrasing)
- No compliments, summaries, or safe phrasing
- Must feel worth replying to

STRUCTURE:
Observation → Insight → Consequence → Question

- Observation: specific signal
- Insight: non-obvious, no common patterns (e.g., “most teams”, “outbound often”), use specific, less-obvious angle, prefer counterintuitive insight
- Consequence: tangible (meetings, replies, pipeline), no abstract impact
- Question: sharp, slightly challenging

SIGNAL:
- Use ONLY real input
- Go deep on one detail (wording, role, tools, scale)
- HYPER-PERSONALIZATION: Avoid the "summarization trap." Don't just list what they do; use a specific niche detail to prove you've actually read their profile.

TONE DEFINITIONS:
- FRIENDLY: Natural, conversational, approachable. Focus on high interest and lower friction.
- BOLD: High-tension, provocative, challenge status quo. Focus heavily on negative consequences.
- DIRECT: Minimalist, no-nonsense, immediate pattern interrupt. Extreme brevity.
- PROFESSIONAL: Polished, structured, business-expert. Human but clearly authoritative.

TENSION:
- Show what breaks when scaling (volume vs personalization or speed vs quality)

SCORING:
Score each opener out of 100:
* Personalization (0–35): real, specific signals used
* Pattern Interrupt (0–25): strength/unexpected hook
* Tension (0–25): clarity of tradeoff + consequence
* Humanization (0–15): natural, non-AI tone, conversational flow

CONSISTENCY:
- All openers must meet elite standard
- If one is weaker → strengthen within same generation

RULES:
* All 3 scores must be different
* Avoid close scores (e.g., 90, 89, 88)
* Highest score = strongest overall opener
* Do NOT assign equal scores
* Score strictly, not generously
* Assume strong competition between options

FORMAT:
- 3 openers, 24–27 words each
- Distinct angles
- No filler, no buzzwords

FOLLOW-UP:
- 1 message, 12–18 words
- Continues same idea
- References opener detail
- Adds slight tension
- Ends with sharp question
- Ban: circling back, following up, just checking

SUBJECT:
- 3–5 words
- Curiosity or friction-driven
- No generic phrasing

WHY IT WORKS (only opener 1):
- 2 bullets only
- ≤8–10 words each
- Each must reference a specific signal from the opener
- Each must explain impact in plain terms
- No generic phrasing (e.g., “shows understanding”, “demonstrates”)
- No explanations, no filler

FINAL CHECK:
- Would this stand out?
- Is it human + non-obvious?

OUTPUT:
{
  "openers": [
    {"text": "", "score": 0},
    {"text": "", "score": 0},
    {"text": "", "score": 0}
  ],
  "subject": "",
  "follow_up": "",
  "why_it_works": ["", ""]
}

Tone: HUMAN, ${safeTone.toUpperCase()}`;

        const userPrompt = `Prospect Bio:
${safeBio}

Company Description:
${safeCompany || "Not provided"}

Offer:
${safeOffer}

Tone Preference:
${safeTone}

INSTRUCTIONS:

* Generate exactly 3 elite-level openers
* Each must strictly follow system rules
* Output must be highly specific, human, and non-generic
* No safe or predictable phrasing
* Each opener must use a different angle
* Tone Requirement: ${safeTone.toUpperCase()} (Ensure the language reflects this specific style)

Return ONLY valid JSON.`;

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
                    const rawOpeners = (parsed.openers || parsed.options || parsed.dms).slice(0, 3);
                    
                    const processedOpeners = rawOpeners.map((item: any, idx: number) => {
                        const text = typeof item === "string" ? item : (item.text || "");
                        const aiScore = typeof item === "object" && typeof item.score === "number" ? item.score : 0;
                        
                        // Intelligent fallback if AI failed to score
                        const fallbackScore = idx === 0 ? 92 : idx === 1 ? 88 : 85;
                        const finalScore = aiScore > 0 ? aiScore : fallbackScore;

                        return {
                            text: text.trim().substring(0, 500),
                            score: finalScore,
                            is_best: false,
                        };
                    });

                    // Rank by score descending
                    processedOpeners.sort((a: any, b: any) => b.score - a.score);
                    if (processedOpeners.length > 0) processedOpeners[0].is_best = true;

                    const humanizedOpeners = processedOpeners;

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
