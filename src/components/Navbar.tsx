"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <>
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (max-width: 1024px) {
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
                }
            `}} />

            <nav className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "var(--spacing-8)", paddingBottom: "var(--spacing-8)", position: "relative", zIndex: 100 }}>
                <Link href="/" style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "transform var(--transition-normal), opacity var(--transition-normal)",
                    willChange: "transform, opacity",
                    cursor: "pointer",
                    textDecoration: "none"
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
                </Link>

                {/* Desktop Nav Links */}
                <div className="nav-links" style={{ display: "flex", gap: "var(--spacing-4)" }}>
                    <Link href="/sign-in" className="secondary-button" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                        Login
                    </Link>
                    <Link href="/sign-up" className="glow-button" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem", background: "var(--accent-blue)" }}>
                        Get Started
                    </Link>
                </div>

                {/* Hamburger Menu (Mobile Only) */}
                <button
                    className="nav-hamburger"
                    style={{ display: "none", background: "transparent", border: "none", cursor: "pointer", color: "white", padding: "8px" }}
                    onClick={() => setMobileNavOpen(true)}
                >
                    <Menu size={28} />
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {mobileNavOpen && (
                <div className="mobile-menu-overlay">
                    <button
                        style={{ position: "absolute", top: "2rem", right: "2rem", background: "transparent", border: "none", color: "white", cursor: "pointer" }}
                        onClick={() => setMobileNavOpen(false)}
                    >
                        <X size={32} />
                    </button>
                    <Link href="/sign-in" className="secondary-button" style={{ fontSize: "1.25rem", padding: "1rem 3rem" }} onClick={() => setMobileNavOpen(false)}>
                        Login
                    </Link>
                    <Link href="/sign-up" className="glow-button" style={{ fontSize: "1.25rem", padding: "1rem 3rem", background: "var(--accent-blue)" }} onClick={() => setMobileNavOpen(false)}>
                        Get Started
                    </Link>
                </div>
            )}
        </>
    );
}
