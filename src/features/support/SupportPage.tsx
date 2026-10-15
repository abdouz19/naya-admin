import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Inbox, MessagesSquare, RefreshCw, TriangleAlert } from 'lucide-react';
import { Button, Card, EmptyState, Spinner, Tabs } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/cn';
import {
  SUPPORT_AUTH_ERROR_MESSAGE,
  SupportAuthError,
  getSupportStats,
  getSupportTicket,
  getSupportTickets,
  replyToSupportTicket,
  resolveSupportTicket,
} from '@/services/support.service';
import type {
  SupportStats,
  SupportStatus,
  SupportTicket,
  SupportTicketDetail,
} from '@/types/support';
import { SUPPORT_STATUS_LABELS } from '@/types/support';
import { SupportTicketRow } from './SupportTicketRow';
import { SupportConversation } from './SupportConversation';

type TabKey = SupportStatus | 'all';

const REFRESH_INTERVAL_MS = 60_000;

const EMPTY_LABELS: Record<TabKey, string> = {
  waiting: 'Aucune demande à traiter 🎉',
  answered: 'Aucune demande en attente de retour',
  resolved: 'Aucune demande résolue',
  all: 'Aucune demande pour le moment',
};

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Une erreur est survenue.';
}

export default function SupportPage() {
  const { token, logout } = useAuth();

  const [tab, setTab] = useState<TabKey>('waiting');
  const [stats, setStats] = useState<SupportStats | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[] | null>(null);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<SupportTicketDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const listRequest = useRef(0);
  const detailRequest = useRef(0);

  // ── List + stats ──────────────────────────────────────────
  const refreshList = useCallback((): Promise<void> => {
    const req = ++listRequest.current;
    return Promise.all([
      getSupportStats(token),
      getSupportTickets(token, tab === 'all' ? undefined : tab),
    ])
      .then(([nextStats, nextTickets]) => {
        if (req !== listRequest.current) return;
        setStats(nextStats);
        setTickets(nextTickets);
        setListError(null);
      })
      .catch((err: unknown) => {
        if (req !== listRequest.current) return;
        if (err instanceof SupportAuthError) setAuthError(true);
        else setListError(errorMessage(err));
      })
      .finally(() => {
        if (req === listRequest.current) setListLoading(false);
      });
  }, [token, tab]);

  useEffect(() => {
    void refreshList();
    const interval = window.setInterval(() => void refreshList(), REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [refreshList]);

  const handleTabChange = useCallback((key: string) => {
    setTab(key as TabKey);
    setTickets(null);
    setListError(null);
    setListLoading(true);
  }, []);

  // ── Detail ────────────────────────────────────────────────
  const applyDetail = useCallback((next: SupportTicketDetail) => {
    setDetail(next);
    // Reflect the new state (read, status, preview) in the list right away.
    setTickets((prev) =>
      prev?.map((t) => (t.id === next.ticket.id ? { ...t, ...next.ticket, unread: false } : t)) ??
      prev,
    );
  }, []);

  const handleSelect = useCallback(
    async (id: string) => {
      const req = ++detailRequest.current;
      setSelectedId(id);
      setDetail(null);
      setDetailError(null);
      setActionError(null);
      setDetailLoading(true);
      try {
        const next = await getSupportTicket(token, id);
        if (req !== detailRequest.current) return;
        applyDetail(next);
        // Opening marks it read for the team: refresh counters.
        getSupportStats(token).then(setStats).catch(() => undefined);
      } catch (err) {
        if (req !== detailRequest.current) return;
        if (err instanceof SupportAuthError) setAuthError(true);
        else setDetailError(errorMessage(err));
      } finally {
        if (req === detailRequest.current) setDetailLoading(false);
      }
    },
    [token, applyDetail],
  );

  const handleSend = useCallback(
    async (message: string): Promise<boolean> => {
      if (!selectedId) return false;
      setSending(true);
      setActionError(null);
      try {
        const next = await replyToSupportTicket(token, selectedId, message);
        applyDetail(next);
        void refreshList();
        return true;
      } catch (err) {
        if (err instanceof SupportAuthError) setAuthError(true);
        else setActionError(`Le message n'a pas pu être envoyé : ${errorMessage(err)}`);
        return false;
      } finally {
        setSending(false);
      }
    },
    [token, selectedId, applyDetail, refreshList],
  );

  const handleResolve = useCallback(async () => {
    if (!selectedId) return;
    setResolving(true);
    setActionError(null);
    try {
      const next = await resolveSupportTicket(token, selectedId);
      applyDetail(next);
      void refreshList();
    } catch (err) {
      if (err instanceof SupportAuthError) setAuthError(true);
      else setActionError(`La demande n'a pas pu être résolue : ${errorMessage(err)}`);
    } finally {
      setResolving(false);
    }
  }, [token, selectedId, applyDetail, refreshList]);

  const tabs = useMemo(
    () => [
      { key: 'waiting', label: SUPPORT_STATUS_LABELS.waiting, count: stats?.waiting },
      { key: 'answered', label: SUPPORT_STATUS_LABELS.answered, count: stats?.answered },
      { key: 'resolved', label: SUPPORT_STATUS_LABELS.resolved, count: stats?.resolved },
      {
        key: 'all',
        label: 'Toutes',
        count: stats ? stats.waiting + stats.answered + stats.resolved : undefined,
      },
    ],
    [stats],
  );

  // ── Render ────────────────────────────────────────────────
  if (authError) {
    return (
      <Card className="mx-auto max-w-xl">
        <div className="flex flex-col items-center py-6 text-center">
          <TriangleAlert size={40} className="mb-4 text-danger" strokeWidth={1.5} />
          <p className="max-w-sm text-sm text-brown">{SUPPORT_AUTH_ERROR_MESSAGE}</p>
          <Button className="mt-6" onClick={logout}>
            Se déconnecter
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:h-[calc(100vh-8rem)]">
      <Tabs
        tabs={tabs}
        activeKey={tab}
        onChange={handleTabChange}
        className="shrink-0 overflow-x-auto"
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white radius-md shadow-card lg:flex-row">
        {/* Ticket list */}
        <aside
          className={cn(
            'min-h-0 flex-col border-gray-200 lg:flex lg:w-[380px] lg:shrink-0 lg:border-r',
            selectedId ? 'hidden' : 'flex',
          )}
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
            <span className="text-xs font-medium uppercase tracking-wider text-muted">
              {tickets ? `${tickets.length} demande${tickets.length > 1 ? 's' : ''}` : 'Demandes'}
            </span>
            <button
              type="button"
              onClick={() => void refreshList()}
              className="text-muted transition-colors hover:text-rose"
              title="Actualiser"
              aria-label="Actualiser"
            >
              <RefreshCw size={14} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {listLoading && !tickets ? (
              <div className="flex h-48 items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : listError && !tickets ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-danger">
                  Impossible de charger les demandes : {listError}
                </p>
                <Button variant="ghost" size="sm" className="mt-3" onClick={() => void refreshList()}>
                  Réessayer
                </Button>
              </div>
            ) : tickets && tickets.length === 0 ? (
              <EmptyState icon={Inbox} title={EMPTY_LABELS[tab]} />
            ) : (
              <>
                {listError && (
                  <p className="border-b border-gray-100 bg-danger-light px-4 py-2 text-xs text-danger">
                    Actualisation impossible : {listError}
                  </p>
                )}
                {tickets?.map((t) => (
                  <SupportTicketRow
                    key={t.id}
                    ticket={t}
                    selected={t.id === selectedId}
                    onSelect={(id) => void handleSelect(id)}
                  />
                ))}
              </>
            )}
          </div>
        </aside>

        {/* Conversation */}
        <section
          className={cn(
            'min-h-[70vh] min-w-0 flex-1 flex-col lg:flex lg:min-h-0',
            selectedId ? 'flex' : 'hidden',
          )}
        >
          {!selectedId ? (
            <div className="flex h-full items-center justify-center">
              <EmptyState
                icon={MessagesSquare}
                title="Sélectionne une demande"
                description="La conversation s'affichera ici."
              />
            </div>
          ) : detailLoading && !detail ? (
            <div className="flex h-full items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : detailError || !detail ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <p className="text-sm text-danger">
                Impossible de charger la conversation : {detailError ?? 'demande introuvable.'}
              </p>
              <div className="mt-3 flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)}>
                  Retour
                </Button>
                <Button variant="secondary" size="sm" onClick={() => void handleSelect(selectedId)}>
                  Réessayer
                </Button>
              </div>
            </div>
          ) : (
            <>
              {actionError && (
                <p className="bg-danger-light px-5 py-2 text-xs text-danger">{actionError}</p>
              )}
              <div className="min-h-0 flex-1">
                <SupportConversation
                  detail={detail}
                  sending={sending}
                  resolving={resolving}
                  onSend={handleSend}
                  onResolve={() => void handleResolve()}
                  onBack={() => setSelectedId(null)}
                />
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
