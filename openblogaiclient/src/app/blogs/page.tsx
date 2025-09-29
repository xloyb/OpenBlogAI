
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiPlus, FiEye, FiEdit, FiTrash2, FiCalendar, FiUser, FiFileText } from "react-icons/fi";
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

  const getPreviewText = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Please log in to view your blogs</h1>
          <Link href="/login" className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              My Blogs
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your AI-generated blog posts
            </p>
          </div>

          <Link href="/create-blog" className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors gap-2">
            <FiPlus className="w-5 h-5" />
            Create New Blog
          </Link>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center gap-3"
          >
            <FiFileText className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className="text-red-800 dark:text-red-200 flex-1">{error}</span>
            <button
              onClick={fetchBlogs}
              className="px-4 py-2 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-md hover:bg-red-100 dark:hover:bg-red-800/30 transition-colors"
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && blogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText className="w-12 h-12 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No blogs yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first AI-generated blog from a YouTube video
            </p>
            <Link href="/create-blog" className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors gap-2">
              <FiPlus className="w-5 h-5" />
              Create Your First Blog
            </Link>
          </motion.div>
        )}

        {/* Blogs Grid */}
        {!loading && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Blog Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                      {blog.subject}
                    </h2>
                    <div className="relative group">
                      <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <FiEdit className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <a href={`/blogs/${blog.id}`} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-t-lg"><FiEye className="w-4 h-4" />View</a>
                        <a href={`/blogs/${blog.id}/edit`} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"><FiEdit className="w-4 h-4" />Edit</a>
                        <a className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400 rounded-b-lg cursor-pointer"><FiTrash2 className="w-4 h-4" />Delete</a>
                      </div>
                    </div>
                  </div>

                  {/* Blog Preview */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {getPreviewText(blog.content)}
                  </p>

                  {/* Blog Stats */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {getWordCount(blog.content)} words
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">
                      {getReadingTime(blog.content)} min read
                    </span>
                    {blog.visible === 1 ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Published</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">Draft</span>
                    )}
                  </div>

                  {/* Source Video */}
                  {blog.video && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Source Video:</p>
                      <a
                        href={blog.video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 line-clamp-1 transition-colors"
                      >
                        {blog.video.title}
                      </a>
                    </div>
                  )}

                  {/* Blog Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {formatDate(blog.createdAt)}
                    </div>
                    {blog.user && (
                      <div className="flex items-center gap-1">
                        <FiUser className="w-3 h-3" />
                        {blog.user.name}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end mt-4">
                    <Link href={`/blogs/${blog.id}`} className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors gap-2">
                      <FiEye className="w-4 h-4" />
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Stats Summary */}
        {!loading && blogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mt-8 shadow-lg"
          >
            <h3 className="font-bold mb-4 text-gray-900 dark:text-white">Your Blog Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{blogs.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Blogs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {blogs.filter(b => b.visible === 1).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {blogs.filter(b => b.visible === 0).length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Drafts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {blogs.reduce((total, blog) => total + getWordCount(blog.content), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}