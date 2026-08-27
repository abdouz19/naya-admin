import { type InputHTMLAttributes, type ElementType } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  icon?: ElementType;
}

export function Input({
  label,
  icon: Icon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 text-sm font-medium text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
            <Icon size={16} />
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            'w-full radius-sm border border-gray-300 bg-white px-3 py-2 text-sm text-ink',
            'placeholder:text-muted-light',
            'transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none',
            Icon && 'pl-9',
          )}
          {...props}
        />
      </div>
    </div>
  );
}
