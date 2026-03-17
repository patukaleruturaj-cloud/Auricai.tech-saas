import Pricing from "@/components/Pricing";

export default function PricingPage() {
    return (
        <main className="animate-fade-in" style={{ paddingBottom: "var(--spacing-20)" }}>

            <section className="container" style={{ padding: "4rem 0", textAlign: "center" }}>
                <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--accent-violet)", fontWeight: "600", marginBottom: "0.75rem" }}>
                    Simple, Scalable Pricing
                </p>
                <h1 style={{ fontSize: "3.5rem", fontWeight: "800", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
                    The right plan for your <span className="text-gradient">outbound.</span>
                </h1>
                <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 4rem auto", lineHeight: "1.6" }}>
                    Whether you're a solo founder or a scaling sales team, we have a plan that fits your volume. All plans include our core AI context engine.
                </p>
                <Pricing />
            </section>
        </main>
    );
}
