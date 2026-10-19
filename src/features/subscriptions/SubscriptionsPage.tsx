import { useCallback, useMemo, useState } from 'react';
import { CreditCard, Euro, RefreshCcw, UserCheck, UserMinus, UserX } from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  EmptyState,
  ProgressBar,
  SearchInput,
  Spinner,
  Stat,
  Table,
  Tabs,
} from '@/components/ui';
import { useService } from '@/hooks/use-service';
import { formatCurrency, formatDate } from '@/lib/format';
import { getSubscriptionsOverview } from '@/services/subscriptions.service';
import {
  PARCOURS_LABELS,
  STORE_LABELS,
  type AdminSubscription,
  type SubscriptionsOverview,
} from '@/types/subscription';

type StatusTab = 'all' | 'active' | 'cancelling' | 'expired';

const DURATION_BADGES = {
  monthly: 'rose',
  quarterly: 'gold',
  annual: 'green',
} as const;

function matchesTab(subscription: AdminSubscription, tab: StatusTab) {
  switch (tab) {
    case 'active':
      return subscription.status === 'active';
    case 'cancelling':
      return subscription.status === 'active' && subscription.willRenew === false;
    case 'expired':
      return subscription.status === 'expired';
    default:
      return true;
  }
}

/** Real subscribers, as RevenueCat reported them to the API. */
export default function SubscriptionsPage() {
  const overviewFn = useCallback(() => getSubscriptionsOverview(), []);
  const { data, loading, error, refetch } =
    useService<SubscriptionsOverview>(overviewFn);

  const [activeTab, setActiveTab] = useState<StatusTab>('active');
  const [search, setSearch] = useState('');

  const subscriptions = useMemo(() => data?.subscriptions ?? [], [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return subscriptions
      .filter((s) => matchesTab(s, activeTab))
      .filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          (s.email ?? '').toLowerCase().includes(q),
      );
  }, [subscriptions, activeTab, search]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <p className="text-sm text-muted">
            {error?.message ?? 'Les abonnements n’ont pas pu être chargés.'}
          </p>
          <Button variant="secondary" onClick={refetch}>
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  const { stats } = data;
  const tabs = [
    { key: 'active', label: 'Actifs', count: stats.active },
    { key: 'cancelling', label: 'Renouvellement coupé', count: stats.cancelling },
    { key: 'expired', label: 'Expirés', count: stats.expired },
    { key: 'all', label: 'Tous', count: subscriptions.length },
  ];

  return (
    <div className="space-y-6">
      {/* Figures */}
      <Card>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={UserCheck} label="Abonnées actives" value={stats.active} />
          <Stat
            icon={UserMinus}
            label="Renouvellement coupé"
            value={stats.cancelling}
          />
          <Stat icon={UserX} label="Abonnements expirés" value={stats.expired} />
          <Stat
            icon={Euro}
            label="Revenu mensuel estimé"
            value={formatCurrency(stats.estimatedMonthlyRevenue, 'EUR')}
          />
        </div>
        <p className="mt-4 text-xs text-muted">
          Estimation à partir des prix en boutique (9,99 € / 24,99 € / 69,99 €),
          ramenés au mois, avant la commission d’Apple et de Google.
        </p>
      </Card>

      {/* Duration breakdown */}
      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-brown">
            Abonnements actifs par durée
          </h3>
          <Button
            variant="ghost"
            size="sm"
            icon={<RefreshCcw size={14} />}
            onClick={refetch}
          >
            Actualiser
          </Button>
        </div>
        <div className="space-y-3">
          {stats.byDuration.map((item) => (
            <div key={item.duration} className="flex items-center gap-4">
              <span className="w-16 text-sm text-brown">{item.label}</span>
              <ProgressBar
                className="flex-1"
                value={stats.active ? (item.count / stats.active) * 100 : 0}
              />
              <span className="w-8 text-right text-sm font-medium text-brown">
                {item.count}
              </span>
            </div>
          ))}
          {stats.unknownDuration > 0 && (
            <p className="text-xs text-muted">
              {stats.unknownDuration} abonnement(s) sans durée connue (attribués
              avant le suivi détaillé ou offerts).
            </p>
          )}
        </div>
      </Card>

      <Tabs
        tabs={tabs}
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as StatusTab)}
      />

      <SearchInput
        value={search}
        onSearch={setSearch}
        placeholder="Rechercher par nom ou e-mail…"
      />

      {filtered.length > 0 ? (
        <Table>
          <Table.Header>
            <th className="px-4 py-3 text-left">Utilisatrice</th>
            <th className="px-4 py-3 text-left">Durée</th>
            <th className="px-4 py-3 text-left">Boutique</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Début</th>
            <th className="px-4 py-3 text-left">Échéance</th>
            <th className="px-4 py-3 text-left">Renouvellement</th>
          </Table.Header>
          <Table.Body>
            {filtered.map((s) => (
              <SubscriberRow key={s.userId} subscription={s} />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Card>
          <EmptyState
            icon={CreditCard}
            title="Aucun abonnement"
            description={
              search
                ? 'Aucun résultat pour cette recherche.'
                : 'Aucun abonnement dans cette catégorie pour le moment.'
            }
          />
        </Card>
      )}
    </div>
  );
}

function SubscriberRow({ subscription: s }: { subscription: AdminSubscription }) {
  const cancelling = s.status === 'active' && s.willRenew === false;
  return (
    <Table.Row>
      <Table.Cell>
        <div className="flex items-center gap-3">
          <Avatar name={s.name} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-brown">{s.name}</span>
            <span className="text-xs text-muted">
              {s.email ?? '—'}
              {s.parcoursType && PARCOURS_LABELS[s.parcoursType]
                ? ` · ${PARCOURS_LABELS[s.parcoursType]}`
                : ''}
            </span>
          </div>
        </div>
      </Table.Cell>
      <Table.Cell>
        {s.duration ? (
          <Badge variant={DURATION_BADGES[s.duration]}>
            {s.durationLabel}
            {s.price ? ` · ${formatCurrency(s.price, 'EUR')}` : ''}
          </Badge>
        ) : (
          <span className="text-sm text-muted">—</span>
        )}
      </Table.Cell>
      <Table.Cell>
        <span className="text-sm text-muted">
          {s.store ? (STORE_LABELS[s.store] ?? s.store) : '—'}
        </span>
      </Table.Cell>
      <Table.Cell>
        {s.status === 'expired' ? (
          <Badge variant="muted">Expiré</Badge>
        ) : cancelling ? (
          <Badge variant="danger">Se termine</Badge>
        ) : (
          <Badge variant="green">Actif</Badge>
        )}
      </Table.Cell>
      <Table.Cell>
        <span className="text-sm text-muted">
          {s.startedAt ? formatDate(s.startedAt) : '—'}
        </span>
      </Table.Cell>
      <Table.Cell>
        <span className="text-sm text-muted">
          {s.expiresAt ? formatDate(s.expiresAt) : '—'}
        </span>
      </Table.Cell>
      <Table.Cell>
        <span className="text-sm text-muted">
          {s.status === 'expired'
            ? '—'
            : s.willRenew === null
              ? 'Inconnu'
              : s.willRenew
                ? 'Automatique'
                : 'Coupé'}
        </span>
      </Table.Cell>
    </Table.Row>
  );
}
