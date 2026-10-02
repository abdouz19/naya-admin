import { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, MessageCircle, HeartHandshake } from 'lucide-react';
import { Modal, Input, Select, Button } from '@/components/ui';
import type { BlogArticle, BlogSection } from '@/types/blog';

const CATEGORY_OPTIONS = [
  { value: 'Confiance', label: 'Confiance & Estime' },
  { value: 'Reconversion', label: 'Reconversion & Transition' },
  { value: 'Retour à l’emploi', label: 'Retour à l’emploi' },
  { value: 'Création d’activité', label: 'Création d’activité' },
];

interface BlogArticleModalProps {
  open: boolean;
  onClose: () => void;
  article: BlogArticle | null;
  onSave: (articleData: Omit<BlogArticle, 'id' | 'viewsCount' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  saving: boolean;
}

export function BlogArticleModal({
  open,
  onClose,
  article,
  onSave,
  saving,
}: BlogArticleModalProps) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState('Confiance');
  const [readTimeMinutes, setReadTimeMinutes] = useState(3);
  const [keyTakeaway, setKeyTakeaway] = useState('');
  const [exerciseTitle, setExerciseTitle] = useState('');
  const [exercisePrompt, setExercisePrompt] = useState('');
  const [coachTrigger, setCoachTrigger] = useState('Reprendre confiance');
  const [coachMessage, setCoachMessage] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [sections, setSections] = useState<BlogSection[]>([
    { heading: '', content: '' },
  ]);

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setSubtitle(article.subtitle);
      setCategory(article.category);
      setReadTimeMinutes(article.readTimeMinutes);
      setKeyTakeaway(article.keyTakeaway);
      setExerciseTitle(article.exerciseTitle || '');
      setExercisePrompt(article.exercisePrompt || '');
      setCoachTrigger(article.coachTrigger);
      setCoachMessage(article.coachMessage);
      setIsPublished(article.isPublished);
      setSections(
        article.sections && article.sections.length > 0
          ? article.sections
          : [{ heading: '', content: '' }],
      );
    } else {
      setTitle('');
      setSubtitle('');
      setCategory('Confiance');
      setReadTimeMinutes(3);
      setKeyTakeaway('');
      setExerciseTitle('');
      setExercisePrompt('');
      setCoachTrigger('Reprendre confiance');
      setCoachMessage('');
      setIsPublished(true);
      setSections([{ heading: '', content: '' }]);
    }
  }, [article, open]);

  const handleAddSection = () => {
    setSections([...sections, { heading: '', content: '' }]);
  };

  const handleRemoveSection = (idx: number) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((_, i) => i !== idx));
  };

  const handleSectionChange = (
    idx: number,
    field: 'heading' | 'content',
    val: string,
  ) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setSections(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subtitle.trim() || !keyTakeaway.trim()) return;

    await onSave({
      title: title.trim(),
      subtitle: subtitle.trim(),
      category,
      readTimeMinutes: Number(readTimeMinutes) || 3,
      keyTakeaway: keyTakeaway.trim(),
      exerciseTitle: exerciseTitle.trim() || undefined,
      exercisePrompt: exercisePrompt.trim() || undefined,
      sections: sections.filter((s) => s.content.trim().length > 0),
      coachTrigger: coachTrigger.trim() || 'Reprendre confiance',
      coachMessage: coachMessage.trim() || `J'ai lu l'article "${title}". Comment appliquer ce conseil ?`,
      isPublished,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={article ? 'Modifier l’article' : 'Rédiger un nouvel article'}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        {/* Basic info */}
        <div className="space-y-4">
          <Input
            label="Titre de l’article *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="ex: Les premiers pas pour avancer avec confiance"
            required
          />

          <Input
            label="Sous-titre / Accroche *"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="ex: Comment dépasser la paralysie du doute..."
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Catégorie"
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <Input
              label="Temps de lecture (minutes)"
              type="number"
              min={1}
              max={30}
              value={readTimeMinutes}
              onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Le Déclic NAYHA */}
        <div className="rounded-xl bg-sand/30 border border-sand p-4 space-y-3">
          <div className="flex items-center gap-2 text-rose font-heading font-semibold text-sm">
            <Sparkles size={16} />
            <span>Le Déclic NAYHA (Idée-force & Takeaway) *</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Une phrase marquante et réconfortante que la lectrice retiendra et appliquera.
          </p>
          <textarea
            value={keyTakeaway}
            onChange={(e) => setKeyTakeaway(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-brown outline-none transition-colors focus:border-rose placeholder:text-muted"
            placeholder="ex: La confiance ne précède pas l’action, elle en est la conséquence directe..."
            required
          />
        </div>

        {/* Sections du contenu */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-brown">
              Sections de l’article
            </label>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={handleAddSection}
            >
              Ajouter une section
            </Button>
          </div>

          {sections.map((section, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-gray-200 p-4 space-y-3 bg-gray-50/50 relative"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted uppercase tracking-wider">
                  Section {idx + 1}
                </span>
                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSection(idx)}
                    className="text-muted hover:text-red-600 transition-colors p-1"
                    title="Supprimer la section"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <Input
                label="Sous-titre de section (optionnel)"
                value={section.heading || ''}
                onChange={(e) =>
                  handleSectionChange(idx, 'heading', e.target.value)
                }
                placeholder="ex: La règle de la micro-marche"
              />

              <div>
                <label className="mb-1 block text-xs font-medium text-brown">
                  Paragraphe(s) *
                </label>
                <textarea
                  value={section.content}
                  onChange={(e) =>
                    handleSectionChange(idx, 'content', e.target.value)
                  }
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-brown outline-none transition-colors focus:border-rose placeholder:text-muted"
                  placeholder="Rédigez le texte de cette partie..."
                  required
                />
              </div>
            </div>
          ))}
        </div>

        {/* Micro-exercice interactif */}
        <div className="rounded-xl border border-gray-200 p-4 space-y-3 bg-white">
          <div className="flex items-center gap-2 text-brown font-heading font-semibold text-sm">
            <HeartHandshake size={16} className="text-rose" />
            <span>Micro-exercice pratique (Optionnel)</span>
          </div>
          <Input
            label="Titre du micro-exercice"
            value={exerciseTitle}
            onChange={(e) => setExerciseTitle(e.target.value)}
            placeholder="ex: Ton micro-geste du jour (2 min)"
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-brown">
              Consigne de l’exercice
            </label>
            <textarea
              value={exercisePrompt}
              onChange={(e) => setExercisePrompt(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-brown outline-none transition-colors focus:border-rose placeholder:text-muted"
              placeholder="ex: Identifie une chose que tu repousses par doute et découpe-la en 2 minutes..."
            />
          </div>
        </div>

        {/* Passerelle Coaching IA */}
        <div className="rounded-xl bg-purple-50/50 border border-purple-100 p-4 space-y-3">
          <div className="flex items-center gap-2 text-purple-900 font-heading font-semibold text-sm">
            <MessageCircle size={16} className="text-purple-600" />
            <span>Passerelle Coach IA NAYHA</span>
          </div>
          <Input
            label="Libellé du bouton Coaching"
            value={coachTrigger}
            onChange={(e) => setCoachTrigger(e.target.value)}
            placeholder="ex: En discuter avec le Coach"
          />
          <div>
            <label className="mb-1 block text-xs font-medium text-brown">
              Message pré-rempli envoyé au Coach
            </label>
            <textarea
              value={coachMessage}
              onChange={(e) => setCoachMessage(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-brown outline-none transition-colors focus:border-rose placeholder:text-muted"
              placeholder="ex: J’ai lu l’article sur la confiance, comment définir mon micro-geste ?"
            />
          </div>
        </div>

        {/* Statut de publication */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div>
            <div className="text-sm font-semibold text-brown">
              Publier l'article immédiatement
            </div>
            <div className="text-xs text-muted">
              Si activé, l’article sera instantanément visible sur l’application mobile NAYHA.
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose"></div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="ghost" size="sm" onClick={onClose} type="button">
            Annuler
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            loading={saving}
            disabled={!title.trim() || !subtitle.trim() || !keyTakeaway.trim()}
          >
            {article ? 'Mettre à jour' : 'Créer l’article'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
