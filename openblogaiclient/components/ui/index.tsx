"use client";

import React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Button variants using DaisyUI classes with enhanced styling
const buttonVariants = cva(
    "btn transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-offset-2",
    {
        variants: {
            variant: {
                // Primary button - DaisyUI primary with gradient enhancement
                primary: "btn-primary bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-secondary",

                // Secondary button - DaisyUI secondary
                secondary: "btn-secondary",

                // Outline button - DaisyUI outline primary
                outline: "btn-outline btn-primary",

                // Ghost button - DaisyUI ghost
                ghost: "btn-ghost",

                // Destructive button - DaisyUI error
                destructive: "btn-error",

                // Success button - DaisyUI success
                success: "btn-success",

                // Neutral button - DaisyUI neutral
                neutral: "btn-neutral",

                // Accent button - DaisyUI accent
                accent: "btn-accent",
            },
            size: {
                sm: "btn-sm",
                md: "btn-md",
                lg: "btn-lg",
                xl: "btn-lg text-lg px-8",
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
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                )}
                {leftIcon && <span className="mr-2">{leftIcon}</span>}
                {children}
                {rightIcon && <span className="ml-2">{rightIcon}</span>}
            </button>
        );
    }
); Button.displayName = "Button";

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

// Card component using DaisyUI
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    shadow?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    bordered?: boolean;
    compact?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, shadow = 'lg', bordered = true, compact = false, children, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "card bg-base-100",
                    shadow === 'sm' && "shadow-sm",
                    shadow === 'md' && "shadow-md",
                    shadow === 'lg' && "shadow-lg",
                    shadow === 'xl' && "shadow-xl",
                    shadow === '2xl' && "shadow-2xl",
                    bordered && "border border-base-300",
                    compact && "card-compact",
                    className
                )}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = "Card";

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div className={cn("card-body", className)} ref={ref} {...props} />
        );
    }
);
CardBody.displayName = "CardBody";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => {
        return (
            <h2 className={cn("card-title", className)} ref={ref} {...props} />
        );
    }
);
CardTitle.displayName = "CardTitle";

export const CardActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        return (
            <div className={cn("card-actions justify-end", className)} ref={ref} {...props} />
        );
    }
);
CardActions.displayName = "CardActions";