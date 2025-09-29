
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { FiPlus, FiEye, FiEdit, FiTrash2, FiCalendar, FiUser, FiFileText } from "react-icons/fi";
import Link from "next/link";
import { blogAPI } from "../../../lib/blog-api";

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
    name: string;
    email: string;
  };
  video?: {
    title: string;
    url: string;
  };
}

export default function BlogsPage() {
  const { data: session } = useSession();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.accessToken) {
      fetchBlogs();
    }
  }, [session]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const fetchedBlogs = await blogAPI.getBlogs(session?.accessToken as string);
      setBlogs(fetchedBlogs);
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

  const getPreviewText = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view your blogs</h1>
          <Link href="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              My Blogs
            </h1>
            <p className="text-base-content/70">
              Manage your AI-generated blog posts
            </p>
          </div>

          <Link href="/create-blog" className="btn btn-primary btn-lg gap-2">
            <FiPlus className="w-5 h-5" />
            Create New Blog
          </Link>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="loading loading-spinner loading-lg text-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="alert alert-error mb-6"
          >
            <FiFileText className="w-5 h-5" />
            <span>{error}</span>
            <button onClick={fetchBlogs} className="btn btn-sm btn-outline">
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
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiFileText className="w-12 h-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No blogs yet</h3>
            <p className="text-base-content/70 mb-6">
              Create your first AI-generated blog from a YouTube video
            </p>
            <Link href="/create-blog" className="btn btn-primary gap-2">
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
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="card-body">
                  {/* Blog Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="card-title text-lg line-clamp-2">
                      {blog.subject}
                    </h2>
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-circle">
                        <FiEdit className="w-4 h-4" />
                      </div>
                      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><a href={`/blogs/${blog.id}`}><FiEye className="w-4 h-4" />View</a></li>
                        <li><a href={`/blogs/${blog.id}/edit`}><FiEdit className="w-4 h-4" />Edit</a></li>
                        <li><a className="text-error"><FiTrash2 className="w-4 h-4" />Delete</a></li>
                      </ul>
                    </div>
                  </div>

                  {/* Blog Preview */}
                  <p className="text-sm text-base-content/70 mb-4 line-clamp-3">
                    {getPreviewText(blog.content)}
                  </p>

                  {/* Blog Stats */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="badge badge-info badge-sm">
                      {getWordCount(blog.content)} words
                    </div>
                    <div className="badge badge-secondary badge-sm">
                      {getReadingTime(blog.content)} min read
                    </div>
                    {blog.visible === 1 ? (
                      <div className="badge badge-success badge-sm">Published</div>
                    ) : (
                      <div className="badge badge-warning badge-sm">Draft</div>
                    )}
                  </div>

                  {/* Source Video */}
                  {blog.video && (
                    <div className="bg-base-200 rounded-lg p-2 mb-4">
                      <p className="text-xs text-base-content/70 mb-1">Source Video:</p>
                      <a
                        href={blog.video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium hover:text-primary line-clamp-1"
                      >
                        {blog.video.title}
                      </a>
                    </div>
                  )}

                  {/* Blog Footer */}
                  <div className="flex items-center justify-between text-xs text-base-content/50">
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
                  <div className="card-actions justify-end mt-4">
                    <Link href={`/blogs/${blog.id}`} className="btn btn-sm btn-primary">
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
            className="bg-base-100 rounded-xl p-6 mt-8 shadow-lg"
          >
            <h3 className="font-bold mb-4">Your Blog Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{blogs.length}</div>
                <div className="text-sm text-base-content/70">Total Blogs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {blogs.filter(b => b.visible === 1).length}
                </div>
                <div className="text-sm text-base-content/70">Published</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {blogs.filter(b => b.visible === 0).length}
                </div>
                <div className="text-sm text-base-content/70">Drafts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-info">
                  {blogs.reduce((total, blog) => total + getWordCount(blog.content), 0).toLocaleString()}
                </div>
                <div className="text-sm text-base-content/70">Total Words</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}