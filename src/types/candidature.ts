export type CandidatureStatut = 'envoyee' | 'en_attente' | 'a_relancer' | 'entretien' | 'refusee' | 'acceptee';

export interface Candidature {
  id: string;
  user_id: string;
  user_name: string;
  entreprise: string;
  poste: string;
  statut: CandidatureStatut;
  date_envoi: string;
  date_entretien: string | null;
  ressenti_entretien: 'bien' | 'mitige' | 'difficile' | null;
  issue_entretien: 'sans_suite' | 'en_attente' | 'proposition' | null;
  relance_envoyee: boolean;
  notes: string | null;
  updated_at: string;
}

export const STATUT_LABELS: Record<CandidatureStatut, string> = {
  envoyee: 'Envoyee',
  en_attente: 'En attente',
  a_relancer: 'A relancer',
  entretien: 'Entretien',
  refusee: 'Refusee',
  acceptee: 'Acceptee',
};

export const STATUT_COLORS: Record<CandidatureStatut, string> = {
  envoyee: 'rose',
  en_attente: 'gold',
  a_relancer: 'muted',
  entretien: 'green',
  refusee: 'danger',
  acceptee: 'green',
};
