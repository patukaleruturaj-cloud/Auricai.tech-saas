import { MetadataRoute } from 'next'

// Mock blog data (synchronized with src/app/blog/page.tsx or ideal from DB/CMS)
const blogPosts = [
    { slug: "best-linkedin-openers-that-get-replies", date: "2024-03-15" },
    { slug: "linkedin-cold-outreach-strategy", date: "2024-03-14" },
    { slug: "linkedin-prospecting-message-examples", date: "2024-03-13" }
];

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://auricai.tech'

    // Future: Add dynamic blog posts here
    const routes = [
        '',
        '/blog',
        '/linkedin-opener-generator',
        '/linkedin-cold-message-generator',
        '/ai-linkedin-outreach-tool',
        '/linkedin-personalization-tool',
        '/b2b-linkedin-lead-generation',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [...routes, ...blogRoutes]
}
