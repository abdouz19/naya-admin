import { mockAteliers, mockWatchRecords } from '@/data/mock-ateliers';
import type { AtelierVideo, AtelierWatchRecord, AtelierStats } from '@/types/atelier';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

export function getAteliers(): Promise<AtelierVideo[]> {
  return delay([...mockAteliers]);
}

export function getWatchRecords(): Promise<AtelierWatchRecord[]> {
  return delay([...mockWatchRecords]);
}

export function addAtelier(atelier: Omit<AtelierVideo, 'id'>): Promise<AtelierVideo> {
  const newAtelier: AtelierVideo = {
    ...atelier,
    id: `a${mockAteliers.length + 1}`,
  };
  mockAteliers.push(newAtelier);
  return delay(newAtelier);
}

export function updateAtelier(id: string, data: Partial<AtelierVideo>): Promise<AtelierVideo | undefined> {
  const atelier = mockAteliers.find((a) => a.id === id);
  if (atelier) Object.assign(atelier, data);
  return delay(atelier);
}

export function deleteAtelier(id: string): Promise<boolean> {
  const index = mockAteliers.findIndex((a) => a.id === id);
  if (index !== -1) mockAteliers.splice(index, 1);
  return delay(index !== -1);
}

export function getAtelierStats(): Promise<AtelierStats[]> {
  const stats: AtelierStats[] = mockAteliers.map((atelier) => {
    const records = mockWatchRecords.filter((r) => r.atelier_id === atelier.id);
    const uniqueViewers = new Set(records.map((r) => r.user_id)).size;
    const totalPossibleViewers = 15; // approximate number of active users

    return {
      id: atelier.id,
      titre: atelier.titre,
      palier: atelier.palier,
      duree: atelier.duree,
      watch_count: records.length,
      unique_viewers: uniqueViewers,
      completion_rate: uniqueViewers / totalPossibleViewers,
    };
  });

  return delay(stats);
}
