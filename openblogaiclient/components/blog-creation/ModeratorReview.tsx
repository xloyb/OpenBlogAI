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

                        <div className="join">
                            <button
                                onClick={() => setEditMode(!editMode)}
                                className={`btn btn-sm join-item ${editMode ? 'btn-active' : ''}`}
                            >
                                <FiEdit className="w-4 h-4" />
                                {editMode ? 'Editing' : 'Edit'}
                            </button>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className={`btn btn-sm join-item ${showPreview ? 'btn-active' : ''}`}
                            >
                                <FiEye className="w-4 h-4" />
                                {showPreview ? 'Preview' : 'Raw'}
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-warning/10 border border-warning/20 rounded-xl p-6"
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <FiAlertCircle className="w-5 h-5 text-warning" />
                        Moderator Checklist
                    </h3>

                    <div className="space-y-3">
                        {[
                            "Content is appropriate and family-friendly",
                            "Information appears accurate and well-researched",
                            "Blog structure includes proper headings and sections",
                            "Grammar and language quality meets publication standards",
                            "Content provides value to readers",
                            "No plagiarism or copyright concerns"
                        ].map((item, index) => (
                            <label key={index} className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="checkbox checkbox-sm" />
                                <span className="text-sm">{item}</span>
                            </label>
                        ))}
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
                className="flex justify-between pt-4"
            >
                <button
                    onClick={onPrev}
                    className="btn btn-outline btn-lg gap-2"
                    disabled={publishStatus === "publishing"}
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <div className="flex gap-3">
                    <button
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
                        className="btn btn-outline btn-lg gap-2"
                        disabled={publishStatus === "publishing"}
                    >
                        <FiSave className="w-5 h-5" />
                        Save Draft
                    </button>

                    <button
                        onClick={handlePublish}
                        className="btn btn-success btn-lg gap-2"
                        disabled={publishStatus === "publishing" || !getCurrentBlog().trim()}
                    >
                        {publishStatus === "publishing" ? (
                            <>
                                <div className="loading loading-spinner loading-sm"></div>
                                Publishing...
                            </>
                        ) : (
                            <>
                                <FiShare2 className="w-5 h-5" />
                                Publish Blog
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}