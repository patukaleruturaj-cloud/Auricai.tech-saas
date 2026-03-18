"use client";

import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import FAQ from "@/components/FAQ";
import StickyCTA from "@/components/StickyCTA";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
// Metadata moved to page.tsx
export default function Home() {
  const [demoStep, setDemoStep] = useState(0); // 0: Input, 1: Generating, 2: Output
  
  const prospectDetails = {
    name: "Sarah Jenkins",
    role: "VP of Sales",
    company: "TechCorp"
  };

  const genericDM = "Hey Sarah, I'm with OutboundAI. We help companies like TechCorp scale their sales. Do you have 15 minutes next week?";
  const auricAIDM = "Hi Sarah — noticed TechCorp's recent Series B and your focus on scaling the GTM team. Curious if ramping new SDRs while maintaining personalization is a priority for you this quarter?";

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
          .hero-typing-card {
            max-width: 100% !important;
            min-height: 140px !important;
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
          .mobile-menu-overlay {
            position: fixed;
            inset: 0;
            background: rgba(5,6,10,0.98);
            backdrop-filter: blur(20px);
            z-index: 200;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
          }
          .hero-demo {
            width: 100% !important;
            max-width: 540px !important;
            margin: 0 auto !important;
          }
        }
        .hero-typing-card {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: rgba(15,15,15,0.4);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          max-width: 540px;
          min-height: 120px;
        }
        .cursor {
          display: inline-block;
          color: white;
          width: 3px;
          margin-left: 2px;
          animation: blink 1s infinite;
          vertical-align: middle;
        }
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
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
            Generate hyper-personalized LinkedIn openers that feel 1:1 written — at scale. Built for SDRs, founders, and outbound teams who care about reply rates.
          </p>

          <div className="hero-cta-group" style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
            <Link href="/sign-up" className="glow-button" style={{
              padding: "1.25rem 2rem", fontSize: "1.125rem", gap: "0.5rem",
              background: "var(--accent-blue)",
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)"
            }}>
              Generate My First DM Free <ArrowRight size={20} />
            </Link>
          </div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            No credit card required. Join 500+ outbound pros.
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-panel hero-demo"
          style={{
            padding: "0",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 80px -20px rgba(59, 130, 246, 0.3)"
          }}
        >
          {/* subtle glow behind */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1), transparent 70%)", pointerEvents: "none" }} />
          
          <div style={{ height: "32px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 12px", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
          </div>

          <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <AnimatePresence mode="wait">
              {demoStep === 0 && (
                <motion.div key="input" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <p style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>Prospect Input</p>
                  <div className="glass-panel" style={{ padding: "1rem", background: "rgba(0,0,0,0.2)" }}>
                    <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>{prospectDetails.name}</p>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{prospectDetails.role} @ {prospectDetails.company}</p>
                  </div>
                </motion.div>
              )}

              {demoStep === 1 && (
                <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ height: "120px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                  <Sparkles className="text-gradient" size={32} />
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic" }}>Analyzing profile signals...</p>
                  <div style={{ width: "60%", height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "1px", overflow: "hidden" }}>
                    <motion.div animate={{ x: ["-100%", "100%"] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }} style={{ width: "40%", height: "100%", background: "var(--accent-blue)" }} />
                  </div>
                </motion.div>
              )}

              {demoStep === 2 && (
                <motion.div key="output" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--accent-blue)", fontWeight: "700" }}>AuricAI Result</p>
                    <div style={{ background: "rgba(74, 222, 128, 0.15)", color: "#4ade80", padding: "4px 10px", borderRadius: "100px", fontSize: "0.7rem", fontWeight: "700" }}>
                      Reply Score: 94/100
                    </div>
                  </div>
                  <div className="glass-panel" style={{ padding: "1rem", background: "var(--bg-elevated)", border: "1px solid var(--border-focus)" }}>
                    <p style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>"{auricAIDM}"</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.7rem", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-secondary)" }}>✨ More specific hook</span>
                    <span style={{ fontSize: "0.7rem", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "4px", color: "var(--text-secondary)" }}>✨ Shorten intro</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comparison Toggle */}
          <div style={{ marginTop: "auto", background: "rgba(0,0,0,0.3)", padding: "0.75rem 1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", fontSize: "0.75rem" }}>
            <span style={{ color: "#f87171", opacity: 0.6 }}>❌ Generic: "Do you have 15 mins?"</span>
            <span style={{ color: "#4ade80" }}>✅ AuricAI: Outcome-driven hooks</span>
          </div>
        </motion.div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div id="trust" className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-secondary)", marginBottom: "3.5rem", fontWeight: "600" }}>
            Trusted by founders and SDRs at fast-growing companies
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            <div className="glass-panel" style={{ padding: "2rem", textAlign: "left", borderRadius: "var(--radius-xl)" }}>
              <p style={{ color: "#4ade80", fontWeight: "700", marginBottom: "0.75rem", fontSize: "1.125rem" }}>"Reply rates tripled in 2 weeks"</p>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>Alex R. — Founder @ GrowthFlow</p>
            </div>
            <div className="glass-panel" style={{ padding: "2rem", textAlign: "left", borderRadius: "var(--radius-xl)" }}>
              <p style={{ color: "#4ade80", fontWeight: "700", marginBottom: "0.75rem", fontSize: "1.125rem" }}>"Saved 10+ hours of writing/week"</p>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>James L. — Senior SDR</p>
            </div>
            <div className="glass-panel" style={{ padding: "2rem", textAlign: "left", borderRadius: "var(--radius-xl)" }}>
              <p style={{ color: "#4ade80", fontWeight: "700", marginBottom: "0.75rem", fontSize: "1.125rem" }}>"Actually sounds human. 5/5."</p>
              <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)" }}>Sarah M. — Head of Sales</p>
            </div>
          </div>
          <p style={{ marginTop: "3.5rem", color: "white", fontWeight: "700", fontSize: "1.125rem" }}>
            Used by <span className="text-gradient">500+ outbound professionals</span>
          </p>
        </div>
      </div>

      <div id="how-it-works" className="container" style={{ padding: "8rem 0" }}>
        <HowItWorks />
        <div style={{ marginTop: "10rem" }}>
          <Features />
        </div>
        <div style={{ marginTop: "10rem" }}>
          <Comparison />
        </div>

        <section style={{ padding: "10rem 0", borderTop: "1px solid var(--border-subtle)", textAlign: "center", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05), transparent 70%)", pointerEvents: "none" }} />
          <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--accent-violet)", fontWeight: "700", marginBottom: "1rem" }}>
            Simple, Scalable Pricing
          </p>
          <h2 style={{ fontSize: "clamp(2.25rem, 6vw, 4rem)", fontWeight: "900", marginBottom: "5rem", letterSpacing: "-0.04em", lineHeight: "1.1" }}>
            Start free. Scale as your <br /><span className="text-gradient">outbound grows.</span>
          </h2>
          <Pricing />
          
          <div style={{ marginTop: "5rem" }}>
            <Link href="/sign-up" className="glow-button" style={{ padding: "1.375rem 3rem", fontSize: "1.25rem", borderRadius: "var(--radius-full)" }}>
              Generate My First DM Free <ArrowRight size={24} style={{ marginLeft: "10px" }} />
            </Link>
          </div>
        </section>

        {/* SEO Content Sections */}
        <section style={{ padding: "10rem 0", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: "900", marginBottom: "2rem", color: "white", letterSpacing: "-0.03em" }}>
              Best AI LinkedIn Opener Generator
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.25rem", lineHeight: "1.8", marginBottom: "2rem" }}>
              AuricAI helps you write personalized LinkedIn messages that get replies. It uses real profile context to generate relevant, human-sounding outreach in seconds.
            </p>
            <p style={{ color: "white", fontWeight: "700", fontSize: "1.125rem", letterSpacing: "0.02em" }}>
              Built for SDRs, founders, and teams doing outbound at scale.
            </p>
          </div>
        </section>

        <FAQ />
      </div>

      <StickyCTA />
    </main>
  );
}
