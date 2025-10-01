"use client";

"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";import { useState, useEffect, useCallback } from "react";

import { FiCalendar, FiUser, FiFileText, FiClock, FiEye, FiArrowRight } from "react-icons/fi";import { useSession } from "next-auth/react";

import Link from "next/link";import { motion } from "framer-motion";

import { FiPlus, FiEye, FiEdit, FiCalendar, FiUser, FiFileText, FiClock, FiTrendingUp } from "react-icons/fi";

interface Blog {import Link from "next/link";

  id: number;import { blogAPI, type Blog } from "../../../lib/blog-api";

  subject: string;

  content: string;export default function BlogsPage() {

  visible: number;  const { data: session } = useSession();

  userId: string;  const [blogs, setBlogs] = useState<Blog[]>([]);

  videoId?: number;  const [loading, setLoading] = useState(true);

  createdAt: string;  const [error, setError] = useState("");

  updatedAt: string;

  user?: {  const fetchBlogs = useCallback(async () => {

    id: string;    if (!session?.accessToken) return;

    name: string;

    email: string;    try {

  };      setLoading(true);

  video?: {      const fetchedBlogs = await blogAPI.getBlogs(session.accessToken);

    id: number;      setBlogs(fetchedBlogs);

    title: string;    } catch (err) {

    url: string;      setError(err instanceof Error ? err.message : "Failed to fetch blogs");

    uploadedAt: string;    } finally {

  };      setLoading(false);

}    }

  }, [session?.accessToken]);

export default function PublicBlogsPage() {

  const [blogs, setBlogs] = useState<Blog[]>([]);  useEffect(() => {

  const [loading, setLoading] = useState(true);    fetchBlogs();

  const [error, setError] = useState("");  }, [fetchBlogs]);



  useEffect(() => {  const getWordCount = (content: string) => {

    fetchPublicBlogs();    return content.split(/\s+/).filter(word => word.length > 0).length;

  }, []);  };



  const fetchPublicBlogs = async () => {  const getReadingTime = (content: string) => {

    try {    const wordCount = getWordCount(content);

      setLoading(true);    return Math.ceil(wordCount / 200);

      const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8082';  };

      const response = await fetch(`${baseUrl}/api/public/blogs`, {

        method: 'GET',  const formatDate = (dateString: string) => {

        headers: {    return new Date(dateString).toLocaleDateString('en-US', {

          'Content-Type': 'application/json',      year: 'numeric',

        },      month: 'short',

      });      day: 'numeric'

    });

      if (!response.ok) {  };

        throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      }  const getPreviewText = (content: string, maxLength: number = 150) => {

    if (content.length <= maxLength) return content;

      const data = await response.json();    return content.substring(0, maxLength) + "...";

      // Filter only visible blogs  };

      const visibleBlogs = data.filter((blog: Blog) => blog.visible === 1);

      setBlogs(visibleBlogs);  if (!session) {

    } catch (err) {    return (

      setError(err instanceof Error ? err.message : "Failed to fetch blogs");      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">

    } finally {        {/* Background Elements */}

      setLoading(false);        <div className="absolute inset-0">

    }          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>

  };          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>

        </div>

  const getWordCount = (content: string) => {

    return content.split(/\s+/).filter(word => word.length > 0).length;        <motion.div

  };          initial={{ opacity: 0, y: 30 }}

          animate={{ opacity: 1, y: 0 }}

  const getReadingTime = (content: string) => {          transition={{ duration: 0.8 }}

    const wordCount = getWordCount(content);          className="relative text-center bg-white p-12 rounded-3xl shadow-2xl border border-slate-200 max-w-md mx-4"

    return Math.ceil(wordCount / 200);        >

  };          <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">

            <FiUser className="w-10 h-10 text-indigo-600" />

  const formatDate = (dateString: string) => {          </div>

    return new Date(dateString).toLocaleDateString('en-US', {          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">

      year: 'numeric',            Welcome to OpenBlog AI

      month: 'short',          </h1>

      day: 'numeric'          <p className="text-slate-600 mb-8 leading-relaxed">

    });            Please log in to view and manage your AI-generated blog posts

  };          </p>

          <Link href="/login" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">

  const getPreviewText = (content: string, maxLength: number = 200) => {            Go to Login

    if (content.length <= maxLength) return content;          </Link>

    return content.substring(0, maxLength) + "...";        </motion.div>

  };      </div>

    );

  if (loading) {  }

    return (

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">  return (

        <motion.div    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">

          initial={{ opacity: 0 }}      {/* Background Elements */}

          animate={{ opacity: 1 }}      <div className="absolute inset-0">

          className="text-center"        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>

        >        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>

          <p className="text-slate-600">Loading public blogs...</p>      </div>

        </motion.div>

      </div>      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

    );        {/* Header */}

  }        <motion.div

          initial={{ opacity: 0, y: 30 }}

  if (error) {          animate={{ opacity: 1, y: 0 }}

    return (          transition={{ duration: 0.8 }}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center">          className="text-center mb-16"

        <motion.div        >

          initial={{ opacity: 0, y: 30 }}          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium mb-6">

          animate={{ opacity: 1, y: 0 }}            <FiFileText className="w-4 h-4" />

          className="text-center bg-white p-8 rounded-2xl shadow-xl border border-red-200 max-w-md mx-4"            AI-Generated Content

        >          </div>

          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">

            <FiFileText className="w-8 h-8 text-red-600" />          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent mb-6">

          </div>            My Blogs

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Error Loading Blogs</h2>          </h1>

          <p className="text-slate-600 mb-6">{error}</p>

          <button          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8">

            onClick={fetchPublicBlogs}            Manage and organize your AI-generated blog posts created from YouTube videos

            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"          </p>

          >

            Try Again          <Link href="/create-blog" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 gap-2">

          </button>            <FiPlus className="w-5 h-5" />

        </motion.div>            Create New Blog

      </div>            <div className="w-2 h-2 bg-white/20 rounded-full group-hover:animate-bounce"></div>

    );          </Link>

  }        </motion.div>



  return (        {/* Loading State */}

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">        {loading && (

      {/* Background Elements */}          <div className="flex justify-center items-center py-20">

      <div className="absolute inset-0">            <div className="relative">

        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>              <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>

        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>

        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>            </div>

      </div>          </div>

        )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}        {/* Error State */}

        <motion.div        {error && (

          initial={{ opacity: 0, y: 30 }}          <motion.div

          animate={{ opacity: 1, y: 0 }}            initial={{ opacity: 0, y: 30 }}

          transition={{ duration: 0.8 }}            animate={{ opacity: 1, y: 0 }}

          className="text-center mb-16"            className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-3xl p-8 mb-8 text-center max-w-2xl mx-auto"

        >          >

          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">

            Discover Amazing Blogs              <FiFileText className="w-8 h-8 text-red-600" />

          </h1>            </div>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">            <h3 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h3>

            Explore AI-generated blogs from our community. Discover insights, stories, and knowledge shared by creators from around the world.            <p className="text-red-600 mb-6">{error}</p>

          </p>            <button

        </motion.div>              onClick={fetchBlogs}

              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105"

        {/* Statistics */}            >

        {blogs.length > 0 && (              Try Again

          <motion.div            </button>

            initial={{ opacity: 0, y: 20 }}          </motion.div>

            animate={{ opacity: 1, y: 0 }}        )}

            transition={{ duration: 0.6, delay: 0.2 }}

            className="mb-12"        {/* Empty State */}

          >        {!loading && !error && blogs.length === 0 && (

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg">          <motion.div

              <div className="flex items-center justify-center space-x-8">            initial={{ opacity: 0, scale: 0.95 }}

                <div className="text-center">            animate={{ opacity: 1, scale: 1 }}

                  <div className="text-3xl font-bold text-indigo-600">{blogs.length}</div>            transition={{ duration: 0.8 }}

                  <div className="text-sm text-slate-600">Public Blogs</div>            className="text-center py-20"

                </div>          >

                <div className="text-center">            <div className="w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-8">

                  <div className="text-3xl font-bold text-purple-600">              <FiFileText className="w-16 h-16 text-indigo-600" />

                    {Math.round(blogs.reduce((acc, blog) => acc + getWordCount(blog.content), 0) / blogs.length)}            </div>

                  </div>            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent">

                  <div className="text-sm text-slate-600">Avg Words</div>              No blogs yet

                </div>            </h3>

                <div className="text-center">            <p className="text-xl text-slate-600 max-w-md mx-auto leading-relaxed mb-8">

                  <div className="text-3xl font-bold text-emerald-600">              Create your first AI-generated blog from a YouTube video and watch the magic happen!

                    {Math.round(blogs.reduce((acc, blog) => acc + getReadingTime(blog.content), 0) / blogs.length)}            </p>

                  </div>            <Link href="/create-blog" className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 gap-2">

                  <div className="text-sm text-slate-600">Avg Read Time</div>              <FiPlus className="w-5 h-5" />

                </div>              Create Your First Blog

              </div>              <div className="w-2 h-2 bg-white/20 rounded-full group-hover:animate-bounce"></div>

            </div>            </Link>

          </motion.div>          </motion.div>

        )}        )}



        {/* Blogs Grid */}        {/* Blogs Grid */}

        {blogs.length === 0 ? (        {!loading && blogs.length > 0 && (

          <motion.div          <motion.div

            initial={{ opacity: 0, y: 30 }}            initial={{ opacity: 0 }}

            animate={{ opacity: 1, y: 0 }}            animate={{ opacity: 1 }}

            transition={{ duration: 0.8 }}            transition={{ delay: 0.2 }}

            className="text-center bg-white/70 backdrop-blur-sm p-16 rounded-3xl border border-slate-200 shadow-lg"            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"

          >          >

            <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">            {blogs.map((blog, index) => (

              <FiFileText className="w-10 h-10 text-indigo-600" />              <motion.article

            </div>                key={blog.id}

            <h2 className="text-3xl font-bold mb-4 text-slate-800">No Public Blogs Yet</h2>                initial={{ opacity: 0, y: 50 }}

            <p className="text-slate-600 text-lg mb-8">                animate={{ opacity: 1, y: 0 }}

              Be the first to create and share amazing AI-generated content with the community!                transition={{ duration: 0.6, delay: index * 0.1 }}

            </p>                className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-indigo-200"

            <Link              >

              href="/login"                {/* Gradient overlay on hover */}

              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105"                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            >

              Get Started                {/* AI Badge */}

              <FiArrowRight className="ml-2 w-5 h-5" />                <div className="absolute top-4 right-4">

            </Link>                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 font-medium text-sm rounded-full shadow-lg">

          </motion.div>                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>

        ) : (                    AI Generated

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">                  </span>

            {blogs.map((blog, index) => (                </div>

              <motion.article

                key={blog.id}                <div className="relative p-8">

                initial={{ opacity: 0, y: 30 }}                  {/* Blog Header */}

                animate={{ opacity: 1, y: 0 }}                  <div className="mb-6">

                transition={{ duration: 0.6, delay: index * 0.1 }}                    <h2 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors duration-300 line-clamp-2">

                className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:bg-white/80"                      {blog.subject}

              >                    </h2>

                {/* Blog Header */}                  </div>

                <div className="mb-6">

                  <h2 className="text-2xl font-bold text-slate-800 mb-4 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">                  {/* Blog Preview */}

                    {blog.subject}                  <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed">

                  </h2>                    {getPreviewText(blog.content)}

                                    </p>

                  {/* Blog Meta */}

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">                  {/* Blog Stats */}

                    <div className="flex items-center space-x-4">                  <div className="flex flex-wrap gap-2 mb-6">

                      <div className="flex items-center">                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300">

                        <FiCalendar className="w-4 h-4 mr-1" />                      <FiFileText className="w-3 h-3" />

                        {formatDate(blog.createdAt)}                      {getWordCount(blog.content)} words

                      </div>                    </span>

                      <div className="flex items-center">                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-lg group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors duration-300">

                        <FiClock className="w-4 h-4 mr-1" />                      <FiClock className="w-3 h-3" />

                        {getReadingTime(blog.content)} min read                      {getReadingTime(blog.content)} min read

                      </div>                    </span>

                    </div>                    {blog.visible === 1 ? (

                  </div>                      <span className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-lg">

                </div>                        Published

                      </span>

                {/* Blog Preview */}                    ) : (

                <div className="mb-6">                      <span className="inline-flex items-center px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-lg">

                  <p className="text-slate-600 leading-relaxed line-clamp-4">                        Draft

                    {getPreviewText(blog.content)}                      </span>

                  </p>                    )}

                </div>                  </div>



                {/* Blog Stats */}                  {/* Source Video */}

                <div className="flex items-center justify-between pt-6 border-t border-slate-200">                  {blog.video && (

                  <div className="flex items-center space-x-4 text-sm text-slate-500">                    <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-4 mb-6">

                    <div className="flex items-center">                      <p className="text-sm text-slate-500 mb-2 font-medium">Source Video:</p>

                      <FiFileText className="w-4 h-4 mr-1" />                      <a

                      {getWordCount(blog.content)} words                        href={blog.video.url}

                    </div>                        target="_blank"

                    {blog.video && (                        rel="noopener noreferrer"

                      <div className="flex items-center">                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 line-clamp-1 transition-colors"

                        <FiEye className="w-4 h-4 mr-1" />                      >

                        Video Source                        {blog.video.title}

                      </div>                      </a>

                    )}                    </div>

                  </div>                  )}

                </div>

                  {/* Blog Footer */}

                {/* Read More Button */}                  <div className="flex items-center justify-between text-sm text-slate-500 mb-6">

                <div className="mt-6">                    <div className="flex items-center gap-2">

                  <Link                      <FiCalendar className="w-4 h-4" />

                    href={`/blogs/${blog.id}`}                      {formatDate(blog.createdAt)}

                    className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-300 group-hover:scale-105"                    </div>

                  >                    {blog.user && (

                    Read More                      <div className="flex items-center gap-2">

                    <FiArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />                        <FiUser className="w-4 h-4" />

                  </Link>                        {blog.user.name}

                </div>                      </div>

              </motion.article>                    )}

            ))}                  </div>

          </div>

        )}                  {/* Actions */}

      </div>                  <div className="flex gap-3">

    </div>                    <Link

  );                      href={`/blogs/${blog.id}`}

}                      className="flex-1 inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 gap-2"
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