import pLimit from 'p-limit';

/**
 * Global limiter to ensure no more than 10 AI calls across the entire application
 * are hitting the API simultaneously.
 */
export const globalLimit = pLimit(10);

/**
 * Per-user limiter map to ensure no single user can trigger more than 2
 * parallel AI calls, preventing abuse and improving priority for others.
 */
const userLimiters = new Map<string, ReturnType<typeof pLimit>>();

export function getUserLimit(userId: string) {
    if (!userLimiters.has(userId)) {
        userLimiters.set(userId, pLimit(2));
    }
    return userLimiters.get(userId)!;
}
