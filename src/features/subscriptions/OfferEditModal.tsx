import { useEffect, useState } from 'react';
import { Button, Input, Modal } from '@/components/ui';
import type { Offer } from '@/types/offer';

interface OfferEditModalProps {
  open: boolean;
  offer: Offer | null;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<Offer, 'id'>>) => void;
}

export function OfferEditModal({ open, offer, onClose, onSave }: OfferEditModalProps) {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [price, setPrice] = useState('');
  const [priceSuffix, setPriceSuffix] = useState('');
  const [badge, setBadge] = useState('');
  const [featuresText, setFeaturesText] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Sync form state when offer changes
  useEffect(() => {
    if (offer) {
      setName(offer.name);
      setSubtitle(offer.subtitle);
      setPrice(offer.price.toString());
      setPriceSuffix(offer.priceSuffix);
      setBadge(offer.badge ?? '');
      setFeaturesText(offer.features.join('\n'));
      setIsActive(offer.isActive);
    }
  }, [offer]);

  function handleSave() {
    if (!offer) return;

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    onSave(offer.id, {
      name,
      subtitle,
      price: parseFloat(price) || 0,
      priceSuffix,
      badge: badge || undefined,
      features,
      isActive,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Modifier l'offre" className="max-w-lg">
      <div className="space-y-4">
        <Input
          label="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Sous-titre"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Prix (€)"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            label="Suffixe prix"
            value={priceSuffix}
            onChange={(e) => setPriceSuffix(e.target.value)}
            placeholder="/mois"
          />
        </div>

        <Input
          label="Badge (optionnel)"
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          placeholder="ex: Populaire"
        />

        <div className="flex flex-col">
          <label
            htmlFor="features-textarea"
            className="mb-1.5 text-sm font-medium text-muted"
          >
            Fonctionnalités (une par ligne)
          </label>
          <textarea
            id="features-textarea"
            rows={5}
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            className="w-full radius-sm border border-gray-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted-light transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none resize-none"
          />
        </div>

        {/* Active toggle */}
        <label className="flex cursor-pointer items-center gap-3">
          <div className="relative">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="peer sr-only"
            />
            <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-rose" />
            <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
          </div>
          <span className="text-sm font-medium text-brown">
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </label>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
}
