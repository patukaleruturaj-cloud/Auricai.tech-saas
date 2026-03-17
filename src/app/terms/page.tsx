import LegalLayout from "@/components/LegalLayout";

export default function TermsPage() {
    return (
        <LegalLayout title="Terms of Service" lastUpdated="March 11, 2026">
            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>1. Acceptance of Terms</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    By accessing or using AuricAI, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>2. Use of Service</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    You are responsible for your use of the service and for any content you provide. You must comply with all applicable laws and regulations. You may not use AuricAI for any illegal or unauthorized purpose, including spamming or malicious outbound activities.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>3. Subscriptions and Payments</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    We offer various subscription plans. Payments are processed through Paddle, our merchant of record. By subscribing, you agree to the payment terms associated with your chosen plan.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>4. Termination</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>5. Limitation of Liability</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    AuricAI shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.
                </p>
            </section>
        </LegalLayout>
    );
}
