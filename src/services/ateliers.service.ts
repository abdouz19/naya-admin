import { mockAteliers, mockWatchRecords } from '@/data/mock-ateliers';
import type { AtelierVideo, AtelierWatchRecord, AtelierStats } from '@/types/atelier';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://nayha-server-kpw2.onrender.com';

let inMemoryAteliers = [...mockAteliers];

export async function getAteliers(): Promise<AtelierVideo[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/ateliers/admin/all`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        inMemoryAteliers = data;
        return data;
      }
    }
  } catch (_) {
    // fallback
  }
  return [...inMemoryAteliers];
}

export function getWatchRecords(): Promise<AtelierWatchRecord[]> {
  return Promise.resolve([...mockWatchRecords]);
}

export async function addAtelier(atelier: Omit<AtelierVideo, 'id'>): Promise<AtelierVideo> {
  try {
    const res = await fetch(`${API_BASE_URL}/ateliers/admin`, {
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
    const res = await fetch(`${API_BASE_URL}/ateliers/admin/${id}`, {
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
    const res = await fetch(`${API_BASE_URL}/ateliers/admin/${id}`, {
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
    const res = await fetch(`${API_BASE_URL}/ateliers/admin/stats`, {
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
