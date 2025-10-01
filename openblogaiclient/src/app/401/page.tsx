"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiLock, FiLogIn, FiShield, FiArrowLeft } from "react-icons/fi";

export default function Unauthorized() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center"
                >
                    {/* 401 Animation */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="relative">
                            <div className="text-8xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                401
                            </div>
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                }}
                                className="absolute -top-4 -right-4 text-red-500"
                            >
                                <FiLock size={32} />
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="flex items-center justify-center mb-4">
                            <FiShield className="text-red-500 mr-2" size={24} />
                            <h1 className="text-2xl font-bold text-slate-800">
                                Access Denied
                            </h1>
                        </div>
                        <p className="text-slate-600 mb-6">
                            You do not have permission to access this page. Please log in with appropriate credentials or contact an administrator.
                        </p>
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium"
                        >
                            <FiArrowLeft size={18} />
                            Go Back
                        </motion.button>

                        <Link href="/login">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-medium w-full"
                            >
                                <FiLogIn size={18} />
                                Sign In
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* Decorative Elements */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-red-400/20 to-orange-400/20 rounded-full blur-3xl"
                    />
                    <motion.div
                        animate={{
                            y: [0, 10, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1
                        }}
                        className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-r from-pink-400/20 to-red-400/20 rounded-full blur-3xl"
                    />
                </motion.div>
            </div>
        </div>
    );
}