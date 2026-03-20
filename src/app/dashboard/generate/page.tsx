"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Sparkles, Copy, RefreshCw, AlertCircle, Zap, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCredits } from "../layout";

export default function GeneratePage() {
    const [bio, setBio] = useState("");
    const [company, setCompany] = useState("");
    const [offer, setOffer] = useState("");
    const [tone, setTone] = useState("Professional");
    const [loading, setLoading] = useState(false);
    const [isGeneratingCompany, setIsGeneratingCompany] = useState(false);
    const [isSavingOffer, setIsSavingOffer] = useState(false);
    const [offerSaved, setOfferSaved] = useState(false);
    const [result, setResult] = useState<{
        openers: { text: string; score: number; is_best: boolean }[];
        followUp: string;
        subjectLine: string;
        recommendedIndex?: number;
        recommendedReason?: string;
        whyItWorks?: string[];          // 2-bullet explanation for ⭐ AI Recommended option
        credits?: { allowed: boolean; credits_remaining: number };
    } | null>(null);
    const [error, setError] = useState("");
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
    const [followups, setFollowups] = useState<Record<number, string[]>>({});
    const [loadingFollowupIndex, setLoadingFollowupIndex] = useState<number | null>(null);

    async function copyToClipboard(text: string, index: number) {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
        } catch (err) {
            console.error("Copy failed", err);
        }
    }

    // Real-time credit state from sidebar context
    const { credits, refreshCredits, updateCreditsLocally } = useCredits();

    const tones = useMemo(() => ["Friendly", "Direct", "Bold", "Professional"], []);

    const COMPANY_CHIPS = useMemo(() => [
        "SaaS platform",
        "Fintech startup",
        "Marketing agency",
        "B2B AI tool",
        "Ecommerce brand",
    ], []);

    const handleGenerateCompany = useCallback(async () => {
        if (!bio) return;
        setIsGeneratingCompany(true);
        setError("");
        try {
            const res = await fetch("/api/extract-company", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bio }),
            });
            const data = await res.json();

            if (!res.ok) {
                const errMsg = data.error || "Connection Error";
                if (res.status === 429) {
                    setError("Gemini Quota Exceeded. Please try again later or upgrade your key.");
                } else {
                    setError(errMsg);
                }
                return;
            }

            if (data.company) {
                setCompany(data.company);
            }
        } catch (err: any) {
            console.error("Company Extraction Error:", err);
            setError("Could not extract company description. Please type it manually.");
        } finally {
            setIsGeneratingCompany(false);
        }
    }, [bio]);

    // Auto-fill offer from user's saved default on page load
    useEffect(() => {
        const loadDefaultOffer = async () => {
            try {
                const res = await fetch("/api/preferences/offer");
                if (res.ok) {
                    const data = await res.json();
                    if (data.offer) {
                        setOffer(data.offer);
                    }
                }
            } catch {
                // silently fail — user can still type manually
            }
        };
        loadDefaultOffer();
    }, []);

    const handleSaveOffer = useCallback(async () => {
        if (!offer) return;
        setIsSavingOffer(true);
        try {
            const res = await fetch("/api/preferences/offer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ offer }),
            });
            if (res.ok) {
                setOfferSaved(true);
                setTimeout(() => setOfferSaved(false), 3000);
            }
        } catch (err) {
            console.error("Failed to save offer:", err);
        } finally {
            setIsSavingOffer(false);
        }
    }, [offer]);

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bio, company, offer, tone }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate");
            setResult(data);

            // ─── INSTANT CREDIT UPDATE ───
            if (data.credits && data.credits.credits_remaining !== undefined) {
                updateCreditsLocally(
                    data.credits.credits_remaining
                );
            } else {
                // Fallback: refetch from server
                refreshCredits();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [bio, company, offer, tone, updateCreditsLocally, refreshCredits]);

    // Usage calculations for the inline bar
    const usagePercent = credits
        ? Math.max(0, Math.round(
            (credits.creditsUsed / Math.max(credits.monthlyLimit, 1)) * 100
        ))
        : 0;

    return (
        <div
            style={{
                maxWidth: "720px",
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "32px",
                paddingTop: "24px",
                paddingBottom: "64px",
            }}
        >
            <style dangerouslySetInnerHTML={{
                __html: `
                /* ── Generate Page Responsive Styles ── */

                /* Card padding: 1rem on mobile → 2rem on tablet+ */
                .gen-card { padding: clamp(1rem, 4vw, 2rem); }

                /* Step 2 label + button row: stack on narrow screens */
                .gen-step2-header {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                    align-items: flex-end;
                    gap: 0.5rem;
                    margin-bottom: 8px;
                }
                .gen-step2-header label { margin-bottom: 0; }

                /* Tone switcher: min 44px touch target */
                .gen-tone-btn {
                    flex: 1;
                    min-height: 44px;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    /* Prevent very long tone names from overflowing */
                    word-break: break-word;
                }

                /* Output card content */
                .gen-output-card { padding: clamp(1rem, 4vw, 2rem); }
                `
            }} />

            {/* Input Form Card */}
            <div
                className="glass-panel animate-fade-in gen-card"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                }}
            >
                <div>
                    <h2
                        style={{
                            fontSize: "1.5rem",
                            fontWeight: "600",
                            marginBottom: "var(--spacing-1)",
                        }}
                    >
                        Generate Openers
                    </h2>
                    <p
                        style={{
                            color: "var(--text-secondary)",
                            fontSize: "0.875rem",
                        }}
                    >
                        Turn target profiles into hyper-personalized messages.
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "var(--spacing-4)",
                    }}
                >
                    {/* Step 1 */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.95rem",
                                fontWeight: "600",
                                marginBottom: "8px",
                                color: "white"
                            }}
                        >
                            <span style={{ color: "var(--accent-blue)", marginRight: "6px" }}>1.</span>
                            Prospect Bio / LinkedIn About
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            style={{
                                width: "100%",
                                minHeight: "100px",
                                borderRadius: "8px",
                                border: "1px solid #3f3f46",
                                padding: "12px",
                                background: "rgba(255,255,255,0.05)",
                                color: "white",
                                fontSize: "0.95rem",
                                resize: "vertical",
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#60a5fa";
                                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(96, 165, 250, 0.2)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#3f3f46";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                            rows={4}
                            placeholder="e.g. 10+ years in B2B SaaS sales. Passionate about scaling GTM teams..."
                        />
                    </div>

                    {/* Step 2 */}
                    <div>
                        {/* Wraps label and AI-generate button on narrow screens */}
                        <div className="gen-step2-header">
                            <label
                                style={{
                                    display: "block",
                                    fontSize: "0.95rem",
                                    fontWeight: "600",
                                    color: "white",
                                    marginBottom: 0
                                }}
                            >
                                <span style={{ color: "var(--accent-blue)", marginRight: "6px" }}>2.</span>
                                What does the company do? <span style={{ color: "var(--text-secondary)", fontWeight: "normal" }}>(optional)</span>
                            </label>

                            <button
                                onClick={handleGenerateCompany}
                                disabled={isGeneratingCompany || !bio}
                                className="secondary-button"
                                style={{
                                    padding: "4px 10px",
                                    fontSize: "0.75rem",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    opacity: (!bio || isGeneratingCompany) ? 0.5 : 1,
                                    border: "1px solid var(--accent-violet)",
                                    color: "var(--text-primary)",
                                    background: "rgba(168, 85, 247, 0.1)"
                                }}
                                title={!bio ? "Requires Prospect Bio to be filled" : "Extract company context from bio"}
                            >
                                {isGeneratingCompany ? <RefreshCw size={12} className="spin" /> : <Wand2 size={12} color="var(--accent-violet)" />}
                                Generate from Bio
                            </button>
                        </div>
                        <input
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            style={{
                                width: "100%",
                                height: "44px",
                                borderRadius: "8px",
                                border: "1px solid #3f3f46",
                                padding: "0 12px",
                                background: "rgba(255,255,255,0.05)",
                                color: "white",
                                fontSize: "0.95rem",
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#60a5fa";
                                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(96, 165, 250, 0.2)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#3f3f46";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                            placeholder="Example: AI platform helping SaaS teams automate outbound sales."
                        />
                        <p style={{
                            fontSize: "0.75rem",
                            color: "var(--text-secondary)",
                            marginTop: "var(--spacing-2)",
                        }}>
                            Just describe the company in one sentence. No deep research needed.
                        </p>

                        {/* Suggestion Chips */}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
                            {COMPANY_CHIPS.map(chip => (
                                <button
                                    key={chip}
                                    onClick={() => setCompany(chip)}
                                    style={{
                                        padding: "6px 14px",
                                        borderRadius: "999px",
                                        fontSize: "0.8rem",
                                        fontWeight: "500",
                                        background: company === chip ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "rgba(255, 255, 255, 0.05)",
                                        border: company === chip ? "1px solid transparent" : "1px solid rgba(255, 255, 255, 0.15)",
                                        color: company === chip ? "white" : "var(--text-secondary)",
                                        cursor: "pointer",
                                        transition: "all 0.2s ease-in-out",
                                        boxShadow: company === chip ? "0 4px 12px rgba(124, 58, 237, 0.3)" : "none"
                                    }}
                                    onMouseOver={(e) => {
                                        if (company !== chip) {
                                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                            e.currentTarget.style.color = "white";
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (company !== chip) {
                                            e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                            e.currentTarget.style.color = "var(--text-secondary)";
                                        }
                                    }}
                                >
                                    {chip}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.95rem",
                                fontWeight: "600",
                                marginBottom: "8px",
                                color: "white"
                            }}
                        >
                            <span style={{ color: "var(--accent-blue)", marginRight: "6px" }}>3.</span>
                            Your Offer / Value Prop
                        </label>
                        <textarea
                            value={offer}
                            onChange={(e) => setOffer(e.target.value)}
                            style={{
                                width: "100%",
                                minHeight: "100px",
                                borderRadius: "8px",
                                border: "1px solid #3f3f46",
                                padding: "12px",
                                background: "rgba(255,255,255,0.05)",
                                color: "white",
                                fontSize: "0.95rem",
                                resize: "vertical",
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = "#60a5fa";
                                e.currentTarget.style.boxShadow = "0 0 0 2px rgba(96, 165, 250, 0.2)";
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = "#3f3f46";
                                e.currentTarget.style.boxShadow = "none";
                            }}
                            rows={3}
                            placeholder="e.g. We help sales teams automate outbound workflows."
                        />
                        <p style={{
                            fontSize: "0.85rem",
                            color: "var(--text-secondary)",
                            marginTop: "8px",
                        }}>
                            Define your audience, outcome, and method precisely.
                        </p>
                        <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                            <button
                                onClick={handleSaveOffer}
                                disabled={isSavingOffer || !offer}
                                style={{
                                    padding: "6px 14px",
                                    fontSize: "0.85rem",
                                    fontWeight: "500",
                                    background: "rgba(255, 255, 255, 0.05)",
                                    border: "1px solid rgba(255, 255, 255, 0.15)",
                                    color: "var(--text-secondary)",
                                    borderRadius: "8px",
                                    cursor: isSavingOffer || !offer ? "not-allowed" : "pointer",
                                    transition: "all 0.2s ease",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                                onMouseOver={(e) => {
                                    if (!isSavingOffer && offer) {
                                        e.currentTarget.style.color = "white";
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!isSavingOffer && offer) {
                                        e.currentTarget.style.color = "var(--text-secondary)";
                                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                    }
                                }}
                            >
                                {isSavingOffer ? "Saving..." : "Save Offer"}
                            </button>
                            {offerSaved && (
                                <span style={{
                                    fontSize: "0.85rem",
                                    color: "#34d399",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    animation: "fadeIn 0.2s ease-in-out"
                                }}>
                                    ✓ Offer saved
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Step 4: Tone */}
                    <div>
                        <label
                            style={{
                                display: "block",
                                fontSize: "0.95rem",
                                fontWeight: "600",
                                marginBottom: "8px",
                                color: "white"
                            }}
                        >
                            <span style={{ color: "var(--accent-blue)", marginRight: "6px" }}>4.</span>
                            Tone
                        </label>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                background: "rgba(255,255,255,0.05)",
                                borderRadius: "8px",
                                padding: "4px",
                                gap: "4px",
                            }}
                        >
                            {tones.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTone(t)}
                                    className="gen-tone-btn"
                                    style={{
                                        background: tone === t ? "rgba(96, 165, 250, 0.2)" : "transparent",
                                        color: tone === t ? "#60a5fa" : "var(--text-secondary)",
                                        padding: "8px 4px",
                                    }}
                                    onMouseOver={(e) => {
                                        if (tone !== t) e.currentTarget.style.color = "white";
                                    }}
                                    onMouseOut={(e) => {
                                        if (tone !== t) e.currentTarget.style.color = "var(--text-secondary)";
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* New Primary Generate Button */}
                <div
                    style={{ width: "100%", position: "relative", marginTop: "24px" }}
                    title={!bio ? "Paste a prospect bio to generate messages" : ""}
                >
                    <motion.button
                        onClick={handleGenerate}
                        disabled={loading || !bio || !offer}
                        whileHover={(!loading && bio && offer) ? { scale: 1.02, filter: "brightness(1.05)" } : {}}
                        whileTap={(!loading && bio && offer) ? { scale: 0.97 } : {}}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        style={{
                            width: "100%",
                            height: "52px",
                            borderRadius: "10px",
                            fontSize: "1rem", // 16px
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            border: "none",
                            color: "white",
                            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                            boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
                            cursor: (loading || !bio || !offer) ? "not-allowed" : "pointer",
                            opacity: (loading || !bio || !offer) ? 0.6 : 1,
                        }}
                    >
                        {loading ? (
                            <>
                                <RefreshCw size={20} className="spin" /> Generating messages...
                            </>
                        ) : (
                            <>
                                ✨ Generate Openers • 1 Credit
                            </>
                        )}
                    </motion.button>
                    <p style={{
                        fontSize: "0.8rem",
                        color: "var(--text-secondary)",
                        textAlign: "center",
                        marginTop: "12px",
                        opacity: 0.8
                    }}>
                        1 credit will be used to generate 3 personalized openers.
                    </p>
                </div>

                {error && (
                    <div
                        style={{
                            padding: "12px",
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "var(--radius-md)",
                            color: "#fca5a5",
                            fontSize: "0.875rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <AlertCircle size={16} /> {error}
                    </div>
                )}
            </div>

            {/* Output Area Container */}
            <div
                className="glass-panel animate-fade-in gen-output-card"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                }}
            >
                <h3 style={{ fontSize: "1.25rem", fontWeight: "600", color: "white" }}>
                    AI Generated Options
                </h3>

                {/* ─── INLINE CREDIT USAGE BAR ─── */}
                {credits && (
                    <div
                        style={{
                            padding: "16px 20px",
                            background: "rgba(255, 255, 255, 0.02)",
                            borderRadius: "12px",
                            border: "1px solid rgba(255, 255, 255, 0.05)"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "var(--spacing-2)",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    color: "var(--text-secondary)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px",
                                }}
                            >
                                <Zap size={14} color="var(--accent-blue)" />
                                Credits
                            </span>
                            <span
                                style={{
                                    fontSize: "0.875rem",
                                    fontWeight: "600",
                                    color:
                                        credits.creditsRemaining === 0
                                            ? "#f87171"
                                            : "white",
                                }}
                            >
                                {credits.creditsRemaining} remaining
                            </span>
                        </div>
                        <div
                            style={{
                                fontSize: "0.75rem",
                                color: "var(--text-secondary)",
                                marginTop: "4px",
                                marginBottom: "8px",
                            }}
                        >
                            {credits.creditsUsed} / {credits.monthlyLimit} used
                        </div>
                        <div
                            style={{
                                height: "6px",
                                background: "rgba(255, 255, 255, 0.1)",
                                borderRadius: "var(--radius-full)",
                                overflow: "hidden",
                            }}
                        >
                            <div
                                style={{
                                    height: "100%",
                                    width: `${Math.min(100, usagePercent)}%`,
                                    background:
                                        usagePercent >= 90
                                            ? "linear-gradient(90deg, #f87171, #ef4444)"
                                            : usagePercent >= 70
                                                ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                                                : "linear-gradient(90deg, #60a5fa, #3b82f6)",
                                    borderRadius: "var(--radius-full)",
                                    transition: "width 0.4s ease-out",
                                }}
                            />
                        </div>
                        {credits.creditsRemaining === 0 && (
                            <p
                                style={{
                                    fontSize: "0.75rem",
                                    color: "#f87171",
                                    marginTop: "var(--spacing-2)",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                }}
                            >
                                <AlertCircle size={12} />
                                Monthly limit reached. Upgrade your plan to continue.
                            </p>
                        )}
                        {usagePercent >= 80 &&
                            usagePercent < 100 &&
                            credits.creditsRemaining > 0 && (
                                <p
                                    style={{
                                        fontSize: "0.75rem",
                                        color: "#fbbf24",
                                        marginTop: "var(--spacing-2)",
                                    }}
                                >
                                    ⚠️ You&apos;ve used {usagePercent}% of your
                                    monthly credits.
                                </p>
                            )}
                    </div>
                )}

                {!result ? (
                    <div
                        style={{
                            height: "280px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-secondary)",
                            border: "1px dashed rgba(255, 255, 255, 0.15)",
                            borderRadius: "12px",
                            background: "rgba(255, 255, 255, 0.01)",
                            opacity: 0.8,
                        }}
                    >
                        <Sparkles
                            size={32}
                            style={{ marginBottom: "16px" }}
                            color="rgba(255, 255, 255, 0.2)"
                        />
                        <p style={{ fontSize: "0.95rem" }}>Your AI-crafted outreach messages will appear here.</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "var(--spacing-4)",
                        }}
                    >
                        {result.openers.map((dm, idx) => {
                            const isBest = idx === 0; // always sorted DESC — first is highest score

                            // ─── Score colour tier ───
                            const scoreColor =
                                dm.score >= 85 ? "#22c55e"      // Green
                                    : dm.score >= 75 ? "#86efac"    // Light Green
                                        : dm.score >= 65 ? "#facc15"    // Yellow
                                            : "#94a3b8";                     // Gray

                            const borderColor = isBest
                                ? "rgba(34, 197, 94, 0.6)"
                                : "rgba(255,255,255,0.08)";

                            const cardShadow = isBest
                                ? "0 0 0 1px rgba(34,197,94,0.4), 0 8px 32px rgba(34,197,94,0.18), 0 2px 8px rgba(0,0,0,0.3)"
                                : "0 2px 12px rgba(0,0,0,0.2)";

                            return (
                                <div
                                    key={idx}
                                    style={{
                                        padding: "20px 24px",
                                        borderRadius: "18px",
                                        border: `1px solid ${borderColor}`,
                                        boxShadow: cardShadow,
                                        background: isBest
                                            ? "rgba(34,197,94,0.04)"
                                            : "rgba(255,255,255,0.02)",
                                        position: "relative",
                                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                        cursor: "default",
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1.015)";
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = isBest
                                            ? "0 0 0 1px rgba(34,197,94,0.5), 0 16px 48px rgba(34,197,94,0.22), 0 4px 12px rgba(0,0,0,0.35)"
                                            : "0 8px 28px rgba(0,0,0,0.35)";
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = cardShadow;
                                    }}
                                >
                                    {/* ─── Top row: label + score ─── */}
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                            {/* Option label */}
                                            <span style={{
                                                fontSize: "0.7rem",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.08em",
                                                fontWeight: "700",
                                                color: "var(--text-secondary)",
                                                opacity: 0.6,
                                            }}>
                                                Option {idx + 1}
                                            </span>

                                            {/* ⭐ AI Recommended badge */}
                                            {isBest && (
                                                <span style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "5px",
                                                    fontSize: "0.72rem",
                                                    fontWeight: "700",
                                                    letterSpacing: "0.04em",
                                                    color: "#bbf7d0",
                                                    background: "rgba(34,197,94,0.12)",
                                                    border: "1px solid rgba(34,197,94,0.3)",
                                                    borderRadius: "999px",
                                                    padding: "3px 10px",
                                                }}>
                                                    ⭐ AI Recommended
                                                </span>
                                            )}
                                        </div>

                                        {/* Score chip */}
                                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                                            <div style={{
                                                fontSize: "1.15rem",
                                                fontWeight: "800",
                                                color: scoreColor,
                                                lineHeight: 1,
                                            }}>
                                                {dm.score} <span style={{ fontSize: "0.8rem", fontWeight: "500", color: "rgba(255,255,255,0.3)" }}>/ 100</span>
                                            </div>
                                            <div style={{
                                                fontSize: "0.65rem",
                                                color: "rgba(255,255,255,0.3)",
                                                marginTop: "3px",
                                            }}>
                                                Based on message quality
                                            </div>
                                        </div>
                                    </div>

                                    {/* ─── Message text ─── */}
                                    <p style={{
                                        fontSize: "0.9375rem",
                                        lineHeight: "1.65",
                                        color: "rgba(255,255,255,0.92)",
                                        marginBottom: "16px",
                                        marginTop: "4px",
                                    }}>
                                        {dm.text}
                                    </p>

                                    {/* ─── Copy button ─── */}
                                    <button
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "7px 14px",
                                            fontSize: "0.78rem",
                                            fontWeight: "600",
                                            borderRadius: "8px",
                                            border: copiedIndex === idx
                                                ? "1px solid rgba(34,197,94,0.5)"
                                                : "1px solid rgba(255,255,255,0.12)",
                                            background: copiedIndex === idx
                                                ? "rgba(34,197,94,0.12)"
                                                : "rgba(255,255,255,0.05)",
                                            color: copiedIndex === idx ? "#86efac" : "rgba(255,255,255,0.6)",
                                            cursor: "pointer",
                                            transition: "all 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => {
                                            if (copiedIndex !== idx) {
                                                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                                e.currentTarget.style.color = "white";
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (copiedIndex !== idx) {
                                                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                                                e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                                            }
                                        }}
                                        onClick={() => copyToClipboard(dm.text, idx)}
                                    >
                                        <Copy size={13} />
                                        {copiedIndex === idx ? "✓ Copied" : "Copy"}
                                    </button>

                                    {/* ─── Why this works (AI Recommended only) ─── */}
                                    {dm.is_best && result.whyItWorks && result.whyItWorks.length === 2 && (
                                        <div style={{ marginTop: "16px" }}>
                                            <div style={{
                                                fontSize: "0.7rem",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.06em",
                                                color: "rgba(255,255,255,0.35)",
                                                marginBottom: "6px",
                                                fontWeight: "600",
                                            }}>
                                                Why this works
                                            </div>
                                            {result.whyItWorks.map((bullet, i) => (
                                                <div key={i} style={{
                                                    fontSize: "0.8rem",
                                                    lineHeight: 1.5,
                                                    color: "rgba(255,255,255,0.45)",
                                                    marginBottom: i === 0 ? "2px" : 0,
                                                }}>
                                                    • {bullet}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        <div
                            className="glass-panel"
                            style={{
                                padding: "var(--spacing-5)",
                                marginTop: "var(--spacing-2)",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "0.75rem",
                                    textTransform: "uppercase",
                                    color: "var(--accent-blue)",
                                    fontWeight: "600",
                                    marginBottom: "var(--spacing-2)",
                                    letterSpacing: "0.05em",
                                }}
                            >
                                Suggested Subject & Follow-up
                            </p>
                            <div style={{ marginBottom: "var(--spacing-4)" }}>
                                <span
                                    style={{
                                        fontSize: "0.875rem",
                                        color: "var(--text-secondary)",
                                    }}
                                >
                                    Subject:{" "}
                                </span>
                                <span
                                    style={{
                                        fontSize: "0.9375rem",
                                        fontWeight: "500",
                                    }}
                                >
                                    {result.subjectLine}
                                </span>
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontSize: "0.875rem",
                                        color: "var(--text-secondary)",
                                        display: "block",
                                        marginBottom: "var(--spacing-1)",
                                    }}
                                >
                                    Follow-up:{" "}
                                </span>
                                <p
                                    style={{
                                        fontSize: "0.9375rem",
                                        fontStyle: "italic",
                                        background: "var(--bg-elevated)",
                                        padding: "12px",
                                        borderRadius: "var(--radius-sm)",
                                    }}
                                >
                                    {result.followUp}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
