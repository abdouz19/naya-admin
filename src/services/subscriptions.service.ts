import { mockSubscriptions, getMockRevenueStats } from '@/data/mock-subscriptions';
import type { Subscription, SubscriptionStatus, RevenueStats } from '@/types/subscription';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

export function getSubscriptions(): Promise<Subscription[]> {
  return delay([...mockSubscriptions]);
}

export function getRevenueStats(): Promise<RevenueStats> {
  return delay(getMockRevenueStats());
}

export function getSubscriptionsByStatus(
  status: SubscriptionStatus,
): Promise<Subscription[]> {
  return delay(mockSubscriptions.filter((s) => s.status === status));
}
