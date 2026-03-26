import { auth } from "@clerk/nextjs/server";

// VERIFICATION TRACE: 2026-03-27_01-57
const DEPLOY_VERSION = "2026-03-27_01-57";

export async function POST(req: Request) {
    try {
        console.log(`[Checkout API] Request received (Version: ${DEPLOY_VERSION})`);
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

        // ─── RUNTIME PRICE RESOLUTION ───
        // We resolve this per-request to ensure the latest environment variables are used
        // and to provide helpful error messages if something was missed in Vercel.
        const runtimePriceMapping: Record<string, string | undefined> = {
            "starter_monthly": process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_MONTHLY,
            "basic_monthly": process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_MONTHLY,
            "growth_monthly": process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_MONTHLY,
            "pro_monthly": process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_MONTHLY,
            "starter_yearly": process.env.NEXT_PUBLIC_PADDLE_PRICE_STARTER_YEARLY,
            "basic_yearly": process.env.NEXT_PUBLIC_PADDLE_PRICE_BASIC_YEARLY,
            "growth_yearly": process.env.NEXT_PUBLIC_PADDLE_PRICE_GROWTH_YEARLY,
            "pro_yearly": process.env.NEXT_PUBLIC_PADDLE_PRICE_PRO_YEARLY,
            "addon_200": process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_200,
            "addon_600": process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_600,
            "addon_1000": process.env.NEXT_PUBLIC_PADDLE_PRICE_ADDON_1000,
        };

        const priceId = runtimePriceMapping[planId] || (planId.startsWith("pri_") ? planId : null);

        if (!priceId || !priceId.startsWith("pri_")) {
            console.error(`[Checkout API] FATAL CONFIG: Missing or invalid Paddle Price ID for '${planId}'. Received: '${priceId}'`);
            return Response.json({ 
                error: "Configuration Error", 
                details: `Missing NEXT_PUBLIC_PADDLE_PRICE_${planId.toUpperCase()} in environment variables.`,
                version: DEPLOY_VERSION
            }, { status: 500 });
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

        // ─── ENVIRONMENT & AUTH CONFIG ───
        const apiKey = process.env.PADDLE_API_KEY || "";
        let isProduction = process.env.PADDLE_ENV === 'production';
        
        // Fail-safe: If API key is live, we MUST use production API
        if (apiKey.startsWith("live_")) {
            isProduction = true;
        }

        const paddleApiUrl = isProduction
            ? "https://api.paddle.com/transactions"
            : "https://sandbox-api.paddle.com/transactions";

        if (!apiKey) {
            console.error("[Checkout API] CRITICAL: PADDLE_API_KEY is missing.");
            return Response.json({ error: "Server misconfiguration" }, { status: 500 });
        }

        // ─── PADDLE REQUEST ───
        const payload = {
            items: [{ price_id: priceId, quantity: 1 }],
            custom_data: { user_id: userId }
        };

        console.log(`[Checkout API] Env: ${isProduction ? 'PROD' : 'SANDBOX'} | Target: ${priceId}`);

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
            console.error(`>>> [Checkout API] Paddle API Reject (${response.status}):`, data.error);
            
            if (data.error?.code === 'forbidden') {
                console.error("[Checkout API] HINT: The Paddle API key lacks permission to create/read transactions.");
            }

            return Response.json({ 
                error: data.error?.code || "Paddle API Failure",
                details: data.error?.detail || "Check server logs for Paddle request_id."
            }, { status: response.status });
        }

        const transactionId = data.data.id;
        console.log(`[Checkout API] Transaction Created: ${transactionId}`);

        return Response.json({
            transactionId,
            transaction_id: transactionId,
            checkout_url: data.data.checkout?.url
        });

    } catch (error: any) {
        console.error("[Checkout API] FATAL EXCEPTION:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
