import { generateWithAI } from "./ai-provider";

/**
 * Strict ADD-ON RULES for humanizing AI output.
 */
const HUMANIZER_SYSTEM_PROMPT = `You are a strict post-processing layer for LinkedIn outreach messages.
Your ONLY job is to rewrite the input message to be 100% human-sounding.

STRICT RULES:
1. Sound like a real person texting (casual, direct).
2. Length: Aim for 12–15 words. ABSOLUTE MAXIMUM 18 words.
3. No AI/Marketing buzzwords (impressive, noticed, growth, leverage, optimize).
4. Mention ONE specific detail from the bio/context (e.g., "5 to 50 scale", "AI focus").
5. MUST end with a simple, natural question.
6. Start immediately with the detail or observation. No "I see" or introductions.

EXAMPLES:
Input: "I noticed you scaled your team from 5 to 50 in 2 years. That is impressive growth. How are you handling the outreach volume currently?"
Output: "Scaled from 5 to 50 in 2 years—that's a lot of hiring. How's the outreach volume lately?"

Input: "I see you're focusing on AI-driven sales automation at TechCorp. We help CEOs like you book more meetings."
Output: "Saw the AI focus at TechCorp. Curious, what's the biggest bottleneck with meeting volume right now?"

Input: "I'm impressed by your focus on B2B lead generation. We have a tool that helps with personalized openers."
Output: "Strong focus on B2B lead gen. Is personalization still the biggest time sink for your team?"

GOAL:
A message so casual and brief that it feels impossible for AI to have written it.

Return ONLY the rewritten message.`;

/**
 * Humanizes a single message (opener or follow-up).
 */
export async function humanizeMessage(message: string, context: { bio: string, offer: string }): Promise<string> {
    const userPrompt = `Context:
Bio: ${context.bio.substring(0, 500)}
Offer: ${context.offer.substring(0, 500)}

Original Message to Rewrite:
"${message}"

Rewrite this message strictly following the rules. Return ONLY the new message.`;

    try {
        const rewritten = await generateWithAI(HUMANIZER_SYSTEM_PROMPT + "\n\n" + userPrompt, {
            temperature: 0.6,
            top_p: 0.9,
            maxOutputTokens: 100,
        });

        // Basic cleanup
        let cleaned = rewritten.replace(/^["']|["']$/g, "").trim();
        
        // Final length safety check - if AI fails to keep it short, we truncate or return a simplified version
        const words = cleaned.split(/\s+/);
        if (words.length > 20) {
            // If it's still too long, we take the first 18 words and hope for the best, 
            // but ideally the LLM follows the system prompt.
            console.warn(`[humanizer] AI output too long (${words.length} words). Truncating.`);
            cleaned = words.slice(0, 18).join(" ") + "...";
        }

        return cleaned;
    } catch (err) {
        console.error("[humanizer] Failed to humanize message:", err);
        return message; // Fallback to original if humanization fails
    }
}
