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
  const [demoStep, setDemoStep] = useState(0); // 0: Prospect, 1: Generating, 2: Output

  const prospect = {
    name: "Sarah Jenkins",
    role: "VP of Sales",
    company: "TechCorp"
  };

  const outputMessage = "Hi Sarah — noticed TechCorp's recent focus on scaling the GTM team. Curious if ramping new SDRs while maintaining personalization is a priority for you this quarter?";

  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 3);
    }, 4000); // 4s cycle
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
      `}} />
      {/* Hero Section */}
      <div className="container hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "6rem", alignItems: "center", minHeight: "85vh", padding: "6rem 0" }}>
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

        {/* Right Demo Animation (Product-Driven) */}
        <div style={{ position: "relative" }}>
          {/* Enhanced Visual Depth Glow */}
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "120%", height: "120%", background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.12), transparent 70%)", pointerEvents: "none", zIndex: -1 }}></div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel hero-demo"
            style={{
              padding: "0",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 40px 100px -20px rgba(0, 0, 0, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              background: "rgba(10, 11, 15, 0.95)",
            }}
          >
            {/* macOS Window Header */}
            <div style={{ height: "32px", background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 14px", gap: "8px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56", opacity: 0.8 }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e", opacity: 0.8 }} />
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f", opacity: 0.8 }} />
            </div>

            <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "2rem", minHeight: "360px" }}>
              {/* Prospect Card Section */}
              <motion.div 
                animate={{ opacity: demoStep >= 0 ? 1 : 0.4 }}
                transition={{ duration: 0.3 }}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "1.5rem" }}
              >
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.08em", fontWeight: "600", marginBottom: "0.75rem" }}>Detected Prospect</p>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #1e293b, #0f172a)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <Image src="/logo.png" alt="AuricAI" width={28} height={28} style={{ filter: "invert(1)" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: "1.125rem", fontWeight: "700", color: "white" }}>{prospect.name}</p>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{prospect.role} @ {prospect.company}</p>
                  </div>
                </div>
              </motion.div>

              {/* Generating / Output Section */}
              <div style={{ position: "relative", minHeight: "140px" }}>
                {demoStep === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      style={{ width: "20px", height: "20px", border: "2px solid rgba(59, 130, 246, 0.2)", borderTopColor: "var(--accent-blue)", borderRadius: "50%" }}
                    />
                    <p style={{ fontSize: "1rem", color: "var(--text-secondary)", fontStyle: "italic" }}>Generating opener...</p>
                  </motion.div>
                )}

                {demoStep === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
                  >
                    <div className="glass-panel" style={{ padding: "1.5rem", background: "rgba(59, 130, 246, 0.03)", border: "1px solid rgba(59, 130, 246, 0.2)", borderRadius: "14px", position: "relative", minHeight: "120px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <div style={{ position: "absolute", top: "1rem", right: "1.25rem", textAlign: "right" }}>
                        <p style={{ fontSize: "1.125rem", fontWeight: "800", color: "#4ade80", lineHeight: "1" }}>82</p>
                        <p style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.02em" }}>Reply Score</p>
                        <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>Based on relevance</p>
                      </div>
                      <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accent-blue)", fontWeight: "700", marginBottom: "1rem", letterSpacing: "0.05em" }}>Personalized Output</p>
                      <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "rgba(255,255,255,0.9)", maxWidth: "80%" }}>
                        "{outputMessage}"
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
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
