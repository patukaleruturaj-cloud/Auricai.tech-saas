"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const PAID_PLANS = [
    {
        name: "Starter",
        planType: "starter",
        description: "Get started with better replies",
        monthlyPrice: 15,
        valueLine: "150 credits (~150 generations/month)",
        usage: "Perfect for sending ~5–10 DMs/day",
        msgs: 150,
        features: [
            "Profile-based personalized openers",
            "3 message variations per prospect",
            "Ready-to-send in seconds",
            "Saves manual writing time",
        ],
        popular: false,
        theme: {
            glowColor: "rgba(251, 146, 60, 1)",
            shimmerColor: "rgba(251, 146, 60, 0.4)",
            bgTint: "rgba(251, 146, 60, 0.02)",
            glowBase: 0.12,
            glowHover: 0.20,
            hoverLift: -6,
            baseScale: 1,
            hoverScale: 1.02,
        }
    },
    {
        name: "Basic",
        planType: "basic",
        description: "Consistent outreach, better conversations",
        monthlyPrice: 29,
        valueLine: "400 credits (~400 generations/month)",
        usage: "~10–20 DMs/day",
        msgs: 400,
        features: [
            "Deeper context-based personalization",
            "More relevant message angles",
            "Consistent output quality",
            "3 message variations",
        ],
        popular: false,
        theme: {
            glowColor: "rgba(59, 130, 246, 1)",
            shimmerColor: "rgba(59, 130, 246, 0.3)",
            bgTint: "rgba(59, 130, 246, 0.01)",
            glowBase: 0.08,
            glowHover: 0.15,
            hoverLift: -6,
            baseScale: 1,
            hoverScale: 1.02,
        }
    },
    {
        name: "Growth",
        planType: "growth",
        description: "Scale outbound without losing personalization",
        monthlyPrice: 49,
        valueLine: "1,200 credits (~1,200 generations/month)",
        usage: "~30–50 DMs/day",
        msgs: 1200,
        features: [
            "Smarter angle generation",
            "More natural message flow",
            "Reply-focused message outputs",
            "Built for consistent outreach",
        ],
        popular: true, // ← MOST POPULAR
        theme: {
            glowColor: "rgba(139, 92, 246, 1)",
            shimmerColor: "rgba(139, 92, 246, 0.4)",
            bgTint: "rgba(139, 92, 246, 0.04)",
            glowBase: 0.25, // Stronger glow
            glowHover: 0.35,
            hoverLift: -12, // More lift
            baseScale: 1.06, // Slightly bigger
            hoverScale: 1.08,
        }
    },
    {
        name: "Pro",
        planType: "pro",
        description: "High-volume outreach with premium quality",
        monthlyPrice: 69,
        valueLine: "3,000 credits (~3,000 generations/month)",
        usage: "50+ DMs/day",
        msgs: 3000,
        features: [
            "Deep multi-signal personalization",
            "Highest-quality message outputs",
            "Optimized for reply rates",
            "Priority processing speed",
        ],
        popular: false,
        theme: {
            glowColor: "rgba(16, 185, 129, 1)",
            shimmerColor: "rgba(16, 185, 129, 0.5)",
            bgTint: "rgba(16, 185, 129, 0.02)",
            glowBase: 0.12,
            glowHover: 0.20,
            hoverLift: -6,
            baseScale: 1,
            hoverScale: 1.02,
        }
    },
];

