export type SubscriptionDuration = 'monthly' | 'quarterly' | 'annual';

export interface AdminSubscription {
  userId: string;
  name: string;
  email: string | null;
  parcoursType: string | null;
  status: 'active' | 'expired';
  duration: SubscriptionDuration | null;
  durationLabel: string | null;
  price: number | null;
  /** app_store, play_store, test_store… as reported by RevenueCat. */
  store: string | null;
  /** False once auto-renewal was turned off in the store. */
  willRenew: boolean | null;
  startedAt: string | null;
  expiresAt: string | null;
}

export interface SubscriptionsOverview {
  stats: {
    active: number;
    cancelling: number;
    expired: number;
    estimatedMonthlyRevenue: number;
    byDuration: { duration: SubscriptionDuration; label: string; count: number }[];
    unknownDuration: number;
  };
  subscriptions: AdminSubscription[];
}

export const STORE_LABELS: Record<string, string> = {
  app_store: 'App Store',
  mac_app_store: 'App Store',
  play_store: 'Google Play',
  test_store: 'Test Store',
  rc_billing: 'Web',
  stripe: 'Web',
  promotional: 'Offert',
};

export const PARCOURS_LABELS: Record<string, string> = {
  retourEmploi: 'Retour à l’emploi',
  reconversion: 'Reconversion',
  creationActivite: 'Création d’activité',
  coaching: 'Coaching',
};
