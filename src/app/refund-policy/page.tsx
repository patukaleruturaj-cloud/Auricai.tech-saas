import LegalLayout from "@/components/LegalLayout";

export default function RefundPolicyPage() {
    return (
        <LegalLayout title="Refund Policy" lastUpdated="March 11, 2026">
            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>1. No Refunds</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    All purchases made on AuricAI are final. Due to the nature of our service, which provides instant AI-generated content and consumes computational resources immediately upon use, we do not offer refunds once a subscription or credit package has been purchased.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>2. Free Usage Before Purchase</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Users are encouraged to evaluate the service using the available free features or trial credits before purchasing a paid plan.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>3. Subscription Cancellation</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    You may cancel your subscription at any time. Once cancelled, you will continue to have access to the service until the end of your current billing period. No further charges will be applied after cancellation.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>4. Exceptional Circumstances</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    In rare cases such as duplicate charges or technical billing errors, AuricAI may review refund requests at its sole discretion.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>5. Contact</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    If you believe there has been a billing error, please contact us at <a href="mailto:support@auricai.tech" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>support@auricai.tech</a> and we will investigate the issue.
                </p>
            </section>
        </LegalLayout>
    );
}
