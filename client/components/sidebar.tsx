"use client"
import React, { useState } from "react";

interface SidebarProps {
  activePage?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage = "home" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    setOpenSubMenus([]); // Close all submenus when toggling
  };

  const toggleSubMenu = (menu: string) => {
    if (openSubMenus.includes(menu)) {
      setOpenSubMenus(openSubMenus.filter((item) => item !== menu));
    } else {
      setOpenSubMenus([...openSubMenus, menu]);
    }
  };

  return (
    <nav
      className={`transition-all ease-in-out duration-300 bg-base-300 text-base-content border-r ${
        isCollapsed ? "w-16" : "w-64"
      } fixed md:sticky top-0 md:h-screen h-16 md:p-4 p-0 flex md:flex-col flex-row md:border-b-0 border-t`}
    >
      {/* Toggle Button */}
      <div className="flex justify-between md:mb-4 items-center md:flex-row flex-col-reverse">
        <button
          id="toggle-btn"
          className="btn btn-circle btn-sm m-2"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 -960 960 960"
            width="24"
            fill="currentColor"
          >
            <path d="m313-480 155 156q11 11 11.5 27.5T468-268q-11 11-28 11t-28-11L228-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T468-692q11 11 11 28t-11 28L313-480Zm264 0 155 156q11 11 11.5 27.5T732-268q-11 11-28 11t-28-11L492-452q-6-6-8.5-13t-2.5-15q0-8 2.5-15t8.5-13l184-184q11-11 27.5-11.5T732-692q11 11 11 28t-11 28L577-480Z" />
          </svg>
        </button>
      </div>
      {/* Menu Items */}
      <ul className="menu md:flex-grow flex md:flex-col flex-row overflow-x-scroll">
        <li className={`${activePage === "home" ? "text-accent" : ""}`}>
          <a href="/home" className="flex md:justify-start justify-center items-center">
            <span className="material-icons">home</span>
            {!isCollapsed && <span className="ml-2 hidden md:inline">Home</span>}
          </a>
        </li>
        <li>
          <a href="/dashboard" className="flex md:justify-start justify-center items-center">
            <span className="material-icons">dashboard</span>
            {!isCollapsed && <span className="ml-2 hidden md:inline">Dashboard</span>}
          </a>
        </li>
        <li>
          <button
            className="flex items-center w-full md:justify-start justify-center"
            onClick={() => toggleSubMenu("create")}
          >
            <span className="material-icons">create</span>
            {!isCollapsed && <span className="ml-2 hidden md:inline">Create</span>}
            <span
              className={`ml-auto transition-transform ${
                openSubMenus.includes("create") ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>
          <ul
            className={`menu bg-base-200 overflow-hidden ${
              openSubMenus.includes("create") ? "h-auto" : "h-0"
            }`}
          >
            <li>
              <a href="#">Folder</a>
            </li>
            <li>
              <a href="#">Document</a>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
