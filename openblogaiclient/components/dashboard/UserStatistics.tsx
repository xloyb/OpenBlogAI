"use client";

import { motion } from "framer-motion";
import { FiUsers, FiUserCheck, FiTrendingUp, FiActivity } from "react-icons/fi";
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
            title: "Total Users",
            value: stats.totalUsers,
            icon: FiUsers,
            color: "blue",
            change: "+12%"
        },
        {
            title: "Active Users",
            value: stats.activeUsers,
            icon: FiUserCheck,
            color: "green",
            change: "+8.2%"
        },
        {
            title: "New This Week",
            value: stats.newUsersThisPeriod,
            icon: FiTrendingUp,
            color: "purple",
            change: "+24%"
        },
        {
            title: "Admins",
            value: stats.usersByRole.find((r: { role: string; count: number }) => r.role === 'admin')?.count || 0,
            icon: FiActivity,
            color: "yellow",
            change: "0%"
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">User Statistics</h3>
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
                            {stat.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-slate-600">{stat.title}</div>
                    </motion.div>
                ))}
            </div>

            {detailed && (
                <div className="space-y-6">
                    {/* User Growth Chart */}
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3">User Growth (Last 7 Days)</h4>
                        <div className="space-y-2">
                            {stats.userGrowth?.map((item: { date: string; count: number }, index: number) => {
                                const prevValue = index > 0 && stats.userGrowth ? stats.userGrowth[index - 1].count : item.count;
                                const growth = item.count - prevValue;
                                return (
                                    <div key={item.date} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="text-sm text-slate-600">
                                            {new Date(item.date).toLocaleDateString()}
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{item.count.toLocaleString()}</span>
                                            {growth !== 0 && (
                                                <span className={`text-xs px-2 py-1 rounded-full ${growth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {growth > 0 ? '+' : ''}{growth}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Daily Logins */}
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Daily Login Activity</h4>
                        <div className="space-y-2">
                            {stats.dailyLogins?.map((item: { date: string; count: number }) => (
                                <div key={item.date} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm text-slate-600">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                    <span className="font-medium">{item.count} logins</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Users by Role */}
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-3">Users by Role</h4>
                        <div className="space-y-2">
                            {stats.usersByRole.map((role: { role: string; count: number }) => (
                                <div key={role.role} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="text-sm text-slate-600 capitalize">{role.role}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{role.count}</span>
                                        <div className="w-20 bg-slate-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full"
                                                style={{ width: `${(role.count / stats.totalUsers) * 100}%` }}
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