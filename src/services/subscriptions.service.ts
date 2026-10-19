import { apiFetch } from '@/lib/api';
import { PAGE_SIZE } from '@/types/pagination';
import type {
  SubscriptionStatusFilter,
  SubscriptionsOverview,
} from '@/types/subscription';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

export interface SubscriptionListFilters {
  status?: SubscriptionStatusFilter;
  search?: string;
}

/**
 * Figures and one page of subscribers, filtered by the API, as RevenueCat
 * reported them.
 */
export async function getSubscriptionsOverview(
  page = 1,
  filters: SubscriptionListFilters = {},
  pageSize = PAGE_SIZE,
): Promise<SubscriptionsOverview> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    status: filters.status ?? 'all',
  });
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  const res = await apiFetch(`${API_BASE_URL}/subscriptions/admin?${params}`);
  if (!res.ok) {
    throw new Error('Les abonnements n’ont pas pu être chargés.');
  }
  return res.json();
}
