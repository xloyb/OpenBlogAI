"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit3, FiTrash2, FiUserPlus, FiSearch, FiFilter, FiMail, FiCalendar, FiShield, FiUsers } from "react-icons/fi";
import { User } from "../../lib/dashboard-api";

interface UserManagementProps {
    users: User[];
    onUsersChange: (users: User[]) => void;
    onRefresh?: () => void;
}

export default function UserManagement({ users, onUsersChange }: UserManagementProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "all" || user.role === roleFilter;
        const matchesStatus = statusFilter === "all" ||
            (statusFilter === "active" && user.isActive) ||
            (statusFilter === "inactive" && !user.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    const handleDeleteUser = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            try {
                const updatedUsers = users.filter(user => user.id !== userId);
                onUsersChange(updatedUsers);
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        }
    };

    const handleEditUser = (user: User) => {
        // TODO: Implement user editing functionality
        console.log('Edit user:', user);
    };

    return (
        <div className="relative">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 mb-6"
            >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent mb-2">
                            User Management
                        </h2>
                        <p className="text-slate-600">Manage your platform users and their permissions</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${showFilters
                                ? 'bg-blue-100 text-blue-600 shadow-lg'
                                : 'bg-white/50 text-slate-600 hover:bg-white/80'
                                }`}
                        >
                            <FiFilter size={18} />
                            Filters
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-lg font-medium"
                        >
                            <FiUserPlus size={18} />
                            Add User
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Search Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/30 mb-6"
            >
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 focus:bg-white transition-all duration-300 placeholder-slate-400"
                        />
                    </div>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-col lg:flex-row gap-4 mt-4 pt-4 border-t border-slate-200"
                        >
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="px-4 py-3 bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="moderator">Moderator</option>
                                <option value="user">User</option>
                            </select>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 bg-white/50 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-300 transition-all duration-300"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>

                            <div className="flex items-center gap-2 ml-auto">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'
                                        }`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-500 hover:bg-slate-100'
                                        }`}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Users Display */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 overflow-hidden"
            >
                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                className="group bg-gradient-to-br from-white to-blue-50/30 rounded-2xl p-6 border border-white/50 hover:border-blue-200/50 transition-all duration-300 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${user.isActive ? 'bg-green-400' : 'bg-gray-400'
                                            }`}></div>
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <div className="flex gap-1">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleEditUser(user)}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                <FiEdit3 size={16} />
                                            </motion.button>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 size={16} />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-lg mb-1">{user.name}</h3>
                                        <div className="flex items-center text-slate-500 text-sm mb-2">
                                            <FiMail className="mr-2" size={14} />
                                            {user.email}
                                        </div>
                                        <div className="flex items-center text-slate-500 text-sm">
                                            <FiCalendar className="mr-2" size={14} />
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                                        <div className="flex items-center gap-2">
                                            <FiShield size={14} className="text-slate-400" />
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' :
                                                user.role === 'moderator' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700' :
                                                    'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                                                }`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                        </div>

                                        <div className={`flex items-center gap-1 text-xs font-medium ${user.isActive ? 'text-green-600' : 'text-red-500'
                                            }`}>
                                            <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'
                                                }`}></div>
                                            {user.isActive ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/50">
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-slate-800">{user.blogCount || 0}</div>
                                            <div className="text-xs text-slate-500">Blogs</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-bold text-slate-800">{user.videoCount || 0}</div>
                                            <div className="text-xs text-slate-500">Videos</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-200/50">
                        {filteredUsers.map((user, index) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex items-center justify-between p-6 hover:bg-blue-50/30 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-semibold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${user.isActive ? 'bg-green-400' : 'bg-gray-400'
                                            }`}></div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-800">{user.name}</h3>
                                        <p className="text-sm text-slate-500">{user.email}</p>
                                    </div>

                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700' :
                                        user.role === 'moderator' ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700' :
                                            'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700'
                                        }`}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-slate-500">
                                        {user.blogCount || 0} blogs, {user.videoCount || 0} videos
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleEditUser(user)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <FiEdit3 size={16} />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 size={16} />
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filteredUsers.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiUsers className="text-slate-400" size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600 mb-2">No users found</h3>
                        <p className="text-slate-400">Try adjusting your search or filters</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}