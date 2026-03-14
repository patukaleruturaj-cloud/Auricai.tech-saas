import Link from 'next/link';

export const metadata = {
    title: "LinkedIn Outreach Blog | Strategies, Tips & Examples | AuricAI",
    description: "Learn how to write better LinkedIn openers, improve your cold outreach strategy, and book more meetings using AI and personalized prospecting.",
};

const blogPosts = [
    {
        title: "Best LinkedIn openers that get replies",
        slug: "best-linkedin-openers-that-get-replies",
        description: "Discover the exact structure of high-converting LinkedIn messages and why relevance wins over volume.",
        date: "2024-03-15"
    },
    {
        title: "LinkedIn cold outreach strategy for 2024",
        slug: "linkedin-cold-outreach-strategy",
        description: "How to build a scalable outreach system without sounding like a bot or getting flagged by LinkedIn.",
        date: "2024-03-14"
    },
    {
        title: "LinkedIn prospecting message examples",
        slug: "linkedin-prospecting-message-examples",
        description: "A collection of 10+ real-world examples of personalized messages for different prospecting scenarios.",
        date: "2024-03-13"
    }
];

export default function BlogPage() {
    return (
        <div className="container" style={{ padding: "6rem 0", maxWidth: "800px" }}>
            <header style={{ marginBottom: "4rem", textAlign: "center" }}>
                <h1 style={{ fontSize: "3rem", fontWeight: "800", marginBottom: "1.5rem" }}>
                    LinkedIn Outreach <span className="text-gradient">Insights</span>
                </h1>
                <p style={{ fontSize: "1.25rem", color: "var(--text-secondary)" }}>
                    Strategies, templates, and guides to help you master LinkedIn prospecting.
                </p>
            </header>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                {blogPosts.map((post) => (
                    <article key={post.slug} className="glass-panel" style={{ padding: "2rem" }}>
                        <time style={{ fontSize: "0.875rem", color: "var(--accent-blue)", fontWeight: "600" }}>{post.date}</time>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: "0.5rem", marginBottom: "1rem" }}>
                            <Link href={`/blog/${post.slug}`} style={{ color: "white", textDecoration: "none" }}>
                                {post.title}
                            </Link>
                        </h2>
                        <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "1.5rem" }}>
                            {post.description}
                        </p>
                        <Link href={`/blog/${post.slug}`} style={{ color: "var(--accent-blue)", fontWeight: "600", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}>
                            Read Article →
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );
}
