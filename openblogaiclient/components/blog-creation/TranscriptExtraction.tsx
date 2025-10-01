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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FiFileText className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Extract Video Transcript
                </h2>
                <p className="text-xl font-medium text-slate-600 max-w-2xl mx-auto">
                    {videoTitle ? `Processing: ${videoTitle}` : "AI-powered transcript extraction from your YouTube video"}
                </p>
            </motion.div>

            {/* Extraction Status */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl border border-blue-100"
            >
                <div className="flex items-center gap-6 mb-6">
                    <div className={`w-4 h-4 rounded-full transition-all duration-300 ${extractionStatus === "extracting" ? "bg-yellow-500 animate-pulse shadow-lg shadow-yellow-200" :
                            extractionStatus === "success" ? "bg-emerald-500 shadow-lg shadow-emerald-200" :
                                extractionStatus === "error" ? "bg-red-500 shadow-lg shadow-red-200" :
                                    "bg-slate-300"
                        }`}></div>
                    <span className="text-xl font-bold text-slate-700">
                        {extractionStatus === "idle" && "Ready to extract transcript"}
                        {extractionStatus === "extracting" && "AI is extracting your transcript..."}
                        {extractionStatus === "success" && "Transcript extracted successfully!"}
                        {extractionStatus === "error" && "Extraction failed"}
                    </span>
                </div>

                {extractionStatus === "extracting" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                            <span className="text-lg font-medium text-slate-600">Connecting to YouTube servers...</span>
                        </div>
                        <div className="space-y-3">
                            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '75%' }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                />
                            </div>
                            <p className="text-sm text-slate-500 text-center">Processing video content...</p>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex items-center gap-4"
                    >
                        <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                            <FiAlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-red-800 mb-1">Extraction Error</h4>
                            <p className="text-red-700">{error}</p>
                        </div>
                        <motion.button
                            onClick={extractTranscript}
                            disabled={isLoading}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            Retry
                        </motion.button>
                    </motion.div>
                )}
            </motion.div>

            {/* Transcript Preview */}
            {transcript && (
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 100 }}
                    className="bg-gradient-to-br from-white via-emerald-50 to-blue-50 rounded-3xl p-8 shadow-xl border border-emerald-100"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <FiCheck className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                                Transcript Ready
                            </h3>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold">
                                {getWordCount(transcript)} words
                            </div>
                            <div className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-bold">
                                {getEstimatedReadTime(transcript)} min read
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 mb-6 shadow-inner border border-slate-100">
                        <div className="text-slate-700 text-base leading-relaxed">
                            <p className="whitespace-pre-wrap">
                                {showFullTranscript ? transcript : getPreviewText(transcript)}
                            </p>
                        </div>

                        {transcript.length > 300 && (
                            <motion.button
                                onClick={() => setShowFullTranscript(!showFullTranscript)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 flex items-center gap-3 shadow-lg"
                            >
                                <FiEye className="w-5 h-5" />
                                {showFullTranscript ? "Show Less" : "Show Full Transcript"}
                            </motion.button>
                        )}
                    </div>

                    {/* Moderator Review Section */}
                    {isModerator && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                                    <FiAlertCircle className="w-6 h-6 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-amber-800">
                                    Moderator Review Required
                                </h4>
                            </div>

                            <p className="text-amber-700 mb-6 text-lg leading-relaxed">
                                As a moderator, please review the extracted transcript to ensure quality and accuracy before proceeding to the next step.
                            </p>

                            <div className="flex gap-4">
                                <motion.button
                                    onClick={() => handleModeratorAction("approved")}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={moderatorApproval !== "pending"}
                                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 ${moderatorApproval === "approved"
                                            ? "bg-emerald-600 text-white shadow-lg"
                                            : "bg-white border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                        }`}
                                >
                                    <FiCheck className="w-5 h-5" />
                                    Approve
                                </motion.button>
                                <motion.button
                                    onClick={() => handleModeratorAction("rejected")}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={moderatorApproval !== "pending"}
                                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-3 transition-all duration-300 ${moderatorApproval === "rejected"
                                            ? "bg-red-600 text-white shadow-lg"
                                            : "bg-white border-2 border-red-200 text-red-700 hover:bg-red-50"
                                        }`}
                                >
                                    <FiAlertCircle className="w-5 h-5" />
                                    Reject
                                </motion.button>
                            </div>

                            {moderatorApproval !== "pending" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${moderatorApproval === "approved"
                                            ? "bg-emerald-100 border border-emerald-200 text-emerald-800"
                                            : "bg-red-100 border border-red-200 text-red-800"
                                        }`}
                                >
                                    <div className="w-6 h-6 bg-current rounded-full flex items-center justify-center text-white">
                                        <FiCheck className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold">
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex justify-between pt-8"
            >
                <motion.button
                    onClick={onPrev}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-white border-2 border-slate-300 text-slate-700 rounded-2xl text-lg font-bold shadow-lg hover:border-slate-400 hover:shadow-xl transition-all duration-300 flex items-center gap-3"
                >
                    <FiArrowLeft className="w-6 h-6" />
                    Back
                </motion.button>

                <motion.button
                    onClick={handleNext}
                    disabled={
                        extractionStatus !== "success" ||
                        (isModerator && moderatorApproval !== "approved") ||
                        isLoading
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-8 py-4 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 flex items-center gap-3 ${extractionStatus === "success" && (!isModerator || moderatorApproval === "approved") && !isLoading
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl hover:from-blue-600 hover:to-purple-700'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <span>Select AI Model</span>
                    <FiArrowRight className="w-6 h-6" />
                </motion.button>
            </motion.div>
        </div>
    );
}