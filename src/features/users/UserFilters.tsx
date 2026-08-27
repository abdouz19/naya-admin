import { SearchInput, Select } from '@/components/ui';

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  diagnosticFilter: 'all' | 'completed' | 'incomplete';
  onDiagnosticChange: (value: 'all' | 'completed' | 'incomplete') => void;
  paidFilter: 'all' | 'paid' | 'free';
  onPaidChange: (value: 'all' | 'paid' | 'free') => void;
  parcoursFilter: 'all' | 'retour_emploi' | 'reconversion' | 'creation_activite';
  onParcoursChange: (value: 'all' | 'retour_emploi' | 'reconversion' | 'creation_activite') => void;
}

const diagnosticOptions = [
  { value: 'all', label: 'Tous les diagnostics' },
  { value: 'completed', label: 'Diagnostic complet' },
  { value: 'incomplete', label: 'Diagnostic incomplet' },
];

const paidOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'paid', label: 'Premium' },
  { value: 'free', label: 'Standard' },
];

const parcoursOptions = [
  { value: 'all', label: 'Tous les parcours' },
  { value: 'retour_emploi', label: 'Retour emploi' },
  { value: 'reconversion', label: 'Reconversion' },
  { value: 'creation_activite', label: "Creation d'activite" },
];

export function UserFilters({
  search,
  onSearchChange,
  diagnosticFilter,
  onDiagnosticChange,
  paidFilter,
  onPaidChange,
  parcoursFilter,
  onParcoursChange,
}: UserFiltersProps) {
  return (
    <div className="flex items-end gap-4">
      <SearchInput
        value={search}
        onSearch={onSearchChange}
        placeholder="Rechercher une utilisatrice..."
        className="flex-1"
      />

      <Select
        label="Diagnostic"
        options={diagnosticOptions}
        value={diagnosticFilter}
        onChange={(e) =>
          onDiagnosticChange(e.target.value as UserFiltersProps['diagnosticFilter'])
        }
      />

      <Select
        label="Statut"
        options={paidOptions}
        value={paidFilter}
        onChange={(e) =>
          onPaidChange(e.target.value as UserFiltersProps['paidFilter'])
        }
      />

      <Select
        label="Parcours"
        options={parcoursOptions}
        value={parcoursFilter}
        onChange={(e) =>
          onParcoursChange(e.target.value as UserFiltersProps['parcoursFilter'])
        }
      />
    </div>
  );
}
