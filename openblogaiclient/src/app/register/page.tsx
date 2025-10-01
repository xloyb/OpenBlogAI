"use client"
import Link from 'next/link';
import RegisterForm from '@/components/RegisterForm';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { FiUserPlus, FiLogIn } from 'react-icons/fi';

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center px-4 py-8">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
                <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '3s'}}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="relative w-full max-w-md"
            >
                <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 p-8 text-center relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 -translate-x-16"></div>
                            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 translate-x-12"></div>
                        </div>
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="relative"
                        >
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <FiUserPlus className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">
                                Join OpenBlogAI
                            </h1>
                            <p className="text-purple-100">
                                Create your account and start generating amazing content with AI
                            </p>
                        </motion.div>
                    </div>

                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="p-8"
                    >
                        <RegisterForm />

                        {/* Divider */}
                        <div className="relative my-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-500">Already have an account?</span>
                            </div>
                        </div>

                        <div className="text-center">
                            <Link href="/login" className="block">
                                <Button
                                    variant="outline"
                                    className="w-full border-2 border-slate-200 hover:border-purple-300 hover:bg-purple-50 text-slate-700 font-semibold py-3 rounded-2xl transition-all duration-300"
                                    size="lg"
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <FiLogIn className="w-4 h-4" />
                                        Sign In Instead
                                    </div>
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-center text-slate-500 text-sm mt-8 leading-relaxed"
                >
                    By creating an account, you agree to our{' '}
                    <a href="/terms" className="text-purple-600 hover:text-purple-700 transition-colors font-medium">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-purple-600 hover:text-purple-700 transition-colors font-medium">Privacy Policy</a>
                </motion.p>
            </motion.div>
        </div>
    );
}