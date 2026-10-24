import { useCallback } from 'react';
import { Users, Activity, Briefcase, CreditCard } from '@/components/icons';
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
import { formatNumber, CHART_COLORS } from '@/lib/format';
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
    <div className="min-w-0 space-y-4 sm:space-y-6">
      {/* KPI cards */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        <KpiCard
          label="Utilisatrices"
          value={formatNumber(kpis?.totalUsers ?? 0)}
          icon={Users}
        />
        <KpiCard
          label="Actives cette semaine"
          value={formatNumber(kpis?.activeThisWeek ?? 0)}
          icon={Activity}
        />
        <KpiCard
          label="Candidatures"
          value={formatNumber(kpis?.totalCandidatures ?? 0)}
          icon={Briefcase}
        />
        <KpiCard
          label="Abonnements actifs"
          value={formatNumber(kpis?.paidUsers ?? 0)}
          icon={CreditCard}
        />
      </div>

      {/* Bottom section: chart + activity */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)]">
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
