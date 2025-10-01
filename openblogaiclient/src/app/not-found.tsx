"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiHome, FiArrowLeft, FiAlertCircle } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center"
                >
                    {/* 404 Animation */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="relative">
                            <div className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                404
                            </div>
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                                className="absolute -top-4 -right-4 text-yellow-500"
                            >
                                <FiAlertCircle size={32} />
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
                        <h1 className="text-2xl font-bold text-slate-800 mb-4">
                            Page Not Found
                        </h1>
                        <p className="text-slate-600 mb-6">
                            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved, deleted, or you entered the wrong URL.
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
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium"
                        >
                            <FiArrowLeft size={18} />
                            Go Back
                        </motion.button>

                        <Link href="/">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium w-full"
                            >
                                <FiHome size={18} />
                                Home Page
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
                        className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl"
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
                        className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
                    />
                </motion.div>
            </div>
        </div>
    );
}