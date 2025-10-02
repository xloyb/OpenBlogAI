
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

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

  // Load sidebar state from local storage on mount and handle responsive behavior
  useEffect(() => {
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
    // Always toggle collapsed state on desktop regardless of external control
    const newCollapsedState = !collapsed;
    console.log("Before toggle - collapsed:", collapsed, "new state will be:", newCollapsedState);
    setCollapsed(newCollapsedState);
    localStorage.setItem("sidebarCollapsed", newCollapsedState.toString());
    console.log("Desktop: Toggled sidebar collapsed to:", newCollapsedState);
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
      {/* Mobile Menu Overlay - only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-all duration-300 ease-in-out"
          onClick={onToggle || toggleSidebar}
          style={{ touchAction: 'none' }}
        />
      )}

      <nav
        className={`transition-all duration-300 ease-in-out bg-gradient-to-b from-white via-slate-50 to-blue-50 border-r border-slate-200 shadow-2xl z-[70]
                    md:relative md:h-screen md:flex md:flex-col md:transform-none
                    fixed left-0 top-0 h-full transform ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } ${collapsed ? 'md:w-20' : 'md:w-64'} ${isOpen ? 'w-64' : 'w-0'
          } md:${collapsed ? 'w-20' : 'w-64'}`}
        style={{ touchAction: 'pan-y' }}
      >
        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center p-6 border-b border-slate-200">
          <div className={`transition-opacity duration-300 ${collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              OpenBlogAI
            </h1>
          </div>
          <ToggleButton onClick={toggleCollapse} isOpen={!collapsed} />
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-slate-200">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            OpenBlogAI
          </h1>
          <button
            onClick={onToggle || toggleSidebar}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Navigation Links */}
        <div className="flex-1 flex flex-col px-4 py-6 overflow-y-auto">
          <nav className="flex-1">
            <ul className="space-y-2">
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


      </nav>
    </>
  );
};
