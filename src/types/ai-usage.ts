export type AiEndpointType =
  | 'portrait' | 'plan-action' | 'evaluate' | 'analyse-offres'
  | 'cv-adapte' | 'cv-metier' | 'lettre-motivation' | 'relance'
  | 'bilan-mensuel' | 'entretien-debrief' | 'simulation-entretien'
  | 'simulation-feedback' | 'simulation-score' | 'linkedin-profile'
  | 'proposition-embauche' | 'parcours-reussite';

export interface AiCallLog {
  id: string;
  user_id: string;
  endpoint: AiEndpointType;
  timestamp: string;
  tokens_input: number;
  tokens_output: number;
  cost_usd: number;
  duration_ms: number;
}

export const AI_ENDPOINT_LABELS: Record<AiEndpointType, string> = {
  'portrait': 'Portrait',
  'plan-action': 'Plan d\'action',
  'evaluate': 'Evaluation metier',
  'analyse-offres': 'Analyse offres',
  'cv-adapte': 'CV adapte',
  'cv-metier': 'CV metier',
  'lettre-motivation': 'Lettre motivation',
  'relance': 'Relance',
  'bilan-mensuel': 'Bilan mensuel',
  'entretien-debrief': 'Debrief entretien',
  'simulation-entretien': 'Simulation entretien',
  'simulation-feedback': 'Feedback simulation',
  'simulation-score': 'Score simulation',
  'linkedin-profile': 'Profil LinkedIn',
  'proposition-embauche': 'Proposition embauche',
  'parcours-reussite': 'Parcours reussite',
};

export const AI_CATEGORIES: Record<string, AiEndpointType[]> = {
  'Diagnostic': ['portrait', 'plan-action', 'evaluate'],
  'Candidature': ['analyse-offres', 'cv-adapte', 'cv-metier', 'lettre-motivation', 'relance'],
  'Entretien': ['simulation-entretien', 'simulation-feedback', 'simulation-score', 'entretien-debrief'],
  'Autre': ['linkedin-profile', 'bilan-mensuel', 'proposition-embauche', 'parcours-reussite'],
};
