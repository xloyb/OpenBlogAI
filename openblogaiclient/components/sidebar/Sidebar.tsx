
"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { ToggleButton } from "./ToggleButton";
import { SidebarItem } from "./SidebarItem";

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true); // Controls whether the sidebar is open or closed
  const [collapsed, setCollapsed] = useState(false); // Controls whether the sidebar is collapsed (icons only)
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);


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
      await console.log("Logout clicked");
    } catch (err) {
      console.log("Logout Error:", err)
    }
  }

  // Toggle sidebar open/closed and collapsed/expanded
  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    setCollapsed(!collapsed); // Toggle collapsed state
    setActiveSubmenu(null);
    localStorage.setItem("sidebarOpen", newState.toString());
    localStorage.setItem("sidebarCollapsed", (!collapsed).toString()); // Save collapsed state
    console.log("Toggled sidebar. Open:", newState, "Collapsed:", !collapsed); // Debug log
  };

  const toggleSubmenu = (submenu: string) => {
    if (activeSubmenu === submenu) {
      setActiveSubmenu(null);
    } else {
      setActiveSubmenu(submenu);
      if (!isOpen) setIsOpen(true);
      if (collapsed) setCollapsed(false); // Expand sidebar if collapsed
    }
  };



  return (
    <>
      <nav
        className={`duration-300 ease-in-out overflow-hidden 
                    md:sticky md:top-0 md:h-screen md:border-r md:border-t-0
                    fixed bottom-0 left-0 w-full h-[60px] border-t ${isOpen
            ? "md:w-[250px] md:px-4"
            : "md:w-[60px] md:px-[5px]"
          }`}
      >
        <div className="hidden md:block"> {/* Only show this div on medium screens and above (desktop) */}
          <div className="flex justify-between items-center mb-4">
            <span
              className={`font-semibold mt-4 font-title inline-flex text-lg md:text-2xl ${collapsed ? "!hidden" : "block"
                }`}
            >
              OpenBlogAI
            </span>
            <ToggleButton onClick={toggleSidebar} isOpen={isOpen} />
          </div>
        </div>
        <ul className="list-none p-0 flex md:flex-col md:overflow-hidden overflow-x-auto">
          {/* Updated li element */}
          <li className="mb:flex mb:justify-end mb:items-center mb-4">
            <span className={`font-semibold ${collapsed ? "md:!hidden" : ""}`}>
              OpenBlogAI
            </span>
            <span className="md:hidden">test</span>{" "}
            {/* Hide "test" on medium screens and above */}
            <ToggleButton onClick={toggleSidebar} isOpen={isOpen} />
          </li>
          <SidebarItem
            href="index.html"
            icon="home"
            text="Home"
            collapsed={collapsed}
          />
          <SidebarItem
            href="dashboard.html"
            icon="dashboard"
            text="Dashboard"
            collapsed={collapsed}
          />
          <SidebarItem
            icon="create"
            text="Create"
            isSubmenu
            isOpen={activeSubmenu === "create"}
            onClick={() => toggleSubmenu("create")}
            submenuItems={[
              { href: "#", text: "Folder" },
              { href: "#", text: "Document" },
              { href: "#", text: "Project" },
            ]}
            collapsed={collapsed}
          />
          <SidebarItem
            icon="todo"
            text="Todo-Lists"
            isSubmenu
            isOpen={activeSubmenu === "todo"}
            onClick={() => toggleSubmenu("todo")}
            submenuItems={[
              { href: "#", text: "Work" },
              { href: "#", text: "Private" },
              { href: "#", text: "Coding" },
              { href: "#", text: "Gardening" },
              { href: "#", text: "School" },
            ]}
            collapsed={collapsed}
          />
          <SidebarItem
            href="calendar.html"
            icon="calendar"
            text="Calendar"
            active
            collapsed={collapsed}
          />
          <SidebarItem
            href="profile.html"
            icon="profile"
            text="Profile"
            collapsed={collapsed}
          />

          <SidebarItem
            onClick={handleLogout}
            icon="logout"
            text="Logout"
            collapsed={collapsed}
          />


        </ul>
      </nav>
    </>
  );
};
