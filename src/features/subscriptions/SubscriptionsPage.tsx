import { useCallback, useMemo, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { Card, Spinner, Tabs, SearchInput, Table, EmptyState } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getSubscriptions,
  getRevenueStats,
} from '@/services/subscriptions.service';
import type { Subscription, SubscriptionStatus, RevenueStats } from '@/types/subscription';
import { RevenueOverview } from './RevenueOverview';
import { RevenueChart } from './RevenueChart';
import { PlanDistributionChart } from './PlanDistributionChart';
import { SubscriptionRow } from './SubscriptionRow';
import { OffresSection } from './OffresSection';

type PageTab = 'offres' | 'revenus';
type StatusTab = 'all' | SubscriptionStatus;

export default function SubscriptionsPage() {
  const subscriptionsFn = useCallback(() => getSubscriptions(), []);
  const statsFn = useCallback(() => getRevenueStats(), []);

  const { data: subscriptions, loading: loadingSubs } =
    useService<Subscription[]>(subscriptionsFn);
  const { data: stats, loading: loadingStats } =
    useService<RevenueStats>(statsFn);

  const [pageTab, setPageTab] = useState<PageTab>('offres');
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [search, setSearch] = useState('');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const counts = useMemo(() => {
    if (!subscriptions) return { all: 0, active: 0, trial: 0, cancelled: 0 };
    return {
      all: subscriptions.length,
      active: subscriptions.filter((s) => s.status === 'active').length,
      trial: subscriptions.filter((s) => s.status === 'trial').length,
      cancelled: subscriptions.filter((s) => s.status === 'cancelled').length,
    };
  }, [subscriptions]);

  const statusTabs = [
    { key: 'all', label: 'Tous', count: counts.all },
    { key: 'active', label: 'Actifs', count: counts.active },
    { key: 'trial', label: 'Essai', count: counts.trial },
    { key: 'cancelled', label: 'Resilies', count: counts.cancelled },
  ];

  const pageTabs = [
    { key: 'offres', label: 'Offres' },
    { key: 'revenus', label: 'Revenus' },
  ];

  const filtered = useMemo(() => {
    if (!subscriptions) return [];

    let result = [...subscriptions];

    // Filter by tab
    if (activeTab !== 'all') {
      result = result.filter((s) => s.status === activeTab);
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.user_name.toLowerCase().includes(q) ||
          s.user_email.toLowerCase().includes(q) ||
          s.plan.toLowerCase().includes(q),
      );
    }

    // Sort by date
    result.sort((a, b) => {
      const diff =
        new Date(a.started_at).getTime() - new Date(b.started_at).getTime();
      return sortDir === 'asc' ? diff : -diff;
    });

    return result;
  }, [subscriptions, activeTab, search, sortDir]);

  const loadingRevenue = loadingSubs || loadingStats;

  return (
    <div className="space-y-6">
      {/* Page-level tabs: Offres | Revenus */}
      <Tabs
        tabs={pageTabs}
        activeKey={pageTab}
        onChange={(key) => setPageTab(key as PageTab)}
      />

      {/* ===== Offres tab ===== */}
      {pageTab === 'offres' && <OffresSection />}

      {/* ===== Revenus tab ===== */}
      {pageTab === 'revenus' && (
        <>
          {loadingRevenue ? (
            <div className="flex h-96 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Revenue overview stats */}
              {stats && <RevenueOverview stats={stats} />}

              {/* Charts row */}
              {stats && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <RevenueChart data={stats.revenueByMonth} />
                  </div>
                  <div>
                    <PlanDistributionChart data={stats.planDistribution} />
                  </div>
                </div>
              )}

              {/* Status tabs */}
              <Tabs
                tabs={statusTabs}
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as StatusTab)}
              />

              {/* Search */}
              <SearchInput
                value={search}
                onSearch={setSearch}
                placeholder="Rechercher une abonnee..."
              />

              {/* Table */}
              {filtered.length > 0 ? (
                <Table>
                  <Table.Header>
                    <th className="px-4 py-3 text-left">Utilisatrice</th>
                    <th className="px-4 py-3 text-left">Plan</th>
                    <th className="px-4 py-3 text-left">Montant</th>
                    <th className="px-4 py-3 text-left">Statut</th>
                    <Table.SortHeader
                      sortDirection={sortDir}
                      onSort={() =>
                        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
                      }
                    >
                      Date debut
                    </Table.SortHeader>
                    <th className="px-4 py-3 text-left">Expiration</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </Table.Header>
                  <Table.Body>
                    {filtered.map((sub) => (
                      <SubscriptionRow key={sub.id} subscription={sub} />
                    ))}
                  </Table.Body>
                </Table>
              ) : (
                <Card>
                  <EmptyState
                    icon={CreditCard}
                    title="Aucun abonnement trouve"
                    description="Essayez de modifier vos filtres de recherche."
                  />
                </Card>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
