"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Button variants using CVA for better type safety and consistency
const buttonVariants = cva(
    // Base styles - Enhanced for login page aesthetic
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:pointer-events-none hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md",
    {
        variants: {
            variant: {
                // Primary button - Enhanced gradient like login page
                primary: "bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white shadow-lg hover:shadow-xl focus:ring-primary-500 dark:shadow-2xl dark:hover:shadow-primary-500/25",

                // Secondary button - Refined dark theme styling
                secondary: "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 dark:border-gray-600 focus:ring-gray-500 dark:shadow-lg",

                // Outline button - Login page inspired styling
                outline: "border-2 border-gray-300 hover:border-primary-400 bg-transparent hover:bg-gray-50 text-gray-700 dark:border-gray-600 dark:hover:border-primary-400 dark:hover:bg-gray-700/50 dark:text-gray-300 focus:ring-primary-500 dark:shadow-lg dark:hover:shadow-primary-500/10",

                // Ghost button - Enhanced hover states
                ghost: "hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-700/50 dark:text-gray-300 focus:ring-gray-500 dark:hover:shadow-lg",

                // Destructive button - Enhanced shadows
                destructive: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl focus:ring-red-500 dark:shadow-2xl dark:hover:shadow-red-500/25",

                // Success button - Enhanced styling
                success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500 dark:shadow-2xl dark:hover:shadow-green-500/25",
            },
            size: {
                sm: "h-8 px-3 text-sm font-medium",
                md: "h-10 px-4 text-sm font-medium",
                lg: "h-12 px-6 text-base font-semibold tracking-wide",
                xl: "h-14 px-8 text-lg font-semibold tracking-wide",
            },
        },
        defaultVariants: {
            variant: "primary",
            size: "md",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        const MotionButton = motion.button;

        return (
            <MotionButton
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
                whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
                transition={{ duration: 0.1 }}
                {...props}
            >
                {loading && (
                    <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                )}
                {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
            </MotionButton>
        );
    }
);

Button.displayName = "Button";

// Input component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, leftIcon, rightIcon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">{leftIcon}</span>
                        </div>
                    )}
                    <input
                        className={cn(
                            "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400 transition-colors duration-200",
                            leftIcon && "pl-10",
                            rightIcon && "pr-10",
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span className="text-gray-400">{rightIcon}</span>
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";