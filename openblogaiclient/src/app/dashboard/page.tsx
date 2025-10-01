"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  FiUsers,
  FiActivity,
  FiBarChart,
  FiAlertCircle,
  FiLogIn
} from "react-icons/fi";
import UserManagement from "../../../components/dashboard/UserManagement";
import UserStatistics from "../../../components/dashboard/UserStatistics";
import BlogStatistics from "../../../components/dashboard/BlogStatistics";
import { dashboardAPI, User as ApiUser, UserStats, BlogStats } from "../../../lib/dashboard-api";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [blogStats, setBlogStats] = useState<BlogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ref to prevent multiple simultaneous requests
  const loadingRef = useRef(false);
  const hasLoadedRef = useRef(false);

  const loadDashboardData = useCallback(async () => {
    // Prevent multiple simultaneous requests
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError("");

      // Load data from actual API endpoints
      const [usersResponse, userStatsResponse, blogStatsResponse] = await Promise.all([
        dashboardAPI.getUsers({ page: 1, limit: 100 }),
        dashboardAPI.getUserStatistics('7d'),
        dashboardAPI.getBlogStatistics('7d')
      ]);

      setUsers(usersResponse.users);
      setUserStats(userStatsResponse);
      setBlogStats(blogStatsResponse);
      hasLoadedRef.current = true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load dashboard data";
      setError(errorMessage);
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, []);

  const handleRetry = useCallback(() => {
    hasLoadedRef.current = false; // Reset loaded state to allow retry
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    // Only load data once when user is authenticated and hasn't loaded yet
    if (status === 'authenticated' && !hasLoadedRef.current) {
      loadDashboardData();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, loadDashboardData]);

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart },
    { id: "users", label: "User Management", icon: FiUsers },
    { id: "analytics", label: "Analytics", icon: FiActivity }
  ];

  // Show authentication loading
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiLogIn className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Admin Access Required</h2>
          <p className="text-slate-600 mb-6">
            You need to be logged in as an administrator to access the dashboard.
          </p>
          <a
            href="/login"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <FiLogIn className="mr-2" />
            Sign In
          </a>
        </motion.div>
      </div>
    );
  }

  // Show error if user is not admin
  if (session && !session.user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full mx-4"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiAlertCircle className="text-red-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Access Denied</h2>
          <p className="text-slate-600 mb-6">
            You need administrator privileges to access this dashboard.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50">
      <div className="space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiBarChart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-xl font-medium text-slate-600 max-w-2xl mx-auto">
            Manage users, monitor activities, and analyze platform performance
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg border border-slate-200">
            <div className="flex space-x-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <UserStatistics stats={userStats} />
              <BlogStatistics stats={blogStats} />
            </div>
          )}

          {activeTab === "users" && (
            <UserManagement
              users={users}
              onUsersChange={(users: ApiUser[]) => setUsers(users)}
              onRefresh={loadDashboardData}
            />
          )}

          {activeTab === "analytics" && (
            <div className="space-y-8">
              <UserStatistics stats={userStats} detailed />
              <BlogStatistics stats={blogStats} detailed />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}