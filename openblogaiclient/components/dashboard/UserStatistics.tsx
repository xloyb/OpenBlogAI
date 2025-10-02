"use client";

import { motion } from "framer-motion";
import { FiUsers, FiUserCheck, FiTrendingUp, FiActivity, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { UserStats } from "../../lib/dashboard-api";

// Extended interface for dashboard with additional fields
interface ExtendedUserStats extends UserStats {
    dailyLogins?: { date: string; count: number }[];
    userGrowth?: { date: string; count: number }[];
}

interface UserStatisticsProps {
    stats: ExtendedUserStats | null;
    detailed?: boolean;
}

export default function UserStatistics({ stats, detailed = false }: UserStatisticsProps) {
    if (!stats) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
            >
                <div className="animate-pulse">
                    <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-2xl mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
            title: "Total Users",
            value: stats.totalUsers,
            icon: FiUsers,
            gradient: "from-blue-500 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
            change: "+12.5%",
            trend: "up",
            description: "All registered users"
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            icon: FiUserCheck,
            gradient: "from-emerald-500 to-teal-500",
            bgGradient: "from-emerald-50 to-teal-50",
            change: "+8.2%",
            trend: "up",
            description: "Currently active"
        },
        {
            title: "New This Week",
            value: stats.newUsersThisPeriod,
            icon: FiTrendingUp,
            gradient: "from-purple-500 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
            change: "+28%",
            trend: "up",
            description: "Recent registrations"
        },
        {
            title: "Admin Users",
            value: stats.usersByRole.find((r: { role: string; count: number }) => r.role === 'admin')?.count || 0,
            icon: FiActivity,
            gradient: "from-orange-500 to-red-500",
            bgGradient: "from-orange-50 to-red-50",
            change: "+2.1%",
            trend: "up",
            description: "Platform administrators"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2"
                >
                    User Analytics
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-600"
                >
                    Overview of user engagement and growth metrics
                </motion.p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
                                {card.value.toLocaleString()}
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
                    {/* User Growth Chart */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FiTrendingUp className="text-blue-500" />
                            User Growth Trend
                        </h3>
                        <div className="space-y-3">
                            {stats.userGrowth?.map((item: { date: string; count: number }, index: number) => {
                                const prevValue = index > 0 && stats.userGrowth ? stats.userGrowth[index - 1].count : item.count;
                                const change = ((item.count - prevValue) / prevValue) * 100;
                                const isPositive = change >= 0;

                                return (
                                    <motion.div
                                        key={item.date}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-transparent rounded-xl hover:from-blue-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${isPositive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                            <span className="font-medium text-slate-700">{item.date}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-800">{item.count}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                {isPositive ? '+' : ''}{change.toFixed(1)}%
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* User Roles Distribution */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FiUsers className="text-purple-500" />
                            User Roles Distribution
                        </h3>
                        <div className="space-y-4">
                            {stats.usersByRole.map((role: { role: string; count: number }, index) => {
                                const percentage = (role.count / stats.totalUsers) * 100;
                                const colors = {
                                    admin: { bg: 'bg-purple-100', bar: 'bg-gradient-to-r from-purple-500 to-pink-500', text: 'text-purple-700' },
                                    moderator: { bg: 'bg-blue-100', bar: 'bg-gradient-to-r from-blue-500 to-cyan-500', text: 'text-blue-700' },
                                    user: { bg: 'bg-green-100', bar: 'bg-gradient-to-r from-green-500 to-emerald-500', text: 'text-green-700' }
                                };
                                const color = colors[role.role as keyof typeof colors] || colors.user;

                                return (
                                    <motion.div
                                        key={role.role}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`p-4 ${color.bg} rounded-xl`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`font-semibold ${color.text} capitalize`}>
                                                {role.role}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-slate-800">{role.count}</span>
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
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}