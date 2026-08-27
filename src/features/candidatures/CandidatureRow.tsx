import { Check } from 'lucide-react';
import { Table, Badge } from '@/components/ui';
import { formatDate } from '@/lib/format';
import type { Candidature, CandidatureStatut } from '@/types/candidature';
import { STATUT_LABELS, STATUT_COLORS } from '@/types/candidature';

interface CandidatureRowProps {
  candidature: Candidature;
}

const BADGE_VARIANT_MAP: Record<string, 'rose' | 'gold' | 'green' | 'muted' | 'danger'> = {
  rose: 'rose',
  gold: 'gold',
  green: 'green',
  muted: 'muted',
  danger: 'danger',
};

function getVariant(statut: CandidatureStatut) {
  const color = STATUT_COLORS[statut];
  return BADGE_VARIANT_MAP[color] ?? 'muted';
}

export function CandidatureRow({ candidature }: CandidatureRowProps) {
  return (
    <Table.Row>
      <Table.Cell>
        <span className="font-medium text-brown">{candidature.entreprise}</span>
      </Table.Cell>

      <Table.Cell>
        <span className="text-sm text-brown">{candidature.poste}</span>
      </Table.Cell>

      <Table.Cell>
        <span className="text-sm text-muted">{candidature.user_name}</span>
      </Table.Cell>

      <Table.Cell>
        <Badge variant={getVariant(candidature.statut)}>
          {STATUT_LABELS[candidature.statut]}
        </Badge>
      </Table.Cell>

      <Table.Cell>
        <span className="text-sm text-muted">
          {formatDate(candidature.date_envoi)}
        </span>
      </Table.Cell>

      <Table.Cell>
        {candidature.date_entretien ? (
          <span className="text-sm text-brown">
            {formatDate(candidature.date_entretien)}
          </span>
        ) : (
          <span className="text-muted">&mdash;</span>
        )}
      </Table.Cell>

      <Table.Cell>
        {candidature.relance_envoyee ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-light text-green">
            <Check size={12} />
          </span>
        ) : (
          <span className="text-muted">&mdash;</span>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
