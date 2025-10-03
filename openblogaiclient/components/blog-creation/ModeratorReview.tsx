"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheck, FiArrowLeft, FiEdit, FiEye, FiSave, FiShare2, FiAlertCircle, FiVideo, FiFileText, FiCpu } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { blogAPI } from "../../lib/blog-api";

interface StepData {
    videoUrl?: string;
    videoId?: string;
    videoTitle?: string;
    transcript?: string;
    selectedModel?: string;
    generatedBlog?: string;
}

interface ModeratorReviewProps {
    stepData: StepData;
    onPrev: () => void;
    isModerator: boolean;
}

export default function ModeratorReview({ stepData, onPrev, isModerator }: ModeratorReviewProps) {
    const { data: session } = useSession();
    const [editMode, setEditMode] = useState(false);
    const [editedBlog, setEditedBlog] = useState(stepData.generatedBlog || "");
    const [showPreview, setShowPreview] = useState(false);
    const [publishStatus, setPublishStatus] = useState<"idle" | "publishing" | "success" | "error">("idle");
    const [error, setError] = useState("");

    const handlePublish = async () => {
        if (!session?.user?.id) return;

        setPublishStatus("publishing");
        setError("");

        try {
            await blogAPI.generateBlog(
                stepData.selectedModel || '',
                stepData.transcript || '',
                session.user.id,
                session.accessToken as string
            );

            setPublishStatus("success");

            // Redirect to blogs page after successful publish
            setTimeout(() => {
                window.location.href = '/blogs';
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Failed to publish blog";
            setError(errorMessage);
            setPublishStatus("error");
        }
    };

    const getWordCount = (text: string) => {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    };

    const getReadingTime = (text: string) => {
        const wordCount = getWordCount(text);
        return Math.ceil(wordCount / 200);
    };

    const getCurrentBlog = () => editMode ? editedBlog : (stepData.generatedBlog || "");

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheck className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Review & Publish</h2>
                <p className="text-base-content/70">
                    Final review of your AI-generated blog post
                </p>
            </motion.div>

            {/* Process Summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-base-200 rounded-xl p-6"
            >
                <h3 className="font-bold mb-4">Process Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Video Source */}
                    <div className="bg-base-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FiVideo className="w-5 h-5 text-red-500" />
                            <span className="font-medium">Source Video</span>
                        </div>
                        <p className="text-sm text-base-content/70 mb-2">
                            {stepData.videoTitle || "YouTube Video"}
                        </p>
                        <a
                            href={stepData.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline"
                        >
                            View Original Video
                        </a>
                    </div>

                    {/* Transcript Stats */}
                    <div className="bg-base-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FiFileText className="w-5 h-5 text-blue-500" />
                            <span className="font-medium">Transcript</span>
                        </div>
                        <p className="text-sm text-base-content/70">
                            {getWordCount(stepData.transcript || "")} words extracted
                        </p>
                        <p className="text-xs text-base-content/50">
                            ~{getReadingTime(stepData.transcript || "")} min original content
                        </p>
                    </div>

                    {/* AI Model */}
                    <div className="bg-base-100 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <FiCpu className="w-5 h-5 text-purple-500" />
                            <span className="font-medium">AI Model</span>
                        </div>
                        <p className="text-sm text-base-content/70">
                            {stepData.selectedModel?.toUpperCase() || "Unknown"}
                        </p>
                        <p className="text-xs text-base-content/50">
                            Text generation model
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Blog Content Review */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-base-200 rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Generated Blog Content</h3>

                    <div className="flex items-center gap-2">
                        <div className="badge badge-info">{getWordCount(getCurrentBlog())} words</div>
                        <div className="badge badge-secondary">{getReadingTime(getCurrentBlog())} min read</div>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className={`group relative px-4 py-2 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center gap-2 ${editMode
                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105"
                                    : "bg-white text-slate-700 border-2 border-slate-200 hover:border-indigo-300"
                                    }`}
                            >
                                {editMode && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                )}
                                <div className="relative flex items-center gap-2">
                                    <FiEdit className="w-4 h-4" />
                                    <span>{editMode ? 'Editing' : 'Edit'}</span>
                                </div>
                            </button>
                            <button
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
                                    <span>{showPreview ? 'Preview' : 'Raw'}</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-base-100 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {editMode ? (
                        <textarea
                            value={editedBlog}
                            onChange={(e) => setEditedBlog(e.target.value)}
                            className="textarea textarea-bordered w-full h-80 font-mono text-sm"
                            placeholder="Edit your blog content here..."
                        />
                    ) : showPreview ? (
                        <div
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: getCurrentBlog().replace(/\n/g, '<br>')
                            }}
                        />
                    ) : (
                        <div className="font-mono text-sm whitespace-pre-wrap">
                            {getCurrentBlog()}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Moderator Checklist */}
            {isModerator && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-xl border border-amber-500/20 rounded-2xl p-6 relative overflow-hidden"
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
                        <motion.h3
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="font-bold text-lg mb-6 flex items-center gap-3"
                        >
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-7 h-7 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg"
                            >
                                <FiAlertCircle className="w-4 h-4 text-white" />
                            </motion.div>
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                Moderator Checklist
                            </span>
                        </motion.h3>

                        <motion.p
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-sm text-base-content/80 mb-6 leading-relaxed"
                        >
                            Please verify each point below before publishing to ensure content quality and compliance.
                        </motion.p>

                        <div className="space-y-4">
                            {[
                                {
                                    text: "Content is appropriate and family-friendly",
                                    icon: "👨‍👩‍👧‍👦",
                                    delay: 0.1
                                },
                                {
                                    text: "Information appears accurate and well-researched",
                                    icon: "🔍",
                                    delay: 0.15
                                },
                                {
                                    text: "Blog structure includes proper headings and sections",
                                    icon: "📝",
                                    delay: 0.2
                                },
                                {
                                    text: "Grammar and language quality meets publication standards",
                                    icon: "✍️",
                                    delay: 0.25
                                },
                                {
                                    text: "Content provides value to readers",
                                    icon: "💎",
                                    delay: 0.3
                                },
                                {
                                    text: "No plagiarism or copyright concerns",
                                    icon: "⚖️",
                                    delay: 0.35
                                }
                            ].map((item, index) => (
                                <motion.label
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: item.delay }}
                                    className="group flex items-center gap-4 cursor-pointer p-3 rounded-xl bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm border border-white/20 hover:border-amber-300/40 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 rounded-lg border-2 border-amber-300 text-amber-600 focus:ring-amber-500 focus:ring-2 focus:ring-offset-0 transition-all duration-200"
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-200"
                                        />
                                    </div>
                                    <div className="flex items-center gap-3 flex-1">
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="text-sm font-medium text-base-content/90 group-hover:text-base-content transition-colors duration-200">
                                            {item.text}
                                        </span>
                                    </div>
                                </motion.label>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-2 text-sm text-blue-600">
                                <FiCheck className="w-4 h-4" />
                                <span className="font-medium">
                                    Complete all checks above before publishing
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}

            {/* Publication Status */}
            {publishStatus !== "idle" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`alert ${publishStatus === "publishing" ? "alert-info" :
                        publishStatus === "success" ? "alert-success" :
                            "alert-error"
                        }`}
                >
                    {publishStatus === "publishing" && (
                        <>
                            <div className="loading loading-spinner loading-sm"></div>
                            <span>Publishing your blog post...</span>
                        </>
                    )}
                    {publishStatus === "success" && (
                        <>
                            <FiCheck className="w-5 h-5" />
                            <span>Blog published successfully! Redirecting to blogs page...</span>
                        </>
                    )}
                    {publishStatus === "error" && (
                        <>
                            <FiAlertCircle className="w-5 h-5" />
                            <span>{error}</span>
                        </>
                    )}
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between pt-6"
            >
                <motion.button
                    whileHover={{ scale: publishStatus === "publishing" ? 1 : 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPrev}
                    disabled={publishStatus === "publishing"}
                    className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back
                </motion.button>

                <div className="flex gap-4">
                    <motion.button
                        whileHover={{ scale: publishStatus === "publishing" ? 1 : 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            const blob = new Blob([getCurrentBlog()], { type: 'text/markdown' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'blog-draft.md';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }}
                        disabled={publishStatus === "publishing"}
                        className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <FiSave className="w-5 h-5" />
                        Save Draft
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: (publishStatus === "publishing" || !getCurrentBlog().trim()) ? 1 : 1.05 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePublish}
                        disabled={publishStatus === "publishing" || !getCurrentBlog().trim()}
                        className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center gap-2">
                            {publishStatus === "publishing" ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Publishing...
                                </>
                            ) : (
                                <>
                                    <FiShare2 className="w-5 h-5" />
                                    Publish Blog
                                </>
                            )}
                        </div>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}