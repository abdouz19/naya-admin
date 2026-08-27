import { useMemo } from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card } from '@/components/ui';
import { CHART_COLORS, formatPercent } from '@/lib/format';
import type { AtelierStats } from '@/types/atelier';

interface AtelierCompletionChartProps {
  data: AtelierStats[];
}

function getBarColor(rate: number): string {
  if (rate >= 0.7) return CHART_COLORS.green;
  if (rate >= 0.4) return CHART_COLORS.gold;
  return CHART_COLORS.rose;
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { name: string; value: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload;
  return (
    <div className="radius-sm bg-white px-3 py-2 shadow-card-hover">
      <p className="text-sm font-medium text-brown">{item.name}</p>
      <p className="text-sm text-muted">{formatPercent(item.value / 100)}</p>
    </div>
  );
}

export function AtelierCompletionChart({ data }: AtelierCompletionChartProps) {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => b.completion_rate - a.completion_rate)
      .map((d) => ({
        name: d.titre.length > 30 ? d.titre.slice(0, 28) + '...' : d.titre,
        value: Math.round(d.completion_rate * 100),
        rate: d.completion_rate,
      }));
  }, [data]);

  const chartHeight = Math.max(280, chartData.length * 40);

  return (
    <Card title="Taux de completion par atelier">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <RechartsBarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
          barCategoryGap="20%"
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_COLORS.muted, fontSize: 11 }}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: CHART_COLORS.muted, fontSize: 12 }}
            width={200}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ fill: CHART_COLORS.cream }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.rate)} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </Card>
  );
}
