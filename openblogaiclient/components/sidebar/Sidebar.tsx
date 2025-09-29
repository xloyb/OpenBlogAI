
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { ToggleButton } from "./ToggleButton";
import { SidebarItem } from "./SidebarItem";
import { ThemeToggleCompact } from "../ThemeToggle";
import { ThemeSelectorCompact } from "../ThemeSelector";

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // Controls whether the sidebar is open or closed
  const [collapsed, setCollapsed] = useState(false); // Controls whether the sidebar is collapsed (icons only)



  // Load sidebar state from local storage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    const savedCollapsedState = localStorage.getItem("sidebarCollapsed");
    console.log(
      "Loaded sidebar state from local storage:",
      savedState,
      savedCollapsedState
    ); // Debug log
    if (savedState !== null) {
      setIsOpen(savedState === "true");
    }
    if (savedCollapsedState !== null) {
      setCollapsed(savedCollapsedState === "true");
    }
  }, []);

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

  // Toggle sidebar open/closed and collapsed/expanded
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    setCollapsed(!collapsed); // Toggle collapsed state
    localStorage.setItem("sidebarOpen", newState.toString());
    localStorage.setItem("sidebarCollapsed", (!collapsed).toString()); // Save collapsed state
    console.log("Toggled sidebar. Open:", newState, "Collapsed:", !collapsed); // Debug log
  };



  return (
    <>
      <nav
        className={`duration-300 ease-in-out overflow-hidden bg-base-100 border-base-300
                    md:sticky md:top-0 md:h-screen md:border-r md:border-t-0 md:shadow-xl
                    fixed bottom-0 left-0 w-full h-[60px] border-t ${isOpen
            ? "md:w-[250px] md:px-4"
            : "md:w-[60px] md:px-[5px]"
          }`}
      >
        <div className="hidden md:block"> {/* Only show this div on medium screens and above (desktop) */}
          <div className="flex justify-between items-center mb-4">
            <span
              className={`font-semibold mt-4 font-title inline-flex text-lg md:text-2xl text-base-content ${collapsed ? "!hidden" : "block"
                }`}
            >
              OpenBlogAI
            </span>
            <ToggleButton onClick={toggleSidebar} isOpen={isOpen} />
          </div>
        </div>
        <ul className="list-none p-0 flex md:flex-col md:overflow-hidden overflow-x-auto">
          {/* Updated li element */}
          {/* <li className="mb:flex mb:justify-end mb:items-center mb-4">
            <span className={`font-semibold ${collapsed ? "md:!hidden" : ""}`}>
              OpenBlogAI
            </span>
            <span className="md:hidden">test</span>{" "}
            
            <ToggleButton onClick={toggleSidebar} isOpen={isOpen} />
          </li> */}
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
            href="/blogs"
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
          <SidebarItem
            href="/themes"
            icon="palette"
            text="Themes"
            collapsed={collapsed}
          />

          <SidebarItem
            onClick={handleLogout}
            icon="logout"
            text="Logout"
            collapsed={collapsed}
          />

          {/* Theme Selector */}
          <li className="mt-auto pt-4 border-t border-base-300">
            <div className="flex items-center justify-center p-3">
              {!collapsed && (
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm text-base-content/60">Theme</span>
                  <div className="flex gap-2">
                    <ThemeToggleCompact />
                    <ThemeSelectorCompact />
                  </div>
                </div>
              )}
              {collapsed && (
                <div className="flex flex-col gap-2">
                  <ThemeToggleCompact />
                  <ThemeSelectorCompact />
                </div>
              )}
            </div>
          </li>

        </ul>
      </nav>
    </>
  );
};
