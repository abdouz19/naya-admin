import { type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface CardProps {
  title?: string;
  subtitle?: string;
  noPadding?: boolean;
  className?: string;
  children: ReactNode;
}

export function Card({
  title,
  subtitle,
  noPadding = false,
  className,
  children,
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white radius-md shadow-card',
        'transition-shadow duration-200 hover:shadow-card-hover',
        !noPadding && 'p-6',
        className,
      )}
    >
      {(title || subtitle) && (
        <div className={cn(noPadding && 'px-6 pt-6', 'mb-4')}>
          {title && (
            <h3 className="font-heading text-lg font-semibold text-brown">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-0.5 text-sm text-muted">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
