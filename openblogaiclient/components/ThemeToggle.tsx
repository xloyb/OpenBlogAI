"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
    const { isDarkTheme, toggleTheme, getThemeInfo, theme } = useTheme();
    const currentThemeInfo = getThemeInfo(theme);

    return (
        <motion.button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
            title={`Current: ${currentThemeInfo?.name || theme}`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: isDarkTheme ? 180 : 0,
                    opacity: isDarkTheme ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <FiSun className="w-5 h-5 text-yellow-500" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: !isDarkTheme ? -180 : 0,
                    opacity: !isDarkTheme ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <FiMoon className="w-5 h-5 text-blue-400" />
            </motion.div>

            {/* Invisible content for sizing */}
            <div className="invisible">
                <FiSun className="w-5 h-5" />
            </div>
        </motion.button>
    );
};

// Alternative compact version for smaller spaces
export const ThemeToggleCompact: React.FC = () => {
    const { isDarkTheme, toggleTheme, getThemeInfo, theme } = useTheme();
    const currentThemeInfo = getThemeInfo(theme);

    return (
        <motion.div
            className="flex cursor-pointer gap-2 items-center text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
            title={`Current: ${currentThemeInfo?.name || theme}`}
        >
            <FiSun className={`w-4 h-4 transition-colors ${!isDarkTheme ? 'text-yellow-500' : 'text-base-content/40'}`} />
            <div className="relative w-8 h-5">
                <div className="absolute inset-0 bg-base-300 rounded-full transition-colors"></div>
                <motion.div
                    className="absolute top-0.5 left-0.5 w-4 h-4 bg-base-100 rounded-full shadow-sm transition-all border border-base-300"
                    animate={{
                        x: isDarkTheme ? 12 : 0,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                ></motion.div>
            </div>
            <FiMoon className={`w-4 h-4 transition-colors ${isDarkTheme ? 'text-blue-400' : 'text-base-content/40'}`} />
        </motion.div>
    );
};

// Dropdown menu item version
export const ThemeToggleMenuItem: React.FC = () => {
    const { isDarkTheme, toggleTheme, getThemeInfo, theme } = useTheme();
    const currentThemeInfo = getThemeInfo(theme);

    return (
        <div className="px-4 py-2">
            <label className="flex cursor-pointer justify-between items-center" onClick={toggleTheme}>
                <div className="flex items-center gap-2 text-sm">
                    {!isDarkTheme ? (
                        <FiSun className="w-4 h-4 text-yellow-500" />
                    ) : (
                        <FiMoon className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-base-content">
                        {currentThemeInfo?.name || theme}
                    </span>
                    <span className="text-xs opacity-60">({isDarkTheme ? 'Dark' : 'Light'})</span>
                </div>
                <div className="relative w-8 h-5">
                    <div className="absolute inset-0 bg-base-300 rounded-full transition-colors"></div>
                    <motion.div
                        className="absolute top-0.5 left-0.5 w-4 h-4 bg-base-100 rounded-full shadow-sm transition-all border border-base-300"
                        animate={{
                            x: theme === 'dark' ? 12 : 0,
                        }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    ></motion.div>
                    <input
                        type="checkbox"
                        checked={theme === 'dark'}
                        onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
            </label>
        </div>
    );
};