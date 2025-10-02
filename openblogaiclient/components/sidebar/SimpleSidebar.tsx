"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
    FiHome,
    FiEdit,
    FiFileText,
    FiUser,
    FiLogOut,
    FiMenu,
    FiX,
    FiChevronLeft,
    FiLogIn,
    FiUserPlus,
    FiShield
} from 'react-icons/fi';
import { doLogout } from '@/actions/auth';

interface SidebarProps {
    isOpen?: boolean;
    onToggle?: () => void;
}

// Public menu items (always visible)
const publicMenuItems = [
    { href: '/', icon: FiHome, label: 'Home' },
    { href: '/blogs', icon: FiFileText, label: 'Blogs' }
];

// Authenticated user menu items
const authMenuItems = [
    { href: '/myblogs', icon: FiFileText, label: 'My Blogs' },
    { href: '/profile', icon: FiUser, label: 'Profile' }
];

// Admin/Mod only menu items
const adminModMenuItems = [
    { href: '/create-blog', icon: FiEdit, label: 'Create Blog', roles: ['admin', 'moderator'] }
];

// Admin only menu items  
const adminMenuItems = [
    { href: '/dashboard', icon: FiShield, label: 'Admin Control Panel', roles: ['admin'] }
];

// Guest menu items (not logged in)
const guestMenuItems = [
    { href: '/login', icon: FiLogIn, label: 'Login' },
    { href: '/register', icon: FiUserPlus, label: 'Register' }
];

export default function SimpleSidebar({ isOpen = true, onToggle }: SidebarProps) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed by default
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Get user permissions from session
    const isAuthenticated = status === 'authenticated';
    const isAdmin = session?.user?.isAdmin || false;
    const isModerator = session?.user?.isModerator || false;
    const isAdminOrMod = isAdmin || isModerator;

    // Build dynamic menu based on authentication and role
    const getMenuItems = () => {
        let items = [...publicMenuItems];

        if (isAuthenticated) {
            // Add authenticated user items
            items = [...items, ...authMenuItems];

            // Add admin/moderator items
            if (isAdminOrMod) {
                items = [...items, ...adminModMenuItems];
            }

            // Add admin-only items
            if (isAdmin) {
                items = [...items, ...adminMenuItems];
            }
        } else {
            // Add guest items (login/register)
            items = [...items, ...guestMenuItems];
        }

        return items;
    };

    const menuItems = getMenuItems();

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

                {/* User Info & Logout Button - Only for authenticated users */}
                {isAuthenticated && (
                    <div className="p-4 border-t border-gray-200">
                        {/* User Role Indicator */}
                        {!isCollapsed && (
                            <div className="mb-3 px-3 py-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <FiShield className="w-4 h-4 text-gray-600" />
                                    <span className="text-xs font-medium text-gray-700">
                                        {isAdmin ? 'Admin' : isModerator ? 'Moderator' : 'User'}
                                    </span>
                                </div>
                                {session?.user?.name && (
                                    <p className="text-xs text-gray-500 mt-1 truncate">
                                        {session.user.name}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Logout Button */}
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
                )}
            </aside>
        </>
    );
}