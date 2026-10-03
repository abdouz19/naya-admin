export type PostType = 'normal' | 'victoire' | 'question' | 'temoignage';

export interface CommunityPost {
  id: string;
  user_id: string;
  auteur: string;
  initiale: string;
  contenu: string;
  type: PostType;
  reactions_count: number;
  comments_count?: number;
  is_moderated: boolean;
  created_at: string;
  reports_count: number;
}

export interface CommunityReport {
  id: string;
  post_id: string;
  user_id: string;
  reason: string;
  created_at: string;
}

export const POST_TYPE_LABELS: Record<PostType, string> = {
  normal: 'Publication',
  victoire: 'Victoire',
  question: 'Question',
  temoignage: 'Temoignage',
};
