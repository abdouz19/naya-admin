import { useCallback, useMemo, useState } from 'react';
import { Briefcase, Download } from 'lucide-react';
import { Table, Spinner, SearchInput, Select, Card, EmptyState, Button } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getCandidatures,
  getCandidatureStats,
  type CandidatureStats,
} from '@/services/candidatures.service';
import type { Candidature, CandidatureStatut } from '@/types/candidature';
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
  const candidaturesFn = useCallback(() => getCandidatures(), []);
  const statsFn = useCallback(() => getCandidatureStats(), []);

  const { data: candidatures, loading: loadingCandidatures } =
    useService<Candidature[]>(candidaturesFn);
  const { data: stats, loading: loadingStats } =
    useService<CandidatureStats>(statsFn);

  const [search, setSearch] = useState('');
  const [statutFilter, setStatutFilter] = useState<'all' | CandidatureStatut>(
    'all',
  );

  const filtered = useMemo(() => {
    if (!candidatures) return [];

    return candidatures.filter((c) => {
      // Search filter
      if (search) {
        const q = search.toLowerCase();
        const match =
          c.entreprise.toLowerCase().includes(q) ||
          c.poste.toLowerCase().includes(q) ||
          c.user_name.toLowerCase().includes(q);
        if (!match) return false;
      }

      // Statut filter
      if (statutFilter !== 'all' && c.statut !== statutFilter) return false;

      return true;
    });
  }, [candidatures, search, statutFilter]);

  const loading = loadingCandidatures || loadingStats;

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
      {stats && <CandidatureStatsHeader stats={stats} />}

      {/* Chart */}
      {candidatures && candidatures.length > 0 && (
        <CandidatureStatusChart candidatures={candidatures} />
      )}

      {/* Filters */}
      <div className="flex items-end gap-4">
        <SearchInput
          value={search}
          onSearch={setSearch}
          placeholder="Rechercher une candidature..."
          className="flex-1"
        />

        <Select
          label="Statut"
          options={statutOptions}
          value={statutFilter}
          onChange={(e) =>
            setStatutFilter(e.target.value as 'all' | CandidatureStatut)
          }
        />

        <Button
          variant="secondary"
          size="sm"
          icon={<Download size={14} />}
          onClick={() => exportCandidaturesCsv(filtered)}
        >
          Exporter CSV
        </Button>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
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
            {filtered.map((candidature) => (
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
    </div>
  );
}
