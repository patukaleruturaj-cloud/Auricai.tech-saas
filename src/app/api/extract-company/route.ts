import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { generateWithAI } from "@/lib/ai-provider";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

// ─── RATE LIMITING (Helper Only) ───
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20; // Relaxed for helper

function isRateLimited(userId: string): boolean {
    const now = Date.now();
    const timestamps = rateLimitMap.get(userId) ?? [];
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
        const session = await auth();
        if (!session.userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const clerkId = session.userId;

        // ─── RATE LIMIT ───
        if (isRateLimited(clerkId)) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again in a minute." },
                { status: 429 }
            );
        }

        const { bio } = await req.json();

        if (!bio || typeof bio !== "string" || bio.trim().length === 0) {
            return NextResponse.json({ error: "Bio is required" }, { status: 400 });
        }

        const MASTER_SYSTEM_INSTRUCTION = `You are a specialized assistant that extracts company descriptions.`;
        const userPrompt = `From the following LinkedIn bio, infer what the company or product does in one short sentence (max 12 words).
Do not add any preamble or meta-text.

Bio:
${bio.substring(0, 1500)}`;

        const fullPrompt = `${MASTER_SYSTEM_INSTRUCTION}\n\n${userPrompt}`;

        console.log("EXTRACTING COMPANY (Free Helper)");
        let cleanCompany = "B2B SaaS platform"; // Safety default

        // ─── GENERATE AI OUTPUT ───
        try {
            const rawResponse = await generateWithAI(fullPrompt, {
                temperature: 0.3,
            });

            if (rawResponse && typeof rawResponse === "string") {
                const cleaned = rawResponse
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .replace(/`json/g, "")
                    .replace(/`/g, "")
                    .replace(/^"|"$/g, '')
                    .replace(/\n/g, ' ')
                    .trim();

                if (cleaned.length > 0 && cleaned.length <= 250) {
                    cleanCompany = cleaned;
                }
            }
        } catch (err) {
            console.error("AI EXTRACTION ERROR:", err);
            // Defaulting to "B2B SaaS" instead of throwing error since this is a free helper
        }

        return NextResponse.json({
            company: cleanCompany
        });

    } catch (error: any) {
        console.error("[api/extract-company] Fatal error:", error);
        return NextResponse.json({
            error: "Failed to extract company description"
        }, { status: 500 });
    }
}
