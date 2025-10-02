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
      {/* Fixed Sidebar */}
      <SimpleSidebar />

      {/* Main Content with margin for fixed sidebar */}
      <main
        className="min-h-screen p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out ml-0"
        style={{
          marginLeft: 'var(--sidebar-width, 0px)'
        }}
      >
        <div className="w-full max-w-none">
          {children}
        </div>
      </main>
    </motion.div>
  );
}