import type { Offer, UnlockFeature } from '@/types/offer';

export const mockOffers: Offer[] = [
  {
    id: 'standard',
    name: 'Standard',
    subtitle: 'Sans engagement',
    price: 9.99,
    priceSuffix: '/mois',
    features: [
      'Diagnostic Vie & Professionnel',
      'Portrait de Force & Plan d\'Action',
      'Les 4 assistants IA',
      'Défi hebdomadaire & communauté',
    ],
    isActive: true,
    badge: 'Populaire',
    order: 1,
  },
  {
    id: 'premium',
    name: 'Premium',
    subtitle: 'Facturation séparée',
    price: 24.99,
    priceSuffix: '/mois',
    features: [
      'Sessions de coaching mensuel thématique',
      'Places limitées, inscription requise',
      'Facturation séparée du Standard',
      'Accès aux replays & ressources exclusives',
    ],
    isActive: true,
    order: 2,
  },
];

export const mockUnlockFeatures: UnlockFeature[] = [
  { id: 'analyse', icon: 'bar-chart', text: 'Analyse d\'offres réelles', enabled: true },
  { id: 'linkedin', icon: 'user', text: 'Profil LinkedIn optimisé', enabled: true },
  { id: 'cv', icon: 'file-text', text: 'CV métier + lettre de motivation', enabled: true },
  { id: 'simulation', icon: 'mic', text: 'Simulation d\'entretien', enabled: true },
  { id: 'coaching', icon: 'message-circle', text: 'Coaching confiance illimité', enabled: true },
];
