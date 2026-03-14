import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
    // In a real app, you'd fetch this from a DB or CMS
    const title = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return {
        title: `${title} | AuricAI Blog`,
        description: `Read about ${title.toLowerCase()} and how to improve your LinkedIn outreach results with AuricAI.`,
        alternates: {
            canonical: `/blog/${params.slug}`,
        }
    };
}

export default function BlogPost({ params }: { params: { slug: string } }) {
    // This is a placeholder for the actual blog content
    // In a real implementation, you'd parse MDX or fetch from a CMS
    return (
        <div className="container" style={{ padding: "6rem 0", maxWidth: "800px" }}>
            <Link href="/blog" style={{ color: "var(--accent-blue)", textDecoration: "none", display: "block", marginBottom: "2rem" }}>
                ← Back to Blog
            </Link>

            <article>
                <header style={{ marginBottom: "3rem" }}>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "1rem", lineHeight: "1.2" }}>
                        {params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </h1>
                    <div style={{ display: "flex", gap: "1rem", color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                        <span>March 15, 2024</span>
                        <span>•</span>
                        <span>6 min read</span>
                    </div>
                </header>

                <div className="glass-panel" style={{ padding: "3rem", lineHeight: "1.8", color: "var(--text-secondary)" }}>
                    <p style={{ marginBottom: "1.5rem" }}>
                        LinkedIn outreach has evolved significantly in recent years. What used to work—sending hundreds of generic connection requests—now results in low reply rates and potential account restrictions.
                    </p>
                    <h2 style={{ color: "white", fontSize: "1.5rem", fontWeight: "700", marginTop: "2rem", marginBottom: "1rem" }}>
                        The Importance of Relevance
                    </h2>
                    <p style={{ marginBottom: "1.5rem" }}>
                        Relevance is the new currency of outbound sales. When you mention a specific detail from a prospect's career or a recent company announcement, you immediately differentiate yourself from 99% of other messages.
                    </p>
                    <p style={{ marginBottom: "1.5rem" }}>
                        AuricAI was built to solve this exact problem at scale. By using AI to analyze profiles, we help you find those "relevance hooks" instantly.
                    </p>
                    {/* Add more placeholder content as needed */}
                </div>
            </article>

            <section className="glass-panel" style={{ marginTop: "4rem", padding: "3rem", textAlign: "center", background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>
                    Ready to see the difference relevance makes?
                </h2>
                <p style={{ marginBottom: "2rem", color: "var(--text-secondary)" }}>
                    Start generating personalized openers for your target prospects today.
                </p>
                <Link href="/sign-up" className="glow-button" style={{ display: "inline-block", padding: "1rem 2rem", textDecoration: "none" }}>
                    Try AuricAI Free
                </Link>
            </section>
        </div>
    );
}
