import { cn } from '@/lib/cn';

type ProgressColor = 'rose' | 'gold' | 'green' | 'danger';

interface ProgressBarProps {
  /** 0 – 100 */
  value: number;
  color?: ProgressColor;
  className?: string;
}

const colorStyles: Record<ProgressColor, string> = {
  rose: 'bg-rose',
  gold: 'bg-gold',
  green: 'bg-green',
  danger: 'bg-danger',
};

export function ProgressBar({
  value,
  color = 'rose',
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-gray-200', className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          'h-full rounded-full transition-all duration-500',
          colorStyles[color],
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
