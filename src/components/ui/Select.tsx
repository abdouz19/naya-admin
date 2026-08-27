import { type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  options: SelectOption[];
}

export function Select({
  label,
  options,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 text-sm font-medium text-muted"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          className={cn(
            'w-full appearance-none radius-sm border border-gray-300 bg-white px-3 py-2 pr-9 text-sm text-ink',
            'transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none',
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted">
          <ChevronDown size={16} />
        </span>
      </div>
    </div>
  );
}
