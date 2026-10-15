import { useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { SupportTicketDetail } from '@/types/support';
import {
  SUPPORT_STATUS_BADGE_VARIANTS,
  SUPPORT_STATUS_LABELS,
  parcoursLabel,
  topicLabel,
} from '@/types/support';
import { SupportMessageItem } from './SupportMessageItem';
import { SupportComposer } from './SupportComposer';

interface SupportConversationProps {
  detail: SupportTicketDetail;
  sending: boolean;
  resolving: boolean;
  onSend: (message: string) => Promise<boolean>;
  onResolve: () => void;
  onBack: () => void;
}

function contextLine(detail: SupportTicketDetail): string {
  const ctx = detail.ticket.context ?? {};
  const parts: string[] = [];
  if (ctx.platform) parts.push(ctx.platform);
  if (ctx.appVersion) {
    parts.push(`App ${ctx.appVersion}${ctx.buildNumber ? ` (${ctx.buildNumber})` : ''}`);
  }
  if (ctx.osVersion) parts.push(`OS ${ctx.osVersion}`);
  if (ctx.locale) parts.push(ctx.locale);
  return parts.join(' · ');
}

export function SupportConversation({
  detail,
  sending,
  resolving,
  onSend,
  onResolve,
  onBack,
}: SupportConversationProps) {
  const { ticket, messages } = detail;
  const user = detail.user ?? ticket.user;
  const userName = user?.name ?? 'Utilisatrice';
  const email = detail.user?.email;
  const context = contextLine(detail);
  const scrollRef = useRef<HTMLDivElement>(null);

  const lastMessageId = messages[messages.length - 1]?.id;
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ticket.id, lastMessageId]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            className="mt-1 text-muted transition-colors hover:text-brown lg:hidden"
            aria-label="Retour à la liste"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-heading text-xl font-semibold text-brown">
                {ticket.subject}
              </h3>
              <Badge variant={SUPPORT_STATUS_BADGE_VARIANTS[ticket.status]}>
                {SUPPORT_STATUS_LABELS[ticket.status]}
              </Badge>
              <Badge variant="muted">{topicLabel(ticket.topic)}</Badge>
            </div>
            <p className="mt-1 text-sm text-brown">
              <span className="font-medium">{userName}</span>
              {email && <span className="text-muted"> · {email}</span>}
              <span className="text-muted"> · {parcoursLabel(user?.parcoursType)}</span>
            </p>
            {context && <p className="mt-0.5 text-[11px] text-muted">{context}</p>}
          </div>
          {ticket.status !== 'resolved' && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onResolve}
              loading={resolving}
              icon={<CheckCircle2 size={16} />}
              className="shrink-0"
            >
              Marquer comme résolu
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 space-y-4 overflow-y-auto bg-beige/60 px-5 py-4">
        {messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">Aucun message.</p>
        ) : (
          messages.map((m) => (
            <SupportMessageItem key={m.id} message={m} userName={userName} />
          ))
        )}
      </div>

      <SupportComposer
        key={ticket.id}
        isResolved={ticket.status === 'resolved'}
        sending={sending}
        onSend={onSend}
      />
    </div>
  );
}
