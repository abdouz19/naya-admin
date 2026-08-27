import { mockOffers, mockUnlockFeatures } from '@/data/mock-offers';
import type { Offer, UnlockFeature } from '@/types/offer';

const delay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), 120));

export function getOffers(): Promise<Offer[]> {
  return delay([...mockOffers].sort((a, b) => a.order - b.order));
}

export function getUnlockFeatures(): Promise<UnlockFeature[]> {
  return delay([...mockUnlockFeatures]);
}

export function updateOffer(
  id: string,
  updates: Partial<Omit<Offer, 'id'>>,
): Promise<void> {
  const index = mockOffers.findIndex((o) => o.id === id);
  if (index !== -1) {
    Object.assign(mockOffers[index], updates);
  }
  return delay(undefined);
}

export function toggleOfferActive(id: string): Promise<void> {
  const offer = mockOffers.find((o) => o.id === id);
  if (offer) {
    offer.isActive = !offer.isActive;
  }
  return delay(undefined);
}

export function updateUnlockFeature(
  id: string,
  updates: Partial<Omit<UnlockFeature, 'id'>>,
): Promise<void> {
  const index = mockUnlockFeatures.findIndex((f) => f.id === id);
  if (index !== -1) {
    Object.assign(mockUnlockFeatures[index], updates);
  }
  return delay(undefined);
}
