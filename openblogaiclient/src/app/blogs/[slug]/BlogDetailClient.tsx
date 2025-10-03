'use client';

// Blog detail client component
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { FiArrowLeft, FiShare2, FiCalendar, FiClock, FiEye, FiTag, FiHelpCircle } from 'react-icons/fi';

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
    blog: Blog;
    slug: string;
}

export default function BlogDetailClient({ blog, slug }: Props) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

    const cleanMarkdown = (text: string) => {
        return text
            .replace(/[#*`_~\[\]()]/g, '') // Remove markdown formatting
            .replace(/\n+/g, ' ') // Replace newlines with spaces
            .trim(); // Remove leading/trailing whitespace
    };

    const handleShare = async () => {
        if (!mounted) return;

        const shareData = {
            title: cleanMarkdown(blog.subject),
            text: `Check out this blog: ${cleanMarkdown(blog.subject)}`,
            url: `${window.location.origin}/blogs/${slug}`,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share cancelled or failed:', err);
            }
        } else {
            // Fallback to clipboard
            try {
                await navigator.clipboard.writeText(shareData.url);
                // You could add a toast notification here
                alert('Blog URL copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy to clipboard:', err);
            }
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                    <p className="text-slate-600">Loading blog...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Background Animation */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-12">
                {/* Back Button */}
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

                {/* Main Article */}
                <motion.article
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
                >
                    {/* Header */}
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
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200"
                            >
                                <div className="flex items-center">
                                    <FiEye className="w-5 h-5 text-indigo-600 mr-2" />
                                    <span className="text-indigo-700 font-medium">Generated from video: {blog.video.title}</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20"
                    >
                        <div className="prose prose-xl max-w-none prose-slate prose-headings:text-slate-800 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-xl prose-strong:text-slate-800 prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-pre:p-6 prose-blockquote:border-indigo-300 prose-blockquote:bg-indigo-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-ul:text-slate-700 prose-ol:text-slate-700 prose-li:text-slate-700 prose-headings:mb-6 prose-headings:mt-10">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {blog.content}
                            </ReactMarkdown>
                        </div>
                    </motion.div>

                    {/* Keywords Section */}
                    {blog.seoKeywords && blog.seoKeywords.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 pb-6"
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                                <div className="flex items-center mb-4">
                                    <FiTag className="w-5 h-5 text-blue-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-slate-800">Keywords</h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {blog.seoKeywords.map((keyword, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors duration-200"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* FAQ Section */}
                    {blog.seoFaq && blog.seoFaq.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="px-6 sm:px-10 lg:px-12 xl:px-16 2xl:px-20 pb-6"
                        >
                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                                <div className="flex items-center mb-6">
                                    <FiHelpCircle className="w-5 h-5 text-green-600 mr-2" />
                                    <h3 className="text-lg font-semibold text-slate-800">Frequently Asked Questions</h3>
                                </div>
                                <div className="space-y-4">
                                    {blog.seoFaq.map((faq, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + index * 0.1 }}
                                            className="bg-white rounded-lg p-4 shadow-sm border border-green-100"
                                        >
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                                    <span className="text-green-600 text-sm font-medium">{index + 1}</span>
                                                </div>
                                                <p className="text-slate-700 leading-relaxed">{faq}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="p-6 sm:p-10 lg:p-12 xl:p-16 2xl:p-20 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50"
                    >
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
                    </motion.div>
                </motion.article>
            </div>
        </div>
    );
}