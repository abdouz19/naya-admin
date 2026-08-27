import { type ElementType } from 'react';
import { cn } from '@/lib/cn';

interface EmptyStateProps {
  icon: ElementType;
  title: string;
  description?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 text-center',
        className,
      )}
    >
      <Icon size={48} className="mb-4 text-muted-light" strokeWidth={1.5} />
      <h4 className="text-lg font-medium text-brown">{title}</h4>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-muted">{description}</p>
      )}
    </div>
  );
}
