
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiPlus, FiEye, FiEdit, FiCalendar, FiUser, FiFileText, FiClock, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";
import { blogAPI, type Blog } from "../../../lib/blog-api";

export default function BlogsPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBlogs = useCallback(async () => {
    if (!session?.accessToken) return;

    try {
      setLoading(true);
      const fetchedBlogs = await blogAPI.getBlogs(session.accessToken);
      setBlogs(fetchedBlogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

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

  const createSlug = (title: string, createdAt: string) => {
    // Clean the title: remove markdown, special chars, convert to lowercase
    const cleanTitle = title
      .replace(/[#*`_~\[\]()]/g, '') // Remove markdown
      .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .substring(0, 60); // Limit length

    // Format date as YYYY-MM-DD
    const date = new Date(createdAt).toISOString().split('T')[0];

    return `${cleanTitle}-${date}`;
  };

  const getPreviewText = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative text-center bg-white p-12 rounded-3xl shadow-2xl border border-slate-200 max-w-md mx-4"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FiUser className="w-10 h-10 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to OpenBlog AI
          </h1>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Please log in to view and manage your AI-generated blog posts
          </p>
          <Link href="/login" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium mb-6">
            <FiFileText className="w-4 h-4" />
            AI-Generated Content
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent mb-6">
            My Blogs
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">
            Manage and organize your AI-generated blog posts created from YouTube videos
          </p>

          <Link href="/create-blog" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 gap-2">
            <FiPlus className="w-5 h-5" />
            Create New Blog
            <div className="w-2 h-2 bg-white/20 rounded-full group-hover:animate-bounce"></div>
          </Link>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-3xl p-8 mb-8 text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FiFileText className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchBlogs}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <FiFileText className="w-16 h-16 text-indigo-600" />
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">
              No blogs yet
            </h3>
            <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed mb-8">
              Create your first AI-generated blog from a YouTube video and watch the magic happen!
            </p>
            <Link href="/create-blog" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 gap-2">
              <FiPlus className="w-5 h-5" />
              Create Your First Blog
              <div className="w-2 h-2 bg-white/20 rounded-full group-hover:animate-bounce"></div>
            </Link>
          </motion.div>
        )}

        {/* Blogs Grid */}
        {!loading && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-indigo-200"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* AI Badge */}
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 font-medium text-sm rounded-full shadow-lg">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    AI Generated
                  </span>
                </div>

                <div className="relative p-8">
                  {/* Blog Header */}
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors duration-300 line-clamp-2">
                      {blog.subject}
                    </h2>
                  </div>

                  {/* Blog Preview */}
                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">
                    {getPreviewText(blog.content)}
                  </p>

                  {/* Blog Stats */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">
                      <FiFileText className="w-3 h-3" />
                      {getWordCount(blog.content)} words
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors duration-300">
                      <FiClock className="w-3 h-3" />
                      {getReadingTime(blog.content)} min read
                    </span>
                    {blog.visible === 1 ? (
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg">
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Source Video */}
                  {blog.video && (
                    <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-4 mb-6">
                      <p className="text-sm text-slate-500 mb-2 font-medium">Source Video:</p>
                      <a
                        href={blog.video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 line-clamp-1 transition-colors"
                      >
                        {blog.video.title}
                      </a>
                    </div>
                  )}

                  {/* Blog Footer */}
                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4" />
                      {formatDate(blog.createdAt)}
                    </div>
                    {blog.user && (
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4" />
                        {blog.user.name}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link
                      href={`/blogs/${createSlug(blog.subject, blog.createdAt)}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 gap-2"
                    >
                      <FiEye className="w-4 h-4" />
                      View Blog
                    </Link>
                    <button className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors duration-300">
                      <FiEdit className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}

        {/* Stats Summary */}
        {!loading && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-3xl p-8 mt-16 shadow-2xl border border-slate-100"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent mb-2">
                Your Blog Statistics
              </h3>
              <p className="text-slate-600">Track your AI-powered content creation journey</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiFileText className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{blogs.length}</div>
                <div className="text-sm text-slate-600">Total Blogs</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiTrendingUp className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {blogs.filter(b => b.visible === 1).length}
                </div>
                <div className="text-sm text-slate-600">Published</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiEdit className="w-8 h-8 text-amber-600" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {blogs.filter(b => b.visible === 0).length}
                </div>
                <div className="text-sm text-slate-600">Drafts</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <FiClock className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">
                  {blogs.reduce((total, blog) => total + getWordCount(blog.content), 0).toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Total Words</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}