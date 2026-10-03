import { mockUsers } from '@/data/mock-users';
import { mockCandidatures } from '@/data/mock-candidatures';
import { mockPosts } from '@/data/mock-community';
import { mockAiUsage } from '@/data/mock-ai-usage';
import { mockWatchRecords } from '@/data/mock-ateliers';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 80));

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

export async function getKpis(): Promise<DashboardKpis> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/kpis`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.totalUsers === 'number') {
        return data;
      }
    }
  } catch (_) {
    // fallback
  }

  const now = Date.now();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;

  const totalUsers = mockUsers.length;
  const activeThisWeek = mockUsers.filter(
    (u) => now - new Date(u.last_active_at).getTime() < oneWeekMs,
  ).length;
  const paidUsers = mockUsers.filter((u) => u.has_paid).length;
  const conversionRate = totalUsers > 0 ? paidUsers / totalUsers : 0;
  const totalCandidatures = mockCandidatures.length;
  const entretiensObtenus = mockCandidatures.filter(
    (c) => c.statut === 'entretien' || c.statut === 'acceptee',
  ).length;
  const acceptees = mockCandidatures.filter((c) => c.statut === 'acceptee').length;
  const totalAiCalls = mockAiUsage.length;
  const totalAiCost =
    Math.round(mockAiUsage.reduce((sum, log) => sum + log.cost_usd, 0) * 100) / 100;
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

export async function getRecentActivity(): Promise<ActivityItem[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/activity`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (_) {
    // fallback
  }

  const activities: ActivityItem[] = [];

  for (const user of mockUsers) {
    activities.push({
      id: `act-user-${user.id}`,
      type: 'user_joined',
      description: `${user.name} a rejoint Nayha`,
      timestamp: user.created_at,
      user_name: user.name,
    });
  }

  for (const cand of mockCandidatures) {
    activities.push({
      id: `act-cand-${cand.id}`,
      type: 'candidature_sent',
      description: `${cand.user_name} a postulé chez ${cand.entreprise}`,
      timestamp: cand.date_envoi,
      user_name: cand.user_name,
    });
  }

  for (const post of mockPosts) {
    activities.push({
      id: `act-post-${post.id}`,
      type: 'post_created',
      description: `${post.auteur} a publié dans la communauté`,
      timestamp: post.created_at,
      user_name: post.auteur,
    });
  }

  for (const record of mockWatchRecords) {
    activities.push({
      id: `act-atelier-${record.atelier_id}-${record.user_id}`,
      type: 'atelier_watched',
      description: `${record.user_name} a visionné un atelier`,
      timestamp: record.watched_at,
      user_name: record.user_name,
    });
  }

  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return delay(activities.slice(0, 30));
}

export interface SparklinePoint {
  date: string;
  value: number;
}

export async function getSparklineData(): Promise<{
  activityPerDay?: SparklinePoint[];
  usersPerDay: SparklinePoint[];
  candidaturesPerDay: SparklinePoint[];
  aiCallsPerDay: SparklinePoint[];
  costPerDay: SparklinePoint[];
}> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/sparklines`);
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.usersPerDay)) {
        return data;
      }
    }
  } catch (_) {
    // fallback
  }

  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const usersPerDay = days.map((date) => ({
    date,
    value: mockUsers.filter((u) => u.created_at.slice(0, 10) === date).length || 1,
  }));

  const candidaturesPerDay = days.map((date) => ({
    date,
    value: mockCandidatures.filter((c) => c.date_envoi.slice(0, 10) === date).length || 1,
  }));

  const aiCallsPerDay = days.map((date) => ({
    date,
    value: mockAiUsage.filter((a) => a.timestamp.slice(0, 10) === date).length || 2,
  }));

  const costPerDay = days.map((date) => {
    const dayCost = mockAiUsage
      .filter((a) => a.timestamp.slice(0, 10) === date)
      .reduce((sum, a) => sum + a.cost_usd, 0);
    return { date, value: Math.round((dayCost || 0.08) * 100) / 100 };
  });

  const activityPerDay = days.map((date, idx) => ({
    date,
    value: Math.round(Math.sin((idx + 2) * 0.6) * 5 + 14),
  }));

  return delay({ activityPerDay, usersPerDay, candidaturesPerDay, aiCallsPerDay, costPerDay });
}
