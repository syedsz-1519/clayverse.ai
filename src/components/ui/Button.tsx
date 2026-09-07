import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group';

    // Variant styles with professional gradients and shadows
    const variantStyles = {
      primary: 'bg-gradient-to-br from-[#A8481F] to-[#8C3A16] hover:from-[#8C3A16] hover:to-[#703014] text-white shadow-lg shadow-[#A8481F]/20 hover:shadow-xl hover:shadow-[#A8481F]/30 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-[#A8481F]',
      secondary: 'bg-gradient-to-br from-brand-amber to-brand-amber-dark hover:from-brand-amber-dark hover:to-brand-amber text-white shadow-lg shadow-brand-amber/20 hover:shadow-xl hover:shadow-brand-amber/30 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-brand-amber',
      outline: 'bg-white hover:bg-neutral-50 text-neutral-800 border-2 border-neutral-300 hover:border-neutral-400 shadow-sm hover:shadow-md focus-visible:ring-neutral-400',
      ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 hover:text-neutral-900 focus-visible:ring-neutral-400',
      destructive: 'bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-red-600',
    };

    // Size styles
    const sizeStyles = {
      sm: 'text-xs px-4 py-2 gap-1.5',
      md: 'text-sm px-6 py-3 gap-2',
      lg: 'text-base px-8 py-4 gap-2.5',
    };

    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <motion.button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
        disabled={disabled || isLoading}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        {...props}
      >
        {/* Shimmer effect on hover */}
        <span className="absolute inset-0 w-full h-full">
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span 
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{ transform: 'skewX(-20deg)' }}
            />
          </span>
        </span>

        {/* Content */}
        <span className="relative flex items-center justify-center gap-inherit">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : leftIcon ? (
            <span className="flex-shrink-0">{leftIcon}</span>
          ) : null}
          
          <span className="flex-shrink-0">{children}</span>
          
          {!isLoading && rightIcon && (
            <span className="flex-shrink-0 group-hover:translate-x-1 transition-transform">
              {rightIcon}
            </span>
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
