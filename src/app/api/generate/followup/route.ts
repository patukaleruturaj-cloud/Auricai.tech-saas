import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateWithAI } from "@/lib/ai-provider";
import { humanizeMessage } from "@/lib/humanizer";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { bio, company, offer, originalMessage } = body;

        if (!bio || !offer || !originalMessage) {
            return NextResponse.json(
                { error: "Missing required fields: bio, offer, and originalMessage are required." },
                { status: 400 }
            );
        }

        const MASTER_SYSTEM_INSTRUCTION = `You are an elite outbound copywriter specializing in LinkedIn follow-up messages.

Your job is to write follow-ups that feel genuinely human, sharp, and thoughtful — like a real professional checking in quickly, not automation.

PRIMARY GOAL:
Generate follow-ups that feel personal, natural, and reply-worthy while maintaining professionalism and low pressure.

CORE BEHAVIOR:
- Think like the sender, not a writer
- Write like the message was typed in one quick pass
- Prioritize realism over perfection
- Sound like a calm, observant professional — not a marketer

TONE:
- Professional but relaxed
- Natural, direct, and slightly informal
- No stiffness, no over-polish, no slang

HUMANIZATION LAYER (CRITICAL):
- Allow slight imperfection in flow
- Use natural entry points when appropriate:
  Examples: “Not sure if this got buried—”, “Wanted to check back briefly—”, “Quick follow-up in case this slipped—”
- Messages should feel like a continuation, not a new pitch
- Avoid perfect sentence symmetry (real humans don’t write perfectly structured lines)

CONTEXT DEPTH (MANDATORY):
- Reference a specific situation or trigger (scaling, hiring, tool changes, outreach volume, etc.)
- Must feel tied to a real-world scenario
- Should not be reusable across different prospects

TENSION LAYER:
- Add a subtle, honest observation
- Highlight a small tradeoff, friction, or reality
- No exaggeration — keep it believable

STRUCTURE (FLEXIBLE, NOT FIXED):
- Optional soft opener
- Light acknowledgment of busyness (explicit or implied)
- Context reference
- Small insight or tension
- End with a natural, simple question

LANGUAGE RULES:
- Use clear, simple English
- Avoid jargon (leverage, optimize, synergy, etc.)
- Avoid generic praise unless tied to a real detail
- Avoid filler phrases that don’t add meaning
- Keep sentences tight and intentional

OUTPUT RULES:
- Return exactly 2 variations
- 12–18 words per message (STRICT)
- One short paragraph each
- Must end with a natural question
- No emojis
- No hype, no exaggeration

VARIATION CONTROL:
- Each variation must feel meaningfully different
- Avoid repeating structure, phrasing, or rhythm
- Change entry point, tone, or angle slightly

QUALITY STANDARD (ELITE):
Each message must:
- Feel written specifically for one person
- Sound natural when read out loud
- Create a small moment of recognition (“this is relevant to me”)
- Be strong enough to earn a reply without sounding salesy

FINAL SELF-CHECK (MANDATORY):
- Does this sound like a real person, not AI?
- Is this specific enough to not be reused?
- Is there any unnecessary word that can be removed?
- Would this message stand out in a crowded inbox?

If not, rewrite internally until it meets the standard.

OUTPUT FORMAT (STRICT JSON):
{
  "followups": [
    "message 1",
    "message 2"
  ]
}

Return ONLY valid JSON.

---

CONDITIONAL QUALITY CHECK (SMART REWRITE SYSTEM):

Before finalizing the output, evaluate the message quality internally.

Check for the following:

- Does it sound generic or reusable?
- Does it feel too clean, structured, or AI-like?
- Is there any unnecessary filler or weak phrasing?
- Does it lack a clear, specific situation?
- Does it feel like something many people could receive unchanged?

IF NONE of the above issues are present:
→ Return the message as-is (DO NOT rewrite)

IF ANY issue is present:
→ Rewrite the message ONCE to improve:
   - natural human tone
   - specificity
   - variation in phrasing
   - realism and flow

IMPORTANT RULES:
- Do NOT rewrite more than once
- Do NOT over-polish during rewrite
- Keep the message natural and slightly imperfect
- Maintain original intent and context

GOAL:
Only rewrite when necessary, not by default.`;

        const userPrompt = `Prospect Bio: ${bio.substring(0, 1000)}
Company Description: ${company || "Not provided"}
User Offer: ${offer}
Original Message Sent: ${originalMessage}

Generate exactly 2 natural follow-up variations. Return ONLY valid JSON.`;

        const fullPrompt = MASTER_SYSTEM_INSTRUCTION + "\n\n" + userPrompt;

        const FALLBACK_FOLLOWUPS = [
            "Hey — hope you're having a good week. Not sure if my last note got buried, but curious if you've had a chance to look at how we're helpng teams like yours?",
            "Wanted to float this to the top of your inbox. Curious if you're open to a quick swap of ideas on scaling your outbound efforts?"
        ];

        let result;
        let attempts = 0;
        const MAX_ATTEMPTS = 2;

        while (attempts < MAX_ATTEMPTS) {
            try {
                console.log("GENERATION STARTED (Followup)");
                console.log("AI_PROMPT:", fullPrompt);

                const rawResponse = await generateWithAI(fullPrompt, {
                    temperature: 0.7,
                    top_p: 0.9,
                    maxOutputTokens: 4096,
                    responseMimeType: "application/json",
                });

                console.log("AI_RAW_RESPONSE:", rawResponse);

                // Part 2: Fix JSON Parsing Errors - Robust Cleaning
                const cleaned = rawResponse
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .replace(/`json/g, "")
                    .replace(/`/g, "")
                    .trim();

                // Robust JSON extraction
                const firstBrace = cleaned.indexOf('{');
                const lastBrace = cleaned.lastIndexOf('}');
                let resultRaw = cleaned;

                if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                    resultRaw = cleaned.substring(firstBrace, lastBrace + 1);
                }

                let parsed;
                const jsonRegex = /\{[\s\S]*\}/;
                const match = resultRaw.match(jsonRegex);

                if (match) {
                    parsed = JSON.parse(match[0]);
                } else {
                    throw new Error("Invalid JSON format");
                }

                const followups = parsed.followups;
                if (!followups || !Array.isArray(followups) || followups.length < 2) {
                    throw new Error("Malformed JSON structure");
                }

                // Validation: max 200 characters (approx 30 words)
                const validFollowups = followups.filter(f => typeof f === "string" && f.length <= 200);
                if (validFollowups.length < 2) {
                    throw new Error("Character limit exceeded (max 200)");
                }

                // ─── PART 3: APPLY NORMALIZATION (NO EXTRA AI CALLS) ───
                result = validFollowups.slice(0, 2).map(msg => msg.trim());
                break;

            } catch (err: any) {
                attempts++;
                console.error(`[followup] Attempt ${attempts} failed:`, err.message);
                if (attempts >= MAX_ATTEMPTS) {
                    result = FALLBACK_FOLLOWUPS;
                }
            }
        }

        return NextResponse.json({ followups: result });

    } catch (error: any) {
        console.error("[generate/followup] Fatal error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
