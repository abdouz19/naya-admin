import { apiFetch } from '@/lib/api';
import type { SubscriptionsOverview } from '@/types/subscription';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

/** Subscribers and figures, as RevenueCat reported them to the API. */
export async function getSubscriptionsOverview(): Promise<SubscriptionsOverview> {
  const res = await apiFetch(`${API_BASE_URL}/subscriptions/admin`);
  if (!res.ok) {
    throw new Error('Les abonnements n’ont pas pu être chargés.');
  }
  return res.json();
}
