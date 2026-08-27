import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card } from '@/components/ui';
import { CHART_COLORS } from '@/lib/format';

interface AiUsageTimelineProps {
  data: { date: string; count: number }[];
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function TimelineTooltip({
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
      <p className="text-sm text-muted">{payload[0].value} appels</p>
    </div>
  );
}

export function AiUsageTimeline({ data }: AiUsageTimelineProps) {
  const chartData = data.map((d) => ({
    name: d.date,
    value: d.count,
  }));

  return (
    <Card title="Appels IA — 30 derniers jours">
      <ResponsiveContainer width="100%" height={280}>
        <RechartsBarChart data={chartData} barCategoryGap="15%">
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
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            tickFormatter={formatShortDate}
            interval="preserveStartEnd"
          />
          <Tooltip
            content={<TimelineTooltip />}
            cursor={{ fill: CHART_COLORS.cream }}
          />
          <Bar
            dataKey="value"
            fill={CHART_COLORS.rose}
            radius={[4, 4, 0, 0]}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </Card>
  );
}
