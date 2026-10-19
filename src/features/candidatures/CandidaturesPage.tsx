import { useCallback, useState } from 'react';
import { Briefcase, Download } from '@/components/icons';
import {
  Table,
  Spinner,
  SearchInput,
  Select,
  Card,
  EmptyState,
  Button,
  Pagination,
} from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getCandidatures,
  getCandidaturesPage,
  getCandidatureStats,
  type CandidatureStats,
} from '@/services/candidatures.service';
import type { Candidature, CandidatureStatut } from '@/types/candidature';
import type { Paginated } from '@/types/pagination';
import { STATUT_LABELS } from '@/types/candidature';
import { CandidatureStatsHeader } from './CandidatureStatsHeader';
import { CandidatureStatusChart } from './CandidatureStatusChart';
import { CandidatureRow } from './CandidatureRow';

function exportCandidaturesCsv(candidatures: Candidature[]) {
  const headers = [
    'Entreprise', 'Poste', 'Utilisatrice', 'Statut', 'Date envoi',
    'Date entretien', 'Ressenti', 'Issue', 'Relance', 'Notes',
  ];
  const rows = candidatures.map((c) => [
    c.entreprise,
    c.poste,
    c.user_name,
    STATUT_LABELS[c.statut],
    c.date_envoi,
    c.date_entretien ?? '',
    c.ressenti_entretien ?? '',
    c.issue_entretien ?? '',
    c.relance_envoyee ? 'Oui' : 'Non',
    c.notes ?? '',
  ]);
  const csv = [headers, ...rows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `candidatures_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const statutOptions = [
  { value: 'all', label: 'Tous les statuts' },
  ...Object.entries(STATUT_LABELS).map(([value, label]) => ({ value, label })),
];

export default function CandidaturesPage() {
  const statsFn = useCallback(() => getCandidatureStats(), []);
  const { data: stats, loading: loadingStats } =
    useService<CandidatureStats>(statsFn);

  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState<'all' | CandidatureStatut>(
    'all',
  );
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);

  // Searching or filtering starts again from the first page.
  const changeFilter =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setPage(1);
    };

  // SearchInput already waits for typing to pause before calling onSearch.
  const candidaturesFn = useCallback(
    () => getCandidaturesPage(page, { search, statut: statutFilter }),
    [page, search, statutFilter],
  );
  const { data: candidaturesPage, loading: loadingCandidatures } =
    useService<Paginated<Candidature>>(candidaturesFn);
  const candidatures = candidaturesPage?.items ?? [];

  const exportCsv = async () => {
    setExporting(true);
    try {
      exportCandidaturesCsv(
        await getCandidatures({ search, statut: statutFilter }),
      );
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
      {stats && <CandidatureStatsHeader stats={stats} />}

      {/* Chart */}
      {stats?.byStatut && stats.total > 0 && (
        <CandidatureStatusChart counts={stats.byStatut} />
      )}

      {/* Filters */}
      <div className="flex items-end gap-4">
        <SearchInput
          value={search}
          onSearch={changeFilter(setSearch)}
          placeholder="Rechercher une candidature..."
          className="flex-1"
        />

        <Select
          label="Statut"
          options={statutOptions}
          value={statutFilter}
          onChange={(e) =>
            changeFilter(setStatutFilter)(
              e.target.value as 'all' | CandidatureStatut,
            )
          }
        />

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
      {loadingCandidatures && !candidaturesPage ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : candidatures.length > 0 ? (
        <Table>
          <Table.Header>
            <th className="px-4 py-3 text-left">Entreprise</th>
            <th className="px-4 py-3 text-left">Poste</th>
            <th className="px-4 py-3 text-left">Utilisatrice</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Date envoi</th>
            <th className="px-4 py-3 text-left">Entretien</th>
            <th className="px-4 py-3 text-left">Relance</th>
          </Table.Header>
          <Table.Body>
            {candidatures.map((candidature) => (
              <CandidatureRow
                key={candidature.id}
                candidature={candidature}
              />
            ))}
          </Table.Body>
        </Table>
      ) : (
        <Card>
          <EmptyState
            icon={Briefcase}
            title="Aucune candidature trouvee"
            description="Essayez de modifier vos filtres de recherche."
          />
        </Card>
      )}

      {candidaturesPage && (
        <Pagination
          page={candidaturesPage.page}
          pageSize={candidaturesPage.pageSize}
          total={candidaturesPage.total}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
