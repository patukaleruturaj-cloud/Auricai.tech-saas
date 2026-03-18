import Link from "next/link";
import { Sparkles, ArrowRight, Shield, Zap, Target, Users, Search, CheckCircle2, AlertCircle } from "lucide-react";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import StickyCTA from "@/components/StickyCTA";
import Script from "next/script";

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
  faqItems
}: SEOLandingPageProps) {
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
        }
        `
      }} />

      {/* Hero Section */}
      <div className="container hero-grid" style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "6rem 0", textAlign: "center" }}>
        <div 
          className="hero-copy"
          style={{ display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", maxWidth: "900px" }}
        >
           <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", background: "rgba(59, 130, 246, 0.1)", borderRadius: "100px", border: "1px solid rgba(59, 130, 246, 0.2)", color: "var(--accent-blue)", fontSize: "0.875rem", fontWeight: "600" }}>
            <Sparkles size={14} /> {subheadline}
          </div>
          <h1 className="hero-title" style={{ fontSize: "4.5rem", fontWeight: "800", lineHeight: "1.05", letterSpacing: "-0.03em" }}>
            {headline.split(' ').map((word, i) => (
              i > headline.split(' ').length - 3 ? <span key={i} className="text-gradient"> {word}</span> : <span key={i}> {word}</span>
            ))}
          </h1>
          <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", maxWidth: "700px", lineHeight: "1.6" }}>
            {description}
          </p>

          <div className="hero-cta-group" style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
            <Link href="/sign-up" className="glow-button" style={{
              padding: "1.25rem 2rem", fontSize: "1.125rem", gap: "0.5rem",
              background: "var(--accent-blue)",
              boxShadow: "0 0 40px rgba(59, 130, 246, 0.3)"
            }}>
              {ctaText} <ArrowRight size={20} />
            </Link>
          </div>
          <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)", marginTop: "-0.5rem" }}>
            Free to start. No credit card required.
          </span>
        </div>
      </div>

      <div className="container">
        {/* Problem-Solution Section */}
        {problemSolution && (
          <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "3rem" }}>
              <div className="glass-panel" style={{ padding: "2.5rem", borderLeft: "4px solid #ef4444" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", color: "#ef4444" }}>
                  <AlertCircle size={24} />
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>The Problem</h2>
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1.125rem" }}>
                  {problemSolution.problem}
                </p>
              </div>
              <div className="glass-panel" style={{ padding: "2.5rem", borderLeft: "4px solid var(--accent-blue)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", color: "var(--accent-blue)" }}>
                  <CheckCircle2 size={24} />
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>The Solution</h2>
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1.125rem" }}>
                  {problemSolution.solution}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Benefits Section */}
        <section style={{ padding: "4rem 0", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {benefits.map((benefit, index) => (
              <div key={index} className="glass-panel" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(59, 130, 246, 0.2)", color: "var(--accent-blue)" }}>
                  {benefit.icon}
                </div>
                <h3 style={{ fontSize: "1.375rem", fontWeight: "700" }}>{benefit.title}</h3>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.7", fontSize: "1.0625rem" }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use-Case Section */}
        {useCase && (
          <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)" }}>
            <div className="glass-panel" style={{ padding: "4rem", textAlign: "center", maxWidth: "1000px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1.5rem" }}>{useCase.title}</h2>
              <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)", marginBottom: "3rem", lineHeight: "1.6" }}>
                {useCase.description}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", textAlign: "left" }}>
                {useCase.points.map((point, i) => (
                  <div key={i} style={{ display: "flex", gap: "1rem" }}>
                    <div style={{ color: "var(--accent-blue)", marginTop: "0.25rem" }}>
                      <CheckCircle2 size={20} />
                    </div>
                    <p style={{ fontSize: "1.125rem", fontWeight: "500", color: "var(--text-primary)" }}>{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Examples Section */}
        <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "700", marginBottom: "3rem", textAlign: "center" }}>
              See <span className="text-gradient">AuricAI</span> In Action
            </h2>
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {examples.map((example, index) => (
                <div key={index} className="glass-panel" style={{ padding: "2rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "4px", height: "100%", background: example.color === "blue" ? "var(--accent-blue)" : "var(--accent-violet)" }} />
                  <p style={{ fontSize: "0.875rem", color: example.color === "blue" ? "var(--accent-blue)" : "var(--accent-violet)", fontWeight: "600", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {example.scenario}
                  </p>
                  <p style={{ color: "white", lineHeight: "1.7", fontSize: "1.0625rem", fontStyle: "italic" }}>
                    "{example.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />
        <Features />

        {/* Below Fold Content */}
        {additionalContent && (
          <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto", color: "var(--text-secondary)", lineHeight: "1.8" }}>
              {additionalContent}
            </div>
          </section>
        )}

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

        <section style={{ padding: "6rem 0", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
          <Pricing />
        </section>

        <FAQ />
      </div>

      <StickyCTA />
    </main>
  );
}
