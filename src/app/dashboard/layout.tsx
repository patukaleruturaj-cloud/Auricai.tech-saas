"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
    MessageSquarePlus,
    History,
    BarChart3,
    CreditCard,
    Settings,
    Zap,
    Menu,
    X,
} from "lucide-react";
import { supabaseClient } from "@/lib/supabase-client";

// ─── CREDIT CONTEXT ───
// Shared across all dashboard pages for real-time credit display
interface CreditState {
    userId: string;
    plan: string;
    creditsRemaining: number;
    monthlyLimit: number;
    addonCredits: number;
    creditsUsed: number;
    billingInterval: string;
    status: string;
    paddleSubscriptionId: string | null;
    nextResetDate: string | null;
}

interface CreditContextValue {
    credits: CreditState | null;
    loading: boolean;
    refreshCredits: () => Promise<void>;
    updateCreditsLocally: (credits_remaining: number) => void;
}

const CreditContext = createContext<CreditContextValue>({
    credits: null,
    loading: true,
    refreshCredits: async () => { },
    updateCreditsLocally: () => { },
});

export function useCredits() {
    return useContext(CreditContext);
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [credits, setCredits] = useState<CreditState | null>(null);
    const [loading, setLoading] = useState(true);
    // Mobile sidebar open/close state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar when route changes (user tapped a nav link on mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Close sidebar when viewport exceeds mobile breakpoint
    useEffect(() => {
        const mq = window.matchMedia("(min-width: 768px)");
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) setSidebarOpen(false);
        };
        mq.addEventListener("change", handleChange);
        return () => mq.removeEventListener("change", handleChange);
    }, []);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    const refreshCredits = useCallback(async () => {
        try {
            const res = await fetch("/api/user", { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                const monthlyLimit = data.monthlyLimit ?? 5;
                setCredits({
                    userId: data.userId ?? "",
                    plan: data.plan ?? "free",
                    creditsRemaining: data.creditsRemaining ?? monthlyLimit,
                    monthlyLimit: monthlyLimit,
                    addonCredits: data.addonCredits ?? 0,
                    creditsUsed: data.creditsUsed ?? 0,
                    billingInterval: data.billingInterval ?? "monthly",
                    status: data.status ?? "active",
                    paddleSubscriptionId: data.paddleSubscriptionId ?? null,
                    nextResetDate: data.nextResetDate ?? null,
                });
            }
        } catch (err) {
            console.error("Failed to fetch credits:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Instant local update (called by generate page after successful generation)
    const updateCreditsLocally = useCallback(
        (creditsRemaining: number) => {
            setCredits((prev) =>
                prev
                    ? { ...prev, creditsRemaining }
                    : prev
            );
        },
        []
    );

    useEffect(() => {
        refreshCredits();
    }, [refreshCredits]);

    // ─── REALTIME SYNC (Wallet) ───
    useEffect(() => {
        if (!credits?.userId) return;

        const channel = supabaseClient
            .channel('credit-sync')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'wallet',
                    filter: `user_id=eq.${credits.userId}`,
                },
                (payload) => {
                    const { credits_remaining, addon_credits } = payload.new;
                    setCredits((prev) =>
                        prev ? {
                            ...prev,
                            creditsRemaining: credits_remaining ?? prev.creditsRemaining,
                            addonCredits: addon_credits ?? prev.addonCredits,
                            creditsUsed: Math.max(0, (prev.monthlyLimit || 0) - (credits_remaining ?? 0))
                        } : prev
                    );
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [credits?.userId]);

    // ─── REALTIME SYNC (Subscription) ───
    useEffect(() => {
        if (!credits?.userId) return;

        const subChannel = supabaseClient
            .channel('sub-sync')
            .on(
                'postgres_changes',
                {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'subscriptions_v2',
                    filter: `user_id=eq.${credits.userId}`,
                },
                (payload) => {
                    const { plan_type, status, billing_cycle } = payload.new;
                    setCredits((prev) =>
                        prev ? {
                            ...prev,
                            plan: plan_type ?? prev.plan,
                            status: status ?? prev.status,
                            billingInterval: billing_cycle ?? prev.billingInterval,
                        } : prev
                    );
                }
            )
            .subscribe();

        return () => {
            supabaseClient.removeChannel(subChannel);
        };
    }, [credits?.userId]);

    const navItems = [
        { name: "Generate", href: "/dashboard/generate", icon: MessageSquarePlus },
        { name: "History", href: "/dashboard/history", icon: History },
        { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
        { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
        { name: "Settings", href: "/dashboard/settings", icon: Settings },
    ];

    // Usage calculations
    const usagePercent = credits
        ? Math.max(0, Math.round(
            (credits.creditsUsed / Math.max(credits.monthlyLimit, 1)) * 100
        ))
        : 0;

    const planLabel = credits
        ? ({ free: "Free", starter: "Starter", growth: "Growth", pro: "Pro" }[credits.plan] ?? credits.plan)
        : "Free";

    // The sidebar content is shared between desktop (always visible) and mobile (drawer)
    const SidebarContent = () => (
        <>
            {/* Logo / Brand */}
            <div
                style={{
                    padding: "var(--spacing-6)",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    borderBottom: "1px solid var(--border-subtle)",
                    transition: "all 0.2s ease",
                    cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.03)";
                    e.currentTarget.style.opacity = "0.9";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.opacity = "1";
                }}
            >
                <Image
                    src="/logo.png"
                    alt="AuricAI Logo"
                    width={40}
                    height={40}
                    priority
                    style={{ filter: "invert(1)" }}
                />
                <span style={{ fontSize: "1.25rem", fontWeight: "700", letterSpacing: "-0.02em", color: "white" }}>
                    AuricAI
                </span>
            </div>

            {/* Nav Items */}
            <nav
                style={{
                    flex: 1,
                    padding: "var(--spacing-4)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--spacing-2)",
                    overflowY: "auto",
                }}
            >
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "var(--spacing-3)",
                                padding: "var(--spacing-3) var(--spacing-4)",
                                borderRadius: "var(--radius-md)",
                                color: isActive ? "white" : "var(--text-secondary)",
                                background: isActive ? "rgba(255, 255, 255, 0.05)" : "transparent",
                                border: isActive ? "1px solid var(--border-subtle)" : "1px solid transparent",
                                textDecoration: "none",
                                transition: "all var(--transition-fast)",
                                fontWeight: isActive ? "500" : "400",
                                // Minimum 44px touch target height on mobile
                                minHeight: "44px",
                            }}
                        >
                            <item.icon
                                size={20}
                                color={isActive ? "var(--accent-blue)" : "var(--text-secondary)"}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* ─── CREDIT USAGE BAR (Sidebar) ─── */}
            <div style={{ padding: "0 var(--spacing-4) var(--spacing-4)" }}>
                <Link href="/dashboard/billing" style={{ textDecoration: "none", color: "inherit" }}>
                    <div
                        style={{
                            padding: "var(--spacing-3) var(--spacing-4)",
                            borderRadius: "var(--radius-md)",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid var(--border-subtle)",
                            cursor: "pointer",
                            transition: "all var(--transition-fast)",
                        }}
                    >
                        {/* Plan badge + credits remaining */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--spacing-2)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <Zap size={14} color="var(--accent-blue)" />
                                <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                    Credits
                                </span>
                            </div>
                            <span style={{ fontSize: "0.75rem", fontWeight: "600", color: usagePercent >= 90 ? "#f87171" : "white" }}>
                                {loading ? "…" : `${credits?.creditsRemaining ?? 0} remaining`}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div style={{ height: "6px", background: "rgba(255, 255, 255, 0.08)", borderRadius: "var(--radius-full)", overflow: "hidden", marginBottom: "var(--spacing-1)" }}>
                            <div style={{
                                height: "100%",
                                width: `${Math.min(usagePercent, 100)}%`,
                                borderRadius: "var(--radius-full)",
                                background: usagePercent >= 90
                                    ? "linear-gradient(90deg, #f87171, #ef4444)"
                                    : usagePercent >= 70
                                        ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                                        : "linear-gradient(90deg, #60a5fa, #3b82f6)",
                                transition: "width 0.4s ease-out",
                            }} />
                        </div>

                        {/* Usage fraction */}
                        <div style={{ fontSize: "0.6875rem", color: "var(--text-secondary)" }}>
                            {loading ? "Loading credits…" : `${credits?.creditsUsed ?? 0} / ${credits?.monthlyLimit ?? 0} used`}
                        </div>
                    </div>
                </Link>
            </div>

            {/* Account row */}
            <div style={{ padding: "var(--spacing-6)", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "var(--spacing-3)" }}>
                <UserButton />
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>Account</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Manage profile</span>
                </div>
            </div>
        </>
    );

    return (
        <CreditContext.Provider value={{ credits, loading, refreshCredits, updateCreditsLocally }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                /* ── Dashboard layout ── */

                /* The outer shell: flex row on desktop, column on mobile */
                .dash-shell {
                    display: flex;
                    min-height: 100vh;
                    background: var(--bg-base);
                    /* Prevent any inadvertent horizontal overflow */
                    overflow-x: hidden;
                }

                /* ── Desktop sidebar: always visible on 768px+ ── */
                .dash-sidebar {
                    width: 260px;
                    flex-shrink: 0;
                    border-right: 1px solid rgba(255, 255, 255, 0.04);
                    background: rgba(12, 13, 18, 0.4);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    display: flex;
                    flex-direction: column;
                    /* Hidden on mobile — shown via overlay instead */
                }

                /* ── Mobile sidebar overlay ── */
                /* The backdrop behind the sidebar drawer */
                .dash-sidebar-backdrop {
                    display: none;
                    position: fixed;
                    inset: 0;
                    z-index: 200;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                }
                .dash-sidebar-backdrop.open {
                    display: block;
                }

                /* The actual drawer panel that slides in from the left */
                .dash-sidebar-drawer {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    width: 260px;
                    z-index: 210;
                    background: rgba(12, 13, 18, 0.6);
                    backdrop-filter: blur(32px);
                    -webkit-backdrop-filter: blur(32px);
                    border-right: 1px solid rgba(255, 255, 255, 0.04);
                    flex-direction: column;
                    transform: translateX(-100%);
                    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
                    will-change: transform;
                }
                .dash-sidebar-drawer.open {
                    transform: translateX(0);
                }

                /* ── Mobile top bar ── */
                /* The top bar with hamburger + logo — only shown on mobile */
                .dash-topbar {
                    display: none;
                    align-items: center;
                    gap: var(--spacing-3);
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
                    background: rgba(12, 13, 18, 0.5);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    flex-shrink: 0;
                }
                .dash-hamburger {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    color: white;
                    /* 44px touch target */
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-md);
                    flex-shrink: 0;
                    transition: background var(--transition-fast);
                }
                .dash-hamburger:active {
                    background: rgba(255,255,255,0.08);
                }

                /* Drawer close button (mobile) */
                .dash-drawer-close {
                    position: absolute;
                    top: 0.75rem;
                    right: 0.75rem;
                    background: rgba(255,255,255,0.06);
                    border: none;
                    cursor: pointer;
                    color: white;
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--radius-md);
                    z-index: 1;
                }

                @media (max-width: 767px) {
                    /* Hide the persistent sidebar on mobile */
                    .dash-sidebar {
                        display: none;
                    }
                    /* Show the mobile top bar */
                    .dash-topbar {
                        display: flex;
                    }
                    /* Show the mobile drawer elements */
                    .dash-sidebar-drawer {
                        display: flex;
                    }
                    /* Reduce main content padding on mobile */
                    .dash-main-content {
                        padding: var(--spacing-4) !important;
                    }
                }

                @media (min-width: 768px) {
                    /* Ensure backdrop/drawer can't show on desktop */
                    .dash-sidebar-backdrop,
                    .dash-sidebar-drawer {
                        display: none !important;
                    }
                }
                `
            }} />

            {/* ── Mobile sidebar backdrop (tap to close) ── */}
            <div
                className={`dash-sidebar-backdrop ${sidebarOpen ? "open" : ""}`}
                onClick={() => setSidebarOpen(false)}
                aria-hidden="true"
            />

            {/* ── Mobile sidebar drawer ── */}
            <aside
                className={`dash-sidebar-drawer ${sidebarOpen ? "open" : ""}`}
                aria-label="Mobile navigation"
                role="dialog"
                aria-modal="true"
            >
                {/* Close button inside drawer */}
                <button
                    className="dash-drawer-close"
                    onClick={() => setSidebarOpen(false)}
                    aria-label="Close navigation"
                >
                    <X size={18} />
                </button>
                <SidebarContent />
            </aside>

            <div className="dash-shell">
                {/* ── Desktop sidebar: always visible on 768px+ ── */}
                <aside className="dash-sidebar">
                    <SidebarContent />
                </aside>

                {/* ── Main Content Area ── */}
                <main
                    style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        minWidth: 0, /* Prevents flex child from overflowing */
                        minHeight: "100vh",
                    }}
                >
                    {/* ── Mobile-only top bar ── */}
                    <div className="dash-topbar">
                        <button
                            className="dash-hamburger"
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open navigation"
                        >
                            <Menu size={22} />
                        </button>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Image src="/logo.png" alt="AuricAI" width={28} height={28} style={{ filter: "invert(1)" }} />
                            <span style={{ fontWeight: "700", fontSize: "1rem", color: "white" }}>AuricAI</span>
                        </div>
                        {/* Account button aligned to right on mobile topbar */}
                        <div style={{ marginLeft: "auto" }}>
                            <UserButton />
                        </div>
                    </div>

                    {/* ── Page content ── */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            overflowX: "hidden",
                            padding: "var(--spacing-8)",
                        }}
                        className="dash-main-content"
                    >
                        <div
                            style={{
                                maxWidth: "1000px",
                                margin: "0 auto",
                                width: "100%",
                            }}
                        >
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </CreditContext.Provider>
    );
}
