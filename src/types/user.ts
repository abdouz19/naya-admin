export interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  last_active_at: string;
  rgpd_accepted: boolean;
  diagnostic_vie_completed: boolean;
  diagnostic_pro_completed: boolean;
  metier_selected: boolean;
  has_paid: boolean;
  selected_metier_titre: string;
  parcours_type: string | null;
  parcours_types?: string[];
  parcours_analyse_completed: boolean;
  parcours_first_candidature_completed: boolean;
  ateliers_emploi_watched: string[];
  actions_semaine_count: number;
  cv_generated: boolean;
  linkedin_optimized: boolean;
  is_blocked: boolean;
}
