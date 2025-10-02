"use client";
import SimpleSidebar from "@/components/sidebar/SimpleSidebar";
import { motion } from "framer-motion";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    >
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <SimpleSidebar />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out min-h-screen">
          <div className="w-full max-w-none">
            {children}
          </div>
        </main>
      </div>
    </motion.div>
  );
}