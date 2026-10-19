import type {
  SupportStats,
  SupportStatus,
  SupportTicket,
  SupportTicketDetail,
} from '@/types/support';
import { PAGE_SIZE, type Paginated } from '@/types/pagination';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

export const SUPPORT_AUTH_ERROR_MESSAGE =
  "Ta session a expiré ou ton compte n'a pas accès au support. Déconnecte-toi puis reconnecte-toi.";

/** Raised when the API answers 401/403 (expired session, fake token, no access). */
export class SupportAuthError extends Error {
  constructor() {
    super(SUPPORT_AUTH_ERROR_MESSAGE);
    this.name = 'SupportAuthError';
  }
}

/** Dispatched on `window` whenever fresh stats are known, so the sidebar badge stays in sync. */
export const SUPPORT_STATS_EVENT = 'nayha:support-stats';

function broadcastStats(stats: SupportStats) {
  window.dispatchEvent(new CustomEvent<SupportStats>(SUPPORT_STATS_EVENT, { detail: stats }));
}

async function supportRequest<T>(
  path: string,
  token: string | null,
  init: RequestInit = {},
): Promise<T> {
  if (!token) throw new SupportAuthError();

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/support/admin${path}`, {
      ...init,
      cache: 'no-store',
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    throw new Error('Impossible de joindre le serveur. Vérifie ta connexion puis réessaie.');
  }

  if (res.status === 401 || res.status === 403) throw new SupportAuthError();

  if (!res.ok) {
    let message = `Erreur du serveur (${res.status}).`;
    try {
      const data = await res.json();
      if (data && typeof data.message === 'string') message = data.message;
    } catch {
      // ignore non-JSON error body
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

export async function getSupportStats(token: string | null): Promise<SupportStats> {
  const stats = await supportRequest<SupportStats>('/stats', token);
  broadcastStats(stats);
  return stats;
}

export interface SupportTicketFilters {
  status?: SupportStatus;
  search?: string;
}

/** One page of the inbox, filtered by status and searched by the API. */
export function getSupportTicketsPage(
  token: string | null,
  page: number,
  filters: SupportTicketFilters = {},
  pageSize = PAGE_SIZE,
): Promise<Paginated<SupportTicket>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (filters.status) params.set('status', filters.status);
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  return supportRequest<Paginated<SupportTicket>>(`/tickets?${params}`, token);
}

export function getSupportTicket(token: string | null, id: string): Promise<SupportTicketDetail> {
  return supportRequest<SupportTicketDetail>(`/tickets/${encodeURIComponent(id)}`, token);
}

export function replyToSupportTicket(
  token: string | null,
  id: string,
  message: string,
): Promise<SupportTicketDetail> {
  return supportRequest<SupportTicketDetail>(`/tickets/${encodeURIComponent(id)}/messages`, token, {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}

export function resolveSupportTicket(token: string | null, id: string): Promise<SupportTicketDetail> {
  return supportRequest<SupportTicketDetail>(`/tickets/${encodeURIComponent(id)}/resolve`, token, {
    method: 'POST',
  });
}
