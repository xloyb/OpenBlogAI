"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiYoutube, FiPlay, FiArrowRight } from "react-icons/fi";

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
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiYoutube className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Enter YouTube Video URL</h2>
                <p className="text-base-content/70">
                    Paste the YouTube video URL you want to convert into a blog post
                </p>
            </motion.div>

            {/* URL Input */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
            >
                <div className="form-control">
                    <label className="label">
                        <span className="label-text font-medium">YouTube URL</span>
                    </label>
                    <div className="relative">
                        <input
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            className={`input input-bordered w-full pr-12 ${error ? 'input-error' : videoPreview ? 'input-success' : ''}`}
                            value={url}
                            onChange={handleUrlChange}
                            disabled={isLoading}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            {isLoading ? (
                                <div className="loading loading-spinner loading-sm"></div>
                            ) : videoPreview ? (
                                <FiPlay className="w-5 h-5 text-success" />
                            ) : (
                                <FiYoutube className="w-5 h-5 text-base-content/30" />
                            )}
                        </div>
                    </div>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="label"
                        >
                            <span className="label-text-alt text-error">{error}</span>
                        </motion.div>
                    )}
                </div>

                {/* Example URLs */}
                <div className="bg-base-200 rounded-lg p-4">
                    <p className="text-sm font-medium mb-2">Example formats supported:</p>
                    <div className="space-y-1 text-sm text-base-content/70">
                        <div>• https://www.youtube.com/watch?v=VIDEO_ID</div>
                        <div>• https://youtu.be/VIDEO_ID</div>
                        <div>• https://www.youtube.com/embed/VIDEO_ID</div>
                    </div>
                </div>
            </motion.div>

            {/* Video Preview */}
            {videoPreview && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-base-200 rounded-xl p-6"
                >
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <FiPlay className="w-5 h-5" />
                        Video Preview
                    </h3>

                    <div className="flex gap-4">
                        <div className="flex-shrink-0">
                            <img
                                src={videoPreview.thumbnail}
                                alt="Video thumbnail"
                                className="w-32 h-24 object-cover rounded-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://img.youtube.com/vi/${videoPreview.id}/hqdefault.jpg`;
                                }}
                            />
                        </div>

                        <div className="flex-1">
                            <h4 className="font-medium mb-2">{videoPreview.title}</h4>
                            <div className="text-sm text-base-content/70">
                                <div>Video ID: {videoPreview.id}</div>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="badge badge-success badge-sm">✓ Valid URL</div>
                                    <div className="badge badge-info badge-sm">Ready to process</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex justify-end pt-4"
            >
                <button
                    onClick={handleNext}
                    disabled={!videoPreview || isLoading}
                    className="btn btn-primary btn-lg gap-2"
                >
                    Extract Transcript
                    <FiArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
}