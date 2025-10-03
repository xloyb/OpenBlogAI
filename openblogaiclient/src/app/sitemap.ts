import { MetadataRoute } from 'next';

interface Blog {
    id: number;
    subject: string;
    slug?: string;
    visible: number;
    createdAt: string;
    updatedAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openblogai.com';

    try {
        // Fetch all public blogs
        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8082'}/api/blog/public/blogs?page=1&limit=1000`);

        if (!response.ok) {
            throw new Error('Failed to fetch blogs');
        }

        const data = await response.json();
        const blogs: Blog[] = data.blogs || [];

        // Generate blog URLs
        const blogUrls = blogs
            .filter(blog => blog.visible === 1)
            .map(blog => ({
                url: `${baseUrl}/blogs/${blog.slug || blog.id}`,
                lastModified: new Date(blog.updatedAt),
                changeFrequency: 'weekly' as const,
                priority: 0.8,
            }));

        // Static pages
        const staticUrls = [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 1,
            },
            {
                url: `${baseUrl}/blogs`,
                lastModified: new Date(),
                changeFrequency: 'daily' as const,
                priority: 0.9,
            },
            {
                url: `${baseUrl}/login`,
                lastModified: new Date(),
                changeFrequency: 'monthly' as const,
                priority: 0.5,
            },
            {
                url: `${baseUrl}/dashboard`,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: 0.6,
            },
        ];

        return [...staticUrls, ...blogUrls];
    } catch (error) {
        console.error('Error generating sitemap:', error);

        // Return minimal sitemap if blog fetch fails
        return [
            {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 1,
            },
            {
                url: `${baseUrl}/blogs`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.9,
            },
        ];
    }
}