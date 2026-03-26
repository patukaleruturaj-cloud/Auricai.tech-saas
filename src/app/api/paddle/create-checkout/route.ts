import { auth } from "@clerk/nextjs/server";

const getRequiredPriceId = (envVar: string | undefined, label: string) => {
    if (envVar && envVar.startsWith("pri_")) return envVar;
    throw new Error(`CRITICAL CONFIG ERROR: Missing or invalid Paddle Price ID for ${label}. Please set the correct NEXT_PUBLIC_PADDLE_PRICE_${label.toUpperCase()} environment variable.`);
};

const PRICE_MAPPING: Record<string, string> = {
    "starter_monthly": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_MONTHLY, "starter_monthly"),
    "basic_monthly": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_MONTHLY, "basic_monthly"),
    "growth_monthly": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_MONTHLY, "growth_monthly"),
    "pro_monthly": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY, "pro_monthly"),
    "starter_yearly": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_YEARLY, "starter_yearly"),
    "basic_yearly": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_YEARLY, "basic_yearly"),
    "growth_yearly": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_YEARLY, "growth_yearly"),
    "pro_yearly": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY, "pro_yearly"),
    // Addons
    "addon_200": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_200, "addon_200"),
    "addon_600": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_600, "addon_600"),
    "addon_1000": getRequiredPriceId(process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_1000, "addon_1000"),
};

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            console.error("[Checkout API] Unauthorized: No userId session found.");
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { planId } = await req.json();
        if (!planId) {
            console.error("[Checkout API] Bad Request: Missing planId.");
            return Response.json({ error: "planId is required" }, { status: 400 });
        }

        // ─── CHECK ADDON ELIGIBILITY ───
        if (planId?.startsWith("addon_")) {
            const { supabaseAdmin } = await import("@/lib/supabase-admin");
            const { data: userStats, error: dbError } = await supabaseAdmin
                .from("user_credit_view")
                .select("subscription_status")
                .eq("clerk_id", userId)
                .single();

            if (dbError || !userStats) {
                console.error("[Checkout API] Database failure during eligibility check:", dbError);
                return Response.json({ error: "Verification failed" }, { status: 500 });
            }

            if (userStats.subscription_status !== "active") {
                console.warn(`[Checkout API] Addon purchase blocked: User ${userId} has ${userStats.subscription_status} status.`);
                return Response.json({ error: "Active subscription required." }, { status: 403 });
            }
        }

        // ─── RESOLVE PRICE ID ───
        const priceId = PRICE_MAPPING[planId] || (planId.startsWith("pri_") ? planId : null);
        if (!priceId) {
            console.error(`[Checkout API] Resolution failed: Could not map planId '${planId}' to a Paddle Price ID.`);
            return Response.json({ error: "Invalid plan identifier" }, { status: 400 });
        }

        // ─── ENVIRONMENT & AUTH CONFIG ───
        const isProduction = process.env.PADDLE_ENV === 'production';
        const apiKey = process.env.PADDLE_API_KEY;
        const paddleApiUrl = isProduction
            ? "https://api.paddle.com/transactions"
            : "https://sandbox-api.paddle.com/transactions";

        if (!apiKey) {
            console.error("[Checkout API] CRITICAL: PADDLE_API_KEY is missing from environment variables.");
            return Response.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        // ─── PADDLE REQUEST ───
        const payload = {
            items: [{ price_id: priceId, quantity: 1 }],
            custom_data: { user_id: userId }
        };

        console.log(`[Checkout API] Environment: ${isProduction ? 'PRODUCTION' : 'SANDBOX'}`);
        console.log(`[Checkout API] Target URL: ${paddleApiUrl}`);
        console.log(`[Checkout API] Payload:`, JSON.stringify(payload, null, 2));

        const response = await fetch(paddleApiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // ─── RESPONSE LOGGING & ERROR HANDLING ───
        if (!response.ok) {
            console.error(`>>> [Checkout API] Paddle API Reject (${response.status} ${response.statusText}):`, {
                error: data.error,
                meta: data.meta
            });
            
            // Helpful hint for the user if they haven't fixed permissions yet
            if (data.error?.code === 'forbidden') {
                console.error("[Checkout API] HINT: This key lacks 'transaction.read' or 'transaction.write' permissions.");
            }

            return Response.json({ 
                error: data.error?.code || "Paddle API Failure",
                details: data.error?.detail || "Check server logs for Paddle request_id."
            }, { status: response.status });
        }

        const transactionId = data.data.id;
        console.log(`[Checkout API] Transaction Created: ${transactionId}`);

        return Response.json({
            transactionId, // Standard name requested
            transaction_id: transactionId, // Support legacy if any
            checkout_url: data.data.checkout?.url // Backwards compatibility for now
        });

    } catch (error: any) {
        console.error("[Checkout API] FATAL EXCEPTION:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
