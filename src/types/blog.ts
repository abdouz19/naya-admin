export interface BlogSection {
  heading?: string;
  content: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTimeMinutes: number;
  keyTakeaway: string;
  exerciseTitle?: string;
  exercisePrompt?: string;
  sections: BlogSection[];
  coachTrigger: string;
  coachMessage: string;
  isPublished: boolean;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  totalViews: number;
  mostReadCategory: string;
}
