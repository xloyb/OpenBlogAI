"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { FiVideo, FiFileText, FiCpu, FiEdit, FiCheck } from "react-icons/fi";
import YouTubeInput from "../../../components/blog-creation/YouTubeInput";
import TranscriptExtraction from "../../../components/blog-creation/TranscriptExtraction";
import ModelSelection from "../../../components/blog-creation/ModelSelection";
import BlogGeneration from "../../../components/blog-creation/BlogGeneration";
import ModeratorReview from "../../../components/blog-creation/ModeratorReview";

interface StepData {
    videoUrl?: string;
    videoId?: string;
    videoTitle?: string;
    transcript?: string;
    selectedModel?: string;
    generatedBlog?: string;
}

const STEPS = [
    { id: 1, title: "YouTube Video", icon: FiVideo, description: "Enter YouTube URL" },
    { id: 2, title: "Extract Transcript", icon: FiFileText, description: "Get video transcript" },
    { id: 3, title: "Select AI Model", icon: FiCpu, description: "Choose generation model" },
    { id: 4, title: "Generate Blog", icon: FiEdit, description: "Create blog content" },
    { id: 5, title: "Review & Publish", icon: FiCheck, description: "Final review" },
];

export default function CreateBlogPage() {
    const { data: session } = useSession();
    const [currentStep, setCurrentStep] = useState(1);
    const [stepData, setStepData] = useState<StepData>({});
    const [isLoading, setIsLoading] = useState(false);

    // Check if user is moderator or admin
    const isModerator = session?.user?.isModerator || session?.user?.isAdmin;

    const updateStepData = (data: Partial<StepData>) => {
        setStepData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <YouTubeInput
                        onVideoData={(data: Partial<StepData>) => updateStepData(data)}
                        onNext={nextStep}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                );
            case 2:
                return (
                    <TranscriptExtraction
                        videoId={stepData.videoId}
                        videoTitle={stepData.videoTitle}
                        onTranscript={(transcript: string) => updateStepData({ transcript })}
                        onNext={nextStep}
                        onPrev={prevStep}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                );
            case 3:
                return (
                    <ModelSelection
                        onModelSelect={(selectedModel: string) => updateStepData({ selectedModel })}
                        onNext={nextStep}
                        onPrev={prevStep}
                        selectedModel={stepData.selectedModel}
                    />
                );
            case 4:
                return (
                    <BlogGeneration
                        transcript={stepData.transcript}
                        selectedModel={stepData.selectedModel}
                        onBlogGenerated={(generatedBlog: string) => updateStepData({ generatedBlog })}
                        onNext={nextStep}
                        onPrev={prevStep}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                    />
                );
            case 5:
                return (
                    <ModeratorReview
                        stepData={stepData}
                        onPrev={prevStep}
                        isModerator={isModerator || false}
                    />
                );
            default:
                return null;
        }
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
                    <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Please log in to create blogs</h1>
                    <a href="/login" className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">Go to Login</a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        Create AI Blog from YouTube
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Transform YouTube videos into engaging blog posts with AI
                    </p>
                </motion.div>

                {/* Stepper */}
                <div className="mb-8">
                    <div className="flex items-center justify-between max-w-4xl mx-auto">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            const isUpcoming = currentStep < step.id;

                            return (
                                <div key={step.id} className="flex items-center">
                                    <motion.div
                                        className="flex flex-col items-center"
                                        initial={false}
                                        animate={{
                                            scale: isActive ? 1.1 : 1,
                                        }}
                                    >
                                        <div
                                            className={`
                        w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                        ${isCompleted ? 'bg-green-500 text-white' : ''}
                        ${isActive ? 'bg-primary-600 text-white shadow-lg' : ''}
                        ${isUpcoming ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400' : ''}
                      `}
                                        >
                                            {isCompleted ? (
                                                <FiCheck className="w-6 h-6" />
                                            ) : (
                                                <Icon className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="text-center">
                                            <div className={`text-sm font-medium ${isActive ? 'text-primary-600 dark:text-primary-400' : isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {step.title}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {step.description}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Connector Line */}
                                    {index < STEPS.length - 1 && (
                                        <div className="flex-1 h-px mx-4 relative">
                                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600"
                                                initial={{ scaleX: 0 }}
                                                animate={{ scaleX: isCompleted ? 1 : 0 }}
                                                style={{ transformOrigin: "left" }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Step Content */}
                <motion.div
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8 min-h-[600px]"
                    layout
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Loading Overlay */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 text-center shadow-2xl"
                            >
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Processing...</h3>
                                <p className="text-gray-600 dark:text-gray-400">Please wait while we work our magic</p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}