import { type ElementType } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui';
import { SparklineChart } from '@/components/charts';
import { cn } from '@/lib/cn';

interface KpiCardProps {
  label: string;
  value: string;
  delta: number;
  icon: ElementType;
  sparklineData?: { value: number }[];
  sparklineColor?: string;
}

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  sparklineData,
  sparklineColor,
}: KpiCardProps) {
  const isPositive = delta >= 0;

  return (
    <Card noPadding className="overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        {/* Top row: icon + value + delta */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center radius-sm bg-rose/10 text-rose">
              <Icon size={20} />
            </div>
            <span className="font-heading text-3xl font-semibold text-brown">
              {value}
            </span>
          </div>

          <span
            className={cn(
              'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium',
              isPositive
                ? 'bg-green-light text-green'
                : 'bg-danger-light text-danger',
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
        </div>

        {/* Label */}
        <p className="mt-1 text-sm text-muted">{label}</p>
      </div>

      {/* Sparkline spanning full width */}
      {sparklineData && sparklineData.length > 0 && (
        <div className="w-full">
          <SparklineChart
            data={sparklineData}
            color={sparklineColor}
            width={320}
            height={48}
          />
        </div>
      )}
    </Card>
  );
}
