"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPalette, FiCheck, FiSun, FiMoon, FiStar, FiGrid } from 'react-icons/fi';
import { useTheme, DaisyUITheme, ThemeInfo } from './ThemeProvider';

interface ThemeSelectorProps {
    showAsModal?: boolean;
    onClose?: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ showAsModal = false, onClose }) => {
    const { theme: currentTheme, setTheme, availableThemes } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [previewTheme, setPreviewTheme] = useState<DaisyUITheme | null>(null);

    const categories = [
        { id: 'all', name: 'All Themes', icon: FiGrid },
        { id: 'default', name: 'Default', icon: FiSun },
        { id: 'professional', name: 'Professional', icon: FiStar },
        { id: 'colorful', name: 'Colorful', icon: FiPalette },
        { id: 'dark', name: 'Dark', icon: FiMoon },
        { id: 'custom', name: 'Custom', icon: FiGrid },
    ];

    const filteredThemes = selectedCategory === 'all'
        ? availableThemes
        : availableThemes.filter(theme => theme.category === selectedCategory);

    const handleThemeSelect = (themeId: DaisyUITheme) => {
        setTheme(themeId);
        if (onClose) {
            setTimeout(() => onClose(), 150); // Small delay for visual feedback
        }
    };

    const handlePreview = (themeId: DaisyUITheme) => {
        setPreviewTheme(themeId);
        document.documentElement.setAttribute('data-theme', themeId);
    };

    const handlePreviewEnd = () => {
        setPreviewTheme(null);
        document.documentElement.setAttribute('data-theme', currentTheme);
    };

    const ThemeCard = ({ themeInfo }: { themeInfo: ThemeInfo }) => {
        const isSelected = currentTheme === themeInfo.id;
        const isPreviewing = previewTheme === themeInfo.id;

        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                    card bg-base-100 shadow-md cursor-pointer transition-all duration-200
                    ${isSelected ? 'ring-2 ring-primary shadow-primary/20' : 'hover:shadow-lg'}
                    ${isPreviewing ? 'ring-2 ring-secondary' : ''}
                `}
                onClick={() => handleThemeSelect(themeInfo.id)}
                onMouseEnter={() => handlePreview(themeInfo.id)}
                onMouseLeave={handlePreviewEnd}
                data-theme={themeInfo.id}
            >
                <div className="card-body p-4">
                    {/* Theme Preview Colors */}
                    <div className="flex gap-1 mb-3">
                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                        <div className="w-3 h-3 rounded-full bg-secondary"></div>
                        <div className="w-3 h-3 rounded-full bg-accent"></div>
                        <div className="w-3 h-3 rounded-full bg-base-200"></div>
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                            >
                                <FiCheck className="w-4 h-4 text-primary" />
                            </motion.div>
                        )}
                    </div>

                    {/* Theme Name */}
                    <h3 className="font-semibold text-sm mb-1 text-base-content">
                        {themeInfo.name}
                    </h3>

                    {/* Theme Description */}
                    <p className="text-xs text-base-content/70 line-clamp-2">
                        {themeInfo.description}
                    </p>

                    {/* Theme Badge */}
                    <div className="flex justify-between items-center mt-3">
                        <div className={`badge badge-sm ${themeInfo.isDark ? 'badge-neutral' : 'badge-ghost'
                            }`}>
                            {themeInfo.isDark ? 'Dark' : 'Light'}
                        </div>
                        <div className="text-xs text-base-content/50 capitalize">
                            {themeInfo.category}
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    const content = (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <FiPalette className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-base-content">Theme Selector</h2>
                        <p className="text-sm text-base-content/70">Choose your preferred theme</p>
                    </div>
                </div>
                {showAsModal && onClose && (
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-ghost btn-circle"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`btn btn-sm gap-2 ${isActive ? 'btn-primary' : 'btn-ghost'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {category.name}
                        </button>
                    );
                })}
            </div>

            {/* Current Theme Info */}
            <div className="alert alert-info">
                <FiCheck className="w-5 h-5" />
                <div>
                    <div className="font-medium">
                        Current: {availableThemes.find(t => t.id === currentTheme)?.name}
                    </div>
                    <div className="text-sm opacity-70">
                        {availableThemes.find(t => t.id === currentTheme)?.description}
                    </div>
                </div>
            </div>

            {/* Themes Grid */}
            <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
                <AnimatePresence mode="popLayout">
                    {filteredThemes.map((themeInfo) => (
                        <motion.div
                            key={themeInfo.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ThemeCard themeInfo={themeInfo} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Theme Count */}
            <div className="text-center text-sm text-base-content/60">
                Showing {filteredThemes.length} of {availableThemes.length} themes
            </div>
        </div>
    );

    if (showAsModal) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-base-100 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {content}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-base-100 rounded-2xl p-6 border border-base-300">
            {content}
        </div>
    );
};

export default ThemeSelector;

// Compact Theme Selector for dropdowns/menus
export const ThemeSelectorCompact: React.FC = () => {
    const { theme: currentTheme, setTheme, availableThemes } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost gap-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <FiPalette className="w-4 h-4" />
                <span className="hidden sm:inline">
                    {availableThemes.find(t => t.id === currentTheme)?.name}
                </span>
            </div>

            {isOpen && (
                <ul className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-80 max-h-96 overflow-y-auto">
                    <li className="menu-title">
                        <span>Select Theme</span>
                    </li>
                    {availableThemes.map((themeInfo) => (
                        <li key={themeInfo.id}>
                            <button
                                onClick={() => {
                                    setTheme(themeInfo.id);
                                    setIsOpen(false);
                                }}
                                className={`flex items-center gap-3 ${currentTheme === themeInfo.id ? 'active' : ''
                                    }`}
                            >
                                <div className="flex gap-1">
                                    <div
                                        className="w-3 h-3 rounded-full bg-primary"
                                        data-theme={themeInfo.id}
                                    ></div>
                                    <div
                                        className="w-3 h-3 rounded-full bg-secondary"
                                        data-theme={themeInfo.id}
                                    ></div>
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium">{themeInfo.name}</div>
                                    <div className="text-xs opacity-70">{themeInfo.description}</div>
                                </div>
                                {currentTheme === themeInfo.id && (
                                    <FiCheck className="w-4 h-4 text-primary" />
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};