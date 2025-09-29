"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPalette, FiSettings, FiEye, FiHeart } from 'react-icons/fi';
import ThemeSelector from '../../../components/ThemeSelector';

export default function ThemeSettingsPage() {
    const [showPreview, setShowPreview] = useState(false);

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                            <FiPalette className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-base-content">
                            Theme Settings
                        </h1>
                    </div>
                    <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
                        Customize your experience with our collection of beautiful themes.
                        Choose from professional, colorful, and dark themes to match your style.
                    </p>
                </motion.div>

                {/* Theme Statistics */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    <div className="stat bg-base-100 rounded-2xl shadow-lg">
                        <div className="stat-figure text-primary">
                            <FiPalette className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Total Themes</div>
                        <div className="stat-value text-primary">30+</div>
                        <div className="stat-desc">Available options</div>
                    </div>

                    <div className="stat bg-base-100 rounded-2xl shadow-lg">
                        <div className="stat-figure text-secondary">
                            <FiSettings className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Categories</div>
                        <div className="stat-value text-secondary">5</div>
                        <div className="stat-desc">Theme categories</div>
                    </div>

                    <div className="stat bg-base-100 rounded-2xl shadow-lg">
                        <div className="stat-figure text-accent">
                            <FiEye className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Preview</div>
                        <div className="stat-value text-accent">Live</div>
                        <div className="stat-desc">Real-time preview</div>
                    </div>

                    <div className="stat bg-base-100 rounded-2xl shadow-lg">
                        <div className="stat-figure text-success">
                            <FiHeart className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Custom</div>
                        <div className="stat-value text-success">2</div>
                        <div className="stat-desc">Brand themes</div>
                    </div>
                </motion.div>

                {/* Theme Information Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="card bg-base-100 shadow-xl"
                    >
                        <div className="card-body">
                            <h3 className="card-title text-primary">
                                <FiSettings className="w-5 h-5" />
                                Easy Switching
                            </h3>
                            <p className="text-base-content/70">
                                Switch between themes instantly with live preview.
                                Your preference is saved automatically.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card bg-base-100 shadow-xl"
                    >
                        <div className="card-body">
                            <h3 className="card-title text-secondary">
                                <FiPalette className="w-5 h-5" />
                                Rich Collection
                            </h3>
                            <p className="text-base-content/70">
                                From professional corporate themes to vibrant colorful options,
                                find the perfect match for your taste.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="card bg-base-100 shadow-xl"
                    >
                        <div className="card-body">
                            <h3 className="card-title text-accent">
                                <FiEye className="w-5 h-5" />
                                Live Preview
                            </h3>
                            <p className="text-base-content/70">
                                Hover over any theme to see how it looks.
                                No need to apply first - preview before you decide.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Main Theme Selector */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <ThemeSelector />
                </motion.div>

                {/* Tips and Tricks */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="card bg-base-100 shadow-xl"
                >
                    <div className="card-body">
                        <h3 className="card-title mb-4">
                            <FiSettings className="w-5 h-5" />
                            Tips & Tricks
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <h4 className="font-semibold text-primary">Quick Toggle</h4>
                                <p className="text-sm text-base-content/70">
                                    Use the sun/moon icon to quickly switch between light and dark variants.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-secondary">Preview Mode</h4>
                                <p className="text-sm text-base-content/70">
                                    Hover over theme cards to preview them without applying permanently.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-accent">Category Filter</h4>
                                <p className="text-sm text-base-content/70">
                                    Use category buttons to narrow down themes by type or style.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold text-success">Auto-Save</h4>
                                <p className="text-sm text-base-content/70">
                                    Your theme preference is automatically saved and will persist across sessions.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}