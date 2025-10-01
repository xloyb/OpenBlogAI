"use client";

import { motion } from "framer-motion";
import { FiFileText, FiTrendingUp, FiUsers, FiStar } from "react-icons/fi";
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
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 rounded mb-4"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 bg-slate-200 rounded"></div>
                        <div className="h-20 bg-slate-200 rounded"></div>
                        <div className="h-20 bg-slate-200 rounded"></div>
                        <div className="h-20 bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Blogs",
            value: stats.totalBlogs,
            icon: FiFileText,
            color: "indigo",
            change: "+15.3%"
        },
        {
            title: "This Week",
            value: stats.blogsThisPeriod,
            icon: FiTrendingUp,
            color: "teal",
            change: "+28%"
        },
        {
            title: "Avg per User",
            value: stats.averageBlogsPerUser,
            icon: FiUsers,
            color: "pink",
            change: "+5.2%",
            isDecimal: true
        },
        {
            title: "Top Author",
            value: stats.topAuthors[0]?.blogCount || 0,
            icon: FiStar,
            color: "orange",
            change: "+3"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Blog Statistics</h3>
                <div className="text-sm text-slate-500">Last 7 days</div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl bg-${stat.color}-50 border border-${stat.color}-100`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                            <span className={`text-xs font-medium text-${stat.color}-600 bg-${stat.color}-100 px-2 py-1 rounded-full`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className={`text-2xl font-bold text-${stat.color}-700 mb-1`}>
                            {stat.isDecimal ? stat.value : stat.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">{stat.title}</div>
                    </motion.div>
                ))}
            </div>

            {!detailed && stats.topAuthors.length > 0 && (
                <div>
                    <h4 className="font-semibold text-slate-700 mb-3">Top Authors</h4>
                    <div className="space-y-2">
                        {stats.topAuthors.slice(0, 3).map((author: { id: string; name: string; blogCount: number }, index: number) => (
                            <div key={author.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                        index === 1 ? 'bg-gray-100 text-gray-700' :
                                            'bg-orange-100 text-orange-700'
                                        }`}>
                                        {index + 1}
                                    </span>
                                    <span className="text-sm text-slate-700">{author.name}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-600">{author.blogCount} blogs</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {detailed && (
                <div className="space-y-6">
                    {/* Daily Blog Creation */}
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Daily Blog Creation</h4>
                        <div className="space-y-2">
                            {stats.dailyBlogCreation?.map((item: { date: string; count: number }) => (
                                <div key={item.date} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm text-slate-600">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                    <span className="font-medium">{item.count} blogs</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Authors */}
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Top Authors</h4>
                        <div className="space-y-2">
                            {stats.topAuthors.map((author: { id: string; name: string; blogCount: number }, index: number) => (
                                <div key={author.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-100 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {index + 1}
                                        </span>
                                        <span className="text-sm text-slate-700">{author.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{author.blogCount} blogs</span>
                                        <div className="w-20 bg-slate-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-500 h-2 rounded-full"
                                                style={{
                                                    width: `${(author.blogCount / Math.max(...stats.topAuthors.map((a: { id: string; name: string; blogCount: number }) => a.blogCount))) * 100}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Blogs by Category */}
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Blogs by Category</h4>
                        <div className="space-y-2">
                            {stats.blogsByCategory?.map((category: { category: string; count: number }) => (
                                <div key={category.category} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm text-slate-600">{category.category}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{category.count}</span>
                                        <div className="w-20 bg-slate-200 rounded-full h-2">
                                            <div
                                                className="bg-teal-500 h-2 rounded-full"
                                                style={{ width: `${(category.count / stats.totalBlogs) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}