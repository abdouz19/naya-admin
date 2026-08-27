export type AdminRole = 'super_admin' | 'admin' | 'moderator' | 'viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar_url: string | null;
  created_at: string;
  last_login_at: string;
  is_active: boolean;
}

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  moderator: 'Modérateur',
  viewer: 'Lecteur',
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: 'Accès total, gestion des admins et configuration',
  admin: 'Gestion des utilisatrices, offres et contenu',
  moderator: 'Modération communauté et support',
  viewer: 'Consultation uniquement, aucune modification',
};

export const ROLE_BADGE_VARIANTS: Record<AdminRole, string> = {
  super_admin: 'rose',
  admin: 'gold',
  moderator: 'green',
  viewer: 'muted',
};

export interface RolePermissions {
  role: AdminRole;
  permissions: {
    dashboard: boolean;
    users_view: boolean;
    users_edit: boolean;
    candidatures_view: boolean;
    ai_view: boolean;
    ai_config: boolean;
    ateliers_view: boolean;
    ateliers_edit: boolean;
    community_view: boolean;
    community_moderate: boolean;
    subscriptions_view: boolean;
    subscriptions_edit: boolean;
    settings_view: boolean;
    settings_edit: boolean;
  };
}
