"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiCpu, FiArrowRight, FiArrowLeft, FiZap, FiDollarSign, FiInfo, FiLoader } from "react-icons/fi";
import { blogAPI } from "../../lib/blog-api";

interface ModelSelectionProps {
    onModelSelect: (selectedModel: string) => void;
    onNext: () => void;
    onPrev: () => void;
    selectedModel?: string;
}

interface AIModel {
    id: string;
    name: string;
    description: string;
    icon: string;
    features: string[];
    performance: {
        speed: number; // 1-5 rating
        quality: number; // 1-5 rating
        cost: number; // 1-5 rating (lower is cheaper)
    };
    bestFor: string[];
    maxTokens: number;
    provider: string;
}

// Static model enhancements for better UI display
const MODEL_ENHANCEMENTS: Record<string, Partial<AIModel>> = {
    "mistral-7b-instruct": {
        icon: "⚡",
        features: ["Fast", "Efficient", "Good Quality", "Free"],
        performance: { speed: 5, quality: 4, cost: 1 },
        bestFor: ["Quick Content", "General Writing", "Summaries", "FAQs"]
    },
    "mixtral-8x7b-instruct": {
        icon: "🎯",
        features: ["High Quality", "Balanced", "Versatile", "Free"],
        performance: { speed: 4, quality: 4, cost: 1 },
        bestFor: ["Technical Content", "Long Articles", "Analysis", "Documentation"]
    },
    "llama-3.1-8b-instruct": {
        icon: "�",
        features: ["Meta AI", "Open Source", "Reliable", "Free"],
        performance: { speed: 4, quality: 4, cost: 1 },
        bestFor: ["General Content", "Educational", "Creative Writing", "Tutorials"]
    },
    "llama-3.1-70b-instruct": {
        icon: "🚀",
        features: ["Most Advanced", "High Quality", "Complex Reasoning", "Free"],
        performance: { speed: 3, quality: 5, cost: 1 },
        bestFor: ["Complex Analysis", "Research", "Technical Writing", "Academic Content"]
    },
    "gemma-2-9b-it": {
        icon: "💎",
        features: ["Google AI", "Efficient", "Balanced", "Free"],
        performance: { speed: 4, quality: 4, cost: 1 },
        bestFor: ["General Content", "News Articles", "Blog Posts", "Social Media"]
    },
    "qwen-2-7b-instruct": {
        icon: "🌟",
        features: ["Multilingual", "Efficient", "Good Quality", "Free"],
        performance: { speed: 5, quality: 4, cost: 1 },
        bestFor: ["Multilingual Content", "Quick Tasks", "Summaries", "Q&A"]
    },
    "phi-3-mini-128k-instruct": {
        icon: "�",
        features: ["Microsoft", "Large Context", "Efficient", "Free"],
        performance: { speed: 4, quality: 4, cost: 1 },
        bestFor: ["Long Documents", "Code Analysis", "Research", "Documentation"]
    },
    "hermes-2-pro-mistral-7b": {
        icon: "✨",
        features: ["Optimized", "Creative", "Instruction Following", "Free"],
        performance: { speed: 4, quality: 4, cost: 1 },
        bestFor: ["Creative Writing", "Instructions", "Tutorials", "Conversational"]
    }
};

