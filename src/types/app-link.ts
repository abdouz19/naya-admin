export interface AppLink {
  key: string;
  title: string;
  module: string;
  step: string;
  organisme: string;
  description: string;
  default_url: string;
  current_url: string;
  created_at?: string;
  updated_at: string;
}

export interface AppLinksFilter {
  module?: string;
  step?: string;
  search?: string;
}

export interface AppLinksCategories {
  modules: string[];
  steps: string[];
  organismes: string[];
  total: number;
}
