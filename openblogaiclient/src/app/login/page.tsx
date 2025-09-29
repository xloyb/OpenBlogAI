"use client"
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-300 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome Back
              </h1>
              <p className="text-primary-content/80 text-sm">
                Sign in to continue your AI blogging journey
              </p>
            </motion.div>
          </div>
          <div className="p-8">
            <LoginForm />
            <div className="divider my-6">
              <span className="text-base-content/60 text-sm">New to OpenBlogAI?</span>
            </div>
            <div className="text-center">
              <Link
                href="/register"
                className="btn btn-outline btn-primary w-full"
              >
                Create New Account
              </Link>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-base-content/60 text-sm mt-6 space-x-4"
        >
          <a href="/forgot-password" className="link link-primary">Forgot Password?</a>
          <span></span>
          <a href="/help" className="link link-primary">Need Help?</a>
        </motion.div>
      </motion.div>
    </div>
  );
}
