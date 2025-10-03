import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";
import {
  generateStructuredData,
  generateSEODescription,
  generateSmartKeywords,
  generateSocialTitle,
  calculateReadingTime,
  countWords,
  type ModernSEOConfig
} from "../../../../lib/modern-seo";

interface Blog {
  id: number;
  subject: string;
  content: string;
  visible: number;
  userId: string;
  videoId?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoFaq?: string[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name?: string;
    email: string;
  };
  video?: {
    id: number;
    title: string;
    url: string;
    uploadedAt: string;
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

// Server Component for generateMetadata
async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8082';
    const response = await fetch(`${baseUrl}/api/blog/blogs/slug/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch blog:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found - OpenBlogAI",
      description: "The requested blog post could not be found.",
      robots: { index: false, follow: false }
    };
  }

  // Generate modern SEO data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://openblogai.com';
  const readingTime = calculateReadingTime(blog.content);
  const wordCount = countWords(blog.content);

  // Smart title generation
  const seoTitle = blog.seoTitle || blog.subject || "Blog Post";
  const socialTitle = generateSocialTitle(seoTitle);
  const fullTitle = `${seoTitle} - OpenBlogAI`;

  // Smart description generation
  const seoDescription = blog.seoDescription || generateSEODescription(blog.content, 155);

  // Smart keyword generation
  const smartKeywords = generateSmartKeywords(
    seoTitle,
    blog.content,
    blog.seoKeywords || []
  );

  // Create SEO config for structured data
  const seoConfig: ModernSEOConfig = {
    title: seoTitle,
    description: seoDescription,
    keywords: smartKeywords,
    author: blog.user ? {
      name: blog.user.name || blog.user.email,
      email: blog.user.email,
      url: `${baseUrl}/author/${blog.user.id}`
    } : undefined,
    article: {
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      section: blog.video ? "AI-Generated Content" : "Technology",
      tags: smartKeywords,
      readingTime,
      wordCount
    },
    faq: blog.seoFaq,
    canonicalUrl: `${baseUrl}/blogs/${slug}`,
    slug
  };

  // Generate comprehensive structured data
  const structuredData = generateStructuredData(seoConfig);

  return {
    title: {
      default: fullTitle,
      template: "%s - OpenBlogAI"
    },
    description: seoDescription,
    keywords: smartKeywords.join(', '),
    authors: blog.user ? [{
      name: blog.user.name || blog.user.email,
      url: `${baseUrl}/author/${blog.user.id}`
    }] : undefined,
    creator: blog.user?.name || blog.user?.email,
    publisher: "OpenBlogAI",
    category: "Technology",
    classification: "Blog Post",
    referrer: "origin-when-cross-origin",
    metadataBase: new URL(baseUrl),

    // Open Graph (Facebook, LinkedIn, etc.)
    openGraph: {
      type: "article",
      title: socialTitle,
      description: seoDescription,
      url: `/blogs/${slug}`,
      siteName: "OpenBlogAI",
      locale: "en_US",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      expirationTime: undefined,
      authors: blog.user ? [blog.user.name || blog.user.email] : undefined,
      section: blog.video ? "AI-Generated Content" : "Technology",
      tags: smartKeywords,
      images: [
        {
          url: `/api/og-image/${slug}`, // Dynamic OG image
          width: 1200,
          height: 630,
          alt: seoTitle,
          type: "image/png"
        }
      ]
    },

    // Twitter/X Cards
    twitter: {
      card: "summary_large_image",
      site: "@OpenBlogAI",
      creator: blog.user ? `@${blog.user.name?.replace(/\s+/g, '') || blog.user.email.split('@')[0]}` : "@OpenBlogAI",
      title: socialTitle,
      description: seoDescription,
      images: [`${baseUrl}/api/og-image/${slug}`]
    },

    // Search Engine Directives
    robots: {
      index: blog.visible === 1,
      follow: blog.visible === 1,
      nocache: false,
      googleBot: {
        index: blog.visible === 1,
        follow: blog.visible === 1,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1
      }
    },

    // Canonical and Alternate URLs
    alternates: {
      canonical: `/blogs/${slug}`,
      languages: {
        "en-US": `/blogs/${slug}`,
        "x-default": `/blogs/${slug}`
      }
    },

    // Additional metadata
    applicationName: "OpenBlogAI",
    generator: "OpenBlogAI Blog Platform",

    // Verification and Analytics
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
      other: {
        "msvalidate.01": process.env.BING_VERIFICATION || ""
      }
    },

    // Structured Data (JSON-LD)
    other: {
      // Multiple structured data schemas
      "application-ld+json": JSON.stringify(structuredData),

      // Article specific meta tags
      "article:published_time": blog.createdAt,
      "article:modified_time": blog.updatedAt,
      "article:author": blog.user?.name || blog.user?.email || "OpenBlogAI",
      "article:section": blog.video ? "AI-Generated Content" : "Technology",
      "article:tag": smartKeywords.join(","),

      // Dublin Core metadata
      "DC.title": seoTitle,
      "DC.description": seoDescription,
      "DC.creator": blog.user?.name || blog.user?.email || "OpenBlogAI",
      "DC.publisher": "OpenBlogAI",
      "DC.date": blog.createdAt,
      "DC.type": "Blog Post",
      "DC.format": "text/html",
      "DC.language": "en-US",
      "DC.rights": "© OpenBlogAI. All rights reserved.",

      // Additional SEO tags
      "reading-time": `${readingTime} min read`,
      "word-count": wordCount.toString(),
      "content-type": "blog-post",
      "ai-generated": blog.video ? "true" : "false"
    }
  };
}

export default async function BlogDetail({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return <BlogDetailClient blog={blog} slug={slug} />;
}