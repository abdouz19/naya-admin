import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { Offer } from '@/types/offer';

interface OfferCardProps {
  offer: Offer;
  onEdit: (offer: Offer) => void;
  onToggleActive: (id: string) => void;
}

export function OfferCard({ offer, onEdit, onToggleActive }: OfferCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'relative flex flex-1 flex-col radius-lg border-2 bg-white p-6',
        'shadow-card transition-all duration-200 hover:shadow-card-hover',
        offer.isActive ? 'border-rose' : 'border-gray-300 opacity-60',
      )}
    >
      {/* Inactive overlay badge */}
      {!offer.isActive && (
        <div className="absolute right-4 top-4">
          <Badge variant="muted">Inactif</Badge>
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <h3 className="font-heading text-2xl font-semibold italic text-brown">
            {offer.name}
          </h3>
          {offer.badge && (
            <Badge variant="gold">{offer.badge}</Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{offer.subtitle}</p>
      </div>

      {/* Price */}
      <div className="mb-5 flex items-baseline gap-1">
        <span className="font-heading text-4xl font-bold text-brown">
          {offer.price.toFixed(2).replace('.', ',')}€
        </span>
        <span className="text-sm text-muted">{offer.priceSuffix}</span>
      </div>

      {/* Features */}
      <ul className="mb-6 flex-1 space-y-2.5">
        {offer.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
            <span className="mt-1 block h-2 w-2 flex-shrink-0 rounded-full bg-gold" />
            {feature}
          </li>
        ))}
      </ul>

      {/* Footer actions */}
      <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
        <Button
          variant={offer.isActive ? 'ghost' : 'primary'}
          size="sm"
          icon={offer.isActive ? <X size={14} /> : <Check size={14} />}
          onClick={() => onToggleActive(offer.id)}
        >
          {offer.isActive ? 'Désactiver' : 'Activer'}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onEdit(offer)}
        >
          Modifier
        </Button>
      </div>
    </motion.div>
  );
}
