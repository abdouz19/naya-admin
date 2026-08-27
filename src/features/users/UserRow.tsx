import { Check } from 'lucide-react';
import { Table, Avatar, Badge } from '@/components/ui';
import { formatRelative } from '@/lib/format';
import type { UserProfile } from '@/types/user';

interface UserRowProps {
  user: UserProfile;
  onClick: (user: UserProfile) => void;
}

const PARCOURS_LABELS: Record<string, string> = {
  retour_emploi: 'Retour emploi',
  reconversion: 'Reconversion',
  creation_activite: "Creation d'activite",
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
        {user.parcours_type ? (
          <Badge variant="rose">{PARCOURS_LABELS[user.parcours_type]}</Badge>
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
