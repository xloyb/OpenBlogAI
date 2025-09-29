"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from './ThemeProvider';

export const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            onClick={toggleTheme}
            className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'dark' ? 180 : 0,
                    opacity: theme === 'dark' ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
            >
                <FiSun className="w-5 h-5 text-yellow-500" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'light' ? -180 : 0,
                    opacity: theme === 'light' ? 0 : 1,
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
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.div
            className="flex cursor-pointer gap-2 items-center text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleTheme}
        >
            <FiSun className={`w-4 h-4 transition-colors ${theme === 'light' ? 'text-yellow-500' : 'text-gray-400'}`} />
            <div className="relative w-8 h-5">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"></div>
                <motion.div
                    className="absolute top-0.5 left-0.5 w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow-sm transition-all"
                    animate={{
                        x: theme === 'dark' ? 12 : 0,
                    }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                ></motion.div>
            </div>
            <FiMoon className={`w-4 h-4 transition-colors ${theme === 'dark' ? 'text-blue-400' : 'text-gray-400'}`} />
        </motion.div>
    );
};

// Dropdown menu item version
export const ThemeToggleMenuItem: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="px-4 py-2">
            <label className="flex cursor-pointer justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                    {theme === 'light' ? (
                        <FiSun className="w-4 h-4 text-yellow-500" />
                    ) : (
                        <FiMoon className="w-4 h-4 text-blue-400" />
                    )}
                    <span className="text-gray-700 dark:text-gray-300">
                        {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                    </span>
                </div>
                <div className="relative w-8 h-5">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"></div>
                    <motion.div
                        className="absolute top-0.5 left-0.5 w-4 h-4 bg-white dark:bg-gray-900 rounded-full shadow-sm transition-all"
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