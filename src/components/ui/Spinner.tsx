import { cn } from '@/lib/cn';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const px = sizeMap[size];

  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn('inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-rose', className)}
      style={{ width: px, height: px }}
    />
  );
}
