"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiStar, FiUser } from "react-icons/fi";

const testimonials = [
    {
        name: "Sarah Chen",
        role: "Content Marketing Manager",
        company: "TechFlow Inc.",
        content: "OpenBlog AI has revolutionized our content creation process. What used to take hours now takes minutes, and the quality is consistently excellent.",
        rating: 5,
        avatar: "SC"
    },
    {
        name: "Marcus Rodriguez",
        role: "Digital Creator",
        company: "Independent",
        content: "As a solopreneur, this tool is a game-changer. I can now scale my content production without compromising on quality or spending endless hours writing.",
        rating: 5,
        avatar: "MR"
    },
    {
        name: "Emily Watson",
        role: "SEO Specialist",
        company: "Growth Labs",
        content: "The SEO optimization features are incredible. Our blog posts now rank higher and drive significantly more organic traffic than before.",
        rating: 5,
        avatar: "EW"
    },
    {
        name: "David Kim",
        role: "Startup Founder",
        company: "InnovateTech",
        content: "OpenBlog AI helped us establish thought leadership in our industry. The AI-generated content is indistinguishable from human-written articles.",
        rating: 5,
        avatar: "DK"
    },
    {
        name: "Rachel Adams",
        role: "Marketing Director",
        company: "CloudSync",
        content: "The time savings are unbelievable. We've increased our content output by 400% while maintaining high quality standards across all our blogs.",
        rating: 5,
        avatar: "RA"
    },
    {
        name: "James Wilson",
        role: "Content Strategist",
        company: "MediaBoost",
        content: "The analytics and insights provided by OpenBlog AI have helped us understand our audience better and create more engaging content.",
        rating: 5,
        avatar: "JW"
    }
];

export default function Testimonials() {
    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full text-amber-700 font-medium mb-6">
                        <FiStar className="w-4 h-4" />
                        Loved by Creators Worldwide
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
                        What Our Users Say
                    </h2>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                        Join thousands of content creators who have transformed their workflow with OpenBlog AI
                    </p>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
                >
                    <div className="text-center">
                        <div className="text-4xl font-bold text-slate-800 mb-2">4.9/5</div>
                        <div className="flex justify-center mb-2">
                            {[...Array(5)].map((_, i) => (
                                <FiStar key={i} className="w-5 h-5 text-amber-400 fill-current" />
                            ))}
                        </div>
                        <p className="text-slate-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-slate-800 mb-2">50k+</div>
                        <p className="text-slate-600">Happy Users</p>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-slate-800 mb-2">1M+</div>
                        <p className="text-slate-600">Blogs Created</p>
                    </div>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative"
                        >
                            <div className="h-full p-8 bg-gradient-to-br from-white to-slate-50 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                {/* Stars */}
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <FiStar key={i} className="w-5 h-5 text-amber-400 fill-current" />
                                    ))}
                                </div>

                                {/* Content */}
                                <blockquote className="text-slate-600 mb-6 leading-relaxed">
                                    &ldquo;{testimonial.content}&rdquo;
                                </blockquote>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {testimonial.role} at {testimonial.company}
                                        </div>
                                    </div>
                                </div>

                                {/* Quote mark decoration */}
                                <div className="absolute top-6 right-6 text-slate-200 group-hover:text-indigo-200 transition-colors duration-300">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 32 32">
                                        <path d="M10 8v8c0 2.2-1.8 4-4 4v4c4.4 0 8-3.6 8-8V8h-4zm12 0v8c0 2.2-1.8 4-4 4v4c4.4 0 8-3.6 8-8V8h-4z" />
                                    </svg>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="text-center mt-20"
                >
                    <p className="text-slate-600 mb-6">Ready to join thousands of satisfied users?</p>
                    <button className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <FiUser className="w-5 h-5" />
                        Start Your Free Trial
                    </button>
                </motion.div>
            </div>
        </section>
    );
}