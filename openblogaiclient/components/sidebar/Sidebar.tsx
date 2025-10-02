
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { ToggleButton } from "./ToggleButton";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen: externalIsOpen, onToggle }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(true); // Controls whether the sidebar is open or closed
  const [collapsed, setCollapsed] = useState(false); // Controls whether the sidebar is collapsed (icons only)
  const [mounted, setMounted] = useState(false); // Track if component is mounted to prevent hydration issues

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Load sidebar state from local storage on mount and handle responsive behavior
  useEffect(() => {
    setMounted(true);

    // Always load collapsed state from localStorage regardless of external control
    const savedCollapsedState = localStorage.getItem("sidebarCollapsed");
    if (savedCollapsedState !== null) {
      setCollapsed(savedCollapsedState === "true");
    }

    // Only handle open/closed state if we're using internal state (not controlled externally)
    if (externalIsOpen === undefined) {
      const savedState = localStorage.getItem("sidebarOpen");
      console.log(
        "Loaded sidebar state from local storage:",
        savedState,
        savedCollapsedState
      ); // Debug log

      if (savedState !== null) {
        setInternalIsOpen(savedState === "true");
      }

      // Handle responsive behavior
      const handleResize = () => {
        if (window.innerWidth < 768) {
          // Mobile: sidebar should be closed by default
          setInternalIsOpen(false);
        } else {
          // Desktop: sidebar should be open by default
          setInternalIsOpen(true);
        }
      };

      // Set initial state based on screen size
      handleResize();

      // Add resize listener
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [externalIsOpen]);

  const handleLogout = async () => {
    try {
      console.log("🔄 Logout process started");

      // Import and call the logout action
      const { doLogout } = await import('@/actions/auth');
      await doLogout();

      console.log("✅ Logout completed");
    } catch (err) {
      console.error("❌ Logout Error:", err);
      // Fallback: redirect to login page
      window.location.href = '/login';
    }
  }

  // Toggle sidebar collapsed state (desktop only)
  const toggleCollapse = () => {
    console.log('🔄 Collapse button clicked! Current state:', collapsed);
    // Always toggle collapsed state on desktop regardless of external control
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    localStorage.setItem("sidebarCollapsed", newCollapsedState.toString());
    console.log('✅ Collapse state updated to:', newCollapsedState);
  };

  // Toggle sidebar open/closed (mobile only)
  const toggleSidebar = () => {
    // If we have external control, use the external toggle for mobile
    if (onToggle) {
      onToggle();
      return;
    }

    // Fallback for internal state management
    const newOpenState = !isOpen;
    setInternalIsOpen(newOpenState);
    localStorage.setItem("sidebarOpen", newOpenState.toString());
    console.log("Mobile: Toggled sidebar open:", newOpenState);
  };



  return (
    <>
      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-all duration-300 ${mounted && isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={onToggle || toggleSidebar}
        aria-hidden={!(mounted && isOpen)}
      />

      {/* Sidebar */}
      <aside
        data-testid="main-sidebar"
        className={`
          h-full bg-gradient-to-b from-white via-slate-50 to-blue-50 
          border-r border-slate-200 shadow-xl
          transition-all duration-300 ease-in-out
          flex flex-col pointer-events-auto
          fixed top-0 left-0 z-50
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0'}
          md:relative md:z-auto md:translate-x-0
          ${mounted && collapsed ? 'md:w-16' : 'md:w-64'}
        `}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center p-4 border-b border-slate-200 pointer-events-auto">
          <div className={`transition-all duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100 w-auto'
            }`}>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              OpenBlogAI
            </h1>
          </div>
          <ToggleButton onClick={toggleCollapse} isOpen={!collapsed} />
        </div>

        {/* Mobile Header - only show when sidebar is open on mobile */}
        {mounted && isOpen && (
          <div className="md:hidden flex justify-between items-center p-4 border-b border-slate-200 bg-slate-50/80 backdrop-blur-sm">
            <h1 className="text-lg font-semibold text-slate-700">
              Menu
            </h1>
            <button
              onClick={onToggle || toggleSidebar}
              className="p-2 rounded-lg hover:bg-slate-200 active:bg-slate-300 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {/* Navigation Links */}
        <div
          className="flex-1 flex flex-col px-4 py-6 overflow-y-auto pointer-events-auto"
          onClick={(e) => console.log('Navigation container clicked:', e.target)}
        >
          <nav className="flex-1 pointer-events-auto">
            <ul className="space-y-2 pointer-events-auto">
              <SidebarItem
                href="/"
                icon="home"
                text="Home"
                collapsed={collapsed}
              />
              <SidebarItem
                href="/dashboard"
                icon="dashboard"
                text="Dashboard"
                collapsed={collapsed}
              />
              <SidebarItem
                href="/create-blog"
                icon="create"
                text="Create Blog"
                collapsed={collapsed}
              />
              <SidebarItem
                href="/myblogs"
                icon="blog"
                text="My Blogs"
                collapsed={collapsed}
              />
              <SidebarItem
                href="/profile"
                icon="profile"
                text="Profile"
                collapsed={collapsed}
              />
            </ul>
          </nav>

          {/* Logout Button at Bottom */}
          <div className="mt-auto pt-6 border-t border-slate-200">
            <SidebarItem
              onClick={handleLogout}
              icon="logout"
              text="Logout"
              collapsed={collapsed}
            />
          </div>
        </div>


      </aside>
    </>
  );
};
