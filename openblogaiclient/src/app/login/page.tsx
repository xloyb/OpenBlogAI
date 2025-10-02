"use client"
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';
import { FiLock, FiZap } from 'react-icons/fi';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 p-8 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiLock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-indigo-100">
                Sign in to continue your AI blogging journey
              </p>
            </motion.div>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="p-8"
          >
            <LoginForm />

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">New to OpenBlogAI?</span>
              </div>
            </div>

            <div className="text-center">
              <Link href="/register" className="block">
                <motion.div
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Button
                    variant="outline"
                    className="w-full border-2 border-slate-200 hover:border-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 text-slate-700 hover:text-indigo-700 font-semibold py-3 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg group"
                    size="lg"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        className="group-hover:rotate-12 transition-transform duration-300"
                      >
                        <FiZap className="w-4 h-4" />
                      </motion.div>
                      <span className="bg-gradient-to-r from-slate-700 to-indigo-700 bg-clip-text text-transparent group-hover:from-indigo-700 group-hover:to-purple-700">
                        Create New Account
                      </span>
                    </div>
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-center text-slate-500 text-sm mt-8 space-x-4"
        >
          <a href="/forgot-password" className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
            Forgot Password?
          </a>
          <span>•</span>
          <a href="/help" className="text-indigo-600 hover:text-indigo-700 transition-colors font-medium">
            Need Help?
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
