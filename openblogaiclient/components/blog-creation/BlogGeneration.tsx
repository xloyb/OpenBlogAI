"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiArrowRight, FiArrowLeft, FiCheck, FiAlertCircle, FiCopy, FiDownload, FiEye } from "react-icons/fi";
import { useSession } from "next-auth/react";
import ReactMarkdown from "react-markdown";
import { blogAPI } from "../../lib/blog-api";

interface BlogGenerationProps {
    transcript?: string;
    selectedModel?: string;
    onBlogGenerated: (generatedBlog: string) => void;
    onNext: () => void;
    onPrev: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export default function BlogGeneration({
    transcript,
    selectedModel,
    onBlogGenerated,
    onNext,
    onPrev,
    isLoading,
    setIsLoading
}: BlogGenerationProps) {
    const { data: session } = useSession();
    const [generatedBlog, setGeneratedBlog] = useState("");
    const [generationStatus, setGenerationStatus] = useState<"idle" | "generating" | "success" | "error">("idle");
    const [error, setError] = useState("");
    const [streamingText, setStreamingText] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const [moderatorApproval, setModeratorApproval] = useState<"pending" | "approved" | "rejected">("pending");
    const [generationProgress, setGenerationProgress] = useState(0);

    const streamingRef = useRef<HTMLDivElement>(null);
    const isModerator = session?.user?.isModerator || session?.user?.isAdmin;

    const simulateStreaming = useCallback(async (fullText: string) => {
        const words = fullText.split(' ');
        const totalWords = words.length;
        let currentText = "";

        for (let i = 0; i < words.length; i++) {
            currentText += (i > 0 ? ' ' : '') + words[i];
            setStreamingText(currentText);
            setGenerationProgress((i + 1) / totalWords * 100);

            // Variable delay for more realistic streaming
            const delay = Math.random() * 50 + 10;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }, []);

    const generateBlog = useCallback(async () => {
        if (!transcript || !selectedModel || !session?.user?.id) return;

        setIsLoading(true);
        setGenerationStatus("generating");
        setError("");
        setStreamingText("");
        setGenerationProgress(0);

        try {
            const data = await blogAPI.generateBlog(
                selectedModel,
                transcript,
                session.user.id,
                session.accessToken as string
            );

            const blog = data.blog || "";

            // Simulate streaming effect for better UX
            await simulateStreaming(blog);

            setGeneratedBlog(blog);
            onBlogGenerated(blog);
            setGenerationStatus("success");

            // If user is moderator, auto-approve
            if (isModerator) {
                setModeratorApproval("approved");
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to generate blog";
            setError(errorMessage);
            setGenerationStatus("error");
        } finally {
            setIsLoading(false);
        }
    }, [transcript, selectedModel, session?.user?.id, session?.accessToken, onBlogGenerated, setIsLoading, isModerator, simulateStreaming]);

    useEffect(() => {
        if (transcript && selectedModel && generationStatus === "idle") {
            generateBlog();
        }
    }, [transcript, selectedModel, generationStatus, generateBlog]);

    useEffect(() => {
        // Auto-scroll to bottom during streaming
        if (streamingRef.current) {
            streamingRef.current.scrollTop = streamingRef.current.scrollHeight;
        }
    }, [streamingText]);

    const handleModeratorAction = (action: "approved" | "rejected") => {
        setModeratorApproval(action);
    };

    const handleNext = () => {
        if (generationStatus === "success" && (moderatorApproval === "approved" || !isModerator)) {
            onNext();
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedBlog);
            // Show success toast (you might want to add a toast system)
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    const downloadBlog = () => {
        const blob = new Blob([generatedBlog], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-blog.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const getWordCount = (text: string) => {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    };

    const getReadingTime = (text: string) => {
        const wordCount = getWordCount(text);
        return Math.ceil(wordCount / 200); // Average reading speed
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center relative"
            >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-green-500/10 rounded-3xl blur-xl" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
                        <FiEdit className="w-10 h-10 text-white relative z-10" />
                        <motion.div
                            animate={{
                                rotate: [0, 360],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                        />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-blue-600 to-green-600 bg-clip-text text-transparent"
                    >
                        Generate AI Blog
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-base-content/80 text-lg"
                    >
                        Creating your blog post using <span className="font-semibold text-primary">{selectedModel?.toUpperCase()}</span> model
                    </motion.p>
                </div>
            </motion.div>

            {/* Generation Status */}
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="bg-gradient-to-br from-base-200/50 to-base-300/30 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl relative overflow-hidden"
            >
                {/* Animated background */}
                <motion.div
                    animate={{
                        background: [
                            "linear-gradient(45deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05))",
                            "linear-gradient(45deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05))",
                            "linear-gradient(45deg, rgba(16, 185, 129, 0.05), rgba(139, 92, 246, 0.05))"
                        ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                />
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-3 h-3 rounded-full ${generationStatus === "generating" ? "bg-warning animate-pulse" :
                        generationStatus === "success" ? "bg-success" :
                            generationStatus === "error" ? "bg-error" : "bg-base-300"
                        }`}></div>
                    <span className="font-medium">
                        {generationStatus === "idle" && "Ready to generate"}
                        {generationStatus === "generating" && "Generating blog content..."}
                        {generationStatus === "success" && "Blog generated successfully"}
                        {generationStatus === "error" && "Generation failed"}
                    </span>
                </div>

                {generationStatus === "generating" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-4 relative z-10"
                    >
                        <div className="flex items-center gap-3">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                            />
                            <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                AI is crafting your blog post...
                            </span>
                        </div>

                        {/* Enhanced Progress Bar */}
                        <div className="relative">
                            <div className="w-full bg-base-300 rounded-full h-3 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${generationProgress}%` }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-full relative overflow-hidden shadow-lg"
                                >
                                    <motion.div
                                        animate={{
                                            x: [-100, 200],
                                            opacity: [0, 1, 0]
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                    />
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-base-content/70 font-medium">
                                Progress: <span className="text-primary font-bold">{Math.round(generationProgress)}%</span>
                            </span>
                            <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent font-semibold">
                                {getWordCount(streamingText)} words generated
                            </span>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="alert alert-error"
                    >
                        <FiAlertCircle className="w-5 h-5" />
                        <span>{error}</span>
                        <button
                            onClick={generateBlog}
                            disabled={isLoading}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Retry
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {/* Streaming Blog Content */}
            {(streamingText || generatedBlog) && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-base-200 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <motion.h3
                            className="text-xl font-bold flex items-center gap-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {generationStatus === "generating" ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                        className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
                                    />
                                    <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                        Generating...
                                    </span>
                                </>
                            ) : (
                                <>
                                    <motion.div
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                                    >
                                        <FiCheck className="w-4 h-4 text-white" />
                                    </motion.div>
                                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        Blog Generated
                                    </span>
                                </>
                            )}
                        </motion.h3>

                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {generatedBlog && (
                                <>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-full text-xs font-semibold text-blue-600 backdrop-blur-sm"
                                    >
                                        {getWordCount(generatedBlog)} words
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-full text-xs font-semibold text-purple-600 backdrop-blur-sm"
                                    >
                                        {getReadingTime(generatedBlog)} min read
                                    </motion.div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowPreview(!showPreview)}
                                        className={`group relative px-4 py-2 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center gap-2 ${showPreview
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105"
                                            : "bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300"
                                            }`}
                                    >
                                        {showPreview && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        )}
                                        <div className="relative flex items-center gap-2">
                                            <FiEye className="w-4 h-4" />
                                            <span>{showPreview ? "Raw" : "Preview"}</span>
                                        </div>
                                    </motion.button>
                                </>
                            )}
                        </motion.div>
                    </div>

                    <div
                        ref={streamingRef}
                        className="bg-gradient-to-br from-base-100/80 to-base-200/50 backdrop-blur-lg rounded-xl p-6 max-h-96 overflow-y-auto border border-white/10 shadow-inner relative"
                    >
                        {/* Subtle pattern overlay */}
                        <div className="absolute inset-0 opacity-5" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Ccircle cx='5' cy='5' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                        }} />

                        <div className="relative z-10">
                            {showPreview && generatedBlog ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="prose prose-lg max-w-none prose-headings:text-primary prose-links:text-secondary prose-strong:text-accent prose-code:text-accent prose-pre:bg-base-300 prose-blockquote:border-primary"
                                >
                                    <ReactMarkdown>{generatedBlog}</ReactMarkdown>
                                </motion.div>
                            ) : (
                                <div className="font-mono text-sm whitespace-pre-wrap leading-relaxed text-base-content/90">
                                    {generationStatus === "generating" ? streamingText : generatedBlog}
                                    {generationStatus === "generating" && (
                                        <motion.span
                                            animate={{
                                                opacity: [1, 0],
                                                scale: [1, 1.2, 1]
                                            }}
                                            transition={{
                                                duration: 0.8,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="inline-block w-3 h-5 bg-gradient-to-r from-primary to-secondary rounded-sm ml-1"
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {generatedBlog && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex gap-4 mt-6"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={copyToClipboard}
                                className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                            >
                                <FiCopy className="w-4 h-4" />
                                <span>Copy Text</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={downloadBlog}
                                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden flex items-center gap-2"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <div className="relative flex items-center gap-2">
                                    <FiDownload className="w-4 h-4" />
                                    <span>Download MD</span>
                                </div>
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Moderator Review Section */}
                    {isModerator && generatedBlog && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 mt-6 relative overflow-hidden"
                        >
                            {/* Animated background pattern */}
                            <motion.div
                                animate={{
                                    background: [
                                        "linear-gradient(45deg, rgba(245, 158, 11, 0.05), rgba(249, 115, 22, 0.05))",
                                        "linear-gradient(45deg, rgba(249, 115, 22, 0.05), rgba(239, 68, 68, 0.05))",
                                        "linear-gradient(45deg, rgba(239, 68, 68, 0.05), rgba(245, 158, 11, 0.05))"
                                    ]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            />

                            <div className="relative z-10">
                                <motion.h4
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-bold text-lg mb-4 flex items-center gap-3"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center"
                                    >
                                        <FiAlertCircle className="w-4 h-4 text-white" />
                                    </motion.div>
                                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                        Moderator Review Required
                                    </span>
                                </motion.h4>

                                <motion.p
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-sm text-base-content/80 mb-6 leading-relaxed"
                                >
                                    Please review the generated blog content for quality, accuracy, and appropriateness before publishing.
                                </motion.p>

                                <div className="flex gap-4">
                                    <motion.button
                                        whileHover={{ scale: moderatorApproval !== "pending" ? 1 : 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleModeratorAction("approved")}
                                        disabled={moderatorApproval !== "pending"}
                                        className={`group relative px-6 py-3 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${moderatorApproval === "approved"
                                                ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:scale-105"
                                                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-300"
                                            }`}
                                    >
                                        {moderatorApproval === "approved" && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        )}
                                        <div className="relative flex items-center gap-2">
                                            <FiCheck className="w-4 h-4" />
                                            <span>Approve</span>
                                        </div>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: moderatorApproval !== "pending" ? 1 : 1.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleModeratorAction("rejected")}
                                        disabled={moderatorApproval !== "pending"}
                                        className={`group relative px-6 py-3 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${moderatorApproval === "rejected"
                                                ? "bg-gradient-to-r from-red-600 to-pink-600 text-white hover:scale-105"
                                                : "bg-white text-slate-700 border-2 border-slate-200 hover:border-red-300"
                                            }`}
                                    >
                                        {moderatorApproval === "rejected" && (
                                            <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        )}
                                        <div className="relative flex items-center gap-2">
                                            <FiAlertCircle className="w-4 h-4" />
                                            <span>Reject</span>
                                        </div>
                                    </motion.button>
                                </div>

                                {moderatorApproval !== "pending" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        className={`mt-4 p-4 rounded-xl backdrop-blur-sm border ${moderatorApproval === "approved"
                                            ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30"
                                            : "bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                transition={{ type: "spring", stiffness: 200 }}
                                                className={`w-5 h-5 rounded-full flex items-center justify-center ${moderatorApproval === "approved" ? "bg-green-500" : "bg-red-500"
                                                    }`}
                                            >
                                                <FiCheck className="w-3 h-3 text-white" />
                                            </motion.div>
                                            <span className="font-medium">
                                                Blog content <span className={`font-bold ${moderatorApproval === "approved" ? "text-green-600" : "text-red-600"
                                                    }`}>
                                                    {moderatorApproval === "approved" ? "approved" : "rejected"}
                                                </span> by moderator
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex justify-between pt-6"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPrev}
                    className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg flex items-center gap-2"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back
                </motion.button>

                <motion.button
                    whileHover={{
                        scale: generationStatus === "success" && (!isModerator || moderatorApproval === "approved") ? 1.05 : 1
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNext}
                    disabled={
                        generationStatus !== "success" ||
                        (isModerator && moderatorApproval !== "approved") ||
                        isLoading
                    }
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-2">
                        <span>Review & Publish</span>
                        <FiArrowRight className="w-5 h-5" />
                    </div>
                </motion.button>
            </motion.div>
        </div>
    );
}