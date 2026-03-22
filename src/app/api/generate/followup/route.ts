import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateWithAI } from "@/lib/ai-provider";
import { globalLimit, getUserLimit } from "@/lib/ai-limiter";
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

        const MASTER_SYSTEM_INSTRUCTION = `You are a LinkedIn follow-up generation engine.
Your goal is to generate follow-ups that feel like a natural continuation of a specific thought, with ZERO generic filler.

STRICT FOLLOW-UP RULES:

1. NO GENERIC PHRASES:
   - BAN: "Just checking in...", "Bumping this...", "Following up...", "Wanted to see...", "Hope you're well", "Quick nudge".
   - Any reusable/templated phrasing = INVALID.

2. CONTEXT LINKING (MANDATORY):
   - The follow-up must directly connect to the idea or tension in the Original Message.
   - It should feel like you just had a second thought about the specific topic discussed.

3. STYLE VARIATIONS:
   You must be able to generate follow-ups using these 5 distinct angles:
   - Direct assumption: Assume a specific problem they have based on their bio.
   - Pattern observation: Note a trend in their industry/role.
   - Insight-based: Share a brief, "did you know" style observation.
   - Light challenge: Gently question their current process/status quo.
   - Curiosity-driven: Ask about a specific detail you "noticed" in their work.

4. STRUCTURE:
   - Max 1–2 sentences.
   - No politeness fluff.
   - Keep it sharp, specific, and slightly informal.

5. TENSION:
   - Maintain or slightly increase the tension from the opener.
   - Push for a response by highlighting a specific consequence of inaction.

OUTPUT FORMAT:
Return exactly 1 variation in JSON:
{
  "followup": "message content here"
}`;

        const userPrompt = `Prospect Bio:
${bio.substring(0, 1500)}

Company Description:
${company || "Not provided"}

Offer:
${offer}

Original Message Sent:
${originalMessage}

Generate exactly 1 follow-up variation. Use one of the 5 style angles that best fits the context.
Return ONLY valid JSON.`;

        const fullPrompt = MASTER_SYSTEM_INSTRUCTION + "\n\n" + userPrompt;

        let finalFollowup = "";
        let attempts = 0;
        const MAX_ATTEMPTS = 3;

        while (attempts < MAX_ATTEMPTS) {
            try {
                console.log(`GENERATION ATTEMPT ${attempts + 1} (Followup)`);
                const clerkId = session.userId || "anonymous";

                const rawResponse = await globalLimit(() => 
                    getUserLimit(clerkId)(() => 
                        generateWithAI(fullPrompt, {
                            temperature: 0.7 + (attempts * 0.1),
                            top_p: 0.9,
                            maxOutputTokens: 512,
                            responseMimeType: "application/json",
                        })
                    )
                );

                const cleaned = rawResponse
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                let parsed = JSON.parse(cleaned);
                let text = (parsed.followup || (Array.isArray(parsed.followups) ? parsed.followups[0].text : null)) || "";

                if (!text) throw new Error("No follow-up text found");

                // Check for banned phrases
                const BANNED = ["checking in", "bumping this", "following up", "hope you're well", "wanted to see"];
                const low = text.toLowerCase();
                if (BANNED.some(b => low.includes(b))) throw new Error("Generic phrases detected");

                // Success!
                finalFollowup = text.trim();
                break;

            } catch (err: any) {
                attempts++;
                console.error(`[followup] Attempt ${attempts} failed:`, err.message);
                if (attempts >= MAX_ATTEMPTS) {
                    finalFollowup = "Saw you're scaling the team—curious, does the outbound quality usually drop once volume hits a certain point?";
                }
            }
        }

        return NextResponse.json({ followups: [finalFollowup] });

    } catch (error: any) {
        console.error("[generate/followup] Fatal error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
