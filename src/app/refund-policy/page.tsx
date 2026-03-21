import LegalLayout from "@/components/LegalLayout";

export default function RefundPolicyPage() {
    return (
        <LegalLayout title="Refund Policy" lastUpdated="March 11, 2026">
            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>1. General Policy</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    All purchases made on AuricAI are generally non-refundable. Due to the nature of our service, which provides instant AI-generated outputs and consumes computational resources upon use, refunds are not typically provided after a purchase is completed.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>2. Free Trial and Evaluation</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Users are encouraged to evaluate the service using available free features or trial credits before upgrading to a paid plan.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>3. Subscription Cancellation</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    You may cancel your subscription at any time. After cancellation, you will continue to have access to the service until the end of your current billing period. No further charges will be applied.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>4. Exceptions</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Refunds may be issued in limited circumstances, including but not limited to:<br />
                    - Duplicate or accidental charges<br />
                    - Technical billing errors<br />
                    - Failure of the service to perform as described
                </p>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginTop: "1rem" }}>
                    All refund requests are reviewed on a case-by-case basis.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>5. Consumer Rights</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    This policy does not override any rights you may have under applicable consumer protection laws.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>6. Contact</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    If you believe there has been a billing issue, contact us at <a href="mailto:support@auricai.tech" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>support@auricai.tech</a> for review.
                </p>
            </section>
        </LegalLayout>
    );
}
