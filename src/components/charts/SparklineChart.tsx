import { AreaChart, Area } from 'recharts';
import { CHART_COLORS } from '@/lib/format';

interface SparklineChartProps {
  data: { value: number }[];
  color?: string;
  width?: number;
  height?: number;
}

export function SparklineChart({
  data,
  color = CHART_COLORS.rose,
  width = 120,
  height = 40,
}: SparklineChartProps) {
  const gradientId = `sparkline-gradient-${color.replace('#', '')}`;

  return (
    <AreaChart width={width} height={height} data={data}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Area
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={1.5}
        fill={`url(#${gradientId})`}
        isAnimationActive={false}
      />
    </AreaChart>
  );
}
