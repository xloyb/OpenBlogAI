"use client"
import Link from 'next/link';
import LoginForm from '@/components/LoginForm';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body p-0">
            <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center rounded-t-2xl">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome Back
                </h1>
                <p className="text-white/80 text-sm">
                  Sign in to continue your AI blogging journey
                </p>
              </motion.div>
            </div>
            <div className="p-8">
              <LoginForm />

              {/* Divider */}
              <div className="divider">New to OpenBlogAI?</div>

              <div className="text-center">
                <Link href="/register" className="block">
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Create New Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6 space-x-4"
        >
          <a href="/forgot-password" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Forgot Password?
          </a>
          <span>•</span>
          <a href="/help" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
            Need Help?
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
}
