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
            className="btn btn-ghost btn-circle swap swap-rotate"
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
                className="swap-off absolute"
            >
                <FiSun className="w-5 h-5" />
            </motion.div>

            <motion.div
                initial={false}
                animate={{
                    rotate: theme === 'light' ? -180 : 0,
                    opacity: theme === 'light' ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
                className="swap-on absolute"
            >
                <FiMoon className="w-5 h-5" />
            </motion.div>
        </motion.button>
    );
};

// Alternative compact version for smaller spaces
export const ThemeToggleCompact: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.label
            className="flex cursor-pointer gap-2 items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <FiSun className="w-4 h-4" />
            <input
                type="checkbox"
                checked={theme === 'dark'}
                onChange={toggleTheme}
                className="toggle toggle-sm"
                aria-label="Toggle theme"
            />
            <FiMoon className="w-4 h-4" />
        </motion.label>
    );
};

// Dropdown menu item version
export const ThemeToggleMenuItem: React.FC = () => {
    const { theme, setTheme } = useTheme();

    return (
        <div className="form-control">
            <label className="label cursor-pointer justify-start gap-3">
                <div className="flex items-center gap-2">
                    {theme === 'light' ? (
                        <FiSun className="w-4 h-4" />
                    ) : (
                        <FiMoon className="w-4 h-4" />
                    )}
                    <span className="label-text">
                        {theme === 'light' ? 'Light Theme' : 'Dark Theme'}
                    </span>
                </div>
                <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                    className="toggle toggle-primary toggle-sm"
                />
            </label>
        </div>
    );
};