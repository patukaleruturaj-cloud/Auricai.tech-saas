/**
 * Paddle Price ID mapping — subscriptions + addon credit packs.
 *
 * Each entry maps a Paddle price_id to its plan config.
 * The webhook handler uses `getPaddleProduct()` to resolve purchases.
 */

import type { PlanType } from "./plans";

// ─── TYPES ───

export interface PaddleSubscriptionProduct {
    type: "subscription";
    planType: PlanType;
    billingCycle: "monthly" | "yearly";
    credits: number;
}

export interface PaddleAddonProduct {
    type: "addon";
    credits: number;
    label: string;
    price: number;
}

export type PaddleProduct = PaddleSubscriptionProduct | PaddleAddonProduct;

// ─── PRICE MAP ───

export const PADDLE_PRICE_MAP: Record<string, PaddleProduct> = {
    // Subscriptions
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_MONTHLY ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_MONTHLY]: {
            type: "subscription",
            planType: "starter",
            billingCycle: "monthly",
            credits: 150,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_YEARLY ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_YEARLY]: {
            type: "subscription",
            planType: "starter",
            billingCycle: "yearly",
            credits: 150,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_MONTHLY ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_MONTHLY]: {
            type: "subscription",
            planType: "basic",
            billingCycle: "monthly",
            credits: 400,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_YEARLY ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_YEARLY]: {
            type: "subscription",
            planType: "basic",
            billingCycle: "yearly",
            credits: 400,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_MONTHLY ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_MONTHLY]: {
            type: "subscription",
            planType: "growth",
            billingCycle: "monthly",
            credits: 1200,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_YEARLY ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_YEARLY]: {
            type: "subscription",
            planType: "growth",
            billingCycle: "yearly",
            credits: 1200,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY]: {
            type: "subscription",
            planType: "pro",
            billingCycle: "monthly",
            credits: 3000,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY]: {
            type: "subscription",
            planType: "pro",
            billingCycle: "yearly",
            credits: 3000,
        }
    } : {}),

    // Addon Credit Packs
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_200 ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_200]: {
            type: "addon",
            credits: 200,
            label: "200 Credits",
            price: 12,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_600 ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_600]: {
            type: "addon",
            credits: 600,
            label: "600 Credits",
            price: 29,
        }
    } : {}),
    ...(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_1000 ? {
        [process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_1000]: {
            type: "addon",
            credits: 1000,
            label: "1000 Credits",
            price: 39,
        }
    } : {}),
};

/** Look up a Paddle product by its price_id */
export function getPaddleProduct(priceId: string): PaddleProduct | null {
    return PADDLE_PRICE_MAP[priceId] ?? null;
}

/** Get all subscription products */
export function getSubscriptionProducts(): Array<PaddleSubscriptionProduct & { priceId: string }> {
    return Object.entries(PADDLE_PRICE_MAP)
        .filter(([_, p]) => p.type === "subscription")
        .map(([priceId, p]) => ({ priceId, ...(p as PaddleSubscriptionProduct) }));
}

/** Get all addon products */
export function getAddonProducts(): Array<PaddleAddonProduct & { priceId: string }> {
    return Object.entries(PADDLE_PRICE_MAP)
        .filter(([_, p]) => p.type === "addon")
        .map(([priceId, p]) => ({ priceId, ...(p as PaddleAddonProduct) }));
}
