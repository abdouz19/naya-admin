import { Card } from '@/components/ui';
import { StatusDonutChart } from '@/components/charts';
import { CHART_COLORS } from '@/lib/format';
import type { CandidatureStatut } from '@/types/candidature';
import { STATUT_LABELS } from '@/types/candidature';

interface CandidatureStatusChartProps {
  /** Number of candidatures in each status, across the whole list. */
  counts: Partial<Record<CandidatureStatut, number>>;
}

const STATUT_HEX: Record<CandidatureStatut, string> = {
  envoyee: CHART_COLORS.rose,
  en_attente: CHART_COLORS.gold,
  a_relancer: CHART_COLORS.muted,
  entretien: CHART_COLORS.green,
  refusee: CHART_COLORS.danger,
  acceptee: '#3D8B5E',
};

export function CandidatureStatusChart({
  counts: rawCounts,
}: CandidatureStatusChartProps) {
  const counts: Record<CandidatureStatut, number> = {
    envoyee: rawCounts.envoyee ?? 0,
    en_attente: rawCounts.en_attente ?? 0,
    a_relancer: rawCounts.a_relancer ?? 0,
    entretien: rawCounts.entretien ?? 0,
    refusee: rawCounts.refusee ?? 0,
    acceptee: rawCounts.acceptee ?? 0,
  };

  const data = (Object.keys(counts) as CandidatureStatut[])
    .filter((key) => counts[key] > 0)
    .map((key) => ({
      name: STATUT_LABELS[key],
      value: counts[key],
      color: STATUT_HEX[key],
    }));

  return (
    <Card title="Repartition par statut">
      <div className="flex items-center justify-center py-4">
        <StatusDonutChart data={data} size={220} />
      </div>
    </Card>
  );
}
