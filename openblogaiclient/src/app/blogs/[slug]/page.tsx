import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetailClient from "./BlogDetailClient";

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
    };
  }

  // Extract first paragraph or truncate content for description
  const defaultDescription = blog.content
    ? blog.content.replace(/[#*`_~\[\]()]/g, '').substring(0, 160).replace(/\s+/g, ' ').trim()
    : "";

  const seoTitle = blog.seoTitle || blog.subject || "Blog Post";
  const seoDescription = blog.seoDescription || defaultDescription;
  const fullTitle = `${seoTitle} - OpenBlogAI`;

  return {
    title: fullTitle,
    description: seoDescription,
    keywords: blog.seoKeywords?.join(', ') || undefined,
    authors: blog.user ? [{ name: blog.user.name || blog.user.email }] : undefined,
    creator: blog.user?.name || blog.user?.email || undefined,
    publisher: "OpenBlogAI",
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "article",
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: blog.user ? [blog.user.name || blog.user.email] : undefined,
      section: "Technology",
      tags: blog.seoKeywords || undefined,
      siteName: "OpenBlogAI",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
      creator: blog.user ? `@${blog.user.name || blog.user.email.split('@')[0]}` : undefined,
    },
    robots: {
      index: blog.visible === 1,
      follow: blog.visible === 1,
    },
    alternates: {
      canonical: `/blogs/${slug}`,
    },
    other: {
      // Add structured data for FAQ if available
      ...(blog.seoFaq && blog.seoFaq.length > 0 && {
        'application-ld+json': JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": blog.seoFaq.map((faq) => ({
            "@type": "Question",
            "name": faq,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `This question is answered in the blog post: ${seoTitle}`
            }
          }))
        })
      })
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