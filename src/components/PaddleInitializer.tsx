"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";

export default function PaddleInitializer() {
    const router = useRouter();

    return (
        <Script
            src="https://cdn.paddle.com/paddle/v2/paddle.js"
            onLoad={() => {
                if (typeof window !== "undefined" && (window as any).Paddle) {
                    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "";
                    let env = process.env.NEXT_PUBLIC_PADDLE_ENV as any;
                    
                    // Fail-safe: If token is live, environment MUST be production
                    if (token.startsWith("live_")) {
                        env = "production";
                    } else if (!env) {
                        env = "sandbox";
                    }

                    (window as any).Paddle.Environment.set(env);
                    (window as any).Paddle.Initialize({
                        token: token,
                        eventCallback: (event: any) => {
                            console.log("[Paddle Event]", event.name, event);
                            if (
                                event.name === "checkout.completed" ||
                                event.name === "checkout.closed"
                            ) {
                                // Give webhook 2 seconds to process, then refresh
                                setTimeout(() => {
                                    window.location.reload();
                                }, 2000);
                            }
                        },
                    });
                }
            }}
        />
    );
}
