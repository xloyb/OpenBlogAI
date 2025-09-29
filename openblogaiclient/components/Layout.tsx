"use client";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
    >
      <div className="min-h-[100dvh] bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 grid md:grid-cols-[auto_1fr] grid-cols-[1fr]">
        <Sidebar />
        <main className="p-4 md:p-8 pb-16 relative">
          {/* Theme Toggle - Fixed Position */}
          <div className="fixed top-4 right-4 z-50 md:top-6 md:right-6">
            <ThemeToggle />
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </motion.div>
  );
}
