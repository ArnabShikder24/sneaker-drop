import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variantClasses = {
  primary:
    'bg-orange-500 hover:bg-orange-400 text-black font-bold shadow-lg shadow-orange-500/20 disabled:bg-orange-900 disabled:text-orange-700',
  secondary:
    'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 disabled:opacity-40',
  danger: 'bg-red-600 hover:bg-red-500 text-white disabled:opacity-40',
  ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-300 disabled:opacity-40',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 inline mr-2"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      transition={{ duration: 0.1 }}
      className={`
        inline-flex items-center justify-center cursor-pointer
        transition-colors duration-150 select-none
        disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner />}
      {children}
    </motion.button>
  );
}