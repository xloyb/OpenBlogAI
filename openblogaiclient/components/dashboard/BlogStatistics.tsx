"use client";

import { motion } from "framer-motion";
import { FiFileText, FiTrendingUp, FiUsers, FiStar, FiArrowUp, FiArrowDown, FiEdit, FiEye } from "react-icons/fi";
import { BlogStats } from "../../lib/dashboard-api";

// Extended interface for dashboard with additional fields
interface ExtendedBlogStats extends BlogStats {
    blogsByCategory?: { category: string; count: number }[];
    dailyBlogCreation?: { date: string; count: number }[];
}

interface BlogStatisticsProps {
    stats: ExtendedBlogStats | null;
    detailed?: boolean;
}

export default function BlogStatistics({ stats, detailed = false }: BlogStatisticsProps) {
    if (!stats) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white/80 to-indigo-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
            >
                <div className="animate-pulse">
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white/50 rounded-2xl p-4">
                                <div className="h-12 bg-slate-200 rounded-xl mb-3"></div>
                                <div className="h-6 bg-slate-200 rounded-lg mb-2"></div>
                                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        );
    }

    const statCards = [
        {
            title: "Total Blogs",
            value: stats.totalBlogs,
            icon: FiFileText,
            gradient: "from-indigo-500 to-purple-600",
            bgGradient: "from-indigo-50 to-purple-50",
            change: "+15.3%",
            trend: "up",
            description: "Published articles"
        },
        {
            title: "This Period",
            value: stats.blogsThisPeriod,
            icon: FiTrendingUp,
            gradient: "from-teal-500 to-cyan-600",
            bgGradient: "from-teal-50 to-cyan-50",
            change: "+28%",
            trend: "up",
            description: "Recent publications"
        },
        {
            title: "Avg per User",
            value: Math.round(stats.averageBlogsPerUser * 10) / 10,
            icon: FiUsers,
            gradient: "from-emerald-500 to-green-600",
            bgGradient: "from-emerald-50 to-green-50",
            change: "+5.2%",
            trend: "up",
            description: "Content productivity"
        },
        {
            title: "Top Authors",
            value: stats.topAuthors.length,
            icon: FiStar,
            gradient: "from-amber-500 to-orange-600",
            bgGradient: "from-amber-50 to-orange-50",
            change: "+3.1%",
            trend: "up",
            description: "Active writers"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-white/80 to-indigo-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-indigo-600 bg-clip-text text-transparent mb-2"
                >
                    Content Analytics
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-600"
                >
                    Track blog performance and content creation metrics
                </motion.p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(0,0,0,0.1)" }}
                        className={`relative overflow-hidden bg-gradient-to-br ${card.bgGradient} backdrop-blur-xl rounded-2xl p-6 border border-white/30 group cursor-pointer`}
                    >
                        {/* Background decoration */}
                        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-white/5 group-hover:scale-110 transition-transform duration-500"></div>

                        {/* Icon */}
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <card.icon className="text-white" size={24} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-600 text-sm font-medium">{card.title}</span>
                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${card.trend === 'up'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-red-100 text-red-600'
                                    }`}>
                                    {card.trend === 'up' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
                                    {card.change}
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-slate-800 mb-1">
                                {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                            </div>

                            <p className="text-slate-500 text-sm">{card.description}</p>
                        </div>

                        {/* Hover effect overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.div>
                ))}
            </div>

            {detailed && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                    {/* Top Authors */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FiStar className="text-amber-500" />
                            Top Content Creators
                        </h3>
                        <div className="space-y-4">
                            {stats.topAuthors.map((author: { id: string; name: string; blogCount: number }, index: number) => {
                                const maxBlogs = Math.max(...stats.topAuthors.map((a: { id: string; name: string; blogCount: number }) => a.blogCount));
                                const percentage = (author.blogCount / maxBlogs) * 100;

                                return (
                                    <motion.div
                                        key={author.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className="group bg-gradient-to-r from-white/50 to-slate-50/50 rounded-xl p-4 hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-4">
                                            {/* Avatar */}
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                                                    {author.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">#{index + 1}</span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                                        {author.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2">
                                                        <FiEdit className="text-slate-400" size={14} />
                                                        <span className="font-bold text-slate-800">{author.blogCount}</span>
                                                        <span className="text-sm text-slate-500">blogs</span>
                                                    </div>
                                                </div>

                                                {/* Progress bar */}
                                                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                                        className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full"
                                                    ></motion.div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Categories */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FiFileText className="text-blue-500" />
                            Content Distribution
                        </h3>

                        {stats.blogsByCategory && stats.blogsByCategory.length > 0 ? (
                            <div className="space-y-4">
                                {stats.blogsByCategory?.map((category: { category: string; count: number }, index) => {
                                    const totalBlogs = stats.blogsByCategory?.reduce((sum, cat) => sum + cat.count, 0) || 1;
                                    const percentage = (category.count / totalBlogs) * 100;
                                    const colors = [
                                        { bg: 'bg-blue-100', bar: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'text-blue-700' },
                                        { bg: 'bg-purple-100', bar: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-purple-700' },
                                        { bg: 'bg-green-100', bar: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-green-700' },
                                        { bg: 'bg-amber-100', bar: 'bg-gradient-to-r from-amber-500 to-orange-500', text: 'text-amber-700' },
                                        { bg: 'bg-rose-100', bar: 'bg-gradient-to-r from-rose-500 to-pink-500', text: 'text-rose-700' }
                                    ];
                                    const color = colors[index % colors.length];

                                    return (
                                        <motion.div
                                            key={category.category}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 ${color.bg} rounded-xl`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className={`font-semibold ${color.text} capitalize`}>
                                                    {category.category}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <FiEye className="text-slate-400" size={14} />
                                                    <span className="font-bold text-slate-800">{category.count}</span>
                                                    <span className="text-sm text-slate-600">({percentage.toFixed(1)}%)</span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-white/50 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percentage}%` }}
                                                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                                                    className={`h-full ${color.bar} rounded-full`}
                                                ></motion.div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiFileText className="text-slate-400" size={24} />
                                </div>
                                <p className="text-slate-500">No category data available</p>
                            </div>
                        )}
                    </div>

                    {/* Daily Blog Creation Trend */}
                    {stats.dailyBlogCreation && (
                        <div className="lg:col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <FiTrendingUp className="text-green-500" />
                                Content Creation Trend
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                                {stats.dailyBlogCreation?.map((item: { date: string; count: number }, index) => {
                                    const maxCount = Math.max(...(stats.dailyBlogCreation?.map(d => d.count) || [1]));
                                    const heightPercent = (item.count / maxCount) * 100;

                                    return (
                                        <motion.div
                                            key={item.date}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="text-center group cursor-pointer"
                                        >
                                            <div className="bg-gradient-to-t from-slate-100 to-slate-50 rounded-lg p-3 h-24 flex flex-col justify-end mb-2 group-hover:from-indigo-100 group-hover:to-indigo-50 transition-colors">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${heightPercent}%` }}
                                                    transition={{ delay: 0.5 + index * 0.05, duration: 0.6 }}
                                                    className="bg-gradient-to-t from-indigo-500 to-purple-500 rounded-sm w-full min-h-[4px]"
                                                ></motion.div>
                                            </div>
                                            <div className="text-xs text-slate-600 font-medium mb-1">{item.date}</div>
                                            <div className="text-lg font-bold text-slate-800">{item.count}</div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
}