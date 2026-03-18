"use client";

import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import FAQ from "@/components/FAQ";
import StickyCTA from "@/components/StickyCTA";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
// Metadata moved to page.tsx
export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  // Simple 2-stage animation sequence for the hero demo
  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnalyzing((prev) => !prev);
    }, isAnalyzing ? 3000 : 5000);
    return () => clearInterval(timer);
  }, [isAnalyzing]);

  return (
    <main className="animate-fade-in" style={{ paddingBottom: "var(--spacing-12)" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 3rem !important;
            padding: 2rem 1rem !important;
            min-height: auto !important;
          }
          .hero-title {
            font-size: 2.75rem !important;
            line-height: 1.2 !important;
          }
          .hero-copy {
            align-items: center !important;
            gap: 1.5rem !important;
          }
          .hero-cta-group {
            flex-direction: column !important;
            width: 100% !important;
          }
          .hero-cta-group a {
            width: 100% !important;
            max-width: 400px !important;
          }
          .nav-links {
            display: none !important;
          }
          .nav-hamburger {
            display: flex !important;
          }
          .hero-demo {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 auto !important;
          }
        }
        .hero-demo {
          width: 100%;
          max-width: 640px;
          margin-left: auto;
        }
      `}} />
      {/* Hero Section */}
      <div className="container hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center", minHeight: "80vh", padding: "4rem 0" }}>
        {/* Left Copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="hero-copy"
          style={{ display: "flex", flexDirection: "column", gap: "2rem", willChange: "transform, opacity" }}
        >
          <h1 className="hero-title" style={{ fontSize: "4.5rem", fontWeight: "800", lineHeight: "1.05", letterSpacing: "-0.03em" }}>
            Turn LinkedIn Cold DMs Into <br />
            <span className="text-gradient">
              Revenue Conversations.
            </span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "540px", lineHeight: "1.6" }}>
            Write personalized LinkedIn openers in seconds. No templates. No generic outreach. Just results.
          </p>

          <div className="hero-cta-group" style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
            <Link href="/sign-up" className="glow-button" style={{
              padding: "1.25rem 2rem", fontSize: "1.125rem", gap: "0.5rem",
              background: "var(--accent-blue)",
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)"
            }}>
              Generate My First LinkedIn DM Free <ArrowRight size={20} />
            </Link>
            <Link href="#how-it-works" className="secondary-button" style={{ padding: "1.25rem 2rem", fontSize: "1.125rem" }}>
              See How It Works
            </Link>
          </div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            No scraping. No automation spam. Just relevance.
          </span>
        </motion.div>

        {/* Right Demo Animation (Restored from the original) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
          className="hero-demo"
          style={{
            background: "rgba(18, 19, 24, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 20px 50px -10px rgba(0, 0, 0, 0.6)",
            position: "relative",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Background Glow */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.1), transparent 70%)", pointerEvents: "none" }} />

          {/* Top Bar Wrapper */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 2, repeat: Infinity }} style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80" }} />
              <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>Live generation</span>
            </div>
            <span style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "rgba(255,255,255,0.3)", fontWeight: "500" }}>LinkedIn Opener</span>
          </div>

          {/* Prospect Block */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "linear-gradient(45deg, #1e293b, #334155)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "700" }}>SJ</div>
            <div>
              <p style={{ fontWeight: "600", fontSize: "0.9375rem", color: "white", marginBottom: "2px" }}>Sarah Jenkins</p>
              <p style={{ fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)" }}>VP Sales @ TechCorp</p>
            </div>
          </div>

          {/* Content Area */}
          <div style={{ minHeight: "140px", position: "relative" }}>
            {isAnalyzing ? (
              <motion.div
                key="analyzing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", fontStyle: "italic" }}>Analyzing profile signals</span>
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}>.</motion.span>
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.3 }}>.</motion.span>
                  <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1], delay: 0.6 }}>.</motion.span>
                </div>
                <div style={{ width: "30%", height: "4px", borderRadius: "100px", background: "rgba(255,255,255,0.04)", overflow: "hidden" }}>
                  <motion.div animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} style={{ width: "50%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent)" }} />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                style={{
                  background: "rgba(25, 27, 34, 0.8)",
                  borderRadius: "14px",
                  padding: "18px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  position: "relative",
                  boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.5)"
                }}
              >
                {/* Score Badge */}
                <div style={{ position: "absolute", top: "12px", right: "12px", textAlign: "right" }}>
                  <div style={{ fontSize: "1rem", fontWeight: "700", color: "#60a5fa", lineHeight: "1" }}>82</div>
                  <div style={{ fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "rgba(255,255,255,0.3)", fontWeight: "600", marginTop: "2px" }}>Score</div>
                </div>

                <p style={{ fontSize: "0.9375rem", lineHeight: "1.6", color: "rgba(255,255,255,0.9)", marginRight: "45px" }}>
                  Hi Sarah — noticed TechCorp expanding the sales team recently. Curious if outbound personalization is something you're exploring this quarter?
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <div id="how-it-works" className="container">
        <HowItWorks />
        <Features />
        <Comparison />

        <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <h2 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem", letterSpacing: "-0.04em", color: "white" }}>
            Pricing Built for Outbound Growth
          </h2>
          <p style={{ fontSize: "1.25rem", color: "rgba(255,255,255,0.5)", marginBottom: "4rem", fontWeight: "500" }}>
            Start free. Upgrade as reply volume increases.
          </p>
          <Pricing />
        </section>

        {/* Results Section (Clean Product UI) */}
        <section style={{ padding: "8rem 0", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1rem", color: "white", letterSpacing: "-0.04em" }}>Better Replies. Less Effort.</h2>
            <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "4rem", maxWidth: "600px", margin: "0 auto 4rem" }}>
              Write personalized LinkedIn messages using real profile context — not templates.
            </p>

            <div className="results-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "4rem" }}>
              {[
                { title: "Higher Reply Rates", desc: "Messages built on real signals" },
                { title: "Faster Outreach", desc: "Go from minutes to seconds" },
                { title: "Consistent Quality", desc: "Every message stays relevant" }
              ].map((card, i) => (
                <div key={i} className="glass-panel" style={{ padding: "2.5rem 2rem", textAlign: "left", display: "flex", flexDirection: "column", gap: "1rem", borderRadius: "20px" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "700", color: "white" }}>{card.title}</h3>
                  <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.9375rem" }}>{card.desc}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", opacity: 0.6 }}>
              Designed for founders, SDRs, and outbound teams.
            </p>
          </div>
        </section>

        <FAQ />
      </div>

      <StickyCTA />
    </main>
  );
}
