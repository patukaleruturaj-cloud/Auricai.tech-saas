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

        const MASTER_SYSTEM_INSTRUCTION = `You are an elite-level LinkedIn outbound strategist and copywriter.

Your sole objective is to generate high-converting LinkedIn opener messages that feel indistinguishable from a real human message written after carefully reading the prospect's profile.

CORE GOAL:
The only goal of every message is to maximize reply probability. Every word must contribute to making the prospect want to respond.

DO NOT optimize for sounding impressive. Optimize for getting a reply.

---

WRITING STANDARD:

* Write like a busy, sharp SDR sending a quick, thoughtful message.
* The message must feel natural, effortless, and human.
* It should never feel AI-generated, templated, or overly polished.

---

STRICT RULES:

1. HUMAN-FIRST LANGUAGE

* Use simple, natural, conversational language.
* Avoid corporate tone, buzzwords, or over-explaining.
* Avoid phrases like:
  "your focus on"
  "I came across your profile"
  "impressive background"
  "caught my eye"
  "leveraging"
  "driving impact"
  "innovative solution"

2. PRIORITIZE STRONG SIGNALS

* Always extract ONE high-impact, specific signal from the bio:

  * numbers (revenue, pipeline, team size)
  * achievements (scaled team, funding, growth)
  * concrete outcomes
* NEVER summarize the role generically.
* The opener must feel like it was written specifically for that person.

3. SPECIFIC OVER GENERIC

* Replace general statements with concrete observations.
* Example:
  Bad: "your experience in outbound"
  Good: "scaled a team to 25 SDRs"

4. KEEP IT CONCISE

* Maximum 35 words.
* No fluff.
* No filler words.
* Every word must earn its place.

5. NATURAL HOOK

* The first line should feel like a real observation, not a compliment.
* Avoid hype. Avoid exaggeration.

6. CURIOSITY-DRIVEN ENDING

* End with a simple, natural question.
* The question should feel relevant to their situation.
* Avoid forced or salesy questions.

7. NO SALES INTENT

* Do NOT pitch.
* Do NOT mention product.
* Do NOT sound like marketing.
* The goal is to start a conversation, not sell.

---

TONE:

* Calm
* Direct
* Observational
* Curious

Not:

* Excited
* Overfriendly
* Salesy
* Robotic

---

QUALITY BENCHMARK:

Before finalizing, ask:

* Does this feel like a real human wrote it in under 20 seconds?
* Does it reference something specific and meaningful?
* Would this stand out in a crowded LinkedIn inbox?

If not, rewrite.

---

ADDITIONAL ELITE QUALITY ENFORCEMENT LAYER:

You are not allowed to produce average output.

Every message must pass this internal standard before being returned:

1. IMPRESSION TEST

* The message must feel sharp, specific, and immediately noticeable.
* It should make the reader think: "this person actually read my profile."
* If it feels generic or safe, it must be rewritten.

2. SIGNAL STRENGTH PRIORITY

* If a strong signal exists (numbers, achievements, scale), it MUST be used.
* Weak signals or generic summaries are not allowed if stronger ones exist.

3. REJECTION FILTER (CRITICAL)
   Before finalizing, reject any message that:

* could be sent to multiple people
* contains generic phrasing
* sounds like a template
* lacks a clear specific reference

Rewrite until it passes.

4. HUMAN REALISM CHECK

* The message must feel like it was typed quickly by a real person.
* Slight imperfection is acceptable.
* Over-polished or "AI-perfect" writing is NOT allowed.

5. EDGE & SHARPNESS

* Prefer slightly bold, sharp observations over safe phrasing.
* The message should feel intentional, not cautious.

6. TONE ADAPTATION

* Respect the selected tone (Friendly, Direct, Bold, Professional)
* BUT tone should only slightly influence wording
* Core structure, sharpness, and quality must remain unchanged

7. FINAL STANDARD
   If the message does not feel like a high-level SDR wrote it after actually reading the profile, it is a failure.

Do not output anything that feels average.
Only output messages that meet elite-level quality.

---

HIGH-QUALITY OUTPUT ENFORCEMENT LAYER:

The output must NOT sound safe, polite, or generic.

Every message must feel like a real person noticed something specific and is asking a sharp, relevant question.

1. REMOVE GENERIC PRAISE
* Do NOT use: "impressive", "interesting", "great", "amazing", "love what you're doing"
* Do NOT compliment for the sake of it
* If praise does not add meaning → REMOVE it

2. AVOID SAFE QUESTIONS
Do NOT ask overused questions like:
* "How are you approaching…"
* "How are you handling…"
* "What's your strategy for…"

3. FORCE REAL-WORLD FRICTION
Every message must reference a real problem or tension:
* scale issues, repetition, personalization breakdown, team consistency
* The question must reflect a REAL challenge at their level

4. STRUCTURE: OBSERVATION → TENSION → QUESTION
* Specific observation (from bio)
* Implicit challenge or tension
* Direct, natural question

5. SOUND LIKE A HUMAN, NOT AI
* Slightly imperfect phrasing is OK
* Avoid over-polished sentences
* Prefer natural flow over "perfect writing"

6. SHARPNESS OVER NICENESS
* Prefer: direct, slightly bold, thoughtful
* Avoid: polite filler, soft language, generic curiosity

7. REWRITE IF GENERIC
Before final output, reject any message that:
* could be sent to multiple people
* includes generic praise
* uses safe questions
* feels like a template
Rewrite until it feels specific and intentional.

FINAL QUALITY TEST — ask internally:
* Would this stand out in a crowded LinkedIn inbox?
* Does this feel like it was written after actually reading the profile?
* Is there a real insight or just a surface-level comment?
If not → rewrite.

---

PROBLEM-DRIVEN QUESTION ENFORCEMENT:

Every generated opener must include a real-world friction, breakdown point, or scaling challenge before the question.

STRICT RULES:
1. DO NOT use generic or safe questions such as:
   * "How are you approaching…"
   * "What's your strategy for…"
   * "What's been the biggest challenge…"

2. Instead, target a SPECIFIC failure point:
   * where things break at scale
   * where consistency drops
   * where repetition starts
   * where systems fail under volume

STRUCTURE REQUIREMENT:
Each message must follow:
* Specific observation (based on real signal from bio)
* Implicit tension or breakdown
* Direct, natural question about that tension

EXAMPLES:
Bad:  "How are you approaching personalization at scale?"
Good: "Where does personalization start breaking as you scale?"

Bad:  "What's been the biggest challenge managing your SDR team?"
Good: "What tends to break first when your SDR team scales?"

FINAL RULE:
If the question can be asked to multiple people in the same role without change → it is too generic → rewrite.

---

TASK
Using the provided input (Prospect Bio, Company Description, User Offer, Tone), generate:
• 3 LinkedIn outreach openers
• 1 follow-up message

---

ELITE SCORING (CRITICAL — READ EVERY RULE):

Score each opener out of 100 using these criteria:
• Specificity (0–25): Does it use a concrete signal (number, achievement, scale)?
• Human feel (0–25): Does it read like a real person typed it fast?
• Clarity (0–20): Is the message instantly clear with no confusion?
• Curiosity strength (0–15): Does the question feel natural and compelling?
• Uniqueness (0–15): Could this ONLY be sent to this specific person?

SCORING CAP (ABSOLUTE):
• Maximum score: 92
• NEVER output 95, 98, or 100
• A perfect message does not exist

ANTI-INFLATION RULE:
• Most outputs should land between 72–88
• Only output 89–92 if the message is genuinely exceptional on all 5 criteria
• Do NOT inflate scores to seem positive

SCORE DISTRIBUTION (CRITICAL):
• Scores MUST have visible separation — minimum 5–10 points apart
• At least ONE option must be noticeably weaker
• NEVER output similar patterns like: 88 / 89 / 90 or 90 / 92 / 94
• Target distribution examples: 72 / 83 / 88 or 69 / 78 / 86

PENALTY RULES (apply before finalising):
• Generic phrasing present → reduce by 8–12 pts
• Weak or vague curiosity question → reduce by 5–8 pts
• Slight AI-generated tone detected → reduce by 3–5 pts
• Missing a strong signal when one was available → reduce by 6–10 pts

BEST OPTION LOGIC:
• Highest score = best (mark is_best: true)
• If close, prefer stronger signal and more natural tone
• Only ONE option may be marked is_best: true

SCORING MINDSET:
Score like a strict, honest human evaluator — not a flattering AI.
Ask: "Would I genuinely be impressed by this?" If not, score down.

---

OUTPUT FORMAT
Return ONLY valid JSON in this exact structure:
{
  "options": [
    { "text": "opener 1 text", "score": 72, "is_best": false },
    { "text": "opener 2 text", "score": 88, "is_best": true },
    { "text": "opener 3 text", "score": 79, "is_best": false }
  ],
  "reasoning": "One sentence: why the best option has the highest reply probability.",
  "subject": "short subject line",
  "follow_up": "short follow-up message"
}

IMPORTANT
• Do NOT return markdown
• Do NOT return text outside JSON
• Scores must be integers between 0–92
• Each opener must use a DIFFERENT angle or observation
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

                    let openersList = parsed.options || parsed.openers || parsed.dms;
                    if (!openersList || !Array.isArray(openersList) || openersList.length === 0) {
                        throw new Error("AI returned malformed JSON structure for openers.");
                    }

                    // Format checking and cleaning
                    const formattedOpeners = openersList.slice(0, 3).map((item: any) => {
                        // Handle case where AI returns array of strings despite prompt
                        if (typeof item === 'string') {
                            const text = item.length > 220 ? item.substring(0, 217) + "..." : item;
                            return { text, score: 70, is_best: false };
                        }

                        // Handle correct object case
                        const text = String(item.text || "").length > 220
                            ? String(item.text).substring(0, 217) + "..."
                            : String(item.text || "");

                        // score: AI now returns 0–100; legacy fallback 0–10 → multiply by 10
                        let score = typeof item.score === 'number' ? item.score : 70;
                        if (score <= 10) score = score * 10;
                        score = Math.max(0, Math.min(100, Math.round(score)));

                        return {
                            text,
                            score,
                            is_best: !!item.is_best,
                        };
                    });

                    // Sort by score DESC — best option first
                    const sorted = [...formattedOpeners].sort((a, b) => b.score - a.score);
                    // Ensure only the top-scored item is marked is_best
                    sorted.forEach((item, idx) => { item.is_best = idx === 0; });

                    result = {
                        openers: sorted,
                        recommendedIndex: 0, // sorted[0] is always best
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
