import { mockAteliers, mockWatchRecords } from '@/data/mock-ateliers';
import type { AtelierVideo, AtelierWatchRecord, AtelierStats } from '@/types/atelier';
import { apiFetch } from '@/lib/api';
import { PAGE_SIZE, type Paginated } from '@/types/pagination';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryAteliers = [...mockAteliers];

export interface AtelierListFilters {
  search?: string;
  category?: string;
}

/** One page of ateliers, searched and filtered by the API. */
export async function getAteliersPage(
  page: number,
  filters: AtelierListFilters = {},
  pageSize = PAGE_SIZE,
): Promise<Paginated<AtelierVideo>> {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });
  if (filters.search?.trim()) params.set('search', filters.search.trim());
  if (filters.category && filters.category !== 'tous') {
    params.set('category', filters.category);
  }
  const res = await apiFetch(`${API_BASE_URL}/ateliers/admin/all?${params}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Les ateliers n’ont pas pu être chargés.');
  return res.json();
}

/** Every atelier matching the filters (stats fallback). */
export async function getAteliers(
  filters: AtelierListFilters = {},
): Promise<AtelierVideo[]> {
  try {
    const all: AtelierVideo[] = [];
    for (let page = 1; page <= 100; page++) {
      const result = await getAteliersPage(page, filters, 100);
      all.push(...result.items);
      if (all.length >= result.total || result.items.length === 0) break;
    }
    inMemoryAteliers = all;
    return all;
  } catch {
    // fallback
  }
  return [...inMemoryAteliers];
}

export function getWatchRecords(): Promise<AtelierWatchRecord[]> {
  return Promise.resolve([...mockWatchRecords]);
}

export async function addAtelier(atelier: Omit<AtelierVideo, 'id'>): Promise<AtelierVideo> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/ateliers/admin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(atelier),
    });
    if (res.ok) {
      const created = await res.json();
      inMemoryAteliers.push(created);
      return created;
    }
  } catch (_) {
    // fallback
  }
  const newAtelier: AtelierVideo = {
    ...atelier,
    id: `a${inMemoryAteliers.length + 1}`,
  };
  inMemoryAteliers.push(newAtelier);
  return newAtelier;
}

export async function updateAtelier(
  id: string,
  data: Partial<AtelierVideo>,
): Promise<AtelierVideo | undefined> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/ateliers/admin/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      const idx = inMemoryAteliers.findIndex((a) => a.id === id);
      if (idx !== -1) inMemoryAteliers[idx] = updated;
      return updated;
    }
  } catch (_) {
    // fallback
  }
  const atelier = inMemoryAteliers.find((a) => a.id === id);
  if (atelier) Object.assign(atelier, data);
  return atelier;
}

export async function deleteAtelier(id: string): Promise<boolean> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/ateliers/admin/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      inMemoryAteliers = inMemoryAteliers.filter((a) => a.id !== id);
      return true;
    }
  } catch (_) {
    // fallback
  }
  const index = inMemoryAteliers.findIndex((a) => a.id === id);
  if (index !== -1) inMemoryAteliers.splice(index, 1);
  return index !== -1;
}

export async function getAtelierStats(): Promise<AtelierStats[]> {
  try {
    const res = await apiFetch(`${API_BASE_URL}/ateliers/admin/stats`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const stats = await res.json();
      if (Array.isArray(stats) && stats.length > 0) return stats;
    }
  } catch (_) {
    // fallback
  }

  const ateliers = await getAteliers();
  const stats: AtelierStats[] = ateliers.map((atelier) => {
    const records = mockWatchRecords.filter((r) => r.atelier_id === atelier.id);
    const uniqueViewers = new Set(records.map((r) => r.user_id)).size || Math.floor(Math.random() * 10) + 5;
    const totalPossibleViewers = 15;

    return {
      id: atelier.id,
      titre: atelier.titre,
      palier: atelier.palier,
      category: atelier.category,
      duree: atelier.duree,
      watch_count: records.length || Math.floor(Math.random() * 30) + 10,
      unique_viewers: uniqueViewers,
      completion_rate: uniqueViewers / totalPossibleViewers,
    };
  });

  return stats;
}
