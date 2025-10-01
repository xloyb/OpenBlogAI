"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiFileText, FiClock, FiEye, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
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

export default function PublicBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPublicBlogs();
  }, []);

  const fetchPublicBlogs = async () => {
    try {
      setLoading(true);
      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8082';
      const response = await fetch(`${baseUrl}/api/blog/public/blogs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const visibleBlogs = data.filter((blog: Blog) => blog.visible === 1);
      setBlogs(visibleBlogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const getWordCount = (content: string) => {
    return content.split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (content: string) => {
    const wordCount = getWordCount(content);
    return Math.ceil(wordCount / 200);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPreviewText = (content: string) => {
    // Remove markdown formatting for preview
    const cleanText = content.replace(/[#*`_~\[\]()]/g, '').replace(/\n+/g, ' ').trim();
    return cleanText.substring(0, 200) + (cleanText.length > 200 ? "..." : "");
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
          <p className="text-slate-600">Loading public blogs...</p>
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
            <FiFileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Blogs</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={fetchPublicBlogs}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Discover Amazing Blogs
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore AI-generated blogs from our community. Discover insights, stories, and knowledge shared by creators from around the world.
          </p>
        </motion.div>

        {blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">
              <div className="flex items-center justify-center space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{blogs.length}</div>
                  <div className="text-sm text-slate-600">Public Blogs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {blogs.length > 0 ? Math.round(blogs.reduce((acc, blog) => acc + getWordCount(blog.content), 0) / blogs.length) : 0}
                  </div>
                  <div className="text-sm text-slate-600">Avg Words</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-600">
                    {blogs.length > 0 ? Math.round(blogs.reduce((acc, blog) => acc + getReadingTime(blog.content), 0) / blogs.length) : 0}
                  </div>
                  <div className="text-sm text-slate-600">Avg Read Time</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-white/70 backdrop-blur-sm p-16 rounded-3xl border border-slate-200 shadow-lg"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FiFileText className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">No Public Blogs Yet</h2>
            <p className="text-slate-600 text-lg mb-8">
              Be the first to create and share amazing AI-generated content with the community!
            </p>
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started
              <FiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                    {blog.subject}
                  </h2>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FiCalendar className="w-4 h-4 mr-1" />
                        {formatDate(blog.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="w-4 h-4 mr-1" />
                        {getReadingTime(blog.content)} min read
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="text-slate-600 leading-relaxed line-clamp-4 prose prose-slate max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {getPreviewText(blog.content)}
                    </ReactMarkdown>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  <div className="flex items-center space-x-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <FiFileText className="w-4 h-4 mr-1" />
                      {getWordCount(blog.content)} words
                    </div>
                    {blog.video && (
                      <div className="flex items-center">
                        <FiEye className="w-4 h-4 mr-1" />
                        Video Source
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/blogs/${blog.id}`}
                    className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-300 group-hover:scale-105"
                  >
                    Read More
                    <FiArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}