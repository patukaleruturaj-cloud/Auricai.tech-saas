"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Send } from "lucide-react";

const steps = [
    {
        icon: Search,
        title: "Structured Input",
        description: "User provides the prospect profile, company context, and value proposition.",
        bullets: [
            "Input LinkedIn bio & About details",
            "Add specific company momentum",
            "Define your offer or value",
            "Select from 4 specialized tones"
        ],
        step: "01",
    },
    {
        icon: Sparkles,
        title: "Strategic Selection",
        description: "The system evaluates the context to select the highest-relevance angle.",
        bullets: [
            "Interpret role & authority markers",
            "Match tone to prospect seniority",
            "Filter generic compliment patterns",
            "Align offer with business signals"
        ],
        step: "02",
    },
    {
        icon: Send,
        title: "Message Generation",
        description: "The system produces 3 unique variations for high-relevance outreach.",
        bullets: [
            "Convert context into 1:1 hooks",
            "Avoid automation-flagged patterns",
            "Create low-friction curiosity gaps",
            "Produce 3 non-template variations"
        ],
        step: "03",
    },
];

export default function HowItWorks() {
    return (
        <section style={{ padding: "clamp(2.5rem, 6vw, 8rem) 0", borderTop: "1px solid var(--border-subtle)" }}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .hiw-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                @media (min-width: 1024px) {
                    .hiw-grid {
                        grid-template-columns: repeat(3, 1fr);
                        gap: 2rem;
                    }
                }
                .hiw-h2 {
                    font-size: clamp(2rem, 5vw, 3.5rem);
                    font-weight: 800;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                    margin-bottom: 1rem;
                }
                .hiw-bullet {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: var(--text-secondary);
                    font-size: 0.875rem;
                    margin-bottom: 0.5rem;
                    text-align: left;
                }
                .hiw-bullet::before {
                    content: "";
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: var(--accent-blue);
                    flex-shrink: 0;
                }
            `}} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: "center", marginBottom: "clamp(3rem, 7vw, 5rem)" }}
            >
                <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--accent-blue)", fontWeight: "700", marginBottom: "1rem", opacity: 0.8 }}>
                    The Process
                </p>
                <h2 className="hiw-h2">
                    How Personalized <br /><span className="text-gradient">Logic is Derived.</span>
                </h2>
                <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto" }}>
                    AuricAI doesn't use templates. It builds every message from the ground up using a multi-stage cognitive pipeline.
                </p>
            </motion.div>

            <div className="hiw-grid">
                {steps.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial="hidden"
                        whileInView="visible"
                        whileHover="hover"
                        viewport={{ once: true }}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: idx * 0.15 } },
                            hover: { y: -8, transition: { duration: 0.2, ease: "easeOut" } }
                        }}
                        className="glass-panel"
                        style={{
                            padding: "3rem 2rem",
                            textAlign: "center",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            borderRadius: "24px",
                            border: "1px solid rgba(255,255,255,0.05)"
                        }}
                    >
                        <div style={{ position: "absolute", top: "1.5rem", right: "2rem", fontSize: "4rem", fontWeight: "900", color: "rgba(255,255,255,0.03)", lineHeight: 1 }}>
                            {item.step}
                        </div>
                        <div style={{
                            width: "64px", height: "64px", borderRadius: "18px",
                            background: "rgba(59,130,246,0.08)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginBottom: "2rem",
                            border: "1px solid rgba(59,130,246,0.2)",
                            boxShadow: "0 0 20px rgba(59,130,246,0.1)"
                        }}>
                            <item.icon size={28} color="#60a5fa" />
                        </div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem", color: "white" }}>{item.title}</h3>
                        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: "1.5", marginBottom: "2rem", minHeight: "3rem" }}>
                            {item.description}
                        </p>
                        
                        <div style={{ width: "100%", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "1.5rem" }}>
                            {item.bullets.map((bullet, i) => (
                                <div key={i} className="hiw-bullet">
                                    {bullet}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Opener Score Breakdown (Optional Premium Detail) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{
                    marginTop: "5rem",
                    padding: "3rem",
                    borderRadius: "24px",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    textAlign: "center"
                }}
            >
                <h4 style={{ fontSize: "1.25rem", fontWeight: "700", color: "white", marginBottom: "2rem" }}>Opener Score Breakdown</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem" }}>
                    {[
                        { label: "Tone Matching", value: "0–100%", desc: "Seniority & industry norms alignment" },
                        { label: "Context Relevance", value: "0–100%", desc: "Strength of identified profile hook" },
                        { label: "Curiosity Gap", value: "0–100%", desc: "Effectiveness of concluding question" },
                        { label: "Reply Probability", value: "0–100%", desc: "Historical pattern performance score" }
                    ].map((metric, i) => (
                        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <div style={{ fontSize: "0.875rem", fontWeight: "600", color: "var(--accent-blue)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{metric.label}</div>
                            <div style={{ fontSize: "1.5rem", fontWeight: "800", color: "white" }}>{metric.value}</div>
                            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)" }}>{metric.desc}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
