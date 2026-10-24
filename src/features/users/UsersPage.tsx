import { useCallback, useState } from 'react';
import { Users, Activity, CreditCard, ClipboardCheck, Download } from '@/components/icons';
import { Table, Stat, Spinner, Card, EmptyState, Button, Pagination } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getUsers,
  getUsersPage,
  getUserStats,
  type UserStats,
} from '@/services/users.service';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Paginated } from '@/types/pagination';
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
  const statsFn = useCallback(() => getUserStats(), []);
  const { data: stats, loading: loadingStats } = useService<UserStats>(statsFn);

  const [search, setSearch] = useState('');
  const [diagnosticFilter, setDiagnosticFilter] = useState<
    'all' | 'completed' | 'incomplete'
  >('all');
  const [paidFilter, setPaidFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [parcoursFilter, setParcoursFilter] = useState<
    'all' | 'retour_emploi' | 'reconversion' | 'creation_activite'
  >('all');
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const debouncedSearch = useDebouncedValue(search);
  const filters = {
    search: debouncedSearch,
    diagnostic: diagnosticFilter,
    plan: paidFilter,
    parcours: parcoursFilter,
  };

  // Searching or filtering starts again from the first page.
  const changeFilter =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setPage(1);
    };

  const usersFn = useCallback(
    () =>
      getUsersPage(page, {
        search: debouncedSearch,
        diagnostic: diagnosticFilter,
        plan: paidFilter,
        parcours: parcoursFilter,
      }),
    [page, debouncedSearch, diagnosticFilter, paidFilter, parcoursFilter],
  );
  const { data: usersPage, loading: loadingUsers } =
    useService<Paginated<UserProfile>>(usersFn);
  const users = usersPage?.items ?? [];

  const exportCsv = async () => {
    setExporting(true);
    try {
      exportUsersCsv(await getUsers(filters));
    } finally {
      setExporting(false);
    }
  };

  if (loadingStats && !stats) {
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
      <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end">
        <div className="min-w-0 flex-1">
          <UserFilters
        search={search}
            onSearchChange={changeFilter(setSearch)}
            diagnosticFilter={diagnosticFilter}
            onDiagnosticChange={changeFilter(setDiagnosticFilter)}
            paidFilter={paidFilter}
            onPaidChange={changeFilter(setPaidFilter)}
            parcoursFilter={parcoursFilter}
            onParcoursChange={changeFilter(setParcoursFilter)}
          />
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={<Download size={14} />}
          onClick={exportCsv}
          disabled={exporting}
        >
          {exporting ? 'Export…' : 'Exporter CSV'}
        </Button>
      </div>

      {/* Table */}
      {loadingUsers && !usersPage ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : users.length > 0 ? (
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
            {users.map((user) => (
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

      {usersPage && (
        <Pagination
          page={usersPage.page}
          pageSize={usersPage.pageSize}
          total={usersPage.total}
          onPageChange={setPage}
        />
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
