"use client";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle responsive sidebar state
  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      // On desktop, sidebar should be open by default
      // On mobile, sidebar should be closed by default
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();

    // Listen for resize events
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle swipe gestures for mobile
  useEffect(() => {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return; // Desktop only
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || window.innerWidth >= 768) return;
      currentX = e.touches[0].clientX;
      const deltaX = currentX - startX;

      // Swipe right from left edge to open
      if (startX < 20 && deltaX > 50 && !sidebarOpen) {
        setSidebarOpen(true);
        isDragging = false;
      }
      // Swipe left to close
      else if (deltaX < -50 && sidebarOpen) {
        setSidebarOpen(false);
        isDragging = false;
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [sidebarOpen]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
    >
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className={`
          md:hidden fixed top-4 left-4 z-[60] 
          p-3 bg-white rounded-xl shadow-lg border border-slate-200 
          hover:bg-slate-50 active:scale-95
          transition-all duration-300 ease-in-out
          ${mounted && sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}
        `}
        style={{ touchAction: 'manipulation' }}
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="min-h-screen flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 transition-all duration-300 ease-in-out min-h-screen">
          <div className="w-full max-w-none pt-16 md:pt-0">
            {children}
          </div>
        </main>
      </div>
    </motion.div>
  );
}