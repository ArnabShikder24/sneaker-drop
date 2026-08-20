interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  className?: string;
}

const variantClasses = {
  success: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/30',
  danger: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
  neutral: 'bg-zinc-700/40 text-zinc-400 ring-1 ring-zinc-600/30',
  accent: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/30',
};

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}