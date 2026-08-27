import { Card } from '@/components/ui';
import { StatusDonutChart } from '@/components/charts/StatusDonutChart';
import { PLAN_LABELS, PLAN_PRICES } from '@/types/subscription';
import type { SubscriptionPlan } from '@/types/subscription';
import { formatCurrency } from '@/lib/format';

interface PlanDistributionChartProps {
  data: { plan: string; count: number }[];
}

const PLAN_COLORS: Record<string, string> = {
  mensuel: '#C4857A',
  trimestriel: '#C9A96E',
  annuel: '#5CA87E',
};

export function PlanDistributionChart({ data }: PlanDistributionChartProps) {
  const donutData = data.map((d) => ({
    name: PLAN_LABELS[d.plan as SubscriptionPlan] ?? d.plan,
    value: d.count,
    color: PLAN_COLORS[d.plan] ?? '#9E8A7E',
  }));

  return (
    <Card title="Repartition par plan">
      <div className="flex flex-col items-center gap-6">
        <StatusDonutChart data={donutData} size={200} />

        {/* Legend with price */}
        <div className="flex flex-col gap-2 w-full">
          {data.map((d) => {
            const plan = d.plan as SubscriptionPlan;
            return (
              <div
                key={d.plan}
                className="flex items-center justify-between radius-sm bg-cream px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PLAN_COLORS[d.plan] }}
                  />
                  <span className="text-sm font-medium text-brown">
                    {PLAN_LABELS[plan]}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted">
                    {d.count} abonn.
                  </span>
                  <span className="text-sm font-medium text-gold">
                    {formatCurrency(PLAN_PRICES[plan], 'EUR')}/mois
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
