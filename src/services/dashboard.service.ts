import { mockUsers } from '@/data/mock-users';
import { mockCandidatures } from '@/data/mock-candidatures';
import { mockPosts } from '@/data/mock-community';
import { mockAiUsage } from '@/data/mock-ai-usage';
import { mockWatchRecords } from '@/data/mock-ateliers';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

export interface DashboardKpis {
  totalUsers: number;
  activeThisWeek: number;
  paidUsers: number;
  conversionRate: number;
  totalCandidatures: number;
  entretiensObtenus: number;
  acceptees: number;
  totalAiCalls: number;
  totalAiCost: number;
  reportedPosts: number;
}

export function getKpis(): Promise<DashboardKpis> {
  const now = new Date('2026-08-26T12:00:00Z').getTime();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  const totalUsers = mockUsers.length;
  const activeThisWeek = mockUsers.filter(
    (u) => now - new Date(u.last_active_at).getTime() < oneWeekMs
  ).length;
  const paidUsers = mockUsers.filter((u) => u.has_paid).length;
  const conversionRate = totalUsers > 0 ? paidUsers / totalUsers : 0;
  const totalCandidatures = mockCandidatures.length;
  const entretiensObtenus = mockCandidatures.filter(
    (c) => c.statut === 'entretien' || c.statut === 'acceptee'
  ).length;
  const acceptees = mockCandidatures.filter((c) => c.statut === 'acceptee').length;
  const totalAiCalls = mockAiUsage.length;
  const totalAiCost = Math.round(
    mockAiUsage.reduce((sum, log) => sum + log.cost_usd, 0) * 100
  ) / 100;
  const reportedPosts = mockPosts.filter((p) => p.reports_count > 0 && !p.is_moderated).length;

  return delay({
    totalUsers,
    activeThisWeek,
    paidUsers,
    conversionRate,
    totalCandidatures,
    entretiensObtenus,
    acceptees,
    totalAiCalls,
    totalAiCost,
    reportedPosts,
  });
}

export interface ActivityItem {
  id: string;
  type: 'user_joined' | 'candidature_sent' | 'post_created' | 'ai_call' | 'atelier_watched';
  description: string;
  timestamp: string;
  user_name: string;
}

export function getRecentActivity(): Promise<ActivityItem[]> {
  const activities: ActivityItem[] = [];

  // Recent user joins (last 7 days)
  for (const user of mockUsers) {
    const created = new Date(user.created_at).getTime();
    const now = new Date('2026-08-26T12:00:00Z').getTime();
    if (now - created < 14 * 24 * 60 * 60 * 1000) {
      activities.push({
        id: `act-user-${user.id}`,
        type: 'user_joined',
        description: `${user.name} a rejoint Nayha`,
        timestamp: user.created_at,
        user_name: user.name,
      });
    }
  }

  // Recent candidatures (last 7 days)
  for (const cand of mockCandidatures) {
    const sent = new Date(cand.date_envoi).getTime();
    const now = new Date('2026-08-26T12:00:00Z').getTime();
    if (now - sent < 10 * 24 * 60 * 60 * 1000) {
      activities.push({
        id: `act-cand-${cand.id}`,
        type: 'candidature_sent',
        description: `${cand.user_name} a postule chez ${cand.entreprise}`,
        timestamp: cand.date_envoi,
        user_name: cand.user_name,
      });
    }
  }

  // Recent posts (last 7 days)
  for (const post of mockPosts) {
    const created = new Date(post.created_at).getTime();
    const now = new Date('2026-08-26T12:00:00Z').getTime();
    if (now - created < 7 * 24 * 60 * 60 * 1000) {
      activities.push({
        id: `act-post-${post.id}`,
        type: 'post_created',
        description: `${post.auteur} a publie dans la communaute`,
        timestamp: post.created_at,
        user_name: post.auteur,
      });
    }
  }

  // Recent atelier watches (last 14 days)
  for (const record of mockWatchRecords) {
    const watched = new Date(record.watched_at).getTime();
    const now = new Date('2026-08-26T12:00:00Z').getTime();
    if (now - watched < 14 * 24 * 60 * 60 * 1000) {
      activities.push({
        id: `act-atelier-${record.atelier_id}-${record.user_id}`,
        type: 'atelier_watched',
        description: `${record.user_name} a visionne un atelier`,
        timestamp: record.watched_at,
        user_name: record.user_name,
      });
    }
  }

  // Sort by timestamp descending, take top 30
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return delay(activities.slice(0, 30));
}

export interface SparklinePoint {
  date: string;
  value: number;
}

export function getSparklineData(): Promise<{
  usersPerDay: SparklinePoint[];
  candidaturesPerDay: SparklinePoint[];
  aiCallsPerDay: SparklinePoint[];
  costPerDay: SparklinePoint[];
}> {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date('2026-08-26T00:00:00Z');
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const usersPerDay = days.map((date) => ({
    date,
    value: mockUsers.filter((u) => u.created_at.slice(0, 10) === date).length,
  }));

  const candidaturesPerDay = days.map((date) => ({
    date,
    value: mockCandidatures.filter((c) => c.date_envoi.slice(0, 10) === date).length,
  }));

  const aiCallsPerDay = days.map((date) => ({
    date,
    value: mockAiUsage.filter((a) => a.timestamp.slice(0, 10) === date).length,
  }));

  const costPerDay = days.map((date) => {
    const dayCost = mockAiUsage
      .filter((a) => a.timestamp.slice(0, 10) === date)
      .reduce((sum, a) => sum + a.cost_usd, 0);
    return { date, value: Math.round(dayCost * 100) / 100 };
  });

  return delay({ usersPerDay, candidaturesPerDay, aiCallsPerDay, costPerDay });
}
