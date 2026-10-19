import { Clock } from '@/components/icons';
import { Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatElapsed, formatRelative } from '@/lib/format';
import type { SupportTicket } from '@/types/support';
import { topicLabel } from '@/types/support';

interface SupportTicketRowProps {
  ticket: SupportTicket;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function SupportTicketRow({ ticket, selected, onSelect }: SupportTicketRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(ticket.id)}
      aria-current={selected ? 'true' : undefined}
      className={cn(
        'w-full text-left px-4 py-3 border-b border-gray-100 border-l-3 transition-colors duration-150',
        selected
          ? 'bg-rose-light/20 border-l-rose'
          : 'border-l-transparent hover:bg-cream/60',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'h-2 w-2 shrink-0 rounded-full',
            ticket.unread ? 'bg-rose' : 'bg-transparent',
          )}
          aria-label={ticket.unread ? 'Non lu' : undefined}
        />
        <span className="flex-1 truncate text-sm font-medium text-brown">
          {ticket.user?.name ?? 'Utilisatrice supprimée'}
        </span>
        <span className="shrink-0 text-[11px] text-muted">
          {formatRelative(ticket.lastMessageAt)}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2 pl-4">
        <Badge variant="muted" className="shrink-0">
          {topicLabel(ticket.topic)}
        </Badge>
        <span
          className={cn(
            'truncate text-sm text-ink',
            ticket.unread ? 'font-semibold' : 'font-normal',
          )}
        >
          {ticket.subject}
        </span>
      </div>

      <p className="mt-1 truncate pl-4 text-xs text-muted">
        {ticket.lastMessagePreview || '—'}
      </p>

      {ticket.status === 'waiting' && (
        <p className="mt-1 flex items-center gap-1 pl-4 text-[11px] font-medium text-rose-dark">
          <Clock size={12} />
          En attente depuis {formatElapsed(ticket.lastMessageAt)}
        </p>
      )}
    </button>
  );
}
