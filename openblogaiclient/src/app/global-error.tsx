"use client";

import { motion } from "framer-motion";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-100 flex items-center justify-center p-4">
                    <div className="max-w-md w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 text-center"
                        >
                            {/* Error Animation */}
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="mb-8"
                            >
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            rotate: [0, 10, -10, 0],
                                            scale: [1, 1.1, 1]
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className="text-purple-500 flex justify-center mb-4"
                                    >
                                        <FiAlertTriangle size={64} />
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
                                    Something went wrong!
                                </h1>
                                <p className="text-slate-600 mb-6">
                                    An unexpected error occurred. Our team has been notified and is working on a fix.
                                </p>
                                {process.env.NODE_ENV === 'development' && (
                                    <details className="text-left bg-red-50 p-4 rounded-lg text-sm text-red-800 mb-4">
                                        <summary className="cursor-pointer font-semibold mb-2">
                                            Error Details (Development)
                                        </summary>
                                        <pre className="whitespace-pre-wrap overflow-auto">
                                            {error.message}
                                            {error.stack}
                                        </pre>
                                    </details>
                                )}
                            </motion.div>

                            {/* Action Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="flex flex-col gap-4"
                            >
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(147, 51, 234, 0.3)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={reset}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-medium"
                                >
                                    <FiRefreshCw size={18} />
                                    Try Again
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => window.location.href = '/'}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 font-medium"
                                >
                                    <FiHome size={18} />
                                    Go Home
                                </motion.button>
                            </motion.div>

                            {/* Error ID */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.5 }}
                                className="mt-6 pt-6 border-t border-slate-200"
                            >
                                <p className="text-xs text-slate-400">
                                    Error ID: {error.digest || Math.random().toString(36).substr(2, 9).toUpperCase()}
                                </p>
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
                                className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"
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
                                className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"
                            />
                        </motion.div>
                    </div>
                </div>
            </body>
        </html>
    );
}