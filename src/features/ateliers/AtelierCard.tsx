import { Eye, Users } from 'lucide-react';
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

export function AtelierCard({ stats }: AtelierCardProps) {
  return (
    <Card className="p-4 space-y-3">
      {/* Title + badges */}
      <div>
        <p className="text-sm font-medium text-brown truncate">{stats.titre}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <Badge variant="gold">{stats.palier}</Badge>
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
