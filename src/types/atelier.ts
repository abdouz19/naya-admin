export interface AtelierVideo {
  id: string;
  palier: string;
  palier_label: string;
  titre: string;
  duree: string;
  description: string;
  video_url?: string;
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
  duree: string;
  watch_count: number;
  unique_viewers: number;
  completion_rate: number;
}
