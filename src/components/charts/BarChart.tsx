import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '@/lib/format';

interface BarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  height?: number;
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
      <p className="text-sm font-medium text-brown">{label}</p>
      <p className="text-sm text-muted">{payload[0].value}</p>
    </div>
  );
}

export function BarChart({
  data,
  color = CHART_COLORS.rose,
  height = 300,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} barCategoryGap="20%">
        <CartesianGrid
          horizontal
          vertical={false}
          strokeDasharray="4 4"
          stroke={CHART_COLORS.gray200}
        />
        <XAxis
          dataKey="name"
          axisLine={false}
          tickLine={false}
          tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: CHART_COLORS.cream }} />
        <Bar
          dataKey="value"
          fill={color}
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
