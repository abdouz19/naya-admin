import { Table, Badge, Avatar } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/format';
import type { Subscription } from '@/types/subscription';
import {
  PLAN_LABELS,
  STATUS_LABELS,
  STATUS_BADGE_VARIANTS,
} from '@/types/subscription';

interface SubscriptionRowProps {
  subscription: Subscription;
}

const PLAN_BADGE_VARIANTS = {
  mensuel: 'rose',
  trimestriel: 'gold',
  annuel: 'green',
} as const;

export function SubscriptionRow({ subscription }: SubscriptionRowProps) {
  return (
    <Table.Row>
      {/* User */}
      <Table.Cell>
        <div className="flex items-center gap-3">
          <Avatar name={subscription.user_name} size="sm" />
          <div className="flex flex-col">
            <span className="text-sm font-medium text-brown">
              {subscription.user_name}
            </span>
            <span className="text-xs text-muted">
              {subscription.user_email}
            </span>
          </div>
        </div>
      </Table.Cell>

      {/* Plan */}
      <Table.Cell>
        <Badge variant={PLAN_BADGE_VARIANTS[subscription.plan]}>
          {PLAN_LABELS[subscription.plan]}
        </Badge>
      </Table.Cell>

      {/* Montant */}
      <Table.Cell>
        <span className="text-sm font-medium text-brown">
          {subscription.status === 'trial'
            ? 'Gratuit'
            : `${formatCurrency(subscription.amount, 'EUR')}/mois`}
        </span>
      </Table.Cell>

      {/* Statut */}
      <Table.Cell>
        <Badge variant={STATUS_BADGE_VARIANTS[subscription.status]}>
          {STATUS_LABELS[subscription.status]}
        </Badge>
      </Table.Cell>

      {/* Date debut */}
      <Table.Cell>
        <span className="text-sm text-muted">
          {formatDate(subscription.started_at)}
        </span>
      </Table.Cell>

      {/* Expiration */}
      <Table.Cell>
        <span className="text-sm text-muted">
          {formatDate(subscription.expires_at)}
        </span>
      </Table.Cell>

      {/* Actions */}
      <Table.Cell>
        <span className="text-muted">&mdash;</span>
      </Table.Cell>
    </Table.Row>
  );
}
