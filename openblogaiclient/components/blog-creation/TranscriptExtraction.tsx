"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiArrowRight, FiArrowLeft, FiCheck, FiAlertCircle, FiEye } from "react-icons/fi";
import { useSession } from "next-auth/react";
import { blogAPI } from "../../lib/blog-api";

interface TranscriptExtractionProps {
    videoId?: string;
    videoTitle?: string;
    onTranscript: (transcript: string) => void;
    onNext: () => void;
    onPrev: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export default function TranscriptExtraction({
    videoId,
    videoTitle,
    onTranscript,
    onNext,
    onPrev,
    isLoading,
    setIsLoading
}: TranscriptExtractionProps) {
    const { data: session } = useSession();
    const [transcript, setTranscript] = useState("");
    const [extractionStatus, setExtractionStatus] = useState<"idle" | "extracting" | "success" | "error">("idle");
    const [error, setError] = useState("");
    const [showFullTranscript, setShowFullTranscript] = useState(false);
    const [moderatorApproval, setModeratorApproval] = useState<"pending" | "approved" | "rejected">("pending");

    const isExtracting = useRef(false);
    const isModerator = session?.user?.isModerator || session?.user?.isAdmin;

    const extractTranscript = useCallback(async () => {
        if (!videoId || !session?.user?.id || isExtracting.current) {
            console.log('Extraction skipped:', { videoId, userId: session?.user?.id, isExtracting: isExtracting.current });
            return;
        }

        console.log('Starting transcript extraction for:', videoId);
        isExtracting.current = true;
        setIsLoading(true);
        setExtractionStatus("extracting");
        setError("");

        try {
            const data = await blogAPI.extractTranscript(
                videoId,
                session.user.id,
                session.accessToken as string
            );

            const extractedTranscript = data.transcript?.content || "";

            setTranscript(extractedTranscript);
            onTranscript(extractedTranscript);
            setExtractionStatus("success");

            // If user is moderator, auto-approve
            if (isModerator) {
                setModeratorApproval("approved");
            }

        } catch (err) {
            let errorMessage = "Failed to extract transcript";

            if (err instanceof Error) {
                if (err.message.includes('not available') || err.message.includes('captions')) {
                    errorMessage = "This video doesn't have captions or transcripts available. Please try a different video that has captions enabled.";
                } else if (err.message.includes('unavailable') || err.message.includes('private')) {
                    errorMessage = "This video is unavailable or private. Please check the video URL and try again.";
                } else {
                    errorMessage = err.message;
                }
            }

            setError(errorMessage);
            setExtractionStatus("error");
        } finally {
            setIsLoading(false);
            isExtracting.current = false;
        }
    }, [videoId, session?.user?.id, session?.accessToken, isModerator, setIsLoading, onTranscript]);

    useEffect(() => {
        if (videoId && extractionStatus === "idle" && !transcript && session?.user?.id && session?.accessToken) {
            console.log('useEffect trigger extraction for:', videoId);
            // Add a small delay to prevent race conditions
            const timeoutId = setTimeout(() => {
                extractTranscript();
            }, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [videoId, extractionStatus, extractTranscript, transcript, session?.user?.id, session?.accessToken]);

    // Reset extraction status when videoId changes
    useEffect(() => {
        if (videoId) {
            setExtractionStatus("idle");
            setTranscript("");
            setError("");
            setModeratorApproval("pending");
            isExtracting.current = false;
        }
        return () => {
            isExtracting.current = false;
        };
    }, [videoId]);

    const handleModeratorAction = (action: "approved" | "rejected") => {
        setModeratorApproval(action);
    };

    const handleNext = () => {
        if (extractionStatus === "success" && (moderatorApproval === "approved" || !isModerator)) {
            onNext();
        }
    };

    const getPreviewText = (text: string, maxLength: number = 300) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const getWordCount = (text: string) => {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    };

    const getEstimatedReadTime = (text: string) => {
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
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiFileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Extract Video Transcript</h2>
                <p className="text-base-content/70">
                    {videoTitle ? `Processing: ${videoTitle}` : "Extracting transcript from your video"}
                </p>
            </motion.div>

            {/* Extraction Status */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-base-200 rounded-xl p-6"
            >
                <div className="flex items-center gap-4 mb-4">
                    <div className={`w-3 h-3 rounded-full ${extractionStatus === "extracting" ? "bg-warning animate-pulse" :
                        extractionStatus === "success" ? "bg-success" :
                            extractionStatus === "error" ? "bg-error" : "bg-base-300"
                        }`}></div>
                    <span className="font-medium">
                        {extractionStatus === "idle" && "Ready to extract"}
                        {extractionStatus === "extracting" && "Extracting transcript..."}
                        {extractionStatus === "success" && "Transcript extracted successfully"}
                        {extractionStatus === "error" && "Extraction failed"}
                    </span>
                </div>

                {extractionStatus === "extracting" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-2">
                            <div className="loading loading-spinner loading-sm"></div>
                            <span className="text-sm">Connecting to YouTube...</span>
                        </div>
                        <div className="progress progress-primary w-full"></div>
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
                            onClick={extractTranscript}
                            className="btn btn-sm btn-outline"
                            disabled={isLoading}
                        >
                            Retry
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {/* Transcript Preview */}
            {transcript && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-base-200 rounded-xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold flex items-center gap-2">
                            <FiCheck className="w-5 h-5 text-success" />
                            Transcript Ready
                        </h3>
                        <div className="flex items-center gap-2">
                            <div className="badge badge-info">{getWordCount(transcript)} words</div>
                            <div className="badge badge-secondary">{getEstimatedReadTime(transcript)} min read</div>
                        </div>
                    </div>

                    <div className="bg-base-100 rounded-lg p-4 mb-4">
                        <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap">
                                {showFullTranscript ? transcript : getPreviewText(transcript)}
                            </p>
                        </div>

                        {transcript.length > 300 && (
                            <button
                                onClick={() => setShowFullTranscript(!showFullTranscript)}
                                className="btn btn-sm btn-ghost mt-2 gap-2"
                            >
                                <FiEye className="w-4 h-4" />
                                {showFullTranscript ? "Show Less" : "Show Full Transcript"}
                            </button>
                        )}
                    </div>

                    {/* Moderator Review Section */}
                    {isModerator && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-warning/10 border border-warning/20 rounded-lg p-4"
                        >
                            <h4 className="font-medium mb-3 flex items-center gap-2">
                                <FiAlertCircle className="w-4 h-4 text-warning" />
                                Moderator Review Required
                            </h4>

                            <p className="text-sm text-base-content/70 mb-4">
                                As a moderator, please review the extracted transcript before proceeding to the next step.
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
                                        Transcript {moderatorApproval === "approved" ? "approved" : "rejected"} by moderator
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
                        extractionStatus !== "success" ||
                        (isModerator && moderatorApproval !== "approved") ||
                        isLoading
                    }
                    className="btn btn-primary btn-lg gap-2"
                >
                    Select AI Model
                    <FiArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
}