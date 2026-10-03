import { useCallback } from 'react';
import { Users, Activity, Briefcase, Brain } from 'lucide-react';
import { Card, Spinner } from '@/components/ui';
import { LineChart } from '@/components/charts';
import { useService } from '@/hooks/use-service';
import {
  getKpis,
  getRecentActivity,
  getSparklineData,
  type DashboardKpis,
  type ActivityItem,
  type SparklinePoint,
} from '@/services/dashboard.service';
import { formatNumber, formatCurrency, CHART_COLORS } from '@/lib/format';
import { KpiCard } from './KpiCard';
import { RecentActivity } from './RecentActivity';

export default function DashboardPage() {
  const kpiFn = useCallback(() => getKpis(), []);
  const activityFn = useCallback(() => getRecentActivity(), []);
  const sparklineFn = useCallback(() => getSparklineData(), []);

  const { data: kpis, loading: loadingKpis } = useService<DashboardKpis>(kpiFn);
  const { data: activities, loading: loadingActivities } =
    useService<ActivityItem[]>(activityFn);
  const { data: sparklines, loading: loadingSparklines } = useService<{
    activityPerDay?: SparklinePoint[];
    usersPerDay: SparklinePoint[];
    candidaturesPerDay: SparklinePoint[];
    aiCallsPerDay: SparklinePoint[];
    costPerDay: SparklinePoint[];
  }>(sparklineFn);

  const loading = loadingKpis || loadingActivities || loadingSparklines;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Utilisatrices"
          value={formatNumber(kpis?.totalUsers ?? 0)}
          delta={12}
          icon={Users}
          sparklineData={sparklines?.usersPerDay}
          sparklineColor={CHART_COLORS.rose}
        />
        <KpiCard
          label="Actives cette semaine"
          value={formatNumber(kpis?.activeThisWeek ?? 0)}
          delta={8}
          icon={Activity}
          sparklineColor={CHART_COLORS.gold}
        />
        <KpiCard
          label="Candidatures"
          value={formatNumber(kpis?.totalCandidatures ?? 0)}
          delta={23}
          icon={Briefcase}
          sparklineData={sparklines?.candidaturesPerDay}
          sparklineColor={CHART_COLORS.green}
        />
        <KpiCard
          label="Cout IA ce mois"
          value={formatCurrency(kpis?.totalAiCost ?? 0)}
          delta={-5}
          icon={Brain}
          sparklineData={sparklines?.costPerDay}
          sparklineColor={CHART_COLORS.danger}
        />
      </div>

      {/* Bottom section: chart + activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <Card title="Activite des 30 derniers jours">
          {(sparklines?.activityPerDay || sparklines?.usersPerDay) ? (
            <LineChart
              data={sparklines.activityPerDay || sparklines.usersPerDay}
              color={CHART_COLORS.rose}
              height={300}
            />
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted">
              Aucune donnee
            </div>
          )}
        </Card>

        {activities ? (
          <RecentActivity activities={activities} />
        ) : (
          <Card title="Activite recente">
            <p className="text-sm text-muted">Aucune activite recente</p>
          </Card>
        )}
      </div>
    </div>
  );
}
