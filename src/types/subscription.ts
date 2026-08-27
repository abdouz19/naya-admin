export type SubscriptionPlan = 'mensuel' | 'trimestriel' | 'annuel';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'trial';

export interface Subscription {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  amount: number; // monthly equivalent in EUR
  started_at: string;
  expires_at: string;
  cancelled_at: string | null;
}

export interface RevenueStats {
  mrr: number; // Monthly Recurring Revenue in EUR
  arr: number; // Annual Recurring Revenue
  totalRevenue: number; // All-time
  activeSubscriptions: number;
  churnRate: number; // 0-1
  averageRevenuePerUser: number;
  trialConversions: number; // percentage 0-1
  revenueByMonth: { month: string; revenue: number }[];
  planDistribution: { plan: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  newSubscriptionsThisMonth: number;
  cancelledThisMonth: number;
}

export const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  mensuel: 'Mensuel',
  trimestriel: 'Trimestriel',
  annuel: 'Annuel',
};

export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  mensuel: 29.90,
  trimestriel: 24.90, // per month
  annuel: 19.90, // per month
};

export const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: 'Actif',
  cancelled: 'Resilie',
  expired: 'Expire',
  trial: 'Essai',
};

export const STATUS_BADGE_VARIANTS: Record<SubscriptionStatus, 'green' | 'danger' | 'muted' | 'gold'> = {
  active: 'green',
  cancelled: 'danger',
  expired: 'muted',
  trial: 'gold',
};
