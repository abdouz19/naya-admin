import type { Candidature, CandidatureStatut } from '@/types/candidature';
import { PAGE_SIZE, type Paginated } from '@/types/pagination';
import { apiFetch } from '@/lib/api';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryCandidatures: Candidature[] = [];

export interface CandidatureListFilters {
  search?: string;
  statut?: 'all' | CandidatureStatut;
}

/** One page of candidatures, searched and filtered by the API. */
export async function getCandidaturesPage(
  page: number,
  filters: CandidatureListFilters = {},
  pageSize = PAGE_SIZE,
): Promise<Paginated<Candidature>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.statut && filters.statut !== 'all') {
    params.set('statut', filters.statut);
  }
  const res = await apiFetch(`${API_BASE_URL}/candidatures/admin/all?${params}`);
  if (!res.ok) throw new Error('Les candidatures n’ont pas pu être chargées.');
  return res.json();
}

/** Every candidature matching the filters (CSV export, dashboard figures). */
export async function getCandidatures(
  filters: CandidatureListFilters = {},
): Promise<Candidature[]> {
  try {
    const all: Candidature[] = [];
    for (let page = 1; page <= 100; page++) {
      const result = await getCandidaturesPage(page, filters, 100);
      all.push(...result.items);
      if (all.length >= result.total || result.items.length === 0) break;
    }
    if (!filters.search && (!filters.statut || filters.statut === 'all')) {
      inMemoryCandidatures = all;
    }
    return all;
  } catch {
    return inMemoryCandidatures;
  }
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
  /** Number of candidatures in each status (status chart). */
  byStatut?: Partial<Record<CandidatureStatut, number>>;
}

export async function getCandidatureStats(): Promise<CandidatureStats> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/candidatures/admin/stats`);
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.total === 'number') {
        return data;
      }
    }
  } catch {
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
  const byStatut: Partial<Record<CandidatureStatut, number>> = {};
  for (const c of candidatures) byStatut[c.statut] = (byStatut[c.statut] ?? 0) + 1;

  return { total, tauxReponse, enCours, entretiensObtenus, acceptees, byStatut };
}

