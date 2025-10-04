"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FiSearch,
    FiTag,
    FiHelpCircle,
    FiPlus,
    FiX,
    FiTrendingUp,
    FiTarget,
    FiEye,
    FiBarChart,
    FiCheckCircle,
    FiAlertCircle,
    FiInfo
} from "react-icons/fi";
import { SEOFieldsFormData } from "../../types/blog";
import { generateSmartKeywords, generateSEODescription, generateSocialTitle } from "../../lib/modern-seo";

interface ModernSEOFieldsFormProps {
    onSEOFieldsChange: (seoData: SEOFieldsFormData) => void;
    initialData?: Partial<SEOFieldsFormData>;
    blogTitle?: string;
    blogContent?: string;
}

interface SEOScore {
    score: number;
    issues: string[];
    suggestions: string[];
}

export default function ModernSEOFieldsForm({
    onSEOFieldsChange,
    initialData = {},
    blogTitle = "",
    blogContent = ""
}: ModernSEOFieldsFormProps) {
    const [seoTitle, setSeoTitle] = useState(initialData.seoTitle || "");
    const [seoDescription, setSeoDescription] = useState(initialData.seoDescription || "");
    const [seoKeywords, setSeoKeywords] = useState<string[]>(initialData.seoKeywords || []);
    const [seoFaq, setSeoFaq] = useState<string[]>(initialData.seoFaq || []);
    const [newKeyword, setNewKeyword] = useState("");
    const [newFaq, setNewFaq] = useState("");
    const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'preview'>('basic');
    const [seoScore, setSeoScore] = useState<SEOScore>({ score: 0, issues: [], suggestions: [] });


    // AI-powered SEO suggestions
    const generateAISuggestions = () => {
        if (!blogTitle || !blogContent) return;

        // Generate smart keywords
        const smartKeywords = generateSmartKeywords(blogTitle, blogContent, seoKeywords);
        setSeoKeywords(smartKeywords);

        // Generate optimized title if empty
        if (!seoTitle) {
            const optimizedTitle = generateSocialTitle(blogTitle, 55);
            setSeoTitle(optimizedTitle);
        }

        // Generate description if empty
        if (!seoDescription) {
            const optimizedDescription = generateSEODescription(blogContent, 155);
            setSeoDescription(optimizedDescription);
        }

        updateSEOData({
            seoTitle: seoTitle || generateSocialTitle(blogTitle, 55),
            seoDescription: seoDescription || generateSEODescription(blogContent, 155),
            seoKeywords: smartKeywords,
            seoFaq
        });
    };

    // Calculate SEO score
    const calculateSEOScore = useCallback((): SEOScore => {
        let score = 0;
        const issues: string[] = [];
        const suggestions: string[] = [];

        // Title checks
        if (!seoTitle) {
            issues.push("Missing SEO title");
        } else {
            if (seoTitle.length >= 30 && seoTitle.length <= 60) {
                score += 20;
            } else if (seoTitle.length < 30) {
                issues.push("SEO title too short (under 30 characters)");
                suggestions.push("Expand your title to be more descriptive");
            } else {
                issues.push("SEO title too long (over 60 characters)");
                suggestions.push("Shorten your title to avoid truncation in search results");
            }
        }

        // Description checks
        if (!seoDescription) {
            issues.push("Missing SEO description");
        } else {
            if (seoDescription.length >= 120 && seoDescription.length <= 160) {
                score += 25;
            } else if (seoDescription.length < 120) {
                issues.push("SEO description too short (under 120 characters)");
                suggestions.push("Add more detail to your description");
            } else {
                issues.push("SEO description too long (over 160 characters)");
                suggestions.push("Trim your description to avoid truncation");
            }
        }

        // Keywords checks
        if (seoKeywords.length === 0) {
            issues.push("No keywords added");
            suggestions.push("Add 3-5 relevant keywords to improve discoverability");
        } else if (seoKeywords.length >= 3 && seoKeywords.length <= 7) {
            score += 20;
        } else if (seoKeywords.length < 3) {
            suggestions.push("Add more keywords (aim for 3-5)");
        } else {
            suggestions.push("Consider reducing keywords to avoid keyword stuffing");
        }

        // FAQ checks
        if (seoFaq.length >= 3) {
            score += 15;
            suggestions.push("Great! FAQ sections help with featured snippets");
        } else if (seoFaq.length > 0) {
            score += 10;
            suggestions.push("Add more FAQ items to improve featured snippet chances");
        } else {
            suggestions.push("Add FAQ items to target featured snippets");
        }

        // Content relevance (basic check)
        if (seoTitle && blogTitle) {
            const titleWords = blogTitle.toLowerCase().split(/\s+/);
            const seoWords = seoTitle.toLowerCase().split(/\s+/);
            const overlap = titleWords.filter(word => seoWords.some(seoWord => seoWord.includes(word))).length;
            if (overlap > 0) {
                score += 10;
            } else {
                suggestions.push("Ensure SEO title relates to your blog title");
            }
        }

        // Keyword in title check
        if (seoTitle && seoKeywords.length > 0) {
            const hasKeywordInTitle = seoKeywords.some(keyword =>
                seoTitle.toLowerCase().includes(keyword.toLowerCase())
            );
            if (hasKeywordInTitle) {
                score += 10;
            } else {
                suggestions.push("Include your main keyword in the SEO title");
            }
        }

        return { score: Math.min(score, 100), issues, suggestions };
    }, [seoTitle, seoDescription, seoKeywords, seoFaq, blogTitle]);

    useEffect(() => {
        setSeoScore(calculateSEOScore());
    }, [seoTitle, seoDescription, seoKeywords, seoFaq, blogTitle, calculateSEOScore]);

    const updateSEOData = (updates: Partial<SEOFieldsFormData>) => {
        const updatedData: SEOFieldsFormData = {
            seoTitle,
            seoDescription,
            seoKeywords,
            seoFaq,
            ...updates
        };
        onSEOFieldsChange(updatedData);
    };

    const handleSeoTitleChange = (value: string) => {
        setSeoTitle(value);
        updateSEOData({ seoTitle: value });
    };

    const handleSeoDescriptionChange = (value: string) => {
        setSeoDescription(value);
        updateSEOData({ seoDescription: value });
    };

    const addKeyword = () => {
        if (newKeyword.trim() && !seoKeywords.includes(newKeyword.trim()) && seoKeywords.length < 10) {
            const updatedKeywords = [...seoKeywords, newKeyword.trim()];
            setSeoKeywords(updatedKeywords);
            updateSEOData({ seoKeywords: updatedKeywords });
            setNewKeyword("");
        }
    };

    const removeKeyword = (index: number) => {
        const updatedKeywords = seoKeywords.filter((_, i) => i !== index);
        setSeoKeywords(updatedKeywords);
        updateSEOData({ seoKeywords: updatedKeywords });
    };

    const addFaq = () => {
        if (newFaq.trim() && !seoFaq.includes(newFaq.trim()) && seoFaq.length < 10) {
            const updatedFaq = [...seoFaq, newFaq.trim()];
            setSeoFaq(updatedFaq);
            updateSEOData({ seoFaq: updatedFaq });
            setNewFaq("");
        }
    };

    const removeFaq = (index: number) => {
        const updatedFaq = seoFaq.filter((_, i) => i !== index);
        setSeoFaq(updatedFaq);
        updateSEOData({ seoFaq: updatedFaq });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden"
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-3xl" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-100/30 to-transparent rounded-full blur-2xl" />

            <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl overflow-hidden">
                <div className="p-8">
                    {/* Header with SEO Score */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
                        <div className="flex items-center gap-4">
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="relative"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                    <FiTrendingUp className="w-8 h-8 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                            </motion.div>
                            <div>
                                <motion.h3
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="font-bold text-2xl bg-gradient-to-r from-gray-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent"
                                >
                                    t SEO Optimization
                                </motion.h3>
                                <motion.p
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="text-gray-600 text-sm mt-1 flex items-center gap-2"
                                >
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                    AI-powered SEO enhancement for maximum visibility
                                </motion.p>
                            </div>
                        </div>

                        {/* Modern SEO Score Display */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="flex items-center gap-4"
                        >
                            <div className="relative">
                                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="rgb(229 231 235)"
                                        strokeWidth="2"
                                    />
                                    <motion.path
                                        d="M18 2.0845
                                        a 15.9155 15.9155 0 0 1 0 31.831
                                        a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={seoScore.score >= 80 ? 'rgb(34 197 94)' : seoScore.score >= 60 ? 'rgb(251 191 36)' : 'rgb(239 68 68)'}
                                        strokeWidth="2"
                                        strokeDasharray={`${seoScore.score}, 100`}
                                        strokeLinecap="round"
                                        initial={{ strokeDasharray: "0, 100" }}
                                        animate={{ strokeDasharray: `${seoScore.score}, 100` }}
                                        transition={{ duration: 1, delay: 0.7 }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                        className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent"
                                    >
                                        {seoScore.score}
                                    </motion.span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-semibold text-gray-700 mb-1">SEO Score</div>
                                <div className={`text-xs px-3 py-1 rounded-full font-medium ${seoScore.score >= 80
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : seoScore.score >= 60
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-red-100 text-red-700'
                                    }`}>
                                    {seoScore.score >= 80 ? '🎉 Excellent' : seoScore.score >= 60 ? '👍 Good' : '⚠️ Needs Work'}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* AI Assistant Toggle */}
                    {(blogTitle || blogContent) && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="mb-8"
                        >
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20" />
                                <button
                                    onClick={generateAISuggestions}
                                    className="relative bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    >
                                        <FiTarget className="w-5 h-5" />
                                    </motion.div>
                                    <span>Generate AI Suggestions</span>
                                    <div className="w-2 h-2 bg-white/80 rounded-full animate-pulse" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Modern Tab Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="mb-8"
                    >
                        <div className="bg-gray-100 p-2 rounded-2xl flex gap-2">
                            {[
                                { id: 'basic', label: 'Basic SEO', icon: FiSearch, color: 'from-blue-500 to-indigo-600' },
                                { id: 'advanced', label: 'Advanced', icon: FiBarChart, color: 'from-purple-500 to-pink-600' },
                                { id: 'preview', label: 'Preview', icon: FiEye, color: 'from-emerald-500 to-teal-600' }
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 flex-1 justify-center ${isActive
                                            ? 'text-white shadow-lg transform scale-105'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                                            }`}
                                        onClick={() => setActiveTab(tab.id as 'basic' | 'advanced' | 'preview')}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl`}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className="relative flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'basic' && (
                            <motion.div
                                key="basic"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {/* SEO Title */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                                                    <FiTag className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <label className="text-lg font-semibold text-gray-800">SEO Title</label>
                                                    <p className="text-sm text-gray-500">The title that appears in search results</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${seoTitle.length > 60
                                                ? 'bg-red-100 text-red-700'
                                                : seoTitle.length < 30
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {seoTitle.length}/60
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={seoTitle}
                                                onChange={(e) => handleSeoTitleChange(e.target.value)}
                                                maxLength={70}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none text-gray-800 placeholder-gray-400 ${seoTitle.length > 60
                                                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                                                    : seoTitle.length >= 30
                                                        ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                        : 'border-gray-300 focus:border-blue-500 bg-gray-50'
                                                    }`}
                                                placeholder="Enter an engaging, keyword-rich title..."
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${seoTitle.length > 60
                                                        ? 'bg-red-400'
                                                        : seoTitle.length >= 30
                                                            ? 'bg-green-400'
                                                            : 'bg-amber-400'
                                                        }`}
                                                    style={{ width: `${Math.min((seoTitle.length / 60) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                            Include your main keyword and make it compelling for clicks
                                        </div>
                                    </div>
                                </motion.div>

                                {/* SEO Description */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                                    <FiInfo className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <label className="text-lg font-semibold text-gray-800">SEO Description</label>
                                                    <p className="text-sm text-gray-500">The description that appears below your title</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${seoDescription.length > 160
                                                ? 'bg-red-100 text-red-700'
                                                : seoDescription.length < 120
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-green-100 text-green-700'
                                                }`}>
                                                {seoDescription.length}/160
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <textarea
                                                value={seoDescription}
                                                onChange={(e) => handleSeoDescriptionChange(e.target.value)}
                                                maxLength={180}
                                                rows={4}
                                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none text-gray-800 placeholder-gray-400 resize-none ${seoDescription.length > 160
                                                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                                                    : seoDescription.length >= 120
                                                        ? 'border-green-300 focus:border-green-500 bg-green-50'
                                                        : 'border-gray-300 focus:border-blue-500 bg-gray-50'
                                                    }`}
                                                placeholder="Write a compelling description that summarizes your content and includes keywords..."
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${seoDescription.length > 160
                                                        ? 'bg-red-400'
                                                        : seoDescription.length >= 120
                                                            ? 'bg-green-400'
                                                            : 'bg-amber-400'
                                                        }`}
                                                    style={{ width: `${Math.min((seoDescription.length / 160) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                            <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                                            This appears in search results - make it compelling and informative
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Keywords */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center">
                                                    <FiTag className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <label className="text-lg font-semibold text-gray-800">Keywords</label>
                                                    <p className="text-sm text-gray-500">Help people find your content</p>
                                                </div>
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${seoKeywords.length >= 3 && seoKeywords.length <= 7
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {seoKeywords.length}/10
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mb-4">
                                            <input
                                                type="text"
                                                value={newKeyword}
                                                onChange={(e) => setNewKeyword(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-emerald-500 focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 bg-gray-50"
                                                placeholder="Add a keyword..."
                                                maxLength={50}
                                            />
                                            <button
                                                type="button"
                                                onClick={addKeyword}
                                                disabled={!newKeyword.trim() || seoKeywords.length >= 10}
                                                className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                                            >
                                                <FiPlus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-3 min-h-[60px]">
                                            {seoKeywords.map((keyword, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ scale: 0, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 rounded-full border border-emerald-200 hover:shadow-md transition-all duration-300"
                                                >
                                                    <span className="font-medium">{keyword}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeKeyword(index)}
                                                        className="w-5 h-5 bg-emerald-200 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors duration-200 group-hover:bg-red-100"
                                                    >
                                                        <FiX className="w-3 h-3 text-emerald-700 group-hover:text-red-600" />
                                                    </button>
                                                </motion.div>
                                            ))}
                                            {seoKeywords.length === 0 && (
                                                <div className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-xl text-gray-500">
                                                    <div className="text-center">
                                                        <FiTag className="w-6 h-6 mx-auto mb-1 opacity-50" />
                                                        <p className="text-sm">No keywords added yet</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                                            <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                                            Add 3-5 relevant keywords that your audience might search for
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {activeTab === 'advanced' && (
                            <motion.div
                                key="advanced"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-6"
                            >
                                {/* FAQ Section */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                                                    <FiHelpCircle className="w-6 h-6 text-orange-600" />
                                                </div>
                                                <div>
                                                    <label className="text-xl font-semibold text-gray-800">FAQ Questions</label>
                                                    <p className="text-sm text-gray-500">Help your content appear in featured snippets</p>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-full text-sm font-medium ${seoFaq.length >= 3
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-amber-100 text-amber-700'
                                                }`}>
                                                {seoFaq.length}/10 Questions
                                            </div>
                                        </div>

                                        <div className="flex gap-3 mb-6">
                                            <input
                                                type="text"
                                                value={newFaq}
                                                onChange={(e) => setNewFaq(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addFaq()}
                                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-all duration-300 text-gray-800 placeholder-gray-400 bg-gray-50"
                                                placeholder="What question does your blog answer?"
                                                maxLength={200}
                                            />
                                            <button
                                                type="button"
                                                onClick={addFaq}
                                                disabled={!newFaq.trim() || seoFaq.length >= 10}
                                                className="px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-300 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
                                            >
                                                <FiPlus className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="space-y-3 min-h-[100px]">
                                            {seoFaq.map((faq, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="group bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100 hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-orange-200 to-red-200 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                            <span className="text-orange-700 font-bold text-sm">Q</span>
                                                        </div>
                                                        <div className="flex-1 text-gray-800 font-medium leading-relaxed">{faq}</div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFaq(index)}
                                                            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-lg flex items-center justify-center transition-colors duration-200 opacity-0 group-hover:opacity-100"
                                                        >
                                                            <FiX className="w-4 h-4 text-red-600" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                            {seoFaq.length === 0 && (
                                                <div className="flex items-center justify-center h-24 border-2 border-dashed border-gray-300 rounded-xl text-gray-500">
                                                    <div className="text-center">
                                                        <FiHelpCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                        <p className="text-sm">No FAQ questions added yet</p>
                                                        <p className="text-xs text-gray-400">Add questions to improve search visibility</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                            <div className="flex items-center gap-2 text-blue-700">
                                                <div className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold">!</span>
                                                </div>
                                                <p className="text-sm font-medium">Pro Tip</p>
                                            </div>
                                            <p className="text-sm text-blue-600 mt-1">FAQ sections help your content appear in Google&apos;s featured snippets, increasing visibility and click-through rates.</p>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* SEO Analysis */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center">
                                                <FiBarChart className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold text-gray-800">SEO Analysis</h4>
                                                <p className="text-sm text-gray-500">Real-time optimization feedback</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* Success Message */}
                                            {seoScore.score >= 80 && (
                                                <motion.div
                                                    initial={{ scale: 0.95, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <div>
                                                            <h5 className="font-semibold text-green-800">Excellent Optimization!</h5>
                                                            <p className="text-sm text-green-600">Your SEO setup looks fantastic and ready to rank well.</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Issues */}
                                            {seoScore.issues.length > 0 && (
                                                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                                                            <FiAlertCircle className="w-4 h-4 text-red-600" />
                                                        </div>
                                                        <h5 className="font-semibold text-red-800">Issues to Fix ({seoScore.issues.length})</h5>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {seoScore.issues.map((issue, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="flex items-center gap-3 text-sm text-red-700 bg-red-100/50 rounded-lg p-3"
                                                            >
                                                                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                                                                <span>{issue}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Suggestions */}
                                            {seoScore.suggestions.length > 0 && (
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <FiTarget className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <h5 className="font-semibold text-blue-800">Suggestions ({seoScore.suggestions.length})</h5>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {seoScore.suggestions.map((suggestion, index) => (
                                                            <motion.div
                                                                key={index}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: index * 0.1 }}
                                                                className="flex items-center gap-3 text-sm text-blue-700 bg-blue-100/50 rounded-lg p-3"
                                                            >
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                                <span>{suggestion}</span>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Empty State */}
                                            {seoScore.issues.length === 0 && seoScore.suggestions.length === 0 && seoScore.score < 80 && (
                                                <div className="text-center py-8">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                        <FiBarChart className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <p className="text-gray-500">Fill out the SEO fields to see your analysis</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}

                        {activeTab === 'preview' && (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="space-y-8"
                            >
                                {/* Search Result Preview */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.1 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center">
                                                <FiSearch className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold text-gray-800">Google Search Preview</h4>
                                                <p className="text-sm text-gray-500">How your blog will appear in search results</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 shadow-inner">
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                                className="space-y-2"
                                            >
                                                <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                                    <div className="w-4 h-4 bg-green-100 rounded-sm flex items-center justify-center">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                                    </div>
                                                    openblogai.com › blogs › your-blog
                                                </div>
                                                <h3 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer transition-colors duration-200">
                                                    {seoTitle || "Your SEO Title Will Appear Here - Make It Compelling!"}
                                                </h3>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {seoDescription || "Your SEO description will appear here. Write a compelling summary that encourages clicks from search results and includes your target keywords naturally."}
                                                </p>
                                                {seoKeywords.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {seoKeywords.slice(0, 4).map((keyword, index) => (
                                                            <motion.span
                                                                key={index}
                                                                initial={{ scale: 0 }}
                                                                animate={{ scale: 1 }}
                                                                transition={{ delay: 0.5 + index * 0.1 }}
                                                                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
                                                            >
                                                                {keyword}
                                                            </motion.span>
                                                        ))}
                                                    </div>
                                                )}
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Social Media Preview */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
                                                <FiEye className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold text-gray-800">Social Media Preview</h4>
                                                <p className="text-sm text-gray-500">How your blog will look when shared</p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-200 max-w-md mx-auto shadow-inner">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.4 }}
                                                className="space-y-3"
                                            >
                                                <div className="relative w-full h-40 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-lg overflow-hidden">
                                                    <div className="absolute inset-0 bg-black/20" />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <div className="text-center text-white">
                                                            <h2 className="text-2xl font-bold mb-2">OpenBlogAI</h2>
                                                            <p className="text-sm opacity-90">AI-Powered Content Creation</p>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-white rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="font-bold text-gray-900 leading-tight">
                                                        {seoTitle || "Your Amazing Blog Title"}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm leading-relaxed">
                                                        {seoDescription?.substring(0, 120) || "Your engaging blog description will appear here when shared on social media platforms..."}
                                                        {seoDescription && seoDescription.length > 120 && "..."}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                                        <div className="text-xs text-gray-500 font-medium">openblogai.com</div>
                                                        <div className="text-xs text-gray-400">Blog • AI Content</div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Mobile Preview */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center">
                                                <div className="w-6 h-6 border-2 border-amber-600 rounded-md flex items-center justify-center">
                                                    <div className="w-2 h-3 bg-amber-600 rounded-sm" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold text-gray-800">Mobile Preview</h4>
                                                <p className="text-sm text-gray-500">How it looks on mobile devices</p>
                                            </div>
                                        </div>

                                        <div className="max-w-xs mx-auto">
                                            <div className="bg-black rounded-3xl p-1 shadow-2xl">
                                                <div className="bg-white rounded-[20px] overflow-hidden">
                                                    <div className="bg-gray-900 h-6 flex items-center justify-center">
                                                        <div className="w-16 h-1 bg-white rounded-full" />
                                                    </div>
                                                    <div className="p-4 space-y-3">
                                                        <div className="text-xs text-green-600 font-medium">openblogai.com</div>
                                                        <h3 className="text-blue-600 text-sm font-medium leading-tight">
                                                            {seoTitle || "Your SEO Title"}
                                                        </h3>
                                                        <p className="text-gray-700 text-xs leading-relaxed">
                                                            {seoDescription?.substring(0, 80) || "Your description..."}
                                                            {seoDescription && seoDescription.length > 80 && "..."}
                                                        </p>
                                                        {seoKeywords.length > 0 && (
                                                            <div className="flex flex-wrap gap-1">
                                                                {seoKeywords.slice(0, 2).map((keyword, index) => (
                                                                    <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                                        {keyword}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}