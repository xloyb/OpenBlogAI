"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiStar, FiZap, FiTrendingUp, FiHeart } from 'react-icons/fi';

export default function ModernShowcasePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-6">
                            <FiStar className="w-4 h-4" />
                            Modern Design System
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                            OpenBlogAI
                        </h1>
                        <p className="text-xl text-base-content/70 max-w-2xl mx-auto mb-8">
                            Experience the future of blogging with our modern, elegant design system powered by AI
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all duration-300 animate-glow">
                                <FiZap className="w-5 h-5" />
                                Get Started
                            </button>
                            <button className="btn btn-outline btn-lg">
                                Learn More
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-base-content mb-4">Modern Features</h2>
                    <p className="text-lg text-base-content/70">Built with the latest design principles</p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        {
                            icon: FiZap,
                            title: "Lightning Fast",
                            description: "Optimized performance with modern technologies",
                            color: "text-primary"
                        },
                        {
                            icon: FiTrendingUp,
                            title: "AI Powered",
                            description: "Smart content generation and optimization",
                            color: "text-secondary"
                        },
                        {
                            icon: FiHeart,
                            title: "User Friendly",
                            description: "Intuitive interface designed for creators",
                            color: "text-accent"
                        }
                    ].map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                            className="group"
                        >
                            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-300 hover:border-primary/20 animate-float">
                                <div className="card-body items-center text-center">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={`w-8 h-8 ${feature.color}`} />
                                    </div>
                                    <h3 className="card-title text-xl mb-2">{feature.title}</h3>
                                    <p className="text-base-content/70">{feature.description}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Showcase Cards */}
            <div className="max-w-7xl mx-auto px-4 py-20">
                <div className="grid lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="space-y-6"
                    >
                        <div className="glass-card p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20">
                            <h3 className="text-2xl font-bold mb-4">Glass Morphism</h3>
                            <p className="text-base-content/70 mb-6">Beautiful glassmorphism effects with modern blur and transparency</p>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                                <div className="w-3 h-3 rounded-full bg-accent"></div>
                            </div>
                        </div>

                        <div className="alert alert-info shadow-lg">
                            <FiStar className="w-6 h-6" />
                            <div>
                                <h4 className="font-bold">Modern Alerts</h4>
                                <div className="text-sm">Clean and elegant notification system</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-xl">
                            <div className="card-body">
                                <h3 className="card-title text-2xl">Gradient Cards</h3>
                                <p>Stunning gradient backgrounds with perfect contrast</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-ghost btn-sm text-white hover:bg-white/20">
                                        Explore
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="stats shadow-lg">
                            <div className="stat">
                                <div className="stat-figure text-primary">
                                    <FiTrendingUp className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Performance</div>
                                <div className="stat-value text-primary">98%</div>
                                <div className="stat-desc">Modern & Fast</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-primary to-secondary py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="max-w-4xl mx-auto text-center px-4"
                >
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Create?</h2>
                    <p className="text-xl text-white/90 mb-8">Start your blogging journey with our modern platform</p>
                    <button className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary transition-all duration-300">
                        <FiZap className="w-5 h-5" />
                        Start Creating
                    </button>
                </motion.div>
            </div>

            <style jsx>{`
                .glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
                    backdrop-filter: blur(10px);
                    -webkit-backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.18);
                }
            `}</style>
        </div>
    );
}