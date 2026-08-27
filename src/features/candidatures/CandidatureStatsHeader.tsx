import { Briefcase, TrendingUp, Clock, CalendarCheck } from 'lucide-react';
import { Card, Stat } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/format';
import type { CandidatureStats } from '@/services/candidatures.service';

interface CandidatureStatsHeaderProps {
  stats: CandidatureStats;
}

export function CandidatureStatsHeader({ stats }: CandidatureStatsHeaderProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <Card>
        <Stat
          label="Total candidatures"
          value={formatNumber(stats.total)}
          icon={Briefcase}
        />
      </Card>
      <Card>
        <Stat
          label="Taux de reponse"
          value={formatPercent(stats.tauxReponse)}
          icon={TrendingUp}
        />
      </Card>
      <Card>
        <Stat
          label="En cours"
          value={formatNumber(stats.enCours)}
          icon={Clock}
        />
      </Card>
      <Card>
        <Stat
          label="Entretiens obtenus"
          value={formatNumber(stats.entretiensObtenus)}
          icon={CalendarCheck}
        />
      </Card>
    </div>
  );
}
