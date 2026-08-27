import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button, Spinner } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getOffers,
  getUnlockFeatures,
  updateOffer,
  toggleOfferActive,
  updateUnlockFeature,
} from '@/services/offers.service';
import type { Offer, UnlockFeature } from '@/types/offer';
import { OfferCard } from './OfferCard';
import { OfferEditModal } from './OfferEditModal';
import { UnlockFeaturesCard } from './UnlockFeaturesCard';

export function OffresSection() {
  const offersFn = useCallback(() => getOffers(), []);
  const unlockFn = useCallback(() => getUnlockFeatures(), []);

  const { data: offersData, loading: loadingOffers } =
    useService<Offer[]>(offersFn);
  const { data: unlockData, loading: loadingUnlock } =
    useService<UnlockFeature[]>(unlockFn);

  const [offers, setOffers] = useState<Offer[]>([]);
  const [unlockFeatures, setUnlockFeatures] = useState<UnlockFeature[]>([]);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (offersData) setOffers(offersData);
  }, [offersData]);

  useEffect(() => {
    if (unlockData) setUnlockFeatures(unlockData);
  }, [unlockData]);

  async function handleToggleActive(id: string) {
    await toggleOfferActive(id);
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o)),
    );
  }

  function handleEditClick(offer: Offer) {
    setEditingOffer(offer);
    setModalOpen(true);
  }

  async function handleSaveOffer(id: string, updates: Partial<Omit<Offer, 'id'>>) {
    await updateOffer(id, updates);
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...updates } : o)),
    );
  }

  async function handleToggleUnlock(id: string) {
    const feature = unlockFeatures.find((f) => f.id === id);
    if (!feature) return;
    await updateUnlockFeature(id, { enabled: !feature.enabled });
    setUnlockFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)),
    );
  }

  async function handleUpdateUnlockText(id: string, text: string) {
    await updateUnlockFeature(id, { text });
    setUnlockFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, text } : f)),
    );
  }

  const loading = loadingOffers || loadingUnlock;

  if (loading && offers.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section header */}
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Gestion des offres
      </p>

      {/* Offer cards row */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            onEdit={handleEditClick}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>

      {/* Unlock features */}
      {unlockFeatures.length > 0 && (
        <UnlockFeaturesCard
          features={unlockFeatures}
          onToggle={handleToggleUnlock}
          onUpdateText={handleUpdateUnlockText}
        />
      )}

      {/* Add offer button */}
      <div className="flex justify-end">
        <Button variant="secondary" icon={<Plus size={16} />}>
          Ajouter une offre
        </Button>
      </div>

      {/* Edit modal */}
      <OfferEditModal
        open={modalOpen}
        offer={editingOffer}
        onClose={() => {
          setModalOpen(false);
          setEditingOffer(null);
        }}
        onSave={handleSaveOffer}
      />
    </div>
  );
}
