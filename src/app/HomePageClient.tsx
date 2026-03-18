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
import { Sparkles, ArrowRight, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
// Metadata moved to page.tsx
export default function Home() {
  const [demoStep, setDemoStep] = useState(0); // 0: Input, 1: Generating, 2: Output
  
  const prospectDetails = {
    name: "Sarah Jenkins",
    role: "VP of Sales",
    company: "TechCorp"
  };

  const genericDM = "Hi, I help companies grow...";
  const auricAIDM = "Hi Sarah — noticed TechCorp's recent Series B and your focus on scaling the GTM team. Curious if ramping new SDRs while maintaining personalization is a priority for you this quarter?";

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 3);
    }, 4500); // 4.5s per step for readability
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
            <Link href="#how-it-works" className="secondary-button" style={{ padding: "1.25rem 2rem", fontSize: "1.125rem" }}>
              See How It Works
            </Link>
          </div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            No scraping. No automation spam. Just relevance.
          </span>
        </motion.div>

        {/* Right Demo Animation */}
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
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            background: "linear-gradient(135deg, rgba(20, 20, 25, 0.9) 0%, rgba(10, 10, 15, 0.9) 100%)",
          }}
        >
          {/* subtle glow behind */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.15), transparent 70%)", pointerEvents: "none" }} />
          
          <div style={{ height: "32px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 12px", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
          </div>

          <div style={{ padding: "1.75rem", display: "flex", flexDirection: "column", gap: "1.25rem", minHeight: "340px" }}>
            <AnimatePresence mode="wait">
              {demoStep === 0 && (
                <motion.div 
                  key="input" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                >
                  <p style={{ fontSize: "0.7rem", textTransform: "uppercase", color: "var(--accent-blue)", letterSpacing: "0.1em", fontWeight: "700" }}>Prospect Detected</p>
                  <div className="glass-panel" style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px" }}>
                    <p style={{ fontWeight: "700", fontSize: "1rem", color: "white", marginBottom: "2px" }}>{prospectDetails.name}</p>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{prospectDetails.role} @ {prospectDetails.company}</p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.65rem", padding: "4px 8px", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-blue)", borderRadius: "4px" }}># Series B</span>
                    <span style={{ fontSize: "0.65rem", padding: "4px 8px", background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-blue)", borderRadius: "4px" }}># Scaling Team</span>
                  </div>
                </motion.div>
              )}

              {demoStep === 1 && (
                <motion.div 
                  key="generating" 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1.5rem", marginTop: "2rem" }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Sparkles className="text-gradient" size={40} />
                  </motion.div>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", fontStyle: "italic", letterSpacing: "0.02em" }}>Generating high-relevance opener...</p>
                  <div style={{ width: "200px", height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden" }}>
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }} 
                      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} 
                      style={{ width: "50%", height: "100%", background: "linear-gradient(90deg, transparent, var(--accent-blue), transparent)" }} 
                    />
                  </div>
                </motion.div>
              )}

              {demoStep === 2 && (
                <motion.div 
                  key="output" 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ background: "rgba(34, 197, 94, 0.15)", color: "#4ade80", padding: "4px 12px", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "800", display: "inline-block", width: "fit-content" }}>
                        Reply Score: 92/100
                      </div>
                      <p style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginTop: "4px", marginLeft: "4px" }}>Based on relevance and clarity</p>
                    </div>
                  </div>
                  
                  <div className="glass-panel" style={{ padding: "1.25rem", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "12px", position: "relative" }}>
                    <div style={{ position: "absolute", top: "-8px", left: "16px", background: "var(--accent-blue)", color: "white", fontSize: "0.6rem", padding: "2px 8px", borderRadius: "4px", fontWeight: "700", textTransform: "uppercase" }}>AuricAI Output</div>
                    <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "white" }}>"{auricAIDM}"</p>
                  </div>
                  
                  <div style={{ background: "rgba(255,255,255,0.03)", padding: "0.75rem 1rem", borderRadius: "8px", borderLeft: "3px solid var(--accent-violet)" }}>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      <span style={{ color: "var(--accent-violet)", fontWeight: "700" }}>Suggestion:</span> Make opening line more specific
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Before vs After Footer */}
          <div style={{ marginTop: "auto", background: "rgba(0,0,0,0.4)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", overflow: "hidden" }}>
            <div style={{ flex: 1, padding: "0.875rem 1.25rem", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <X size={14} style={{ color: "#ef4444" }} />
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "#ef4444", fontWeight: "700", letterSpacing: "0.05em" }}>Generic DM</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>"{genericDM}"</p>
              </div>
            </div>
            <div style={{ flex: 1, padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", gap: "0.5rem", background: "rgba(34, 197, 94, 0.03)" }}>
              <Check size={14} style={{ color: "#22c55e" }} />
              <div style={{ overflow: "hidden" }}>
                <p style={{ fontSize: "0.6rem", textTransform: "uppercase", color: "#22c55e", fontWeight: "700", letterSpacing: "0.05em" }}>AuricAI Output</p>
                <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>High-context hooks...</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div id="how-it-works" className="container">
        <HowItWorks />
        <Features />
        <Comparison />

        <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-violet)", fontWeight: "600", marginBottom: "0.75rem" }}>
            Simple, Scalable Pricing
          </p>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "3rem" }}>
            Start free. Scale as your <span className="text-gradient">outbound grows.</span>
          </h2>
          <Pricing />
        </section>

        {/* SEO Content Sections */}
        <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
              Best AI LinkedIn Opener Generator
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "2rem" }}>
              AuricAI is the world's most intelligent <strong>AI LinkedIn opener generator</strong> and <strong>LinkedIn message generator</strong>. Unlike generic templates or automation tools that get your account flagged, AuricAI uses advanced natural language processing to analyze individual LinkedIn profiles. It identify unique career milestones, shared interests, and specific company updates to craft messages through our <strong>LinkedIn DM generator</strong> that feel like they were written after an hour of research. Whether you need a <strong>LinkedIn outreach generator</strong> or a <strong>LinkedIn cold message generator</strong>, AuricAI delivers high-converting results.
            </p>

            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
              How to Write LinkedIn Openers That Get Replies
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1.5rem" }}>
              The secret to high-converting <strong>LinkedIn outreach</strong> isn't in your pitch—it's in your opener. Using an <strong>AI LinkedIn outreach tool</strong> or a <strong>LinkedIn prospecting AI tool</strong> can significantly boost your efficiency. Most professionals ignore 90% of their InMail because it sounds like a template. To increase your reply rates with an <strong>AI tool for LinkedIn prospecting</strong>:
            </p>
            <ul style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "2rem", paddingLeft: "1.5rem", listStyleType: "disc" }}>
              <li><strong>Lead with relevance:</strong> Mention a specific achievement from their "About" section for better <strong>personalized LinkedIn outreach</strong>.</li>
              <li><strong>Keep it short:</strong> Your first message should be under 200 characters.</li>
              <li><strong>Ask a curiosity question:</strong> Instead of "do you have time?", ask about a specific challenge they might be facing using our <strong>LinkedIn lead generation tool</strong>.</li>
              <li><strong>Use a natural tone:</strong> Avoid corporate jargon and "SaaS-speak".</li>
            </ul>

            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
              Examples of High-Converting LinkedIn Messages
            </h2>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--accent-blue)", fontWeight: "600", marginBottom: "0.5rem" }}>Scenario: Funding Round</p>
                <p style={{ color: "white", lineHeight: "1.6" }}>"Hey Sarah—congrats on the Series B! Noticed you're scaling the GTM team. Curious if ramping new SDRs is your main focus this quarter?"</p>
              </div>
              <div className="glass-panel" style={{ padding: "1.5rem" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--accent-violet)", fontWeight: "600", marginBottom: "0.5rem" }}>Scenario: Specific Skillset</p>
                <p style={{ color: "white", lineHeight: "1.6" }}>"Hi Mark—loved your recent post about product-led growth. Noticed your background in fintech too. Would love to hear how you're thinking about PLG in that space."</p>
              </div>
            </div>
          </div>
        </section>

        <FAQ />
      </div>

      <StickyCTA />
    </main>
  );
}
