import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  HomeIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  UserIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export default function SidebarLayout() {
  // Sidebar starts as closed
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex drawer lg:drawer-open h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isOpen ? "w-64" : "w-16"
        } bg-gray-800 text-white flex flex-col transition-all duration-300`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className={`${isOpen ? "block" : "hidden"} text-lg font-bold`}>
            My App
          </span>
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 p-4">
          <SidebarItem icon={<HomeIcon className="w-6 h-6" />} text="Home" isOpen={isOpen} />
          <SidebarItem icon={<Cog6ToothIcon className="w-6 h-6" />} text="Settings" isOpen={isOpen} />
          <SidebarItem icon={<QuestionMarkCircleIcon className="w-6 h-6" />} text="Help" isOpen={isOpen} />
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <SidebarItem icon={<UserIcon className="w-6 h-6" />} text="Profile" isOpen={isOpen} />
          <SidebarItem icon={<ArrowRightStartOnRectangleIcon className="w-6 h-6" />} text="Logout" isOpen={isOpen} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <div className="bg-white shadow p-4 sticky top-0 flex justify-between">
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden">
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
          <span className="font-bold text-lg">Dashboard</span>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// SidebarItem Component
interface SidebarItemProps {
  icon: JSX.Element;
  text: string;
  isOpen: boolean;
}

function SidebarItem({ icon, text, isOpen }: SidebarItemProps) {
  return (
    <a
      href="#"
      className="flex items-center space-x-3 p-3 hover:bg-gray-700 rounded transition"
    >
      {icon}
      {isOpen && <span className="text-sm">{text}</span>}
    </a>
  );
}
