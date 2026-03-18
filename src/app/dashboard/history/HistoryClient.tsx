"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Clock, Search, Trash2, ChevronDown, Check } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { deleteGeneration, updateGenerationStatus } from "./actions";

// Define the type based on the select query
type GenerationItem = {
    id: string;
    prospect_bio: string | null;
    tone: string | null;
    generated_options: {
        dms?: string[];
        openers?: string[];
        [key: string]: any;
    } | null;
    subject: string | null;
    follow_up: string | null;
    status?: string | null;
    created_at: string;
};

interface HistoryClientProps {
    initialHistory: GenerationItem[];
}

const STATUS_OPTIONS = [
    { value: "not_sent", label: "Not Sent" },
    { value: "sent", label: "Sent" },
    { value: "responded", label: "Responded" },
    { value: "no_response", label: "No Response" },
];

function StatusDropdown({
    generationId,
    currentStatus,
    onStatusChange
}: {
    generationId: string;
    currentStatus: string;
    onStatusChange: (id: string, newStatus: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    
    const activeOption = STATUS_OPTIONS.find(o => o.value === currentStatus) || STATUS_OPTIONS[0];

    const handleSelect = async (newStatus: string) => {
        if (newStatus === currentStatus) {
            setIsOpen(false);
            return;
        }
        
        setIsPending(true);
        setIsOpen(false);
        // Optimistic update
        onStatusChange(generationId, newStatus);
        
        try {
            await updateGenerationStatus(generationId, newStatus);
        } catch (error) {
            console.error("Failed to update status", error);
            // Revert on error
            onStatusChange(generationId, currentStatus);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div style={{ position: "relative" }}>
            <button
                disabled={isPending}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "8px",
                    color: "var(--text-secondary)",
                    fontSize: "0.8125rem",
                    cursor: isPending ? "wait" : "pointer",
                    transition: "all 0.2s ease",
                    opacity: isPending ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                    if (!isPending) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
                        e.currentTarget.style.border = "1px solid rgba(255, 255, 255, 0.15)";
                    }
                }}
                onMouseLeave={(e) => {
                    if (!isPending) {
                        e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                        e.currentTarget.style.border = "1px solid var(--border-subtle)";
                    }
                }}
                title="Conversation Status"
            >
                {activeOption.label}
                <ChevronDown size={14} style={{ opacity: 0.5, marginLeft: "4px" }} />
            </button>

            {isOpen && (
                <>
                    <div 
                        style={{ position: "fixed", inset: 0, zIndex: 40 }} 
                        onClick={() => setIsOpen(false)}
                    />
                    <div style={{
                        position: "absolute",
                        top: "100%",
                        right: 0,
                        marginTop: "8px",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--border-subtle)",
                        borderRadius: "8px",
                        padding: "4px",
                        minWidth: "140px",
                        zIndex: 50,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)",
                    }}>
                        {STATUS_OPTIONS.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                    padding: "8px 12px",
                                    background: "transparent",
                                    border: "none",
                                    borderRadius: "4px",
                                    color: currentStatus === option.value ? "var(--text-primary)" : "var(--text-secondary)",
                                    fontSize: "0.8125rem",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "all 0.15s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                                    e.currentTarget.style.color = "var(--text-primary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = currentStatus === option.value ? "var(--text-primary)" : "var(--text-secondary)";
                                }}
                            >
                                {option.label}
                                {currentStatus === option.value && <Check size={12} style={{ opacity: 0.5 }} />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default function HistoryClient({ initialHistory }: HistoryClientProps) {
    const [history, setHistory] = useState<GenerationItem[]>(initialHistory);
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Client-side filtering
    const filteredHistory = useMemo(() => {
        if (!searchQuery.trim()) return history;

        const query = searchQuery.toLowerCase();

        return history.filter((item) => {
            // Check bio
            if (item.prospect_bio?.toLowerCase().includes(query)) return true;

            // Check tone
            if (item.tone?.toLowerCase().includes(query)) return true;

            // Check subject
            if (item.subject?.toLowerCase().includes(query)) return true;

            // Check follow-up
            if (item.follow_up?.toLowerCase().includes(query)) return true;

            // Check generated options
            const options = item.generated_options?.openers || item.generated_options?.dms || [];
            if (options.some((opt) => opt.toLowerCase().includes(query))) return true;

            return false;
        });
    }, [history, searchQuery]);

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this generation?\nThis action cannot be undone.")) {
            return;
        }

        setDeletingId(id);
        try {
            await deleteGeneration(id);
            setHistory((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Failed to delete:", error);
            alert("Failed to delete generation. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        setHistory(prev => prev.map(item => 
            item.id === id ? { ...item, status: newStatus } : item
        ));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-6)" }}>
            <div>
                <h1 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "var(--spacing-2)" }}>
                    Generation History
                </h1>
                <p style={{ color: "var(--text-secondary)" }}>
                    {history.length > 0
                        ? `${history.length} generation${history.length !== 1 ? "s" : ""} saved.`
                        : "Your past generations will appear here."}
                </p>
            </div>

            {/* Search Bar */}
            {history.length > 0 && (
                <div style={{ position: "relative", marginBottom: "1rem" }}>
                    <Search
                        size={18}
                        style={{
                            position: "absolute",
                            left: "1rem",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--text-secondary)"
                        }}
                    />
                    <input
                        type="search"
                        placeholder="Search by prospect, company, keyword, or tone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-base"
                        style={{ paddingLeft: "3rem" }}
                    />
                </div>
            )}

            {history.length === 0 ? (
                <div
                    className="glass-panel"
                    style={{ padding: "var(--spacing-12)", textAlign: "center", color: "var(--text-secondary)" }}
                >
                    <MessageSquare size={48} style={{ opacity: 0.2, margin: "0 auto var(--spacing-4)" }} />
                    <p>You haven&apos;t generated any openers yet.</p>
                    <p style={{ fontSize: "0.875rem", marginTop: "var(--spacing-2)" }}>
                        Head to the Generate page to create your first outreach message.
                    </p>
                </div>
            ) : filteredHistory.length === 0 ? (
                /* Empty Search State */
                <div
                    className="glass-panel"
                    style={{ padding: "var(--spacing-12)", textAlign: "center", color: "var(--text-secondary)" }}
                >
                    <Search size={48} style={{ opacity: 0.2, margin: "0 auto var(--spacing-4)" }} />
                    <p>No matching generations found.</p>
                    <p style={{ fontSize: "0.875rem", marginTop: "var(--spacing-2)" }}>
                        Try searching by prospect, company, keyword, or tone.
                    </p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {filteredHistory.map((item) => {
                        const preview =
                            item.prospect_bio && item.prospect_bio.length > 120
                                ? item.prospect_bio.substring(0, 120) + "..."
                                : item.prospect_bio || "No bio provided";

                        const options: string[] = item.generated_options?.openers || item.generated_options?.dms || [];

                        return (
                            <div
                                key={item.id}
                                className="glass-panel animate-fade-in"
                                style={{
                                    padding: "1.5rem",
                                    opacity: deletingId === item.id ? 0.5 : 1,
                                    pointerEvents: deletingId === item.id ? "none" : "auto",
                                    transition: "opacity 0.2s ease"
                                }}
                            >
                                {/* Header */}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "flex-start",
                                        marginBottom: "1rem",
                                        flexWrap: "wrap",
                                        gap: "1rem",
                                    }}
                                >
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {item.tone && (
                                            <span
                                                style={{
                                                    fontSize: "0.75rem",
                                                    textTransform: "uppercase",
                                                    background: "var(--bg-elevated)",
                                                    padding: "3px 8px",
                                                    borderRadius: "var(--radius-sm)",
                                                    color: "var(--text-secondary)",
                                                    marginRight: "8px",
                                                    display: "inline-block",
                                                    marginBottom: "6px",
                                                }}
                                            >
                                                {item.tone}
                                            </span>
                                        )}
                                        <p
                                            style={{
                                                fontWeight: "500",
                                                fontSize: "0.9375rem",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {preview}
                                        </p>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "1rem", flexShrink: 0 }}>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                color: "var(--text-secondary)",
                                                fontSize: "0.875rem",
                                            }}
                                        >
                                            <Clock size={14} />
                                            {new Date(item.created_at).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                        
                                        {/* Status Dropdown */}
                                        <StatusDropdown 
                                            generationId={item.id}
                                            currentStatus={item.status || "not_sent"}
                                            onStatusChange={handleStatusChange}
                                        />

                                        {/* Delete Button */}
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            disabled={deletingId === item.id}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                color: "var(--text-secondary)",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                fontSize: "0.875rem",
                                                padding: "4px 8px",
                                                borderRadius: "var(--radius-sm)",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = "#ef4444";
                                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = "var(--text-secondary)";
                                                e.currentTarget.style.background = "none";
                                            }}
                                            title="Delete generation"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Expandable content */}
                                <details style={{ cursor: "pointer" }}>
                                    <summary
                                        style={{
                                            outline: "none",
                                            color: "var(--accent-blue)",
                                            fontWeight: "500",
                                            fontSize: "0.875rem",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        View Generated Options ({options.length})
                                    </summary>

                                    <div style={{ marginTop: "1rem", cursor: "default" }}>

                                        {/* DM Variations */}
                                        {options.length > 0 && (
                                            <div style={{ marginBottom: "1.5rem" }}>
                                                <h4
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "var(--text-secondary)",
                                                        marginBottom: "0.5rem",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.05em",
                                                    }}
                                                >
                                                    Generated Openers
                                                </h4>
                                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                                    {options.map((opt: string, idx: number) => (
                                                        <div
                                                            key={idx}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                gap: "0.75rem",
                                                            }}
                                                        >
                                                            <div
                                                                style={{
                                                                    flex: 1,
                                                                    padding: "1rem",
                                                                    background: "var(--bg-elevated)",
                                                                    borderRadius: "var(--radius-md)",
                                                                    border: "1px solid var(--border-subtle)",
                                                                    fontSize: "0.9375rem",
                                                                    lineHeight: "1.5",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontSize: "0.7rem",
                                                                        textTransform: "uppercase",
                                                                        color: "var(--accent-violet)",
                                                                        fontWeight: "600",
                                                                        display: "block",
                                                                        marginBottom: "6px",
                                                                    }}
                                                                >
                                                                    Option {idx + 1}
                                                                </span>
                                                                {opt}
                                                            </div>
                                                            <CopyButton text={opt} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Subject Line */}
                                        {item.subject && (
                                            <div style={{ marginBottom: "1.5rem" }}>
                                                <h4
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "var(--text-secondary)",
                                                        marginBottom: "0.5rem",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.05em",
                                                    }}
                                                >
                                                    Suggested Subject
                                                </h4>
                                                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            padding: "1rem",
                                                            background: "var(--bg-elevated)",
                                                            borderRadius: "var(--radius-md)",
                                                            border: "1px solid var(--border-subtle)",
                                                            fontSize: "0.9375rem",
                                                            lineHeight: "1.5",
                                                            fontWeight: "500",
                                                        }}
                                                    >
                                                        {item.subject}
                                                    </div>
                                                    <CopyButton text={item.subject} />
                                                </div>
                                            </div>
                                        )}

                                        {/* Follow-up Message */}
                                        {item.follow_up && (
                                            <div>
                                                <h4
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        color: "var(--text-secondary)",
                                                        marginBottom: "0.5rem",
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.05em",
                                                    }}
                                                >
                                                    Follow-up Message
                                                </h4>
                                                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                                                    <div
                                                        style={{
                                                            flex: 1,
                                                            padding: "1rem",
                                                            background: "var(--bg-elevated)",
                                                            borderRadius: "var(--radius-md)",
                                                            border: "1px solid var(--border-subtle)",
                                                            fontSize: "0.9375rem",
                                                            lineHeight: "1.5",
                                                            fontStyle: "italic",
                                                            whiteSpace: "pre-wrap",
                                                        }}
                                                    >
                                                        {item.follow_up}
                                                    </div>
                                                    <CopyButton text={item.follow_up} />
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </details>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
