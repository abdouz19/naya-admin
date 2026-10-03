import { getUsers, getUserStats } from '@/services/users.service';
import { getCandidatures } from '@/services/candidatures.service';
import { getPosts } from '@/services/community.service';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

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

  // Exact real data calculation from server users/candidatures/posts
  const [stats, users, cands, posts] = await Promise.all([
    getUserStats(),
    getUsers(),
    getCandidatures().catch(() => []),
    getPosts().catch(() => []),
  ]);

  const totalUsers = stats.total || users.length;
  const activeThisWeek = stats.activeThisWeek;
  const paidUsers = stats.paidUsers;
  const conversionRate = totalUsers > 0 ? Math.round((paidUsers / totalUsers) * 100) / 100 : 0;
  
  const totalCandidatures = cands.length;
  const entretiensObtenus = cands.filter(
    (c: any) => c.statut === 'entretien' || c.statut === 'acceptee',
  ).length;
  const acceptees = cands.filter((c: any) => c.statut === 'acceptee').length;
  
  const totalAiCalls = 0;
  const totalAiCost = 0;
  const reportedPosts = posts.filter((p: any) => (p.reports_count || 0) > 0 && !p.is_moderated).length;

  return {
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
  };
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

  const [users, cands, posts] = await Promise.all([
    getUsers(),
    getCandidatures().catch(() => []),
    getPosts().catch(() => []),
  ]);

  const activities: ActivityItem[] = [];
  const userMap = new Map<string, string>();

  // 1. Only real user joined events with actual created_at
  for (const user of users) {
    userMap.set(user.id, user.name);

    if (user.created_at) {
      activities.push({
        id: `act-user-${user.id}`,
        type: 'user_joined',
        description: `${user.name} a rejoint Nayha`,
        timestamp: user.created_at,
        user_name: user.name,
      });
    }
  }

  // 2. Only real candidatures submitted
  for (const cand of cands) {
    const uName = cand.user_name || userMap.get(cand.user_id) || 'Une utilisatrice';
    const ent = cand.entreprise ? `chez ${cand.entreprise}` : '';
    const poste = (cand as any).poste ? `(${(cand as any).poste})` : '';
    activities.push({
      id: `act-cand-${cand.id}`,
      type: 'candidature_sent',
      description: `${uName} a postulé ${ent} ${poste}`.trim(),
      timestamp: cand.date_envoi || (cand as any).created_at || new Date().toISOString(),
      user_name: uName,
    });
  }

  // 3. Only real posts created in community
  for (const post of posts) {
    const author = post.auteur || userMap.get(post.user_id) || 'Une utilisatrice';
    activities.push({
      id: `act-post-${post.id}`,
      type: 'post_created',
      description: `${author} a publié dans la communauté : "${post.contenu?.slice(0, 50) || 'Message'}"`,
      timestamp: post.created_at || new Date().toISOString(),
      user_name: author,
    });
  }

  activities.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return activities.slice(0, 30);
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

  const [users, cands, posts] = await Promise.all([
    getUsers(),
    getCandidatures().catch(() => []),
    getPosts().catch(() => []),
  ]);

  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const usersPerDay = days.map((date) => ({
    date,
    value: users.filter((u) => (u.created_at || '').slice(0, 10) === date).length,
  }));

  const candidaturesPerDay = days.map((date) => ({
    date,
    value: cands.filter((c: any) => ((c.date_envoi || c.created_at) || '').slice(0, 10) === date).length,
  }));

  const aiCallsPerDay = days.map((date) => ({
    date,
    value: 0,
  }));

  const costPerDay = days.map((date) => ({
    date,
    value: 0,
  }));

  const activityPerDay = days.map((date) => {
    const uCount = users.filter((u) => (u.created_at || '').slice(0, 10) === date).length;
    const cCount = cands.filter((c: any) => ((c.date_envoi || c.created_at) || '').slice(0, 10) === date).length;
    const pCount = posts.filter((p: any) => (p.created_at || '').slice(0, 10) === date).length;
    return {
      date,
      value: uCount + cCount + pCount,
    };
  });

  return { activityPerDay, usersPerDay, candidaturesPerDay, aiCallsPerDay, costPerDay };
}

