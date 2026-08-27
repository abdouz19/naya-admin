import { mockCandidatures } from '@/data/mock-candidatures';
import type { Candidature } from '@/types/candidature';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

export function getCandidatures(): Promise<Candidature[]> {
  return delay([...mockCandidatures]);
}

export function getCandidaturesByUser(userId: string): Promise<Candidature[]> {
  return delay(mockCandidatures.filter((c) => c.user_id === userId));
}

export interface CandidatureStats {
  total: number;
  tauxReponse: number;
  enCours: number;
  entretiensObtenus: number;
  acceptees: number;
}

export function getCandidatureStats(): Promise<CandidatureStats> {
  const total = mockCandidatures.length;
  const withResponse = mockCandidatures.filter(
    (c) => c.statut !== 'envoyee' && c.statut !== 'a_relancer'
  ).length;
  const tauxReponse = total > 0 ? withResponse / total : 0;
  const enCours = mockCandidatures.filter(
    (c) => c.statut === 'envoyee' || c.statut === 'en_attente' || c.statut === 'a_relancer'
  ).length;
  const entretiensObtenus = mockCandidatures.filter(
    (c) => c.statut === 'entretien' || c.statut === 'acceptee'
  ).length;
  const acceptees = mockCandidatures.filter((c) => c.statut === 'acceptee').length;

  return delay({ total, tauxReponse, enCours, entretiensObtenus, acceptees });
}
