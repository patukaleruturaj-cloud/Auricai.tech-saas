import React from "react";

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: React.ReactNode;
}

export default function LegalLayout({ title, lastUpdated, children }: LegalLayoutProps) {
    return (
        <main className="animate-fade-in" style={{ paddingBottom: "var(--spacing-20)" }}>
            <div className="container" style={{ maxWidth: "800px", marginTop: "4rem" }}>
                <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "2rem" }}>{title}</h1>
                <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Last Updated: {lastUpdated}</p>
                {children}
            </div>
        </main>
    );
}
