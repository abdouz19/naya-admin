import { Card } from '@/components/ui';
import { BarChart } from '@/components/charts/BarChart';
import { CHART_COLORS } from '@/lib/format';

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map((d) => ({
    name: d.month,
    value: d.revenue,
  }));

  return (
    <Card title="Revenu mensuel (€)">
      <BarChart data={chartData} color={CHART_COLORS.gold} height={300} />
    </Card>
  );
}
