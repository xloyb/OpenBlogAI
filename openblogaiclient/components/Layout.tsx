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
      <div className="min-h-screen bg-base-200 flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-6 md:p-8">
                {children}
              </div>
            </div>
          </div>
        </main>

        {/* Theme Toggle for Desktop */}
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
      </div>
    </motion.div>
  );
}