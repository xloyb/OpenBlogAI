"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiLayout,
    FiEdit,
    FiFileText,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronLeft
} from 'react-icons/fi';
import { doLogout } from '@/actions/auth';

interface SidebarProps {
    isOpen?: boolean;
    onToggle?: () => void;
}

const menuItems = [
    { href: '/', icon: FiHome, label: 'Home' },
    { href: '/dashboard', icon: FiLayout, label: 'Dashboard' },
    { href: '/create-blog', icon: FiEdit, label: 'Create Blog' },
    { href: '/myblogs', icon: FiFileText, label: 'My Blogs' },
    { href: '/profile', icon: FiUser, label: 'Profile' }
];

export default function SimpleSidebar({ isOpen = true, onToggle }: SidebarProps) {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Load collapsed state from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved) {
            setIsCollapsed(JSON.parse(saved));
        }
    }, []);

    // Set CSS custom property for main content margin
    useEffect(() => {
        const updateSidebarWidth = () => {
            if (window.innerWidth >= 768) { // Desktop
                const width = isCollapsed ? '64px' : '256px'; // 16 * 4 = 64px, 64 * 4 = 256px
                document.documentElement.style.setProperty('--sidebar-width', width);
            } else { // Mobile
                document.documentElement.style.setProperty('--sidebar-width', '0px');
            }
        };

        updateSidebarWidth();
        window.addEventListener('resize', updateSidebarWidth);
        return () => window.removeEventListener('resize', updateSidebarWidth);
    }, [isCollapsed]);

    const toggleCollapsed = () => {
        const newState = !isCollapsed;
        setIsCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState));
    };

    const handleMobileToggle = () => {
        if (onToggle) {
            onToggle();
        } else {
            setIsMobileOpen(!isMobileOpen);
        }
    };

    const handleLogout = async () => {
        try {
            await doLogout();
        } catch (error) {
            console.error('Logout failed:', error);
            window.location.href = '/login';
        }
    };

    const effectiveIsOpen = onToggle ? isOpen : isMobileOpen;

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={handleMobileToggle}
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50"
                aria-label="Toggle menu"
            >
                {effectiveIsOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            {effectiveIsOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={handleMobileToggle}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-xl z-45
          transition-all duration-300 ease-in-out flex flex-col
          ${effectiveIsOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${isCollapsed ? 'md:w-16' : 'md:w-64'}
          w-64
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    {!isCollapsed && (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            OpenBlogAI
                        </h1>
                    )}

                    {/* Desktop Collapse Button */}
                    <button
                        onClick={toggleCollapsed}
                        className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <FiChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => {
                                            // Close mobile menu on navigation
                                            if (window.innerWidth < 768) {
                                                handleMobileToggle();
                                            }
                                        }}
                                        className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
                      ${isActive
                                                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }
                      ${isCollapsed ? 'justify-center' : ''}
                    `}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        {!isCollapsed && (
                                            <span className="font-medium">{item.label}</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Logout Button */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className={`
              flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors
              ${isCollapsed ? 'justify-center' : ''}
            `}
                    >
                        <FiLogOut className="w-5 h-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}