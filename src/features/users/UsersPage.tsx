import { useCallback, useMemo, useState } from 'react';
import { Users, Activity, CreditCard, ClipboardCheck, Download } from 'lucide-react';
import { Table, Stat, Spinner, Card, EmptyState, Button } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import { getUsers, getUserStats, type UserStats } from '@/services/users.service';
import { formatNumber } from '@/lib/format';
import type { UserProfile } from '@/types/user';
import { UserFilters } from './UserFilters';
import { UserRow } from './UserRow';
import { UserDetailPanel } from './UserDetailPanel';

function exportUsersCsv(users: UserProfile[]) {
  const headers = [
    'Nom', 'Email', 'Inscrite le', 'Derniere activite', 'Parcours',
    'Metier', 'Diagnostic vie', 'Diagnostic pro', 'Premium', 'CV genere',
    'LinkedIn', 'Ateliers vus', 'Actions semaine', 'Bloquee',
  ];
  const rows = users.map((u) => [
    u.name,
    u.email,
    u.created_at,
    u.last_active_at,
    u.parcours_type ?? '',
    u.selected_metier_titre ?? '',
    u.diagnostic_vie_completed ? 'Oui' : 'Non',
    u.diagnostic_pro_completed ? 'Oui' : 'Non',
    u.has_paid ? 'Oui' : 'Non',
    u.cv_generated ? 'Oui' : 'Non',
    u.linkedin_optimized ? 'Oui' : 'Non',
    u.ateliers_emploi_watched.length.toString(),
    u.actions_semaine_count.toString(),
    u.is_blocked ? 'Oui' : 'Non',
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `utilisatrices_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function UsersPage() {
  const usersFn = useCallback(() => getUsers(), []);
  const statsFn = useCallback(() => getUserStats(), []);

  const { data: users, loading: loadingUsers } = useService<UserProfile[]>(usersFn);
  const { data: stats, loading: loadingStats } = useService<UserStats>(statsFn);

  const [search, setSearch] = useState('');
  const [diagnosticFilter, setDiagnosticFilter] = useState<
    'all' | 'completed' | 'incomplete'
  >('all');
  const [paidFilter, setPaidFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [parcoursFilter, setParcoursFilter] = useState<
    'all' | 'retour_emploi' | 'reconversion' | 'creation_activite'
  >('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const filtered = useMemo(() => {
    if (!users) return [];

    return users.filter((u) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const match =
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.selected_metier_titre ?? '').toLowerCase().includes(q);
        if (!match) return false;
      }

      // Diagnostic filter
      if (diagnosticFilter === 'completed') {
        if (!u.diagnostic_vie_completed || !u.diagnostic_pro_completed)
          return false;
      } else if (diagnosticFilter === 'incomplete') {
        if (u.diagnostic_vie_completed && u.diagnostic_pro_completed)
          return false;
      }

      // Paid filter
      if (paidFilter === 'paid' && !u.has_paid) return false;
      if (paidFilter === 'free' && u.has_paid) return false;

      // Parcours filter
      if (parcoursFilter !== 'all') {
        const target = parcoursFilter.toLowerCase().replace(/[^a-z]/g, '');
        const list = (
          u.parcours_types && u.parcours_types.length > 0
            ? u.parcours_types
            : u.parcours_type
            ? [u.parcours_type]
            : []
        ).map((p) => p.toLowerCase().replace(/[^a-z]/g, ''));

        if (!list.some((p) => p.includes(target) || target.includes(p))) {
          return false;
        }
      }

      return true;
    });
  }, [users, search, diagnosticFilter, paidFilter, parcoursFilter]);

  const loading = loadingUsers || loadingStats;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Stat
            label="Total utilisatrices"
            value={formatNumber(stats?.total ?? 0)}
            icon={Users}
          />
        </Card>
        <Card>
          <Stat
            label="Actives cette semaine"
            value={formatNumber(stats?.activeThisWeek ?? 0)}
            icon={Activity}
          />
        </Card>
        <Card>
          <Stat
            label="Premium"
            value={formatNumber(stats?.paidUsers ?? 0)}
            icon={CreditCard}
          />
        </Card>
        <Card>
          <Stat
            label="Diagnostic complete"
            value={formatNumber(stats?.diagnosticCompleted ?? 0)}
            icon={ClipboardCheck}
          />
        </Card>
      </div>

      {/* Filters + Export */}
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <UserFilters
        search={search}
        onSearchChange={setSearch}
        diagnosticFilter={diagnosticFilter}
        onDiagnosticChange={setDiagnosticFilter}
        paidFilter={paidFilter}
        onPaidChange={setPaidFilter}
            parcoursFilter={parcoursFilter}
            onParcoursChange={setParcoursFilter}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => exportUsersCsv(filtered)}
        >
          Exporter CSV
        </Button>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <Table>
          <Table.Header>
            <th className="px-4 py-3 text-left">Nom</th>
            <th className="px-4 py-3 text-left">Diagnostic</th>
            <th className="px-4 py-3 text-left">Parcours</th>
            <th className="px-4 py-3 text-left">Metier</th>
            <th className="px-4 py-3 text-left">Candidatures</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Derniere activite</th>
          </Table.Header>
          <Table.Body>
            {filtered.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onClick={setSelectedUser}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Card>
          <EmptyState
            icon={Users}
            title="Aucune utilisatrice trouvee"
            description="Essayez de modifier vos filtres de recherche."
          />
        </Card>
      )}

      {/* Detail panel */}
      <UserDetailPanel
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUserUpdated={(updated) => setSelectedUser(updated)}
      />
    </div>
  );
}
