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

Tone: Friendly (warm, conversational)`;

        const userPrompt = `Prospect Bio:
${bio.substring(0, 1500)}

Company Description:
${company || "Not provided"}

Offer:
${offer}

Original Message Sent:
${originalMessage}

Generate exactly 3 variations. Return ONLY valid JSON.`;

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
                    maxOutputTokens: 2048,
                    responseMimeType: "application/json",
                });

                console.log("AI_RAW_RESPONSE:", rawResponse);

                // Robust cleaning
                const cleaned = rawResponse
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .replace(/`json/g, "")
                    .replace(/`/g, "")
                    .trim();

                let parsed;
                try {
                    parsed = JSON.parse(cleaned);
                } catch (e) {
                    const firstBrace = cleaned.indexOf('{');
                    const lastBrace = cleaned.lastIndexOf('}');
                    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
                        parsed = JSON.parse(cleaned.substring(firstBrace, lastBrace + 1));
                    } else {
                        throw new Error("Invalid JSON format");
                    }
                }

                const openers = parsed.openers || parsed.followups || parsed.options;
                if (!openers || !Array.isArray(openers) || openers.length === 0) {
                    throw new Error("Malformed JSON structure");
                }

                // Map to strings and return
                result = openers.slice(0, 3).map(msg => (typeof msg === "string" ? msg : msg.text || "").trim());
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
