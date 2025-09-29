"use client";

import { useState } from 'react';
import { doLogout } from '@/actions/auth';
import { FaSignOutAlt, FaSpinner } from 'react-icons/fa';

interface LogoutButtonProps {
    variant?: 'button' | 'link' | 'icon';
    className?: string;
    showText?: boolean;
}

export default function LogoutButton({
    variant = 'button',
    className = '',
    showText = true
}: LogoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        if (isLoading) return;

        setIsLoading(true);
        console.log("🔄 Logout initiated from LogoutButton");

        try {
            await doLogout();
        } catch (error) {
            console.error("❌ LogoutButton error:", error);
            // Fallback: Force redirect to login
            window.location.href = '/login';
        } finally {
            setIsLoading(false);
        }
    };

    const baseClasses = "flex items-center gap-2 transition-colors";

    const variantClasses = {
        button: "btn btn-ghost hover:btn-error",
        link: "link link-hover text-error hover:text-error-focus",
        icon: "btn btn-ghost btn-circle hover:btn-error"
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className={combinedClasses}
            title="Sign Out"
        >
            {isLoading ? (
                <FaSpinner className="animate-spin" />
            ) : (
                <FaSignOutAlt />
            )}
            {showText && variant !== 'icon' && (
                <span>{isLoading ? 'Signing out...' : 'Sign Out'}</span>
            )}
        </button>
    );
}