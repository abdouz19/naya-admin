export interface AtelierVideo {
  id: string;
  palier: string;
  palier_label?: string;
  category?: string;
  step_tag?: string;
  titre: string;
  subtitle?: string;
  duree: string;
  description: string;
  video_url?: string;
  objectifs?: string[];
  tips?: string[];
  resource_url?: string;
  speaker_name?: string;
  speaker_role?: string;
  icon?: string;
  accent_color?: string;
  order?: number;
  is_active?: boolean;
}

export interface AtelierWatchRecord {
  atelier_id: string;
  user_id: string;
  user_name: string;
  watched_at: string;
}

export interface AtelierStats {
  id: string;
  titre: string;
  palier: string;
  category?: string;
  step_tag?: string;
  duree: string;
  watch_count: number;
  unique_viewers: number;
  completion_rate: number;
  is_active?: boolean;
}