export default function Pricing({
    isDashboard = false,
    onPlanSelect,
}: {
    isDashboard?: boolean;
    onPlanSelect?: (planType: string, isYearly: boolean) => void;
} = {}) {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section>
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                {/* Billing Toggle */}
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        background: "var(--bg-elevated)",
                        padding: "var(--spacing-1)",
                        borderRadius: "var(--radius-full)",
                        border: "1px solid var(--border-subtle)",
                    }}
                >
                    <button
                        onClick={() => setIsYearly(false)}
                        style={{
                            padding: "var(--spacing-2) var(--spacing-6)",
                            borderRadius: "var(--radius-full)",
                            background: !isYearly
                                ? "var(--accent-blue)"
                                : "transparent",
                            color: !isYearly ? "white" : "var(--text-secondary)",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                            transition: "background-color var(--transition-fast), color var(--transition-fast)",
                            willChange: "background-color, color"
                        }}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsYearly(true)}
                        style={{
                            padding: "var(--spacing-2) var(--spacing-6)",
                            borderRadius: "var(--radius-full)",
                            background: isYearly
                                ? "var(--accent-blue)"
                                : "transparent",
                            color: isYearly ? "white" : "var(--text-secondary)",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500",
                            transition: "background-color var(--transition-fast), color var(--transition-fast)",
                            willChange: "background-color, color"
                        }}
                    >
                        Yearly{" "}
                        <span
                            style={{
                                color: "#4ade80",
                                fontSize: "0.75rem",
                                marginLeft: "4px",
                            }}
                        >
                            Save 20%
                        </span>
                    </button>
                </div>
            </div>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: "1.5rem",
                    maxWidth: "1200px",
                    margin: "0 auto",
                }}
            >
                {PAID_PLANS.map((plan, idx) => {
                    const displayPrice = isYearly
                        ? Math.floor(plan.monthlyPrice * 0.8)
                        : plan.monthlyPrice;

                    return (
                        <motion.div
                            key={plan.name}
                            initial="hidden"
                            whileInView="visible"
                            whileHover="hover"
                            viewport={{ once: true }}
                            variants={{
                                hidden: { opacity: 0, y: 20, scale: plan.theme.baseScale },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    scale: plan.theme.baseScale,
                                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }
                                },
                                hover: {
                                    y: plan.theme.hoverLift,
                                    scale: plan.theme.hoverScale,
                                    transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] }
                                }
                            }}
                            className="glass-panel"
                            style={{
                                padding: "2rem",
                                position: "relative",
                                border: plan.popular
                                    ? "2px solid var(--accent-blue)"
                                    : "1px solid var(--border-subtle)",
                                zIndex: plan.popular ? 10 : 1,
                                borderRadius: "1rem",
                                display: "flex",
                                flexDirection: "column",
                                background: `linear-gradient(180deg, var(--bg-surface) 0%, ${plan.theme.bgTint} 100%)`,
                                willChange: "transform, opacity"
                            }}
                        >
                            {/* Glow Layer (Hardware Accelerated & Tier-Based) */}
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: plan.theme.glowBase },
                                    hover: { opacity: plan.theme.glowHover, transition: { duration: 0.25, ease: "easeOut" } }
                                }}
                                style={{
                                    position: "absolute",
                                    inset: 0,
                                    borderRadius: "inherit",
                                    boxShadow: `0 12px 40px ${plan.theme.glowColor}`,
                                    zIndex: -1,
                                    pointerEvents: "none",
                                    willChange: "opacity"
                                }}
                            />

                            {/* Animated Shimmer Border Overlay */}
                            <div style={{
                                position: "absolute",
                                inset: plan.popular ? "-2px" : "-1px",
                                borderRadius: "inherit",
                                padding: plan.popular ? "2px" : "1px",
                                background: "transparent",
                                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                                WebkitMaskComposite: "xor",
                                maskComposite: "exclude",
                                pointerEvents: "none",
                                overflow: "hidden"
                            }}>
                                <motion.div
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                    style={{
                                        position: "absolute",
                                        top: 0, bottom: 0, left: "-100%", right: "-100%",
                                        background: `linear-gradient(90deg, transparent, ${plan.theme.shimmerColor}, transparent)`,
                                        willChange: "transform"
                                    }}
                                />
                            </div>

                            {plan.popular && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "-14px",
                                        left: "50%",
                                        transform: "translate3d(-50%, 0, 0)",
                                        background:
                                            "linear-gradient(to right, #60a5fa, #3b82f6)",
                                        color: "white",
                                        padding: "6px 16px",
                                        borderRadius: "var(--radius-full)",
                                        fontSize: "0.75rem",
                                        fontWeight: "700",
                                        letterSpacing: "0.05em",
                                        boxShadow:
                                            "0 4px 15px rgba(59, 130, 246, 0.4)",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    MOST POPULAR
                                </div>
                            )}

                            {/* 1. Price (Most Dominant) */}
                            <div style={{ marginBottom: "2rem" }}>
                                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                    <span
                                        style={{
                                            fontSize: "3.5rem",
                                            fontWeight: "800",
                                            letterSpacing: "-0.04em",
                                            color: "white"
                                        }}
                                    >
                                        ${displayPrice}
                                    </span>
                                    <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: "600", fontSize: "1rem" }}>
                                        /mo
                                    </span>
                                </div>
                                {isYearly ? (
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            color: "#4ade80",
                                            marginTop: "4px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        Billed ${displayPrice * 12} yearly
                                    </p>
                                ) : (
                                    <p
                                        style={{
                                            fontSize: "0.875rem",
                                            color: "rgba(255,255,255,0.4)",
                                            marginTop: "4px",
                                            fontWeight: "500"
                                        }}
                                    >
                                        Billed monthly
                                    </p>
                                )}
                            </div>

                            {/* 2. Plan Name */}
                            <h3
                                style={{
                                    fontSize: "1.5rem",
                                    fontWeight: "700",
                                    marginBottom: "1rem", /* Increased spacing */
                                    letterSpacing: "-0.02em",
                                    color: "white"
                                }}
                            >
                                {plan.name}
                            </h3>

                            {/* 3. Description */}
                            <p
                                style={{
                                    fontSize: "0.9375rem",
                                    color: "rgba(255,255,255,0.5)",
                                    fontWeight: "500",
                                    marginBottom: "2rem",
                                    lineHeight: "1.5",
                                    minHeight: "3rem",
                                }}
                            >
                                {plan.description}
                            </p>

                            <div style={{ marginBottom: "2rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <p style={{ fontSize: "0.9375rem", fontWeight: "600", color: "white", marginBottom: "6px" }}>{plan.valueLine}</p>
                                <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)", fontWeight: "500" }}>{plan.usage}</p>
                            </div>

                            {isDashboard ? (
                                <button
                                    onClick={() => onPlanSelect?.(plan.planType, isYearly)}
                                    className={
                                        plan.popular
                                            ? "glow-button"
                                            : "secondary-button"
                                    }
                                    style={{
                                        width: "100%",
                                        textAlign: "center",
                                        display: "block",
                                        marginBottom: "2rem",
                                        background: plan.popular
                                            ? "var(--accent-blue)"
                                            : undefined,
                                        border: "none",
                                        cursor: "pointer",
                                    }}
                                >
                                    Start generating better DMs
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        // Ensure we redirect to the correct auth flow
                                        window.location.href = "/sign-up";
                                    }}
                                    className={
                                        plan.popular
                                            ? "glow-button"
                                            : "secondary-button"
                                    }
                                    style={{
                                        width: "100%",
                                        textAlign: "center",
                                        display: "block",
                                        marginBottom: "2rem",
                                        background: plan.popular
                                            ? "var(--accent-blue)"
                                            : undefined,
                                        border: "none",
                                        cursor: "pointer"
                                    }}
                                >
                                    Start generating better DMs
                                </button>
                            )}

                            <ul
                                style={{
                                    listStyle: "none",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.75rem",
                                    marginTop: "auto",
                                }}
                            >
                                {plan.features.map((feature, i) => (
                                    <li
                                        key={i}
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "0.75rem",
                                            fontSize: "0.875rem",
                                            color: "var(--text-secondary)",
                                        }}
                                    >
                                        <div style={{
                                            flexShrink: 0,
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "50%",
                                            background: "rgba(59, 130, 246, 0.15)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "1px solid rgba(59, 130, 246, 0.2)"
                                        }}>
                                            <Check size={12} color="var(--accent-blue)" strokeWidth={3} />
                                        </div>
                                        <span style={{ fontWeight: "600" }}>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
