"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
    FiUser,
    FiMail,
    FiCalendar,
    FiActivity,
    FiTrendingUp,
    FiFileText,
    FiVideo,
    FiEye,
    FiAward,
    FiClock,
    FiBarChart,
    FiStar
} from "react-icons/fi";
import { userAPI, UserProfile, UserActivity } from "../../../lib/user-api";

export default function UserProfilePage() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activity, setActivity] = useState<UserActivity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProfileData = useCallback(async () => {
        console.log("Session data:", session);
        console.log("Access token:", session?.accessToken);

        if (!session?.accessToken) {
            console.log("No access token available");
            return;
        }

        try {
            setLoading(true);
            setError("");

            console.log("Making API calls with token:", session.accessToken?.substring(0, 20) + "...");

            const [profileData, activityData] = await Promise.all([
                userAPI.getUserProfile(session.accessToken),
                userAPI.getUserActivity(session.accessToken, 10)
            ]);

            setProfile(profileData);
            setActivity(activityData);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch profile data");
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return 'from-red-500 to-pink-500';
            case 'moderator': return 'from-blue-500 to-indigo-500';
            default: return 'from-green-500 to-emerald-500';
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-red-100 text-red-800 border-red-200';
            case 'moderator': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Loading skeleton */}
                    <div className="animate-pulse">
                        <div className="h-8 bg-slate-200 rounded-2xl mb-6 w-64"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-3xl p-8 h-80"></div>
                                <div className="bg-white rounded-3xl p-8 h-64"></div>
                            </div>
                            <div className="space-y-6">
                                <div className="bg-white rounded-3xl p-6 h-96"></div>
                                <div className="bg-white rounded-3xl p-6 h-48"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl p-8 shadow-2xl border border-red-200 max-w-md w-full text-center"
                >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiActivity className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Profile</h2>
                    <p className="text-slate-600 mb-4">{error}</p>
                    <button
                        onClick={fetchProfileData}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                        Try Again
                    </button>
                </motion.div>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        User Profile
                    </h1>
                    <p className="text-slate-600">
                        Manage your account and view your statistics
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Profile Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden"
                        >
                            {/* Background gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />

                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-20 h-20 bg-gradient-to-r ${getRoleColor(profile.user.role)} rounded-2xl flex items-center justify-center shadow-lg`}>
                                            <FiUser className="w-10 h-10 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-800">{profile.user.name}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <FiMail className="w-4 h-4 text-slate-500" />
                                                <span className="text-slate-600">{profile.user.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(profile.user.role)}`}>
                                            {profile.user.role.charAt(0).toUpperCase() + profile.user.role.slice(1)}
                                        </span>
                                        {profile.user.isVerifiedPoster && (
                                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
                                                <FiStar className="w-3 h-3" />
                                                Verified
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <FiCalendar className="w-4 h-4 text-slate-500" />
                                        <span className="text-slate-600">Joined {formatDate(profile.user.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiClock className="w-4 h-4 text-slate-500" />
                                        <span className="text-slate-600">{profile.statistics.accountAge} days ago</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Statistics Overview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-3xl p-8 shadow-2xl border border-white/20"
                        >
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                <FiBarChart className="w-5 h-5 text-indigo-600" />
                                Statistics Overview
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                        <FiFileText className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800">{profile.statistics.totalBlogs}</div>
                                    <div className="text-sm text-slate-500">Total Blogs</div>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                        <FiVideo className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800">{profile.statistics.totalVideos}</div>
                                    <div className="text-sm text-slate-500">Total Videos</div>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                        <FiEye className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800">{profile.statistics.totalBlogViews}</div>
                                    <div className="text-sm text-slate-500">Total Views</div>
                                </div>

                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                        <FiTrendingUp className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="text-2xl font-bold text-slate-800">{profile.statistics.weeklyBlogs}</div>
                                    <div className="text-sm text-slate-500">This Week</div>
                                </div>
                            </div>

                            {/* Activity Chart Placeholder */}
                            <div className="mt-8 p-6 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-2xl">
                                <h4 className="font-semibold text-slate-700 mb-4">Recent Activity</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <div className="text-slate-600">Last 30 days</div>
                                        <div className="font-bold text-slate-800">{profile.statistics.recentBlogs} blogs, {profile.statistics.recentVideos} videos</div>
                                    </div>
                                    <div>
                                        <div className="text-slate-600">Last 7 days</div>
                                        <div className="font-bold text-slate-800">{profile.statistics.weeklyBlogs} blogs, {profile.statistics.weeklyVideos} videos</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Achievements */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-6 shadow-2xl border border-white/20"
                        >
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FiAward className="w-5 h-5 text-yellow-600" />
                                Achievements
                            </h3>

                            <div className="space-y-3">
                                {profile.achievements.map((achievement: { name: string; icon: string; description: string }, index: number) => (
                                    <motion.div
                                        key={achievement.name}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200"
                                    >
                                        <span className="text-2xl">{achievement.icon}</span>
                                        <div>
                                            <div className="font-semibold text-slate-800">{achievement.name}</div>
                                            <div className="text-xs text-slate-600">{achievement.description}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-3xl p-6 shadow-2xl border border-white/20"
                        >
                            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <FiActivity className="w-5 h-5 text-indigo-600" />
                                Recent Activity
                            </h3>

                            {activity.length > 0 ? (
                                <div className="space-y-3">
                                    {activity.map((item, index) => (
                                        <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 + index * 0.05 }}
                                            className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-slate-800 text-sm truncate">
                                                    {item.title}
                                                </div>
                                                <div className="text-xs text-slate-600 mt-1">
                                                    {formatDate(item.createdAt)}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <FiActivity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p>No recent activity</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}