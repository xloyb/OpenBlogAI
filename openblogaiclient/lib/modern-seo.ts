/**
 * Modern SEO Utilities for OpenBlogAI
 * Implements latest SEO best practices and schema.org standards
 */

type BlogPostingSchema = Record<string, unknown>;

export interface ModernSEOConfig {
    title: string;
    description: string;
    keywords?: string[];
    author?: {
        name: string;
        email?: string;
        url?: string;
    };
    article?: {
        publishedTime: string;
        modifiedTime: string;
        section: string;
        tags?: string[];
        readingTime?: number;
        wordCount?: number;
    };
    faq?: string[];
    images?: string[];
    canonicalUrl: string;
    slug: string;
}

/**
 * Generate comprehensive structured data for better search engine understanding
 */
export function generateStructuredData(config: ModernSEOConfig) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openblogai.com';
    const fullUrl = `${baseUrl}/blogs/${config.slug}`;

    const structuredData = [];

    // Main Article Schema
    const articleSchema: BlogPostingSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": fullUrl,
        "headline": config.title,
        "description": config.description,
        "url": fullUrl,
        "datePublished": config.article?.publishedTime,
        "dateModified": config.article?.modifiedTime,
        "author": {
            "@type": "Person",
            "name": config.author?.name,
            "email": config.author?.email,
            "url": config.author?.url
        },
        "publisher": {
            "@type": "Organization",
            "name": "OpenBlogAI",
            "url": baseUrl,
            "logo": {
                "@type": "ImageObject",
                "url": `${baseUrl}/logo.png`,
                "width": 512,
                "height": 512
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": fullUrl
        },
        "articleSection": config.article?.section || "Technology",
        "keywords": config.keywords?.join(", "),
        "wordCount": config.article?.wordCount,
        "timeRequired": config.article?.readingTime ? `PT${config.article.readingTime}M` : undefined,
        "inLanguage": "en-US",
        "isAccessibleForFree": true,
        "copyrightYear": new Date(config.article?.publishedTime || Date.now()).getFullYear(),
        "copyrightHolder": {
            "@type": "Organization",
            "name": "OpenBlogAI"
        }
    };

    // Add images if available
    if (config.images && config.images.length > 0) {
        articleSchema.image = config.images.map(img => ({
            "@type": "ImageObject",
            "url": img,
            "width": 1200,
            "height": 630
        }));
    }

    structuredData.push(articleSchema);

    // FAQ Schema if FAQ exists
    if (config.faq && config.faq.length > 0) {
        const faqSchema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": config.faq.map((question, index) => ({
                "@type": "Question",
                "@id": `${fullUrl}#faq-${index}`,
                "name": question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `This question is comprehensively answered in our blog post: "${config.title}". Visit the full article for detailed insights.`
                }
            }))
        };
        structuredData.push(faqSchema);
    }

    // Breadcrumb Schema
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blogs",
                "item": `${baseUrl}/blogs`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": config.title,
                "item": fullUrl
            }
        ]
    };
    structuredData.push(breadcrumbSchema);

    // Website Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "OpenBlogAI",
        "alternateName": "OpenBlogAI - AI-Powered Blog Generation",
        "url": baseUrl,
        "description": "Transform YouTube videos into engaging blog posts with AI-powered content generation",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${baseUrl}/search?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
    structuredData.push(websiteSchema);

    return structuredData;
}

/**
 * Extract and clean content for SEO description
 */
export function generateSEODescription(content: string, maxLength = 160): string {
    // Remove markdown formatting
    const cleaned = content
        .replace(/#{1,6}\s+/g, '') // Remove headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/`(.*?)`/g, '$1') // Remove code
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Remove links, keep text
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '') // Remove images
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

    // Truncate to maxLength while preserving word boundaries
    if (cleaned.length <= maxLength) return cleaned;

    let truncated = cleaned.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.8) {
        truncated = truncated.substring(0, lastSpace);
    }

    return truncated + '...';
}

/**
 * Generate optimized keywords from content
 */
export function generateSmartKeywords(title: string, content: string, customKeywords: string[] = []): string[] {
    // Common stop words to filter out
    const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
        'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above',
        'below', 'between', 'among', 'through', 'during', 'before', 'after', 'above', 'below',
        'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
        'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
        'this', 'that', 'these', 'those', 'i', 'me', 'my', 'myself', 'we', 'our', 'ours',
        'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his',
        'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them',
        'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'where', 'when',
        'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some',
        'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very'
    ]);

    // Extract words from title and content
    const allText = `${title} ${content}`.toLowerCase();
    const words = allText
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !stopWords.has(word));

    // Count word frequency
    const wordCount: Record<string, number> = {};
    words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Sort by frequency and take top words
    const autoKeywords = Object.entries(wordCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([word]) => word);

    // Combine with custom keywords and remove duplicates
    const allKeywords = Array.from(new Set([...customKeywords, ...autoKeywords]));

    return allKeywords.slice(0, 10); // Limit to 10 keywords
}

/**
 * Generate social media optimized title
 */
export function generateSocialTitle(title: string, maxLength = 60): string {
    if (title.length <= maxLength) return title;

    const truncated = title.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > maxLength * 0.8) {
        return truncated.substring(0, lastSpace) + '...';
    }

    return truncated + '...';
}

/**
 * Calculate estimated reading time
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return Math.max(1, minutes);
}

/**
 * Count words in content
 */
export function countWords(content: string): number {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length;
}