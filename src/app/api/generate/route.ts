import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { generateWithAI } from "@/lib/ai-provider";
import { ensureUserProvisioned, deductCredit, refundCredit, getWallet } from "@/lib/credits";

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
                        monthly_limit: wallet?.monthly_limit ?? 5,
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

        const MASTER_SYSTEM_INSTRUCTION = `You are an elite LinkedIn outbound strategist who specializes in writing highly personalized cold outreach messages that consistently generate replies.

Your job is to generate outreach messages that feel human, thoughtful, and natural.

The messages should feel like they were written by a top outbound salesperson who researched the prospect manually.

PRIMARY OBJECTIVE
The goal of the message is NOT to pitch.
The goal is to start a natural conversation and maximize reply rates.

---

WRITING PRINCIPLES
Messages must follow these rules:

Human Tone
Messages must sound like a real person wrote them.
Avoid robotic phrases such as: "I hope this message finds you well."
Use conversational openers instead.
Example: "Really liked what you're building at [Company]. Quick question..."

Hyper Personalization
Each opener should reference something from the prospect bio, their role, their company, or their work focus.
If specific personalization is limited, reference their industry or problem space.
Generic outreach must be avoided.

Curiosity Hook
Messages should create curiosity. The prospect should feel inclined to respond.
Examples: 
"Curious how you're currently approaching..."
"Quick question about..."
"Saw what you're building around..."

Conversation First
The opener should start a conversation. Do NOT pitch the product immediately.
Focus on asking thoughtful questions or making relevant observations.

Message Length Rules
Opener messages must be 15–35 words maximum.
Follow-up messages must be 10–25 words maximum.
Messages must stay concise and conversational.

Tone Adaptation
Adjust writing style based on the selected tone.
Friendly → warm, casual conversation
Direct → short and straight to the point
Bold → confident and curiosity-driven
Professional → polished but conversational

Quality Check
Every message must pass this test: "Would a top outbound sales expert send this message manually?"
If the message sounds generic or robotic, rewrite it.

ADDITIONAL WRITING INSTRUCTIONS:
* Write LinkedIn openers that sound natural and human, like a busy SDR sending a quick message.
* Avoid hype phrases such as “super impressive”, “truly amazing”, or overly enthusiastic compliments.
* Keep the tone conversational, simple, and professional.
* The opener must be concise and natural, under 35 words.
* Focus on one relevant observation from the prospect’s bio and end with a curiosity-driven question.

---

TASK
Using the provided input (Prospect Bio, Company Description, User Offer, Tone), generate:
• 3 LinkedIn outreach openers
• 1 follow-up message

Scoring
After generating the openers, score each opener from 1–10 based on:
• personalization
• curiosity
• natural tone
• reply probability
Select the best opener.

---

OUTPUT FORMAT
Return ONLY valid JSON in this exact structure:
{
  "openers": [
    { "text": "opener 1", "score": 0 },
    { "text": "opener 2", "score": 0 },
    { "text": "opener 3", "score": 0 }
  ],
  "best_index": 0,
  "reasoning": "Brief explanation why this opener has the highest reply probability.",
  "subject": "short subject",
  "follow_up": "short follow up message"
}

IMPORTANT
• best_index must be 0-based (0,1,2)
• Do NOT return markdown
• Do NOT return text outside JSON
• Tone specification: ${toneInstruction}`;

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
                    const rawResponse = await generateWithAI(fullPrompt, {
                        temperature: 0.7,
                        top_p: 0.9,
                        maxOutputTokens: 4096,
                        responseMimeType: "application/json",
                    });

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

                    let openersList = parsed.openers || parsed.dms;
                    if (!openersList || !Array.isArray(openersList) || openersList.length === 0) {
                        throw new Error("AI returned malformed JSON structure for openers.");
                    }

                    // Format checking and cleaning
                    const formattedOpeners = openersList.slice(0, 3).map((item: any) => {
                        // Handle case where AI returns array of strings despite prompt
                        if (typeof item === 'string') {
                            const text = item.length > 220 ? item.substring(0, 217) + "..." : item;
                            return { text, score: 7.0 };
                        }

                        // Handle correct object case
                        const text = String(item.text || "").length > 220
                            ? String(item.text).substring(0, 217) + "..."
                            : String(item.text || "");

                        return {
                            text,
                            score: typeof item.score === 'number' ? item.score : 7.0
                        };
                    });

                    result = {
                        openers: formattedOpeners,
                        recommendedIndex: typeof parsed.best_index === 'number' ? parsed.best_index : 0,
                        recommendedReason: parsed.reasoning || "Best chance of reply based on personalization and curiosity.",
                        followUp: parsed.follow_up || parsed.followUp || "Just checking in to see if you saw my previous message.",
                        subjectLine: parsed.subject || parsed.subjectLine || "Quick question"
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
