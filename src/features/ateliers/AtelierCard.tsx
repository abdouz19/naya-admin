import { Eye, Users, Video, ExternalLink, UserCheck } from 'lucide-react';
import { Card, Badge, ProgressBar } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/format';
import type { AtelierStats, AtelierVideo } from '@/types/atelier';

interface AtelierCardProps {
  stats: AtelierStats;
  atelier?: AtelierVideo;
}

function getProgressColor(rate: number): 'green' | 'gold' | 'danger' {
  if (rate >= 0.7) return 'green';
  if (rate >= 0.4) return 'gold';
  return 'danger';
}

const CATEGORY_LABELS: Record<string, string> = {
  emploi: 'Emploi',
  reconversion: 'Reconversion',
  confiance: 'Confiance',
  activite: 'Activité',
  palier_1: 'Palier 1',
  palier_2: 'Palier 2',
  palier_3: 'Palier 3',
};

export function AtelierCard({ stats, atelier }: AtelierCardProps) {
  const categoryLabel =
    (stats.category && CATEGORY_LABELS[stats.category]) ||
    (atelier?.category && CATEGORY_LABELS[atelier.category]) ||
    CATEGORY_LABELS[stats.palier] ||
    stats.palier;

  const stepTag = atelier?.step_tag || stats.step_tag;
  const isActive = atelier?.is_active ?? stats.is_active ?? true;

  return (
    <Card className="p-4 space-y-3 hover:border-rose/50 transition-all cursor-pointer group flex flex-col justify-between h-full bg-white">
      <div className="space-y-2.5">
        {/* Header Title + Badges */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-brown group-hover:text-rose transition-colors line-clamp-1">
              {stats.titre}
            </p>
            {atelier?.subtitle && (
              <p className="text-xs text-muted truncate mt-0.5">{atelier.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                isActive ? 'bg-green-500' : 'bg-gray-300'
              }`}
              title={isActive ? 'Actif dans l’app mobile' : 'Inactif / Masqué'}
            />
            <Video size={16} className="text-rose shrink-0" />
          </div>
        </div>

        {/* Category, Tag & Duration Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="gold">{categoryLabel}</Badge>
          {stepTag && (
            <Badge variant="rose" className="max-w-[140px] truncate">
              {stepTag}
            </Badge>
          )}
          <Badge variant="muted">{stats.duree}</Badge>
        </div>

        {/* Speaker info if available */}
        {atelier?.speaker_name && (
          <div className="flex items-center gap-1.5 text-xs text-muted pt-0.5">
            <UserCheck size={13} className="text-sand shrink-0" />
            <span className="truncate">
              {atelier.speaker_name}
              {atelier.speaker_role ? ` (${atelier.speaker_role})` : ''}
            </span>
          </div>
        )}

        {/* Description preview */}
        {atelier?.description && (
          <p className="text-xs text-brown/75 line-clamp-2 leading-relaxed">
            {atelier.description}
          </p>
        )}
      </div>

      <div className="space-y-2.5 pt-2 border-t border-gray-100 mt-2">
        {/* View stats */}
        <div className="flex items-center justify-between text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <Eye size={13} />
            {formatNumber(stats.watch_count)} vues
          </span>
          <span className="inline-flex items-center gap-1">
            <Users size={13} />
            {formatNumber(stats.unique_viewers)} spectateurs
          </span>
          {atelier?.video_url && (
            <a
              href={atelier.video_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-rose hover:underline"
              title="Ouvrir la vidéo sur YouTube"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Completion rate */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Complétion moyenne</span>
            <span className="font-semibold text-brown">
              {formatPercent(stats.completion_rate)}
            </span>
          </div>
          <ProgressBar
            value={Math.round(stats.completion_rate * 100)}
            color={getProgressColor(stats.completion_rate)}
          />
        </div>
      </div>
    </Card>
  );
}
