import React from 'react';
import { motion } from 'motion/react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({ 
  children, 
  variant = 'default', 
  hover = false, 
  className = '',
  onClick 
}: CardProps) {
  const baseStyles = 'rounded-3xl backdrop-blur-sm transition-all duration-300';

  const variantStyles = {
    default: 'bg-white border border-neutral-200/80 shadow-sm',
    glass: 'bg-white/80 border border-neutral-200/50 shadow-lg backdrop-blur-md',
    elevated: 'bg-white border border-neutral-100 shadow-xl shadow-neutral-900/5',
    bordered: 'bg-white border-2 border-neutral-300',
  };

  const hoverStyles = hover
    ? 'hover:shadow-2xl hover:shadow-neutral-900/10 hover:-translate-y-1 hover:border-neutral-300 cursor-pointer'
    : '';

  const interactiveStyles = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${interactiveStyles} ${className}`}
      initial={hover ? { y: 0 } : undefined}
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <div className={`px-6 py-5 border-b border-neutral-100 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <h3 className={`text-lg font-bold text-brand-charcoal ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <p className={`text-sm text-brand-slate mt-1 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <div className={`px-6 py-5 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string 
}) {
  return (
    <div className={`px-6 py-4 border-t border-neutral-100 ${className}`}>
      {children}
    </div>
  );
}
