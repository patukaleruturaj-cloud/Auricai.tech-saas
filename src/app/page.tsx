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

export default function Home() {
  const [demoStep, setDemoStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typedOpenerIndex, setTypedOpenerIndex] = useState(0);

  const demoOpeners = [
    "Hey Sarah — noticed TechCorp expanding the sales team recently. Curious if outbound personalization is something your team is experimenting with this quarter?",
    "Hi Mark — loved your recent post about product-led growth. Noticed your background in fintech too. Would love to hear how you're thinking about PLG in that space.",
    "Hey David — congrats on the Series B! Scaling the engineering team is usually a challenge right after. How's the transition to the new infrastructure going?",
    "Hi Jessica — saw your talk at the GTM Summit. Your point about signal-based outreach really resonated. Are you currently using AI to help with lead research?"
  ];

  // Simple animation sequence for the hero demo
  useEffect(() => {
    const timer = setInterval(() => {
      setDemoStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // AI Typing animation effect
  useEffect(() => {
    let isCancelled = false;
    let timeoutId: NodeJS.Timeout;

    // Reset text immediately when opener index changes
    setTypedText("");

    const fullText = demoOpeners[typedOpenerIndex];
    let currentIndex = 0;

    const type = () => {
      if (isCancelled) return;

      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(type, 30); // Slightly faster for responsiveness
      } else {
        // Wait for 5 seconds after typing finishes
        timeoutId = setTimeout(() => {
          if (isCancelled) return;
          setTypedOpenerIndex((prev) => (prev + 1) % demoOpeners.length);
        }, 5000);
      }
    };

    // Short delay before starting to type the next one
    timeoutId = setTimeout(type, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [typedOpenerIndex]);

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

          {/* AI Typing Animation */}
          <div className="glass-panel hero-typing-card">
            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accent-violet)", fontWeight: "600", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
              <Sparkles size={12} style={{ display: "inline-block", marginRight: "4px", verticalAlign: "middle" }} />
              AuricAI generating opener...
            </p>
            <p style={{ fontSize: "0.9375rem", lineHeight: "1.5", color: "var(--text-primary)", fontStyle: "italic", minHeight: "4.5rem", wordBreak: "break-word" }}>
              {typedText}<span className="cursor">|</span>
            </p>
          </div>

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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
            y: { duration: 7, ease: "easeInOut", repeat: Infinity }
          }}
          className="glass-panel hero-demo"
          style={{
            padding: "0",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            willChange: "transform, opacity",
            overflow: "hidden"
          }}
        >
          {/* macOS Window Header */}
          <div style={{ height: "28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 12px", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
          </div>

          <div style={{ padding: "var(--spacing-6)", display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
            <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "100px", height: "100px", background: "var(--accent-blue)", filter: "blur(60px)", zIndex: -1, opacity: 0.2 }}></div>

            <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--spacing-4)" }}>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.05em", marginBottom: "var(--spacing-2)" }}>Target Prospect</p>
              <div style={{ display: "flex", gap: "var(--spacing-3)", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image src="/logo.png" alt="AuricAI Logo" width={24} height={24} style={{ filter: "invert(1)", objectFit: "contain" }} />
                </div>
                <div>
                  <p style={{ fontWeight: "600" }}>Sarah Jenkins</p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>VP of Sales @ TechCorp</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-3)", minHeight: "150px" }}>
              {demoStep === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "var(--spacing-4)", background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontStyle: "italic" }}>
                  Mapping Prospect Context...
                </motion.div>
              )}
              {demoStep === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "var(--spacing-4)", background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontStyle: "italic" }}>
                  Analyzing role authority...
                </motion.div>
              )}
              {demoStep === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: "var(--spacing-4)", background: "rgba(0,0,0,0.3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", color: "var(--text-secondary)", fontStyle: "italic" }}>
                  Scanning company signals...
                </motion.div>
              )}
              {demoStep === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-2)", padding: "var(--spacing-4)", color: "var(--text-secondary)", fontStyle: "italic" }}>
                  <Sparkles size={16} className="text-gradient" />
                  <p>Generating personalized opener...</p>
                </motion.div>
              )}
              {demoStep >= 4 && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ padding: "var(--spacing-4)", background: "var(--bg-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-focus)", position: "relative" }}>
                  <p style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent-blue)", fontWeight: "600", marginBottom: "var(--spacing-2)" }}>Generated Opener</p>
                  <p style={{ fontSize: "0.9375rem", lineHeight: "1.6" }}>
                    "Hey Sarah — noticed TechCorp expanding the sales team recently. Curious if outbound personalization is something your team is experimenting with this quarter?"
                  </p>
                </motion.div>
              )}
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
              AuricAI is the world's most intelligent <strong>AI LinkedIn opener generator</strong>. Unlike generic templates or automation tools that get your account flagged, AuricAI uses advanced natural language processing to analyze individual LinkedIn profiles. It identifies unique career milestones, shared interests, and specific company updates to craft messages that feel like they were written after an hour of research.
            </p>

            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
              How to Write LinkedIn Openers That Get Replies
            </h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1.5rem" }}>
              The secret to high-converting <strong>LinkedIn outreach</strong> isn't in your pitch—it's in your opener. Most professionals ignore 90% of their InMail because it sounds like a template. To increase your reply rates:
            </p>
            <ul style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "2rem", paddingLeft: "1.5rem", listStyleType: "disc" }}>
              <li><strong>Lead with relevance:</strong> Mention a specific achievement from their "About" section.</li>
              <li><strong>Keep it short:</strong> Your first message should be under 200 characters.</li>
              <li><strong>Ask a curiosity question:</strong> Instead of "do you have time?", ask about a specific challenge they might be facing.</li>
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
