import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

type BadgeVariant = 'rose' | 'gold' | 'green' | 'muted' | 'danger';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  rose: 'bg-rose-light/40 text-rose-dark',
  gold: 'bg-gold-light/40 text-gold',
  green: 'bg-green-light text-green',
  muted: 'bg-gray-100 text-muted',
  danger: 'bg-danger-light text-danger',
};

export function Badge({
  variant = 'muted',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