export default function ModelSelection({ onModelSelect, onNext, onPrev, selectedModel }: ModelSelectionProps) {
    const [selected, setSelected] = useState(selectedModel || "");
    const [showDetails, setShowDetails] = useState<string | null>(null);
    const [availableModels, setAvailableModels] = useState<AIModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch available models on component mount
    useEffect(() => {
        const fetchModels = async () => {
            try {
                setLoading(true);
                const models = await blogAPI.getAvailableModels();

                // Transform server models to UI models with enhancements
                const transformedModels: AIModel[] = models.map(model => {
                    const enhancement = MODEL_ENHANCEMENTS[model.id] || {};
                    return {
                        id: model.id,
                        name: model.name,
                        description: model.description,
                        maxTokens: model.maxTokens,
                        provider: model.provider,
                        icon: enhancement.icon || "🤖",
                        features: enhancement.features || ["AI Model", "Text Generation", "Free"],
                        performance: enhancement.performance || { speed: 3, quality: 3, cost: 1 },
                        bestFor: enhancement.bestFor || ["General Content", "Text Generation"]
                    };
                });

                setAvailableModels(transformedModels);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch models:', err);
                setError('Failed to load available models. Please try again.');
                // Fallback to a default model
                setAvailableModels([]);
            } finally {
                setLoading(false);
            }
        };

        fetchModels();
    }, []);

    const handleModelSelect = (modelId: string) => {
        setSelected(modelId);
        onModelSelect(modelId);
    };

    const handleNext = () => {
        if (selected) {
            onNext();
        }
    };

    const renderPerformanceBar = (value: number, max: number = 5) => {
        return (
            <div className="flex gap-1">
                {Array.from({ length: max }, (_, i) => (
                    <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${i < value ? "bg-primary" : "bg-base-300"
                            }`}
                    />
                ))}
            </div>
        );
    };

    const getCostLabel = (cost: number) => {
        const labels = ["Very Low", "Low", "Medium", "High", "Very High"];
        return labels[cost - 1];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCpu className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Select AI Model</h2>
                <p className="text-base-content/70">
                    Choose the AI model that best fits your content needs and budget
                </p>
            </motion.div>

            {/* Loading State */}
            {loading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                >
                    <FiLoader className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p className="text-base-content/70">Loading available models...</p>
                </motion.div>
            )}

            {/* Error State */}
            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="alert alert-error"
                >
                    <FiInfo className="w-5 h-5" />
                    <span>{error}</span>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-sm btn-outline"
                    >
                        Retry
                    </button>
                </motion.div>
            )}

            {/* Model Grid */}
            {!loading && !error && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {availableModels.map((model, index) => (
                        <motion.div
                            key={model.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            className={`
              card bg-base-100 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl
              ${selected === model.id ? "ring-2 ring-primary shadow-primary/20" : ""}
            `}
                            onClick={() => handleModelSelect(model.id)}
                        >
                            <div className="card-body p-4">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{model.icon}</span>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-sm">{model.name}</h3>
                                        <p className="text-xs text-base-content/70 line-clamp-2">
                                            {model.description}
                                        </p>
                                    </div>
                                    {selected === model.id && (
                                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <FiZap className="w-3 h-3 text-primary-content" />
                                        </div>
                                    )}
                                </div>

                                {/* Performance Metrics */}
                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1">
                                            <FiZap className="w-3 h-3" />
                                            Speed
                                        </span>
                                        {renderPerformanceBar(model.performance.speed)}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1">
                                            <FiCpu className="w-3 h-3" />
                                            Quality
                                        </span>
                                        {renderPerformanceBar(model.performance.quality)}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1">
                                            <FiDollarSign className="w-3 h-3" />
                                            Cost
                                        </span>
                                        <span className="text-xs">{getCostLabel(model.performance.cost)}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {model.features.slice(0, 2).map((feature) => (
                                        <div key={feature} className="badge badge-sm badge-ghost">
                                            {feature}
                                        </div>
                                    ))}
                                    {model.features.length > 2 && (
                                        <div className="badge badge-sm badge-outline">
                                            +{model.features.length - 2}
                                        </div>
                                    )}
                                </div>

                                {/* Details Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDetails(showDetails === model.id ? null : model.id);
                                    }}
                                    className="btn btn-xs btn-ghost gap-1 self-start"
                                >
                                    <FiInfo className="w-3 h-3" />
                                    Details
                                </button>

                                {/* Expanded Details */}
                                {showDetails === model.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 pt-3 border-t border-base-300"
                                    >
                                        <div className="space-y-2 text-xs">
                                            <div>
                                                <span className="font-medium">Best for:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {model.bestFor.map((use) => (
                                                        <div key={use} className="badge badge-xs badge-primary badge-outline">
                                                            {use}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Max Tokens:</span>
                                                <span>{model.maxTokens}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Provider:</span>
                                                <span>{model.provider}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Selected Model Summary */}
            {selected && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="alert alert-info"
                >
                    <FiInfo className="w-5 h-5" />
                    <div>
                        <h4 className="font-bold">Selected: {availableModels.find(m => m.id === selected)?.name}</h4>
                        <p className="text-sm">{availableModels.find(m => m.id === selected)?.description}</p>
                    </div>
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
                    disabled={!selected}
                    className="btn btn-primary btn-lg gap-2"
                >
                    Generate Blog
                    <FiArrowRight className="w-5 h-5" />
                </button>
            </motion.div>
        </div>
    );
}