"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiUser, FiClock, FiTag } from "react-icons/fi";

interface BlogCardProps {
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    tags: string[];
    imageUrl?: string;
    index: number;
}

export default function BlogCard({
    title,
    excerpt,
    author,
    date,
    readTime,
    tags,
    imageUrl,
    index
}: BlogCardProps) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-100 hover:border-indigo-200"
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-indigo-300">
                            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* AI Badge */}
                <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm text-indigo-600 font-medium text-sm rounded-full">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        AI Generated
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="relative p-6">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                            key={tagIndex}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-300"
                        >
                            <FiTag className="w-3 h-3" />
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors duration-300 line-clamp-2">
                    {title}
                </h3>

                {/* Excerpt */}
                <p className="text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                    {excerpt}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between text-sm text-slate-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <FiUser className="w-4 h-4" />
                            <span>{author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>{date}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiClock className="w-4 h-4" />
                        <span>{readTime}</span>
                    </div>
                </div>

                {/* Hover indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
        </motion.article>
    );
}