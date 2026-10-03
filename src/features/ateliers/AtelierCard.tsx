import { Eye, Users, Video } from 'lucide-react';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/format';
import type { AtelierStats } from '@/types/atelier';

interface AtelierCardProps {
  stats: AtelierStats;
}

function getProgressColor(rate: number): 'green' | 'gold' | 'danger' {
  if (rate >= 0.7) return 'green';
  if (rate >= 0.4) return 'gold';
  return 'danger';
}

const CATEGORY_LABELS: Record<string, string> = {
  emploi: 'Emploi',
  reconversion: 'Reconversion',
  activite: 'Activité',
  palier_1: 'Palier 1',
  palier_2: 'Palier 2',
  palier_3: 'Palier 3',
};

export function AtelierCard({ stats }: AtelierCardProps) {
  const categoryLabel =
    (stats.category && CATEGORY_LABELS[stats.category]) ||
    CATEGORY_LABELS[stats.palier] ||
    stats.palier;

  return (
    <Card className="p-4 space-y-3 hover:border-rose/40 transition-colors">
      {/* Title + badges */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium text-brown truncate flex-1">{stats.titre}</p>
          <Video size={15} className="text-rose shrink-0 mt-0.5" />
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <Badge variant="gold">{categoryLabel}</Badge>
          <Badge variant="muted">{stats.duree}</Badge>
        </div>
      </div>

      {/* View stats */}
      <div className="flex items-center gap-4 text-xs text-muted">
        <span className="inline-flex items-center gap-1">
          <Eye size={13} />
          {formatNumber(stats.watch_count)} vues
        </span>
        <span className="inline-flex items-center gap-1">
          <Users size={13} />
          {formatNumber(stats.unique_viewers)} spectateurs
        </span>
      </div>

      {/* Completion rate */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Completion</span>
          <span className="font-medium text-brown">
            {formatPercent(stats.completion_rate)}
          </span>
        </div>
        <ProgressBar
          value={Math.round(stats.completion_rate * 100)}
          color={getProgressColor(stats.completion_rate)}
        />
      </div>
    </Card>
  );
}
