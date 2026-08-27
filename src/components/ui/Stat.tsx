import { type ElementType } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/cn';

interface StatProps {
  label: string;
  value: string | number;
  /** Positive = up / green, negative = down / danger */
  delta?: number;
  icon?: ElementType;
  className?: string;
}

export function Stat({ label, value, delta, icon: Icon, className }: StatProps) {
  const isPositive = delta !== undefined && delta >= 0;

  return (
    <div className={cn('flex items-start gap-3', className)}>
      {Icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center radius-sm bg-rose-light/30 text-rose">
          <Icon size={20} />
        </div>
      )}

      <div className="flex flex-col">
        <span className="text-2xl font-semibold text-brown">{value}</span>

        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-sm text-muted">{label}</span>

          {delta !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-medium',
                isPositive ? 'text-green' : 'text-danger',
              )}
            >
              {isPositive ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {isPositive ? '+' : ''}
              {delta}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
