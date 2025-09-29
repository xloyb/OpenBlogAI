"use client"
import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 flex items-center justify-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Join OpenBlogAI
                            </h1>
                            <p className="text-primary-content/80 text-sm">
                                Create your account and start generating amazing content
                            </p>
                        </motion.div>
                    </div>

                    {/* Form Section */}
                    <div className="p-8">
                        <RegisterForm />

                        <div className="divider my-6">
                            <span className="text-base-content/60 text-sm">Already have an account?</span>
                        </div>

                        <div className="text-center">
                            <Link
                                href="/login"
                                className="btn btn-outline btn-primary w-full"
                            >
                                Sign In Instead
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center text-base-content/60 text-sm mt-6"
                >
                    By creating an account, you agree to our{' '}
                    <a href="/terms" className="link link-primary">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="link link-primary">Privacy Policy</a>
                </motion.p>
            </motion.div>
        </div>
    );
}