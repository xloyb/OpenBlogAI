"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiYoutube, FiPlay, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

interface YouTubeInputProps {
    onVideoData: (data: { videoUrl: string; videoId: string; videoTitle?: string }) => void;
    onNext: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

export default function YouTubeInput({ onVideoData, onNext, isLoading, setIsLoading }: YouTubeInputProps) {
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");
    const [videoPreview, setVideoPreview] = useState<{
        id: string;
        title: string;
        thumbnail: string;
    } | null>(null);

    const extractVideoId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
            /youtube\.com\/watch\?.*v=([^&\n?#]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    };

    const validateAndPreview = async (inputUrl: string) => {
        setError("");
        const videoId = extractVideoId(inputUrl);

        if (!videoId) {
            setError("Please enter a valid YouTube URL");
            setVideoPreview(null);
            return;
        }

        try {
            setIsLoading(true);

            // Create preview data
            const preview = {
                id: videoId,
                title: `Video ${videoId}`, // We'll get the real title from the server
                thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
            };

            setVideoPreview(preview);

            // Update parent component with video data
            onVideoData({
                videoUrl: inputUrl,
                videoId: videoId,
                videoTitle: preview.title
            });

        } catch {
            setError("Failed to load video preview");
            setVideoPreview(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);

        if (newUrl.length > 10) {
            validateAndPreview(newUrl);
        } else {
            setVideoPreview(null);
            setError("");
        }
    };

    const handleNext = () => {
        if (videoPreview) {
            onNext();
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center"
            >
                <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200">
                    <FiYoutube className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-red-600 bg-clip-text text-transparent">
                    Enter YouTube Video URL
                </h2>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Paste the YouTube video URL you want to convert into an amazing blog post
                </p>
            </motion.div>

            {/* URL Input */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="space-y-6"
            >
                <div className="space-y-3">
                    <label className="text-lg font-semibold text-slate-700">
                        YouTube URL
                    </label>
                    <div className="relative">
                        <input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                            className={`w-full px-6 py-4 text-lg border-2 rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 pr-16 ${error
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200'
                                : videoPreview
                                    ? 'border-emerald-300 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200'
                                    : 'border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-200'
                                }`}
                            value={url}
                            onChange={handleUrlChange}
                            disabled={isLoading}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                            {isLoading ? (
                                <div className="relative">
                                    <div className="w-6 h-6 border-2 border-indigo-200 rounded-full animate-spin"></div>
                                    <div className="absolute inset-0 w-6 h-6 border-2 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
                                </div>
                            ) : videoPreview ? (
                                <FiPlay className="w-6 h-6 text-emerald-600" />
                            ) : (
                                <FiYoutube className="w-6 h-6 text-slate-400" />
                            )}
                        </div>
                    </div>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-red-600"
                        >
                            <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-xs">!</span>
                            </div>
                            <span className="text-sm font-medium">{error}</span>
                        </motion.div>
                    )}
                </div>

                {/* Example URLs */}
                <div className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl p-6 border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                        <FiYoutube className="w-4 h-4 text-red-500" />
                        Supported URL formats:
                    </p>
                    <div className="space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                            https://www.youtube.com/watch?v=VIDEO_ID
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                            https://youtu.be/VIDEO_ID
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                            https://www.youtube.com/embed/VIDEO_ID
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Video Preview */}
            {videoPreview && (
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 100 }}
                    className="bg-gradient-to-br from-white via-emerald-50 to-indigo-50 rounded-3xl p-8 shadow-xl border border-emerald-100"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                            <FiPlay className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent">
                            Video Preview
                        </h3>
                    </div>

                    <div className="flex gap-6">
                        <div className="flex-shrink-0">
                            <div className="relative group overflow-hidden rounded-2xl shadow-lg">
                                <Image
                                    src={videoPreview.thumbnail}
                                    alt="Video thumbnail"
                                    width={160}
                                    height={112}
                                    className="w-40 h-28 object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = `https://img.youtube.com/vi/${videoPreview.id}/hqdefault.jpg`;
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <FiPlay className="w-6 h-6 text-emerald-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <h4 className="text-xl font-bold text-slate-800 leading-tight line-clamp-2">
                                {videoPreview.title}
                            </h4>
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-slate-600 bg-slate-100 px-3 py-2 rounded-lg">
                                    Video ID: <span className="font-mono text-indigo-600">{videoPreview.id}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-2 rounded-full text-sm font-semibold">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        Valid URL
                                    </div>
                                    <div className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-2 rounded-full text-sm font-semibold">
                                        <FiCheckCircle className="w-4 h-4" />
                                        Ready to process
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex justify-end pt-8"
            >
                <motion.button
                    onClick={handleNext}
                    disabled={!videoPreview || isLoading}
                    whileHover={{ scale: (!videoPreview || isLoading) ? 1 : 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className={`group relative px-8 py-4 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex items-center gap-2 ${videoPreview && !isLoading
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {videoPreview && !isLoading && (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    )}
                    <div className="relative flex items-center gap-2">
                        <span>Extract Transcript</span>
                        <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                </motion.button>
            </motion.div>
        </div>
    );
}