import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/lib/format';

interface LineChartProps {
  data: { date: string; value: number }[];
  color?: string;
  height?: number;
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="radius-sm bg-white px-3 py-2 shadow-card-hover">
      <p className="text-sm font-medium text-brown">
        {label ? formatShortDate(label) : ''}
      </p>
      <p className="text-sm text-muted">{payload[0].value}</p>
    </div>
  );
}

export function LineChart({
  data,
  color = CHART_COLORS.rose,
  height = 300,
}: LineChartProps) {
  const gradientId = `line-gradient-${color.replace('#', '')}`;

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.25} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          horizontal
          vertical={false}
          strokeDasharray="4 4"
          stroke={CHART_COLORS.gray200}
        />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickFormatter={formatShortDate}
          tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
          interval="preserveStartEnd"
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradientId})`}
          activeDot={{ r: 4, fill: color, stroke: '#fff', strokeWidth: 2 }}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
