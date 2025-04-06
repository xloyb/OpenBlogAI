"use client";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { motion } from "framer-motion";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
 
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.3 }}
      >
    <div className="min-h-[100dvh] bg-base-100 text-base-content grid md:grid-cols-[auto_1fr] grid-cols-[1fr]">
      <Sidebar />
      <main className="p-[min(30px,7%)] md:p-[30px] pb-[60px]">
        <div className="md:border md:border-neutral md:rounded-2xl md:mb-5 md:p-[min(3em,15%)] p-0 border-none">
          {children}
        </div>
      </main>
    </div>
    </motion.div>
  );
}
