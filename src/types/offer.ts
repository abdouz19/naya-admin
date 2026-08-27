export interface Offer {
  id: string;
  name: string;
  subtitle: string;
  price: number; // EUR per month
  priceSuffix: string;
  features: string[];
  isActive: boolean;
  badge?: string; // e.g. "Populaire"
  order: number; // display order
}

export interface UnlockFeature {
  id: string;
  icon: string; // lucide icon name
  text: string;
  enabled: boolean;
}
