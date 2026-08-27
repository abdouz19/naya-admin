import { useState } from 'react';
import {
  BarChart3,
  User,
  FileText,
  Mic,
  MessageCircle,
  Pencil,
  Check,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/cn';
import type { UnlockFeature } from '@/types/offer';

const iconMap: Record<string, LucideIcon> = {
  'bar-chart': BarChart3,
  user: User,
  'file-text': FileText,
  mic: Mic,
  'message-circle': MessageCircle,
};

interface UnlockFeaturesCardProps {
  features: UnlockFeature[];
  onToggle: (id: string) => void;
  onUpdateText: (id: string, text: string) => void;
}

export function UnlockFeaturesCard({
  features,
  onToggle,
  onUpdateText,
}: UnlockFeaturesCardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  function startEdit(feature: UnlockFeature) {
    setEditingId(feature.id);
    setEditText(feature.text);
  }

  function confirmEdit() {
    if (editingId && editText.trim()) {
      onUpdateText(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText('');
  }

  function cancelEdit() {
    setEditingId(null);
    setEditText('');
  }

  return (
    <Card title="Fonctionnalités débloquées" subtitle="Accessibles avec un abonnement actif">
      <ul className="space-y-3">
        {features.map((feature) => {
          const Icon = iconMap[feature.icon] ?? BarChart3;
          const isEditing = editingId === feature.id;

          return (
            <li
              key={feature.id}
              className={cn(
                'flex items-center gap-4 radius-sm border border-gray-200 px-4 py-3',
                'transition-colors',
                !feature.enabled && 'opacity-50',
              )}
            >
              {/* Icon */}
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gold-light/40">
                <Icon size={18} className="text-gold" />
              </div>

              {/* Text or edit input */}
              {isEditing ? (
                <input
                  autoFocus
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  className="flex-1 radius-sm border border-gray-300 bg-white px-2 py-1 text-sm text-ink focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none"
                />
              ) : (
                <span className="flex-1 text-sm text-ink">{feature.text}</span>
              )}

              {/* Edit / confirm / cancel */}
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={confirmEdit}
                    className="rounded-full p-1.5 text-green transition-colors hover:bg-green-light"
                    aria-label="Confirmer"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-full p-1.5 text-danger transition-colors hover:bg-danger-light"
                    aria-label="Annuler"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit(feature)}
                  className="rounded-full p-1.5 text-muted transition-colors hover:bg-beige hover:text-brown"
                  aria-label="Modifier"
                >
                  <Pencil size={14} />
                </button>
              )}

              {/* Toggle switch */}
              <label className="relative flex-shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feature.enabled}
                  onChange={() => onToggle(feature.id)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-gray-300 transition-colors peer-checked:bg-rose" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </label>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
