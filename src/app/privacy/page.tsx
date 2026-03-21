import LegalLayout from "@/components/LegalLayout";

export default function PrivacyPage() {
    return (
        <LegalLayout title="Privacy Policy" lastUpdated="March 11, 2026">
            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>1. Information We Collect</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include your email address, name, and any LinkedIn profile data or company information you provide for our AI to analyze.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>2. How We Use Information</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    We use the information we collect to provide, maintain, and improve our services, including our AI-powered personalization engine. We do not sell your personal information to third parties.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>3. Data Security</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    We implement reasonable security measures to protect your information from unauthorized access, alteration, or destruction. We use industry-standard encryption and secure authentication providers like Clerk.
                </p>
            </section>

            <section style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>4. Contact Us</h2>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@auricai.tech" style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>support@auricai.tech</a>.
                </p>
            </section>
        </LegalLayout>
    );
}
