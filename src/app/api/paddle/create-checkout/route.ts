import { auth } from "@clerk/nextjs/server";

const getPriceId = (envVar: string | undefined, fallback: string, label: string) => {
    if (envVar) return envVar;
    console.warn(`>>> [Checkout API] WARNING: Missing environment variable for ${label}. Using fallback: ${fallback}`);
    return fallback;
};

const PRICE_MAPPING: Record<string, string> = {
    "starter_monthly": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_MONTHLY, "pri_01kkevcx82pwmmkz08r5am2y1n", "starter_monthly"),
    "basic_monthly": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_MONTHLY, "pri_01kkeveharsajd1j8jqmjz6p8y", "basic_monthly"),
    "growth_monthly": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_MONTHLY, "pri_01kkevg12ce2pemtwkqyg0ja74", "growth_monthly"),
    "pro_monthly": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY, "pri_01kkevhkv3zh5v61v9yrhazk90", "pro_monthly"),
    "starter_yearly": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_YEARLY, "pri_01kkevksxjk34bp98wywqdhjq0", "starter_yearly"),
    "basic_yearly": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_YEARLY, "pri_01kkevn74qmwvrfp27zvr6anag", "basic_yearly"),
    "growth_yearly": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_YEARLY, "pri_01kkevptnbcgmn0sv5c4qs2s40", "growth_yearly"),
    "pro_yearly": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY, "pri_01kkevr1h59gf7mqsf4477b1mg", "pro_yearly"),
    // Addons
    "addon_200": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_200, "pri_01kkewa0zq9q2h9n4jf3dzppcz", "addon_200"),
    "addon_600": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_600, "pri_01kkewcae9602tkhen4w72wmkd", "addon_600"),
    "addon_1000": getPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_1000, "pri_01kkewd2gm0s2hbwpk7pmc5sf5", "addon_1000"),
};

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.error("[Checkout API] Unauthorized access attempt");
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { planId } = await req.json();
        if (!planId) {
            console.error("[Checkout API] Missing planId in request body");
            return Response.json({ error: "planId is required" }, { status: 400 });
        }

        // ─── ADDON COMPATIBILITY CHECK ───
        if (planId?.startsWith("addon_")) {
            const { supabaseAdmin } = await import("@/lib/supabase-admin");
            const { data: userStats, error: dbError } = await supabaseAdmin
                .from("user_credit_view")
                .select("subscription_status")
                .eq("clerk_id", userId)
                .single();

            if (dbError || !userStats) {
                console.error("[Checkout API] Database error during subscription check:", dbError);
                return Response.json({ error: "Failed to verify subscription status" }, { status: 500 });
            }

            if (userStats.subscription_status !== "active") {
                console.warn(`[Checkout API] Forbidden addon purchase attempt by user ${userId} (Status: ${userStats.subscription_status})`);
                return Response.json({ error: "Active subscription required to purchase extra credits." }, { status: 403 });
            }
        }

        // ─── PRICE ID RESOLUTION ───
        const priceId = PRICE_MAPPING[planId] || (planId.startsWith("pri_") ? planId : null);
        if (!priceId) {
            console.error(`[Checkout API] Unmapped or invalid planId provided: ${planId}`);
            return Response.json({ error: `Invalid planId: ${planId}` }, { status: 400 });
        }

        // ─── ENVIRONMENT & AUTHENTICATION ───
        const isProduction = process.env.PADDLE_ENV === 'production';
        const apiKey = process.env.PADDLE_API_KEY;
        const paddleApiUrl = isProduction
            ? "https://api.paddle.com/transactions"
            : "https://sandbox-api.paddle.com/transactions";

        if (!apiKey) {
            console.error("[Checkout API] CRITICAL ERROR: PADDLE_API_KEY is missing from environment");
            return Response.json({ error: "Server configuration error" }, { status: 500 });
        }

        // ─── PADDLE REQUEST PREPARATION ───
        const payload = {
            items: [{ price_id: priceId, quantity: 1 }],
            custom_data: { user_id: userId }
        };

        console.log(`[Checkout API] Initiating ${isProduction ? 'PRODUCTION' : 'SANDBOX'} checkout`);
        console.log(`[Checkout API] Request Payload:`, JSON.stringify({ ...payload, items: [{ price_id: priceId, quantity: 1 }] }, null, 2));

        const response = await fetch(paddleApiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // ─── ERROR HANDLING ───
        if (!response.ok) {
            console.error(">>> [Checkout API] Paddle API authorization/request failed:", {
                status: response.status,
                statusText: response.statusText,
                error: data.error,
                requestId: data.meta?.request_id
            });
            return Response.json({ 
                error: data.error?.code || "Paddle API error",
                details: data.error?.detail || "No additional information provided from Paddle."
            }, { status: response.status });
        }

        // ─── SUCCESS RESPONSE ───
        if (!data.data?.checkout?.url) {
            console.error("[Checkout API] Paddle response missing checkout URL:", data);
            return Response.json({ error: "Failed to generate checkout URL" }, { status: 500 });
        }

        console.log(`[Checkout API] Successfully created transaction ID: ${data.data.id}`);
        return Response.json({
            checkout_url: data.data.checkout.url,
            transaction_id: data.data.id
        });

    } catch (error: any) {
        console.error("[Checkout API] Unexpected exception:", error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
