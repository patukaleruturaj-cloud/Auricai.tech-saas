"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Script from "next/script";

import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import Comparison from "@/components/Comparison";
import FAQ from "@/components/FAQ";
import StickyCTA from "@/components/StickyCTA";

interface SEOLandingPageProps {
  headline: string;
  subheadline: string;
  description: string;
  examples: {
    scenario: string;
    message: string;
    color: "blue" | "violet";
  }[];
  benefits: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  ctaText: string;
  crossLinks: {
    title: string;
    href: string;
  }[];
  problemSolution?: {
    problem: string;
    solution: string;
  };
  useCase?: {
    title: string;
    description: string;
    points: string[];
  };
  additionalContent?: React.ReactNode;
  faqItems?: {
    question: string;
    answer: string;
  }[];
  supportingLine?: string;
}

export default function SEOLandingPage({
  headline,
  subheadline,
  description,
  examples,
  benefits,
  ctaText,
  crossLinks,
  problemSolution,
  useCase,
  additionalContent,
  faqItems,
  supportingLine = "Free to start. No credit card required."
}: SEOLandingPageProps) {
  const [demoStep, setDemoStep] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typedOpenerIndex, setTypedOpenerIndex] = useState(0);

  const demoOpeners = examples.length > 0 
    ? examples.map(ex => ex.message)
    : [
        "Hey Sarah — noticed TechCorp expanding the sales team recently. Curious if outbound personalization is something your team is experimenting with this quarter?"
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

    setTypedText("");

    const fullText = demoOpeners[typedOpenerIndex];
    let currentIndex = 0;

    const type = () => {
      if (isCancelled) return;

      if (currentIndex <= fullText.length) {
        setTypedText(fullText.substring(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(type, 30);
      } else {
        timeoutId = setTimeout(() => {
          if (isCancelled) return;
          setTypedOpenerIndex((prev) => (prev + 1) % demoOpeners.length);
        }, 5000);
      }
    };

    timeoutId = setTimeout(type, 400);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [typedOpenerIndex, demoOpeners]);

  const faqSchema = faqItems ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  } : null;

  return (
    <main className="animate-fade-in" style={{ paddingBottom: "var(--spacing-12)" }}>
      {faqSchema && (
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
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
        `
      }} />

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
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "rgba(59, 130, 246, 0.1)", borderRadius: "100px", border: "1px solid rgba(59, 130, 246, 0.2)", color: "var(--accent-blue)", fontSize: "0.875rem", fontWeight: "600", alignSelf: "flex-start" }}>
            <Sparkles size={14} /> {subheadline}
          </div>
          
          <h1 className="hero-title" style={{ fontSize: "4.5rem", fontWeight: "800", lineHeight: "1.05", letterSpacing: "-0.03em" }}>
            {headline.split(' ').map((word, i) => (
              i >= headline.split(' ').length - 3 ? <span key={i} className="text-gradient"> {word}</span> : <span key={i}> {word}</span>
            ))}
          </h1>
          
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "540px", lineHeight: "1.6" }}>
            {description}
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
              {ctaText} <ArrowRight size={20} />
            </Link>
            <Link href="#how-it-works" className="secondary-button" style={{ padding: "1.25rem 2rem", fontSize: "1.125rem" }}>
              See How It Works
            </Link>
          </div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            {supportingLine}
          </span>
        </motion.div>

        {/* Right Demo Animation */}
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
                  <Image src="/logo.png" alt="AI LinkedIn opener generator dashboard" width={24} height={24} style={{ filter: "invert(1)", objectFit: "contain" }} />
                </div>
                <div>
                  <p style={{ fontWeight: "600" }}>Target Lead</p>
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
                    "{demoOpeners[typedOpenerIndex]}"
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

        {/* SEO Content Sections (Matching Homepage Layout style) */}
        <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "left" }}>
            
            {/* Problem-Solution Section */}
            {problemSolution && (
              <div style={{ marginBottom: "4rem" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
                  The Challenge vs. The Solution
                </h2>
                <div style={{ display: "grid", gap: "1.5rem" }}>
                  <div className="glass-panel" style={{ padding: "1.5rem", borderLeft: "4px solid #ef4444" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "#ef4444" }}>
                      <AlertCircle size={20} />
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>The Problem</h3>
                    </div>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1rem" }}>
                      {problemSolution.problem}
                    </p>
                  </div>
                  <div className="glass-panel" style={{ padding: "1.5rem", borderLeft: "4px solid var(--accent-blue)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem", color: "var(--accent-blue)" }}>
                      <CheckCircle2 size={20} />
                      <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>The Solution</h3>
                    </div>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1rem" }}>
                      {problemSolution.solution}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Benefits Content */}
            {benefits && benefits.length > 0 && (
              <div style={{ marginBottom: "4rem" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
                  Core Benefits
                </h2>
                <ul style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "2rem", paddingLeft: "1.5rem", listStyleType: "disc" }}>
                  {benefits.map((benefit, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem" }}>
                      <strong>{benefit.title}:</strong> {benefit.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Use-Case Section */}
            {useCase && (
              <div style={{ marginBottom: "4rem" }}>
                <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
                  {useCase.title}
                </h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "1.5rem" }}>
                  {useCase.description}
                </p>
                <ul style={{ color: "var(--text-secondary)", lineHeight: "1.8", marginBottom: "2rem", paddingLeft: "1.5rem", listStyleType: "disc" }}>
                  {useCase.points.map((point, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem" }}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Additional "Below the Fold" Content */}
            {additionalContent && (
              <div style={{ marginBottom: "4rem" }}>
                {additionalContent}
              </div>
            )}

            {/* Static Examples Demo block */}
            <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
              Examples of High-Converting LinkedIn Messages
            </h2>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {examples.map((example, index) => (
                <div key={index} className="glass-panel" style={{ padding: "1.5rem" }}>
                  <p style={{ fontSize: "0.875rem", color: example.color === "blue" ? "var(--accent-blue)" : "var(--accent-violet)", fontWeight: "600", marginBottom: "0.5rem" }}>Scenario: {example.scenario}</p>
                  <p style={{ color: "white", lineHeight: "1.6" }}>"{example.message}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Cross-linking */}
        <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "2rem" }}>Explore More LinkedIn Tools</h2>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
            <Link href="/" className="glass-panel" style={{ padding: "0.75rem 1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", transition: "all 0.2s ease" }}>
              Homepage
            </Link>
            <Link href="/dashboard" className="glass-panel" style={{ padding: "0.75rem 1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", transition: "all 0.2s ease" }}>
              Dashboard
            </Link>
            {crossLinks.map((link, index) => (
              <Link 
                key={index} 
                href={link.href}
                className="glass-panel"
                style={{ padding: "0.75rem 1.5rem", fontSize: "0.875rem", color: "var(--text-secondary)", transition: "all 0.2s ease" }}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </section>

        <FAQ />
      </div>

      <StickyCTA />
    </main>
  );
}
