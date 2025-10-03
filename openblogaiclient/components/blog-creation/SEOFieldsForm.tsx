"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiTag, FiHelpCircle, FiPlus, FiX } from "react-icons/fi";
import { SEOFieldsFormData } from "../../types/blog";

interface SEOFieldsFormProps {
    onSEOFieldsChange: (seoData: SEOFieldsFormData) => void;
    initialData?: Partial<SEOFieldsFormData>;
}

export default function SEOFieldsForm({ onSEOFieldsChange, initialData = {} }: SEOFieldsFormProps) {
    const [seoTitle, setSeoTitle] = useState(initialData.seoTitle || "");
    const [seoDescription, setSeoDescription] = useState(initialData.seoDescription || "");
    const [seoKeywords, setSeoKeywords] = useState<string[]>(initialData.seoKeywords || []);
    const [seoFaq, setSeoFaq] = useState<string[]>(initialData.seoFaq || []);
    const [newKeyword, setNewKeyword] = useState("");
    const [newFaq, setNewFaq] = useState("");

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
        if (newFaq.trim() && !seoFaq.includes(newFaq.trim()) && seoFaq.length < 20) {
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-base-200 rounded-xl p-6 space-y-6"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FiSearch className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg">SEO Optimization</h3>
                    <p className="text-base-content/70 text-sm">Add SEO fields to improve search engine visibility</p>
                </div>
            </div>

            {/* SEO Title */}
            <div className="space-y-2">
                <label className="label">
                    <span className="label-text font-medium">SEO Title</span>
                    <span className="label-text-alt text-xs">
                        {seoTitle.length}/60 characters
                    </span>
                </label>
                <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => handleSeoTitleChange(e.target.value)}
                    maxLength={60}
                    placeholder="Enter a compelling SEO title (recommended: 50-60 characters)"
                    className="input input-bordered w-full"
                />
                <div className="text-xs text-base-content/60">
                    This title will appear in search engine results and browser tabs
                </div>
            </div>

            {/* SEO Description */}
            <div className="space-y-2">
                <label className="label">
                    <span className="label-text font-medium">SEO Description</span>
                    <span className="label-text-alt text-xs">
                        {seoDescription.length}/160 characters
                    </span>
                </label>
                <textarea
                    value={seoDescription}
                    onChange={(e) => handleSeoDescriptionChange(e.target.value)}
                    maxLength={160}
                    rows={3}
                    placeholder="Enter a compelling meta description (recommended: 120-160 characters)"
                    className="textarea textarea-bordered w-full"
                />
                <div className="text-xs text-base-content/60">
                    This description will appear under your title in search results
                </div>
            </div>

            {/* SEO Keywords */}
            <div className="space-y-2">
                <label className="label">
                    <span className="label-text font-medium">SEO Keywords</span>
                    <span className="label-text-alt text-xs">
                        {seoKeywords.length}/10 keywords
                    </span>
                </label>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        placeholder="Add a keyword"
                        className="input input-bordered flex-1"
                        disabled={seoKeywords.length >= 10}
                    />
                    <button
                        onClick={addKeyword}
                        disabled={!newKeyword.trim() || seoKeywords.length >= 10}
                        className="btn btn-primary"
                    >
                        <FiPlus className="w-4 h-4" />
                    </button>
                </div>

                {seoKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {seoKeywords.map((keyword, index) => (
                            <div key={index} className="badge badge-primary gap-1">
                                <FiTag className="w-3 h-3" />
                                {keyword}
                                <button
                                    onClick={() => removeKeyword(index)}
                                    className="btn btn-ghost btn-xs p-0 ml-1"
                                >
                                    <FiX className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-xs text-base-content/60">
                    Add relevant keywords that describe your content (max 10)
                </div>
            </div>

            {/* SEO FAQ */}
            <div className="space-y-2">
                <label className="label">
                    <span className="label-text font-medium">Frequently Asked Questions</span>
                    <span className="label-text-alt text-xs">
                        {seoFaq.length}/20 questions
                    </span>
                </label>

                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newFaq}
                        onChange={(e) => setNewFaq(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFaq())}
                        placeholder="Add a frequently asked question"
                        className="input input-bordered flex-1"
                        disabled={seoFaq.length >= 20}
                    />
                    <button
                        onClick={addFaq}
                        disabled={!newFaq.trim() || seoFaq.length >= 20}
                        className="btn btn-primary"
                    >
                        <FiPlus className="w-4 h-4" />
                    </button>
                </div>

                {seoFaq.length > 0 && (
                    <div className="space-y-2 mt-3">
                        {seoFaq.map((faq, index) => (
                            <div key={index} className="bg-base-100 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                    <FiHelpCircle className="w-4 h-4 text-primary shrink-0" />
                                    <span className="text-sm">{faq}</span>
                                </div>
                                <button
                                    onClick={() => removeFaq(index)}
                                    className="btn btn-ghost btn-xs"
                                >
                                    <FiX className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-xs text-base-content/60">
                    Add common questions readers might have about this topic (max 20)
                </div>
            </div>

            {/* SEO Tips */}
            <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                <h4 className="font-medium text-info mb-2">SEO Tips</h4>
                <ul className="text-xs text-base-content/70 space-y-1">
                    <li>• Use your main keyword in the SEO title</li>
                    <li>• Write a compelling meta description that encourages clicks</li>
                    <li>• Choose keywords that match your content and audience searches</li>
                    <li>• FAQ sections help with featured snippets in search results</li>
                </ul>
            </div>
        </motion.div>
    );
}