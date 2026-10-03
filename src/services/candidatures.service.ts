import type { Candidature } from '@/types/candidature';
import { supabaseRest } from '@/lib/supabase-client';
import { getUsers } from '@/services/users.service';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryCandidatures: Candidature[] = [];

export async function getCandidatures(): Promise<Candidature[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/candidatures/admin/all`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        inMemoryCandidatures = data;
        return data;
      }
    }
  } catch (_) {
    // fallback
  }

  // Direct Supabase query fallback
  const [dbCands, users] = await Promise.all([
    supabaseRest<any[]>('candidatures?select=*&order=date_envoi.desc'),
    getUsers().catch(() => []),
  ]);

  if (dbCands && Array.isArray(dbCands) && dbCands.length > 0) {
    const userMap = new Map<string, string>();
    for (const u of users) {
      userMap.set(u.id, u.name);
    }

    const mapped = dbCands.map((c) => ({
      ...c,
      user_name: userMap.get(c.user_id) || 'Meriem Sahraoui',
    }));
    inMemoryCandidatures = mapped;
    return mapped;
  }

  return inMemoryCandidatures;
}

export async function getCandidaturesByUser(userId: string): Promise<Candidature[]> {
  const all = await getCandidatures();
  return all.filter((c) => c.user_id === userId);
}

export interface CandidatureStats {
  total: number;
  tauxReponse: number;
  enCours: number;
  entretiensObtenus: number;
  acceptees: number;
}

export async function getCandidatureStats(): Promise<CandidatureStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/candidatures/admin/stats`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.total === 'number') {
        return data;
      }
    }
  } catch (_) {
    // fallback
  }

  const candidatures = await getCandidatures();
  const total = candidatures.length;
  const withResponse = candidatures.filter(
    (c) => c.statut !== 'envoyee' && c.statut !== 'a_relancer',
  ).length;
  const tauxReponse = total > 0 ? Math.round((withResponse / total) * 100) / 100 : 0;
  const enCours = candidatures.filter(
    (c) => c.statut === 'envoyee' || c.statut === 'en_attente' || c.statut === 'a_relancer',
  ).length;
  const entretiensObtenus = candidatures.filter(
    (c) => c.statut === 'entretien' || c.statut === 'acceptee',
  ).length;
  const acceptees = candidatures.filter((c) => c.statut === 'acceptee').length;

  return { total, tauxReponse, enCours, entretiensObtenus, acceptees };
}

