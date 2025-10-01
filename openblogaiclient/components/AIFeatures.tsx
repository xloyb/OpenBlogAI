"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiZap, FiTarget, FiTrendingUp, FiStar, FiUsers, FiGlobe } from "react-icons/fi";

const features = [
    {
        icon: FiZap,
        title: "Instant Content Creation",
        description: "Transform YouTube videos into blog posts in under 60 seconds with our AI-powered engine",
        color: "indigo",
        stat: "60s",
        statLabel: "Average time"
    },
    {
        icon: FiTarget,
        title: "SEO Optimization",
        description: "Built-in SEO analysis and optimization for maximum search engine visibility",
        color: "emerald",
        stat: "95%",
        statLabel: "SEO Score"
    },
    {
        icon: FiTrendingUp,
        title: "Smart Analytics",
        description: "Track performance metrics and optimize your content strategy with AI insights",
        color: "amber",
        stat: "10x",
        statLabel: "Performance boost"
    },
    {
        icon: FiStar,
        title: "Quality Assurance",
        description: "Professional-grade content with grammar checking and style optimization",
        color: "purple",
        stat: "99.9%",
        statLabel: "Accuracy rate"
    },
    {
        icon: FiUsers,
        title: "Team Collaboration",
        description: "Work together with your team on content creation and review processes",
        color: "blue",
        stat: "5k+",
        statLabel: "Active teams"
    },
    {
        icon: FiGlobe,
        title: "Multi-language Support",
        description: "Create content in over 50 languages with native-level accuracy",
        color: "rose",
        stat: "50+",
        statLabel: "Languages"
    }
];

export default function AIFeatures() {
    return (
        <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 -left-64 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute bottom-1/4 -right-64 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 font-medium mb-6">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        Powered by Advanced AI
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
                        Revolutionary Features
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Experience the next generation of content creation with AI-powered tools designed to maximize your productivity and impact
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const colorClasses = {
                            indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
                            emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
                            amber: "bg-amber-100 text-amber-600 border-amber-200",
                            purple: "bg-purple-100 text-purple-600 border-purple-200",
                            blue: "bg-blue-100 text-blue-600 border-blue-200",
                            rose: "bg-rose-100 text-rose-600 border-rose-200"
                        };

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                {/* Card */}
                                <div className="relative h-full p-8 bg-white rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 ${colorClasses[feature.color as keyof typeof colorClasses]} rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <feature.icon className="w-8 h-8" />
                                    </div>

                                    {/* Content */}
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold text-slate-800 mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </div>

                                    {/* Stat */}
                                    <div className="mt-auto">
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-3xl font-bold text-slate-800">
                                                {feature.stat}
                                            </span>
                                            <span className="text-sm text-slate-500">
                                                {feature.statLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Gradient border on hover */}
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                        <span>Explore All Features</span>
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}