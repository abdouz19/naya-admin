import { Euro, TrendingUp, Users, UserMinus, Receipt, ArrowRightCircle } from 'lucide-react';
import { Card, Stat } from '@/components/ui';
import { formatCurrency, formatPercent } from '@/lib/format';
import type { RevenueStats } from '@/types/subscription';

interface RevenueOverviewProps {
  stats: RevenueStats;
}

export function RevenueOverview({ stats }: RevenueOverviewProps) {
  return (
    <Card>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Stat
          icon={Euro}
          label="MRR"
          value={formatCurrency(stats.mrr, 'EUR')}
          delta={12}
        />
        <Stat
          icon={TrendingUp}
          label="ARR"
          value={formatCurrency(stats.arr, 'EUR')}
          delta={12}
        />
        <Stat
          icon={Users}
          label="Abonnements actifs"
          value={stats.activeSubscriptions}
          delta={8}
        />
        <Stat
          icon={UserMinus}
          label="Taux de churn"
          value={formatPercent(stats.churnRate)}
          delta={-2}
        />
        <Stat
          icon={Receipt}
          label="Revenu moyen / utilisatrice"
          value={formatCurrency(stats.averageRevenuePerUser, 'EUR')}
          delta={5}
        />
        <Stat
          icon={ArrowRightCircle}
          label="Conversions essai → payant"
          value={formatPercent(stats.trialConversions)}
          delta={3}
        />
      </div>
    </Card>
  );
}
