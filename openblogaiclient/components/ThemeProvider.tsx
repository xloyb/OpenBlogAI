"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

// All available DaisyUI themes
export type DaisyUITheme =
    // Default themes
    | 'light' | 'dark'
    // Professional themes  
    | 'corporate' | 'business' | 'luxury' | 'wireframe'
    // Colorful themes
    | 'synthwave' | 'retro' | 'cyberpunk' | 'valentine' | 'halloween'
    | 'garden' | 'forest' | 'aqua' | 'lofi' | 'pastel' | 'fantasy'
    | 'cmyk' | 'autumn' | 'acid' | 'lemonade'
    // Dark themes
    | 'night' | 'coffee' | 'winter' | 'dim' | 'nord' | 'sunset'
    | 'dracula' | 'black'
    // Custom themes
    | 'lightCustom' | 'darkCustom';

export interface ThemeInfo {
    id: DaisyUITheme;
    name: string;
    category: 'default' | 'professional' | 'colorful' | 'dark' | 'custom';
    isDark: boolean;
    description: string;
    preview?: {
        primary: string;
        secondary: string;
        background: string;
    };
}

export const AVAILABLE_THEMES: ThemeInfo[] = [
    // Default themes
    { id: 'light', name: 'Light', category: 'default', isDark: false, description: 'Clean and minimal light theme' },
    { id: 'dark', name: 'Dark', category: 'default', isDark: true, description: 'Sleek and modern dark theme' },

    // Professional themes
    { id: 'corporate', name: 'Corporate', category: 'professional', isDark: false, description: 'Professional business theme' },
    { id: 'business', name: 'Business', category: 'professional', isDark: false, description: 'Clean business interface' },
    { id: 'luxury', name: 'Luxury', category: 'professional', isDark: true, description: 'Elegant premium theme' },
    { id: 'wireframe', name: 'Wireframe', category: 'professional', isDark: false, description: 'Minimalist wireframe style' },

    // Colorful themes
    { id: 'synthwave', name: 'Synthwave', category: 'colorful', isDark: true, description: 'Retro neon cyberpunk style' },
    { id: 'retro', name: 'Retro', category: 'colorful', isDark: false, description: 'Vintage computing aesthetic' },
    { id: 'cyberpunk', name: 'Cyberpunk', category: 'colorful', isDark: true, description: 'Futuristic cyber theme' },
    { id: 'valentine', name: 'Valentine', category: 'colorful', isDark: false, description: 'Romantic pink theme' },
    { id: 'halloween', name: 'Halloween', category: 'colorful', isDark: true, description: 'Spooky orange and black' },
    { id: 'garden', name: 'Garden', category: 'colorful', isDark: false, description: 'Fresh green nature theme' },
    { id: 'forest', name: 'Forest', category: 'colorful', isDark: true, description: 'Deep forest greens' },
    { id: 'aqua', name: 'Aqua', category: 'colorful', isDark: false, description: 'Ocean blue theme' },
    { id: 'lofi', name: 'Lo-Fi', category: 'colorful', isDark: false, description: 'Chill pastel vibes' },
    { id: 'pastel', name: 'Pastel', category: 'colorful', isDark: false, description: 'Soft pastel colors' },
    { id: 'fantasy', name: 'Fantasy', category: 'colorful', isDark: false, description: 'Magical purple theme' },
    { id: 'cmyk', name: 'CMYK', category: 'colorful', isDark: false, description: 'Print-inspired colors' },
    { id: 'autumn', name: 'Autumn', category: 'colorful', isDark: false, description: 'Warm fall colors' },
    { id: 'acid', name: 'Acid', category: 'colorful', isDark: false, description: 'Bright neon colors' },
    { id: 'lemonade', name: 'Lemonade', category: 'colorful', isDark: false, description: 'Fresh yellow theme' },

    // Dark themes
    { id: 'night', name: 'Night', category: 'dark', isDark: true, description: 'Deep night theme' },
    { id: 'coffee', name: 'Coffee', category: 'dark', isDark: true, description: 'Rich coffee browns' },
    { id: 'winter', name: 'Winter', category: 'dark', isDark: true, description: 'Cool winter blues' },
    { id: 'dim', name: 'Dim', category: 'dark', isDark: true, description: 'Subtle dim theme' },
    { id: 'nord', name: 'Nord', category: 'dark', isDark: true, description: 'Arctic inspired colors' },
    { id: 'sunset', name: 'Sunset', category: 'dark', isDark: true, description: 'Warm sunset gradients' },
    { id: 'dracula', name: 'Dracula', category: 'dark', isDark: true, description: 'Popular dark theme' },
    { id: 'black', name: 'Black', category: 'dark', isDark: true, description: 'Pure black theme' },

    // Custom themes
    { id: 'lightCustom', name: 'Light Custom', category: 'custom', isDark: false, description: 'Custom light theme with your branding' },
    { id: 'darkCustom', name: 'Dark Custom', category: 'custom', isDark: true, description: 'Custom dark theme with your branding' },
];

interface ThemeContextType {
    theme: DaisyUITheme;
    setTheme: (theme: DaisyUITheme) => void;
    toggleTheme: () => void;
    availableThemes: ThemeInfo[];
    getThemeInfo: (theme: DaisyUITheme) => ThemeInfo | undefined;
    isDarkTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setThemeState] = useState<DaisyUITheme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check localStorage for saved theme preference
        const savedTheme = localStorage.getItem('theme') as DaisyUITheme;
        const isValidTheme = AVAILABLE_THEMES.some(t => t.id === savedTheme);

        if (savedTheme && isValidTheme) {
            setThemeState(savedTheme);
        } else {
            // Check system preference if no saved theme
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setThemeState(systemPrefersDark ? 'dark' : 'light');
        }
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            // Apply DaisyUI theme to document
            document.documentElement.setAttribute('data-theme', theme);

            // Also add/remove dark class for custom components compatibility
            const themeInfo = getThemeInfo(theme);
            if (themeInfo?.isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            // Save to localStorage
            localStorage.setItem('theme', theme);
        }
    }, [theme, mounted]);

    const setTheme = (newTheme: DaisyUITheme) => {
        setThemeState(newTheme);
    };

    const toggleTheme = () => {
        // Toggle between light and dark variants
        const currentThemeInfo = getThemeInfo(theme);
        if (currentThemeInfo?.isDark) {
            // Switch to light theme
            setThemeState('light');
        } else {
            // Switch to dark theme
            setThemeState('dark');
        }
    };

    const getThemeInfo = (themeId: DaisyUITheme): ThemeInfo | undefined => {
        return AVAILABLE_THEMES.find(t => t.id === themeId);
    };

    const isDarkTheme = getThemeInfo(theme)?.isDark || false;

    const value: ThemeContextType = {
        theme,
        setTheme,
        toggleTheme,
        availableThemes: AVAILABLE_THEMES,
        getThemeInfo,
        isDarkTheme,
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};