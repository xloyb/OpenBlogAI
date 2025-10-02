"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiArrowLeft, FiEye, FiShare2 } from "react-icons/fi";
import Link from "next/link";
import { useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Blog {
  id: number;
  subject: string;
  content: string;
  visible: number;
  userId: string;
  videoId?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  video?: {
    id: number;
    title: string;
    url: string;
    uploadedAt: string;
  };
}

export default function BlogDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = useCallback(async () => {
    if (!slug) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch by slug instead of ID
      const response = await fetch(`http://localhost:8082/api/blog/blogs/slug/${encodeURIComponent(slug)}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Blog not found");
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.visible !== 1) {
        throw new Error("This blog is not available publicly");
      }

      setBlog(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  const getWordCount = (content: string) => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (content: string) => {
    const wordCount = getWordCount(content);
    return Math.ceil(wordCount / 200);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatContent = (content: string) => {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    );
  };

  const cleanMarkdown = (text: string) => {
    return text
      .replace(/[#*`_~\[\]()]/g, '') // Remove markdown formatting
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim(); // Remove leading/trailing whitespace
  };

  const handleShare = () => {
    const shareData = {
      title: blog ? cleanMarkdown(blog.subject) : '',
      text: `Check out this blog: ${blog ? cleanMarkdown(blog.subject) : ''}`,
      url: `${window.location.origin}/blogs/${slug}`,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(shareData.url);
      alert('Blog URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-slate-600">Loading blog...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md mx-4"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiEye className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Blog Not Available</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Link
            href="/blogs"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <FiArrowLeft className="mr-2 w-4 h-4" />
            Back to Blogs
          </Link>
        </motion.div>
      </div>
    );
  }

  if (!blog) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Link
            href="/blogs"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold transition-colors duration-300"
          >
            <FiArrowLeft className="mr-2 w-5 h-5" />
            Back to All Blogs
          </Link>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
        >
          <div className="p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20 border-b border-slate-200">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-800 mb-8 leading-tight">
              {cleanMarkdown(blog.subject)}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 text-slate-600">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <FiCalendar className="w-5 h-5 mr-2 text-indigo-500" />
                  <span className="font-medium">{formatDate(blog.createdAt)}</span>
                </div>
                <div className="flex items-center">
                  <FiClock className="w-5 h-5 mr-2 text-purple-500" />
                  <span className="font-medium">{getReadingTime(blog.content)} min read</span>
                </div>
                <div className="flex items-center">
                  <FiEye className="w-5 h-5 mr-2 text-emerald-500" />
                  <span className="font-medium">{getWordCount(blog.content)} words</span>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <FiShare2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>

            {blog.video && (
              <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                <div className="flex items-center">
                  <FiEye className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-indigo-700 font-medium">Generated from video: {blog.video.title}</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20">
            <div className="prose prose-xl max-w-none prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-xl prose-strong:text-slate-800 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:p-6 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:text-slate-700 prose-headings:mb-6 prose-headings:mt-10">
              {formatContent(blog.content)}
            </div>
          </div>

          <div className="p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div className="text-slate-600">
                <p className="text-sm">Published on {formatDate(blog.createdAt)}</p>
                {blog.updatedAt !== blog.createdAt && (
                  <p className="text-sm">Last updated on {formatDate(blog.updatedAt)}</p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <Link
                  href="/blogs"
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Read More Blogs
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}