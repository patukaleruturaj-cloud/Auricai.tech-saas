"use client";

import Pricing from "@/components/Pricing";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Comparison from "@/components/Comparison";
import FAQ from "@/components/FAQ";
import StickyCTA from "@/components/StickyCTA";
import Footer from "@/components/Footer";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const fullText = `"Hey Sarah — noticed TechCorp is expanding its sales team this quarter. Curious how you're thinking about outbound scaling?"`;

export default function Home() {
  const [demoStep, setDemoStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  // Mobile nav open/close state
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Simple animation sequence for the hero demo
  useEffect(() => {
    const timer = setTimeout(() => {
      setDemoStep((prev) => (prev + 1) % 5);
    }, demoStep === 4 ? 4000 : 2000);
    return () => clearTimeout(timer);
  }, [demoStep]);

  // AI Typing animation effect
  useEffect(() => {
    let currentIndex = 0;
    let isPaused = false;
    let interval: NodeJS.Timeout;

    const startTyping = () => {
      setTypedText("");
      currentIndex = 0;
      isPaused = false;

      interval = setInterval(() => {
        if (isPaused) return;

        currentIndex++;
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex));
        } else {
          clearInterval(interval);
          isPaused = true;
          // Wait for 5 seconds after typing finishes
          setTimeout(() => {
            startTyping(); // Restart the loop
          }, 5000);
        }
      }, 40);
    };

    const startDelay = setTimeout(startTyping, 1000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, []);

  return (
    <main className="animate-fade-in" style={{ paddingBottom: "var(--spacing-12)" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* ── Cursor blink ── */
        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0; }
        }
        .cursor {
          display: inline-block;
          color: white;
          width: 3px;
          margin-left: 4px;
          animation: blink 1s infinite;
        }

        /* ── Responsive Navbar ── */
        .nav-desktop-links {
          display: flex;
          gap: var(--spacing-4);
        }
        .nav-hamburger {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          color: white;
          padding: 8px;
          /* Minimum 44px touch target */
          min-width: 44px;
          min-height: 44px;
          align-items: center;
          justify-content: center;
        }
        /* Mobile nav overlay */
        .mobile-nav-overlay {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(5, 6, 10, 0.97);
          backdrop-filter: blur(24px);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }
        .mobile-nav-overlay.open {
          display: flex;
        }
        .mobile-nav-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: transparent;
          border: none;
          cursor: pointer;
          color: white;
          padding: 8px;
          min-width: 44px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mobile-nav-link {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          text-decoration: none;
          padding: 0.75rem 2rem;
          border-radius: var(--radius-full);
          transition: background var(--transition-fast);
          min-height: 56px;
          display: flex;
          align-items: center;
        }

        /* ── Hero Grid ── */
        /* Mobile first: single column */
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
          padding: 3rem 0 2rem;
        }
        /* Tablet+: two columns */
        @media (min-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            min-height: 80vh;
            padding: 4rem 0;
          }
        }

        /* ── Hero typography ── */
        /* clamp(min, preferred, max) — fluid scaling */
        .hero-headline {
          font-size: clamp(2rem, 7vw, 4.5rem);
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
        }
        .hero-subtext {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: var(--text-secondary);
          max-width: 540px;
          line-height: 1.6;
        }

        /* ── Hero CTA Buttons ── */
        /* Mobile: column + full-width */
        .hero-cta-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
          width: 100%;
        }
        .hero-cta-group a,
        .hero-cta-group button {
          width: 100%;
          justify-content: center;
          padding: 1rem 1.5rem;
          font-size: 1rem;
        }
        /* Tablet+: row layout, auto width */
        @media (min-width: 640px) {
          .hero-cta-group {
            flex-direction: row;
            width: auto;
          }
          .hero-cta-group a,
          .hero-cta-group button {
            width: auto;
            padding: 1.25rem 2rem;
            font-size: 1.125rem;
          }
        }

        /* ── Typing demo card ── */
        .hero-typing-card {
          margin-top: 1.5rem;
          padding: 1.25rem;
          background: rgba(15,15,15,0.4);
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          /* max-width: 100% on mobile, capped on desktop */
          max-width: 100%;
          min-height: 100px;
        }
        @media (min-width: 768px) {
          .hero-typing-card {
            max-width: 540px;
          }
        }

        /* ── Hero demo panel ── hide on small mobile, show on tablet ── */
        .hero-demo-panel {
          display: none;
        }
        @media (min-width: 640px) {
          .hero-demo-panel {
            display: flex;
            flex-direction: column;
          }
        }

        /* ── Section heading h2 ── */
        .section-h2 {
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        /* ── Section padding — reduce on mobile ── */
        .section-gap {
          padding: 3.5rem 0;
        }
        @media (min-width: 768px) {
          .section-gap {
            padding: 6rem 0;
          }
        }

        /* ── Hamburger breakpoint ── */
        @media (max-width: 639px) {
          .nav-desktop-links {
            display: none;
          }
          .nav-hamburger {
            display: flex;
          }
        }
      `}} />

      {/* ── Mobile Nav Overlay ── */}
      <div className={`mobile-nav-overlay ${mobileNavOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-label="Mobile navigation">
        <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)} aria-label="Close menu">
          <X size={28} />
        </button>
        <Link href="/sign-in" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>
          Login
        </Link>
        <Link href="/sign-up" className="glow-button mobile-nav-link" onClick={() => setMobileNavOpen(false)} style={{ background: "var(--accent-blue)" }}>
          Get Started
        </Link>
      </div>

      {/* ── Navbar ── */}
      <nav className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "var(--spacing-8)", paddingBottom: "var(--spacing-8)" }}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "transform var(--transition-normal), opacity var(--transition-normal)",
          willChange: "transform, opacity",
          cursor: "pointer"
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale3d(1.03, 1.03, 1)";
            e.currentTarget.style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale3d(1, 1, 1)";
            e.currentTarget.style.opacity = "1";
          }}>
          <Image
            src="/logo.png"
            alt="AuricAI Logo"
            width={40}
            height={40}
            priority
            style={{ filter: "invert(1)" }}
          />
          <span style={{ fontSize: "1.5rem", fontWeight: "700", letterSpacing: "-0.02em", color: "white" }}>AuricAI</span>
        </div>

        {/* Desktop nav links — hidden on mobile via CSS */}
        <div className="nav-desktop-links">
          <Link href="/sign-in" className="secondary-button" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
            Login
          </Link>
          <Link href="/sign-up" className="glow-button" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", background: "var(--accent-blue)" }}>
            Get Started
          </Link>
        </div>

        {/* Hamburger — shown only on mobile via CSS */}
        <button className="nav-hamburger" onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
          <Menu size={26} />
        </button>
      </nav>

      {/* ── Hero Section ── */}
      <div className="container hero-grid">
        {/* Left Copy */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem", willChange: "transform, opacity" }}
        >
          {/* Fluid heading — clamp() scales from 2rem on mobile to 4.5rem on large desktop */}
          <h1 className="hero-headline">
            Turn LinkedIn Cold DMs Into{" "}
            <span className="text-gradient">
              Revenue Conversations.
            </span>
          </h1>

          <p className="hero-subtext">
            Generate hyper-personalized LinkedIn openers that feel 1:1 written — at scale. Built for SDRs, founders, and outbound teams who care about reply rates.
          </p>

          {/* AI Typing Animation */}
          <div className="glass-panel hero-typing-card">
            <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--accent-violet)", fontWeight: "600", marginBottom: "0.5rem", letterSpacing: "0.05em" }}>
              <Sparkles size={12} style={{ display: "inline-block", marginRight: "4px", verticalAlign: "middle" }} />
              AuricAI generating opener...
            </p>
            <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "var(--text-primary)", fontStyle: "italic", minHeight: "3rem" }}>
              {typedText}<span className="cursor">|</span>
            </p>
          </div>

          {/* CTA buttons — stack on mobile, row on tablet+ */}
          <div className="hero-cta-group">
            <Link href="/sign-up" className="glow-button" style={{ gap: "0.5rem" }}>
              Generate My First LinkedIn DM Free <ArrowRight size={20} />
            </Link>
            <Link href="#how-it-works" className="secondary-button">
              See How It Works
            </Link>
          </div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "-0.25rem" }}>
            No scraping. No automation spam. Just relevance.
          </span>
        </motion.div>

        {/* Right Demo Panel — hidden on smallest screens, shown from 640px up */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: [0, -10, 0] }}
          transition={{
            opacity: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
            y: { duration: 7, ease: "easeInOut", repeat: Infinity }
          }}
          className="glass-panel hero-demo-panel"
          style={{
            position: "relative",
            willChange: "transform, opacity",
            overflow: "hidden",
            background: "rgba(15,15,15,0.75)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.55), 0 20px 60px rgba(59, 130, 246, 0.15)"
          }}
        >
          {/* macOS Window Header */}
          <div style={{ height: "28px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", padding: "0 12px", gap: "6px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff5f56" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffbd2e" }} />
            <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#27c93f" }} />
          </div>

          <div style={{ padding: "var(--spacing-6)", display: "flex", flexDirection: "column", gap: "var(--spacing-4)", position: "relative" }}>
            <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "100px", height: "100px", background: "var(--accent-blue)", filter: "blur(60px)", zIndex: -1, opacity: 0.2 }}></div>

            <div style={{ borderBottom: "1px solid var(--border-subtle)", paddingBottom: "var(--spacing-4)" }}>
              <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "var(--text-secondary)", letterSpacing: "0.05em", marginBottom: "var(--spacing-2)" }}>Target Prospect</p>
              <div style={{ display: "flex", gap: "var(--spacing-3)", alignItems: "center" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
                    &ldquo;Hey Sarah — noticed TechCorp expanding the sales team recently. Curious if outbound personalization is something your team is experimenting with this quarter?&rdquo;
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Content Sections ── */}
      <div id="how-it-works" className="container">
        <HowItWorks />
        <Features />
        <Comparison />

        {/* Pricing section */}
        <section className="section-gap" style={{ borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-violet)", fontWeight: "600", marginBottom: "0.75rem" }}>
            Simple, Scalable Pricing
          </p>
          <h2 className="section-h2" style={{ marginBottom: "3rem" }}>
            Start free. Scale as your <span className="text-gradient">outbound grows.</span>
          </h2>
          <Pricing />
        </section>

        <FAQ />
      </div>

      <Footer />
      <StickyCTA />
    </main>
  );
}
