import { Check } from 'lucide-react';
import { Table, Avatar, Badge } from '@/components/ui';
import { formatRelative } from '@/lib/format';
import type { UserProfile } from '@/types/user';

interface UserRowProps {
  user: UserProfile;
  onClick: (user: UserProfile) => void;
}

const PARCOURS_CONFIG: Record<string, { label: string; variant: 'rose' | 'gold' | 'green' | 'muted' }> = {
  retour_emploi: { label: 'Retour emploi', variant: 'rose' },
  retouremploi: { label: 'Retour emploi', variant: 'rose' },
  reconversion: { label: 'Reconversion', variant: 'gold' },
  creation_activite: { label: "Création d'activité", variant: 'green' },
  creationactivite: { label: "Création d'activité", variant: 'green' },
};

function DiagnosticBadge({ user }: { user: UserProfile }) {
  const both = user.diagnostic_vie_completed && user.diagnostic_pro_completed;
  const partial = user.diagnostic_vie_completed || user.diagnostic_pro_completed;

  if (both) {
    return (
      <Badge variant="green">
        <Check size={12} className="mr-1" />
        Complet
      </Badge>
    );
  }

  if (partial) {
    return <Badge variant="gold">En cours</Badge>;
  }

  return <Badge variant="muted">Non commence</Badge>;
}

export function UserRow({ user, onClick }: UserRowProps) {
  const activeList =
    user.parcours_types && user.parcours_types.length > 0
      ? user.parcours_types
      : user.parcours_type
      ? [user.parcours_type]
      : [];

  return (
    <Table.Row clickable onClick={() => onClick(user)}>
      <Table.Cell>
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div>
            <p className="font-medium text-brown">{user.name}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </Table.Cell>

      <Table.Cell>
        <DiagnosticBadge user={user} />
      </Table.Cell>

      <Table.Cell>
        {activeList.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {activeList.map((p) => {
              const key = p.toLowerCase().replace(/[^a-z]/g, '');
              const conf = PARCOURS_CONFIG[key] || { label: p, variant: 'rose' as const };
              return (
                <Badge key={p} variant={conf.variant}>
                  {conf.label}
                </Badge>
              );
            })}
          </div>
        ) : (
          <span className="text-muted">&mdash;</span>
        )}
      </Table.Cell>

      <Table.Cell>
        {user.selected_metier_titre ? (
          <span className="text-sm text-brown">{user.selected_metier_titre}</span>
        ) : (
          <span className="text-muted">&mdash;</span>
        )}
      </Table.Cell>

      <Table.Cell>
        <span className="font-medium text-brown">{user.actions_semaine_count}</span>
      </Table.Cell>

      <Table.Cell>
        {user.has_paid ? (
          <Badge variant="green">Premium</Badge>
        ) : (
          <Badge variant="muted">Standard</Badge>
        )}
      </Table.Cell>

      <Table.Cell>
        <span className="text-sm text-muted">
          {formatRelative(user.last_active_at)}
        </span>
      </Table.Cell>
    </Table.Row>
  );
}
