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

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-success";
        if (score >= 60) return "text-warning";
        return "text-error";
    };



    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card bg-base-100 border border-base-300 shadow-lg"
        >
            <div className="card-body">
                {/* Header with SEO Score */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <FiTrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl">Modern SEO Optimization</h3>
                            <p className="text-base-content/70 text-sm">AI-powered SEO enhancement for maximum visibility</p>
                        </div>
                    </div>

                    {/* SEO Score Badge */}
                    <div className="flex items-center gap-2">
                        <div className={`radial-progress ${getScoreColor(seoScore.score)}`}
                            style={{ "--value": seoScore.score, "--size": "3rem" } as React.CSSProperties}>
                            <span className="text-sm font-bold">{seoScore.score}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium">SEO Score</div>
                            <div className={`text-xs ${getScoreColor(seoScore.score)}`}>
                                {seoScore.score >= 80 ? 'Excellent' : seoScore.score >= 60 ? 'Good' : 'Needs Work'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Assistant Toggle */}
                {(blogTitle || blogContent) && (
                    <div className="mb-4">
                        <button
                            onClick={generateAISuggestions}
                            className="btn btn-outline btn-primary btn-sm gap-2"
                        >
                            <FiTarget className="w-4 h-4" />
                            Generate AI Suggestions
                        </button>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="tabs tabs-boxed mb-6">
                    <button
                        className={`tab ${activeTab === 'basic' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('basic')}
                    >
                        <FiSearch className="w-4 h-4 mr-2" />
                        Basic SEO
                    </button>
                    <button
                        className={`tab ${activeTab === 'advanced' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('advanced')}
                    >
                        <FiBarChart className="w-4 h-4 mr-2" />
                        Advanced
                    </button>
                    <button
                        className={`tab ${activeTab === 'preview' ? 'tab-active' : ''}`}
                        onClick={() => setActiveTab('preview')}
                    >
                        <FiEye className="w-4 h-4 mr-2" />
                        Preview
                    </button>
                </div>

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
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-2">
                                        <FiTag className="w-4 h-4" />
                                        SEO Title
                                    </span>
                                    <span className={`label-text-alt text-xs ${seoTitle.length > 60 ? 'text-error' :
                                            seoTitle.length < 30 ? 'text-warning' : 'text-success'
                                        }`}>
                                        {seoTitle.length}/60 characters
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    value={seoTitle}
                                    onChange={(e) => handleSeoTitleChange(e.target.value)}
                                    maxLength={70}
                                    className={`input input-bordered ${seoTitle.length > 60 ? 'input-error' :
                                            seoTitle.length >= 30 ? 'input-success' : ''
                                        }`}
                                    placeholder="Enter an engaging, keyword-rich title..."
                                />
                                <label className="label">
                                    <span className="label-text-alt text-xs text-base-content/60">
                                        💡 Include your main keyword and make it compelling for clicks
                                    </span>
                                </label>
                            </div>

                            {/* SEO Description */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-2">
                                        <FiInfo className="w-4 h-4" />
                                        SEO Description
                                    </span>
                                    <span className={`label-text-alt text-xs ${seoDescription.length > 160 ? 'text-error' :
                                            seoDescription.length < 120 ? 'text-warning' : 'text-success'
                                        }`}>
                                        {seoDescription.length}/160 characters
                                    </span>
                                </label>
                                <textarea
                                    value={seoDescription}
                                    onChange={(e) => handleSeoDescriptionChange(e.target.value)}
                                    maxLength={180}
                                    rows={3}
                                    className={`textarea textarea-bordered ${seoDescription.length > 160 ? 'textarea-error' :
                                            seoDescription.length >= 120 ? 'textarea-success' : ''
                                        }`}
                                    placeholder="Write a compelling description that summarizes your content and includes keywords..."
                                />
                                <label className="label">
                                    <span className="label-text-alt text-xs text-base-content/60">
                                        📖 This appears in search results - make it compelling and informative
                                    </span>
                                </label>
                            </div>

                            {/* Keywords */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-2">
                                        <FiTag className="w-4 h-4" />
                                        Keywords ({seoKeywords.length}/10)
                                    </span>
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newKeyword}
                                        onChange={(e) => setNewKeyword(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                                        className="input input-bordered flex-1"
                                        placeholder="Add a keyword..."
                                        maxLength={50}
                                    />
                                    <button
                                        type="button"
                                        onClick={addKeyword}
                                        disabled={!newKeyword.trim() || seoKeywords.length >= 10}
                                        className="btn btn-primary"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {seoKeywords.map((keyword, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="badge badge-primary gap-1 p-3"
                                        >
                                            {keyword}
                                            <button
                                                type="button"
                                                onClick={() => removeKeyword(index)}
                                                className="hover:text-error"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                <label className="label">
                                    <span className="label-text-alt text-xs text-base-content/60">
                                        🎯 Add 3-5 relevant keywords that your audience might search for
                                    </span>
                                </label>
                            </div>
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
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium flex items-center gap-2">
                                        <FiHelpCircle className="w-4 h-4" />
                                        FAQ Questions ({seoFaq.length}/10)
                                    </span>
                                </label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newFaq}
                                        onChange={(e) => setNewFaq(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addFaq()}
                                        className="input input-bordered flex-1"
                                        placeholder="What question does your blog answer?"
                                        maxLength={200}
                                    />
                                    <button
                                        type="button"
                                        onClick={addFaq}
                                        disabled={!newFaq.trim() || seoFaq.length >= 10}
                                        className="btn btn-secondary"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {seoFaq.map((faq, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex items-center gap-2 p-3 bg-base-200 rounded-lg"
                                        >
                                            <FiHelpCircle className="w-4 h-4 text-secondary flex-shrink-0" />
                                            <span className="flex-1 text-sm">{faq}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeFaq(index)}
                                                className="btn btn-ghost btn-xs text-error"
                                            >
                                                <FiX className="w-3 h-3" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                                <label className="label">
                                    <span className="label-text-alt text-xs text-base-content/60">
                                        ❓ FAQ sections help your content appear in featured snippets
                                    </span>
                                </label>
                            </div>

                            {/* SEO Analysis */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h4 className="card-title text-lg flex items-center gap-2">
                                        <FiBarChart className="w-5 h-5" />
                                        SEO Analysis
                                    </h4>

                                    {/* Issues */}
                                    {seoScore.issues.length > 0 && (
                                        <div className="space-y-2">
                                            <h5 className="font-medium text-error flex items-center gap-2">
                                                <FiAlertCircle className="w-4 h-4" />
                                                Issues to Fix ({seoScore.issues.length})
                                            </h5>
                                            <ul className="list-disc list-inside space-y-1 text-sm text-base-content/80">
                                                {seoScore.issues.map((issue, index) => (
                                                    <li key={index}>{issue}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Suggestions */}
                                    {seoScore.suggestions.length > 0 && (
                                        <div className="space-y-2">
                                            <h5 className="font-medium text-info flex items-center gap-2">
                                                <FiCheckCircle className="w-4 h-4" />
                                                Suggestions ({seoScore.suggestions.length})
                                            </h5>
                                            <ul className="list-disc list-inside space-y-1 text-sm text-base-content/80">
                                                {seoScore.suggestions.map((suggestion, index) => (
                                                    <li key={index}>{suggestion}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {seoScore.score >= 80 && (
                                        <div className="alert alert-success">
                                            <FiCheckCircle className="w-5 h-5" />
                                            <span>Excellent! Your SEO optimization looks great.</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'preview' && (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6"
                        >
                            {/* Search Result Preview */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h4 className="card-title text-lg mb-4">Search Result Preview</h4>
                                    <div className="bg-white p-4 rounded-lg border">
                                        <div className="text-xs text-green-600 mb-1">openblogai.com › blogs</div>
                                        <h3 className="text-blue-600 text-lg hover:underline cursor-pointer mb-1">
                                            {seoTitle || "Your SEO Title Here"}
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            {seoDescription || "Your SEO description will appear here. Make it compelling to encourage clicks from search results."}
                                        </p>
                                        {seoKeywords.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {seoKeywords.slice(0, 3).map((keyword, index) => (
                                                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Social Media Preview */}
                            <div className="card bg-base-200">
                                <div className="card-body">
                                    <h4 className="card-title text-lg mb-4">Social Media Preview</h4>
                                    <div className="bg-white p-4 rounded-lg border max-w-md">
                                        <div className="w-full h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-3 flex items-center justify-center text-white font-bold">
                                            OpenBlogAI
                                        </div>
                                        <h3 className="font-bold text-gray-900 mb-1">
                                            {seoTitle || "Your Blog Title"}
                                        </h3>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {seoDescription?.substring(0, 100) || "Your blog description..."}
                                        </p>
                                        <div className="text-xs text-gray-500">openblogai.com</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}