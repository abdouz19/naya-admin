import { Pencil, Trash2 } from 'lucide-react';
import { Avatar, Badge, Table } from '@/components/ui';
import { formatRelative } from '@/lib/format';
import type { AdminUser } from '@/types/admin';
import { ROLE_LABELS, ROLE_BADGE_VARIANTS } from '@/types/admin';

interface AdminUserRowProps {
  user: AdminUser;
  onEdit: (user: AdminUser) => void;
  onDelete: (user: AdminUser) => void;
}

export function AdminUserRow({ user, onEdit, onDelete }: AdminUserRowProps) {
  return (
    <Table.Row>
      {/* Identity */}
      <Table.Cell>
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-brown">{user.name}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
        </div>
      </Table.Cell>

      {/* Role */}
      <Table.Cell>
        <Badge variant={ROLE_BADGE_VARIANTS[user.role] as 'rose' | 'gold' | 'green' | 'muted'}>
          {ROLE_LABELS[user.role]}
        </Badge>
      </Table.Cell>

      {/* Last login */}
      <Table.Cell className="text-muted">
        {formatRelative(user.last_login_at)}
      </Table.Cell>

      {/* Status */}
      <Table.Cell>
        <Badge variant={user.is_active ? 'green' : 'muted'}>
          {user.is_active ? 'Actif' : 'Inactif'}
        </Badge>
      </Table.Cell>

      {/* Actions */}
      <Table.Cell>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-beige hover:text-brown"
            aria-label={`Modifier ${user.name}`}
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(user)}
            className="rounded-md p-1.5 text-muted transition-colors hover:bg-danger-light hover:text-danger"
            aria-label={`Supprimer ${user.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}
