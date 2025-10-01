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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
                {/* Background Elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative text-center bg-white p-12 rounded-3xl shadow-2xl border border-slate-200 max-w-md mx-4"
                >
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FiVideo className="w-10 h-10 text-indigo-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Create AI Blog
                    </h1>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Please log in to start creating amazing blog posts from YouTube videos
                    </p>
                    <a href="/login" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                        Go to Login
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium mb-6">
                        <FiVideo className="w-4 h-4" />
                        AI-Powered Blog Creation
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 bg-clip-text text-transparent mb-6">
                        Create AI Blog
                    </h1>

                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Transform YouTube videos into engaging, SEO-optimized blog posts with our advanced AI technology
                    </p>
                </motion.div>

                {/* Stepper */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-12"
                >
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
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div
                                            className={`
                                                w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300 shadow-lg
                                                ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-emerald-200' : ''}
                                                ${isActive ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200' : ''}
                                                ${isUpcoming ? 'bg-white border-2 border-slate-200 text-slate-400' : ''}
                                            `}
                                        >
                                            {isCompleted ? (
                                                <FiCheck className="w-8 h-8" />
                                            ) : (
                                                <Icon className="w-8 h-8" />
                                            )}
                                        </div>
                                        <div className="text-center max-w-24">
                                            <div className={`text-sm font-semibold mb-1 ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                {step.title}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {step.description}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Connector Line */}
                                    {index < STEPS.length - 1 && (
                                        <div className="flex-1 h-1 mx-6 relative rounded-full overflow-hidden">
                                            <div className="absolute inset-0 bg-slate-200"></div>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500"
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
                </motion.div>

                {/* Step Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="bg-white border border-slate-200 rounded-3xl shadow-2xl p-8 min-h-[600px] relative overflow-hidden"
                    layout
                >
                    {/* Background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-indigo-50/30 to-purple-50/30 pointer-events-none"></div>

                    <div className="relative">
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
                    </div>
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
                                className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-2xl max-w-md mx-4"
                            >
                                <div className="relative mb-6">
                                    <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin mx-auto"></div>
                                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    AI Working...
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Please wait while we work our magic and create amazing content for you
                                </p>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}