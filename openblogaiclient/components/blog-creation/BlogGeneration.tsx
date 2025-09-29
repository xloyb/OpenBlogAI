"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiArrowRight, FiArrowLeft, FiCheck, FiAlertCircle, FiCopy, FiDownload, FiEye } from "react-icons/fi";
import { useSession } from "next-auth/react";
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

    useEffect(() => {
        if (transcript && selectedModel && generationStatus === "idle") {
            generateBlog();
        }
    }, [transcript, selectedModel, generationStatus]);

    useEffect(() => {
        // Auto-scroll to bottom during streaming
        if (streamingRef.current) {
            streamingRef.current.scrollTop = streamingRef.current.scrollHeight;
        }
    }, [streamingText]);

    const generateBlog = async () => {
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
    };

    const simulateStreaming = async (fullText: string) => {
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
    };

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
                className="text-center"
            >
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiEdit className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Generate AI Blog</h2>
                <p className="text-base-content/70">
                    Creating your blog post using {selectedModel?.toUpperCase()} model
                </p>
            </motion.div>

            {/* Generation Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-base-200 rounded-xl p-6"
            >
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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <div className="loading loading-spinner loading-sm"></div>
                            <span className="text-sm">AI is writing your blog post...</span>
                        </div>
                        <progress className="progress progress-primary w-full" value={generationProgress} max={100}></progress>
                        <div className="text-xs text-base-content/70">
                            Progress: {Math.round(generationProgress)}% • {getWordCount(streamingText)} words
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
                            className="btn btn-sm btn-outline"
                            disabled={isLoading}
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
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            {generationStatus === "generating" ? (
                                <>
                                    <div className="loading loading-spinner loading-sm"></div>
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <FiCheck className="w-5 h-5 text-success" />
                                    Blog Generated
                                </>
                            )}
                        </h3>

                        <div className="flex items-center gap-2">
                            {generatedBlog && (
                                <>
                                    <div className="badge badge-info">{getWordCount(generatedBlog)} words</div>
                                    <div className="badge badge-secondary">{getReadingTime(generatedBlog)} min read</div>
                                    <button
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="btn btn-sm btn-ghost gap-1"
                                    >
                                        <FiEye className="w-4 h-4" />
                                        {showPreview ? "Raw" : "Preview"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div
                        ref={streamingRef}
                        className="bg-base-100 rounded-lg p-4 max-h-96 overflow-y-auto"
                    >
                        {showPreview && generatedBlog ? (
                            <div
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                    __html: generatedBlog.replace(/\n/g, '<br>')
                                }}
                            />
                        ) : (
                            <div className="font-mono text-sm whitespace-pre-wrap">
                                {generationStatus === "generating" ? streamingText : generatedBlog}
                                {generationStatus === "generating" && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                        className="inline-block w-2 h-4 bg-primary ml-1"
                                    />
                                )}
                            </div>
                        )}
                    </div>

                    {generatedBlog && (
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={copyToClipboard}
                                className="btn btn-sm btn-ghost gap-1"
                            >
                                <FiCopy className="w-4 h-4" />
                                Copy
                            </button>
                            <button
                                onClick={downloadBlog}
                                className="btn btn-sm btn-ghost gap-1"
                            >
                                <FiDownload className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    )}

                    {/* Moderator Review Section */}
                    {isModerator && generatedBlog && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-warning/10 border border-warning/20 rounded-lg p-4 mt-4"
                        >
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                <FiAlertCircle className="w-4 h-4 text-warning" />
                                Moderator Review Required
                            </h4>

                            <p className="text-sm text-base-content/70 mb-4">
                                Please review the generated blog content for quality, accuracy, and appropriateness.
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleModeratorAction("approved")}
                                    className={`btn btn-sm ${moderatorApproval === "approved" ? "btn-success" : "btn-outline"}`}
                                    disabled={moderatorApproval !== "pending"}
                                >
                                    <FiCheck className="w-4 h-4" />
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleModeratorAction("rejected")}
                                    className={`btn btn-sm ${moderatorApproval === "rejected" ? "btn-error" : "btn-outline"}`}
                                    disabled={moderatorApproval !== "pending"}
                                >
                                    <FiAlertCircle className="w-4 h-4" />
                                    Reject
                                </button>
                            </div>

                            {moderatorApproval !== "pending" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`alert mt-3 ${moderatorApproval === "approved" ? "alert-success" : "alert-error"}`}
                                >
                                    <span>
                                        Blog content {moderatorApproval === "approved" ? "approved" : "rejected"} by moderator
                                    </span>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-between pt-4"
            >
                <button
                    onClick={onPrev}
                    className="btn btn-outline btn-lg gap-2"
                >
                    <FiArrowLeft className="w-5 h-5" />
                    Back
                </button>

                <button
                    onClick={handleNext}
                    disabled={
                        generationStatus !== "success" ||
                        (isModerator && moderatorApproval !== "approved") ||
                        isLoading
                    }
                    className="btn btn-primary btn-lg gap-2"
                >
                    Review & Publish
                    <FiArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
}