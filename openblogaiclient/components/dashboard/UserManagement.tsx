"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiEdit3, FiTrash2, FiUserPlus, FiSearch } from "react-icons/fi";
import { User } from "../../lib/dashboard-api";

interface UserManagementProps {
    users: User[];
    onUsersChange: (users: User[]) => void;
    onRefresh: () => void;
}

export default function UserManagement({ users, onUsersChange }: UserManagementProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [editingUser, setEditingUser] = useState<User | null>(null);

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
                // API call would go here
                const updatedUsers = users.filter(user => user.id !== userId);
                onUsersChange(updatedUsers);
            } catch (error) {
                console.error("Failed to delete user:", error);
            }
        }
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
    };

    const handleSaveUser = async (userData: Partial<User>) => {
        try {
            // API call would go here
            if (editingUser) {
                const updatedUsers = users.map(user =>
                    user.id === editingUser.id ? { ...user, ...userData } : user
                );
                onUsersChange(updatedUsers);
            }
            setEditingUser(null);
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-slate-800">User Management</h3>
                <button
                    onClick={() => alert("Add user functionality would be implemented here")}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg"
                >
                    <FiUserPlus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">User</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Role</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Content</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Joined</th>
                            <th className="text-left py-3 px-4 font-semibold text-slate-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user, index) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <div>
                                        <div className="font-medium text-slate-800">{user.name}</div>
                                        <div className="text-sm text-slate-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-red-100 text-red-700' :
                                        user.role === 'moderator' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-slate-600">
                                    <div className="text-sm">
                                        <div>{user.blogCount} blogs</div>
                                        <div>{user.videoCount} videos</div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 text-slate-600 text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditUser(user)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <FiEdit3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteUser(user.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                    No users found matching your criteria.
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 w-full max-w-md"
                    >
                        <h3 className="text-xl font-bold mb-4">Edit User</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target as HTMLFormElement);
                                handleSaveUser({
                                    name: formData.get('name') as string,
                                    email: formData.get('email') as string,
                                    role: formData.get('role') as 'user' | 'moderator' | 'admin',
                                    isActive: formData.get('isActive') === 'on'
                                });
                            }}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    defaultValue={editingUser.name}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    defaultValue={editingUser.email}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    defaultValue={editingUser.role}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="user">User</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex items-center">
                                <input
                                    name="isActive"
                                    type="checkbox"
                                    defaultChecked={editingUser.isActive}
                                    className="mr-2"
                                />
                                <label className="text-sm font-medium text-slate-700">
                                    Active
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
}