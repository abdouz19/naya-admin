import { useState, useEffect } from 'react';
import { ExternalLink, RotateCcw } from 'lucide-react';
import { Button, Input, Modal, Badge } from '@/components/ui';
import type { AppLink } from '@/types/app-link';

interface EditLinkModalProps {
  link: AppLink | null;
  onClose: () => void;
  onSave: (key: string, updates: { url: string; title?: string; description?: string }) => Promise<void>;
  onReset: (key: string) => Promise<void>;
}

export function EditLinkModal({ link, onClose, onSave, onReset }: EditLinkModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (link) {
      setUrl(link.current_url || link.default_url);
      setTitle(link.title);
      setDescription(link.description);
      setError('');
    }
  }, [link]);

  if (!link) return null;

  const isCustomized = url !== link.default_url;

  function handleTestUrl() {
    try {
      new URL(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (_) {
      setError('Format d\'URL invalide (ex: https://...)');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setError('L\'URL ne peut pas être vide');
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch (_) {
      setError('Format d\'URL invalide (doit commencer par https:// ou http://)');
      return;
    }

    setLoading(true);
    try {
      await onSave(link!.key, {
        url: trimmedUrl,
        title: title.trim(),
        description: description.trim(),
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  }

  async function handleResetToDefault() {
    setUrl(link!.default_url);
    setLoading(true);
    try {
      await onReset(link!.key);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      open={!!link}
      onClose={onClose}
      title="Modifier le lien externe"
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-2">
        <p className="text-xs text-muted">
          Ce lien sera immédiatement synchronisé sur l'application mobile NAYHA.
        </p>

        {/* Context metadata */}
        <div className="rounded-lg bg-cream/40 p-3.5 space-y-2 border border-border/50">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="rose">{link.module}</Badge>
            {link.step && <Badge variant="gold">{link.step}</Badge>}
            {link.organisme && <Badge variant="muted">{link.organisme}</Badge>}
          </div>
          <div className="text-xs text-muted font-mono break-all">
            Clé technique : <span className="text-brown font-semibold">{link.key}</span>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-brown mb-1">
            Intitulé / Nom du lien
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Aide Individuelle à la Formation (AIF)"
          />
        </div>

        {/* Current URL */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-brown">
              URL active (Application Mobile)
            </label>
            <button
              type="button"
              onClick={handleTestUrl}
              className="text-xs text-rose hover:text-rose/80 font-medium inline-flex items-center gap-1"
            >
              <ExternalLink size={12} />
              Tester l'URL
            </button>
          </div>
          <Input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="https://..."
          />
          {error && <p className="text-xs text-danger mt-1">{error}</p>}
        </div>

        {/* Default URL Reference */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            URL officielle par défaut
          </label>
          <div className="text-xs text-muted/80 bg-cream/20 p-2.5 rounded-md border border-border/40 font-mono break-all select-all">
            {link.default_url}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-brown mb-1">
            Description / Contexte d'affichage
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-brown shadow-sm focus:border-rose focus:outline-none focus:ring-1 focus:ring-rose"
            placeholder="Préciser l'utilité ou l'étape du lien..."
          />
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div>
            {isCustomized && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                icon={<RotateCcw size={14} />}
                onClick={handleResetToDefault}
                disabled={loading}
              >
                Rétablir par défaut
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" type="button" onClick={onClose} disabled={loading}>
              Annuler
            </Button>
            <Button type="submit" loading={loading}>
              Enregistrer
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
