"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiYoutube, FiZap, FiEdit, FiShare2 } from "react-icons/fi";

const steps = [
    {
        icon: FiYoutube,
        title: "Paste YouTube URL",
        description: "Simply paste any YouTube video URL into our intuitive interface",
        color: "red",
        number: "01"
    },
    {
        icon: FiZap,
        title: "AI Analysis",
        description: "Our advanced AI analyzes the video content and generates structured blog content",
        color: "indigo",
        number: "02"
    },
    {
        icon: FiEdit,
        title: "Review & Edit",
        description: "Fine-tune the generated content with our powerful editor and customization tools",
        color: "emerald",
        number: "03"
    },
    {
        icon: FiShare2,
        title: "Publish & Share",
        description: "Export your blog post and share it across your platforms with one click",
        color: "purple",
        number: "04"
    }
];

export default function HowItWorks() {
    return (
        <section className="py-32 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
                <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 rounded-full text-purple-700 font-medium mb-6">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        Simple 4-Step Process
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
                        How It Works
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Transform YouTube videos into professional blog posts in just a few simple steps
                    </p>
                </motion.div>

                {/* Steps */}
                <div className="relative">
                    {/* Connection line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent transform -translate-y-1/2 hidden lg:block"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
                        {steps.map((step, index) => {
                            const colorClasses = {
                                red: "bg-red-100 text-red-600 border-red-200",
                                indigo: "bg-indigo-100 text-indigo-600 border-indigo-200",
                                emerald: "bg-emerald-100 text-emerald-600 border-emerald-200",
                                purple: "bg-purple-100 text-purple-600 border-purple-200"
                            };

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    viewport={{ once: true }}
                                    className="relative group"
                                >
                                    {/* Step card */}
                                    <div className="relative p-8 bg-white rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 text-center">
                                        {/* Step number */}
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-bold rounded-full flex items-center justify-center">
                                                {step.number}
                                            </div>
                                        </div>

                                        {/* Icon */}
                                        <div className={`inline-flex items-center justify-center w-20 h-20 ${colorClasses[step.color as keyof typeof colorClasses]} rounded-3xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                            <step.icon className="w-10 h-10" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-slate-800 mb-4">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-600 leading-relaxed">
                                            {step.description}
                                        </p>

                                        {/* Glow effect */}
                                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    {/* Arrow for desktop */}
                                    {index < steps.length - 1 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                            <div className="w-4 h-4 bg-white border-2 border-slate-300 rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <p className="text-slate-600 mb-8 text-lg">
                        Ready to create your first AI-powered blog post?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                            <div className="flex items-center gap-2">
                                <FiYoutube className="w-5 h-5" />
                                Try It Now - Free
                                <FiZap className="w-4 h-4 group-hover:animate-bounce" />
                            </div>
                        </button>
                        <button className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg">
                            Watch Demo Video
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}