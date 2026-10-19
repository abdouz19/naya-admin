import { useCallback, useMemo, useState } from 'react';
import {
  Film,
  Eye,
  Users,
  TrendingUp,
  Plus,
  Trash2,
  Search,
  Video,
  BookOpen,
  User,
  Link2,
} from '@/components/icons';
import { Card, Spinner, Stat, Button, Modal, Input, Select, Pagination } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getAteliersPage,
  getAtelierStats,
  addAtelier,
  updateAtelier,
  deleteAtelier,
} from '@/services/ateliers.service';
import type { AtelierVideo, AtelierStats } from '@/types/atelier';
import { formatNumber, formatPercent } from '@/lib/format';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { Paginated } from '@/types/pagination';
import { AtelierCard } from './AtelierCard';
import { AtelierCompletionChart } from './AtelierCompletionChart';

const CATEGORY_OPTIONS = [
  { value: 'emploi', label: 'Retour à l’emploi' },
  { value: 'reconversion', label: 'Reconversion professionnelle' },
  { value: 'confiance', label: 'Coaching confiance' },
  { value: 'activite', label: 'Création d’activité' },
  { value: 'palier_1', label: 'Palier 1 - Se connaître' },
  { value: 'palier_2', label: 'Palier 2 - Se positionner' },
  { value: 'palier_3', label: 'Palier 3 - Avancer' },
];

const CATEGORY_LABELS: Record<string, string> = {
  emploi: 'Retour à l’emploi',
  reconversion: 'Reconversion professionnelle',
  confiance: 'Coaching confiance',
  activite: 'Création d’activité',
  palier_1: 'Palier 1 - Se connaître',
  palier_2: 'Palier 2 - Se positionner',
  palier_3: 'Palier 3 - Avancer',
};

interface AtelierFormData {
  titre: string;
  subtitle: string;
  category: string;
  step_tag: string;
  duree: string;
  description: string;
  video_url: string;
  objectifs: string;
  tips: string;
  resource_url: string;
  speaker_name: string;
  speaker_role: string;
  order: number;
  is_active: boolean;
}

const emptyForm: AtelierFormData = {
  titre: '',
  subtitle: '',
  category: 'emploi',
  step_tag: '',
  duree: '15:00',
  description: '',
  video_url: 'https://youtu.be/6A1xfGvUFgk',
  objectifs: '',
  tips: '',
  resource_url: '',
  speaker_name: 'Coach NAYHA',
  speaker_role: 'Experte en accompagnement',
  order: 1,
  is_active: true,
};

export default function AteliersPage() {
  const statsFn = useCallback(() => getAtelierStats(), []);
  const { data: stats, loading: loadingStats, refetch: refetchStats } = useService<AtelierStats[]>(statsFn);

  const [selectedFilter, setSelectedFilter] = useState('tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchQuery);

  // Searching or filtering starts again from the first page.
  const changeFilter =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setPage(1);
    };

  const ateliersFn = useCallback(
    () =>
      getAteliersPage(page, {
        search: debouncedSearch,
        category: selectedFilter,
      }),
    [page, debouncedSearch, selectedFilter],
  );
  const {
    data: ateliersPage,
    loading: loadingAteliers,
    refetch: refetchAteliers,
  } = useService<Paginated<AtelierVideo>>(ateliersFn);
  const ateliers = useMemo(() => ateliersPage?.items ?? [], [ateliersPage]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAtelier, setEditingAtelier] = useState<AtelierVideo | null>(null);
  const [form, setForm] = useState<AtelierFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditingAtelier(null);
    setForm({
      ...emptyForm,
      order: (ateliersPage?.total ?? stats?.length ?? 0) + 1,
    });
    setModalOpen(true);
  };

  const openEdit = (atelier: AtelierVideo) => {
    setEditingAtelier(atelier);
    setForm({
      titre: atelier.titre,
      subtitle: atelier.subtitle ?? '',
      category: atelier.category ?? atelier.palier ?? 'emploi',
      step_tag: atelier.step_tag ?? '',
      duree: atelier.duree,
      description: atelier.description,
      video_url: atelier.video_url ?? '',
      objectifs: Array.isArray(atelier.objectifs) ? atelier.objectifs.join('\n') : '',
      tips: Array.isArray(atelier.tips) ? atelier.tips.join('\n') : '',
      resource_url: atelier.resource_url ?? '',
      speaker_name: atelier.speaker_name ?? '',
      speaker_role: atelier.speaker_role ?? '',
      order: atelier.order ?? 1,
      is_active: atelier.is_active ?? true,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const tipsArray = form.tips
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const objectifsArray = form.objectifs
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      titre: form.titre.trim(),
      subtitle: form.subtitle.trim() || undefined,
      category: form.category,
      palier: form.category,
      palier_label: CATEGORY_LABELS[form.category] ?? form.category,
      step_tag: form.step_tag.trim() || undefined,
      duree: form.duree.trim(),
      description: form.description.trim(),
      video_url: form.video_url.trim() || undefined,
      objectifs: objectifsArray,
      tips: tipsArray,
      resource_url: form.resource_url.trim() || undefined,
      speaker_name: form.speaker_name.trim() || undefined,
      speaker_role: form.speaker_role.trim() || undefined,
      order: Number(form.order) || 1,
      is_active: form.is_active,
    };

    if (editingAtelier) {
      await updateAtelier(editingAtelier.id, payload);
    } else {
      await addAtelier(payload);
    }
    setSaving(false);
    setModalOpen(false);
    refetchStats();
    refetchAteliers();
  };

  const handleDelete = async () => {
    if (!editingAtelier) return;
    if (window.confirm(`Supprimer définitivement l'atelier "${editingAtelier.titre}" ?`)) {
      setSaving(true);
      await deleteAtelier(editingAtelier.id);
      setSaving(false);
      setModalOpen(false);
      refetchStats();
      // Last atelier of a page: show the previous page.
      if (ateliers.length === 1 && page > 1) setPage(page - 1);
      else refetchAteliers();
    }
  };

  // Cards of this page: each atelier with its viewing figures.
  const pageCards = useMemo(
    () =>
      ateliers.map((atelier) => {
        const found = stats?.find((st) => st.id === atelier.id);
        const cardStats: AtelierStats = found ?? {
          id: atelier.id,
          titre: atelier.titre,
          palier: atelier.palier,
          category: atelier.category,
          step_tag: atelier.step_tag,
          duree: atelier.duree,
          watch_count: 0,
          unique_viewers: 0,
          completion_rate: 0,
          is_active: atelier.is_active,
        };
        return { atelier, stats: cardStats };
      }),
    [ateliers, stats],
  );

  const kpis = useMemo(() => {
    if (!stats || stats.length === 0) {
      return { total: 0, totalViews: 0, avgCompletion: 0, mostViewed: '' };
    }
    const totalViews = stats.reduce((s, a) => s + a.watch_count, 0);
    const avgCompletion =
      stats.reduce((s, a) => s + a.completion_rate, 0) / stats.length;
    const mostViewed = [...stats].sort(
      (a, b) => b.watch_count - a.watch_count,
    )[0]?.titre || '—';

    return {
      total: stats.length,
      totalViews,
      avgCompletion,
      mostViewed,
    };
  }, [stats]);

  const loading = (loadingStats && !stats) || (loadingAteliers && !ateliersPage);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-6">
          <Stat label="Total ateliers & vidéos" value={formatNumber(kpis.total)} icon={Film} />
        </Card>
        <Card className="p-6">
          <Stat label="Total vues" value={formatNumber(kpis.totalViews)} icon={Eye} />
        </Card>
        <Card className="p-6">
          <Stat
            label="Taux moyen de complétion"
            value={formatPercent(kpis.avgCompletion)}
            icon={TrendingUp}
          />
        </Card>
        <Card className="p-6">
          <Stat
            label="Vidéo la plus vue"
            value={
              kpis.mostViewed.length > 22
                ? kpis.mostViewed.slice(0, 20) + '...'
                : kpis.mostViewed || '—'
            }
            icon={Users}
          />
        </Card>
      </div>

      {/* Completion chart */}
      {stats && stats.length > 0 && <AtelierCompletionChart data={stats} />}

      {/* Filter Tabs & Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-brown">
              Vidéos & Ateliers Thématiques ({ateliersPage?.total ?? 0})
            </h2>
            <p className="text-xs text-muted">
              Gérez les ateliers vidéo interactifs de l'application mobile (Emploi, Reconversion, Confiance en soi).
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={openAdd}
          >
            Ajouter un atelier
          </Button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-1">
            <button
              onClick={() => changeFilter(setSelectedFilter)('tous')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selectedFilter === 'tous'
                  ? 'bg-rose text-white shadow-xs'
                  : 'bg-gray-100 text-brown hover:bg-gray-200'
              }`}
            >
              Tous ({stats?.length ?? 0})
            </button>
            {CATEGORY_OPTIONS.map((opt) => {
              const count =
                stats?.filter((s) => s.category === opt.value || s.palier === opt.value).length ?? 0;
              return (
                <button
                  key={opt.value}
                  onClick={() => changeFilter(setSelectedFilter)(opt.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                    selectedFilter === opt.value
                      ? 'bg-rose text-white shadow-xs'
                      : 'bg-gray-100 text-brown hover:bg-gray-200'
                  }`}
                >
                  {opt.label} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => changeFilter(setSearchQuery)(e.target.value)}
              placeholder="Rechercher un atelier..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-gray-200 focus:border-rose focus:ring-1 focus:ring-rose/20 outline-none text-brown"
            />
          </div>
        </div>

        {/* Grid */}
        {pageCards.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-xl">
            <Film className="mx-auto text-muted mb-2" size={32} />
            <p className="text-sm font-medium text-brown">Aucun atelier trouvé</p>
            <p className="text-xs text-muted mt-1">Modifiez vos filtres ou effectuez une autre recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {pageCards.map(({ atelier, stats: cardStats }) => (
              <div key={atelier.id} onClick={() => openEdit(atelier)}>
                <AtelierCard stats={cardStats} atelier={atelier} />
              </div>
            ))}
          </div>
        )}

        {ateliersPage && (
          <Pagination
            page={ateliersPage.page}
            pageSize={ateliersPage.pageSize}
            total={ateliersPage.total}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAtelier ? `Modifier l'atelier : ${editingAtelier.titre}` : 'Nouvel atelier vidéo'}
        className="max-w-2xl"
      >
        <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1 pr-2">
          {/* Section 1: Informations Générales */}
          <div className="space-y-3.5">
            <h3 className="text-xs font-semibold text-rose uppercase tracking-wider flex items-center gap-1.5">
              <Film size={14} /> Informations Générales
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Titre de l'atelier"
                value={form.titre}
                onChange={(e) => setForm({ ...form, titre: e.target.value })}
                placeholder="ex: Alertes emploi"
              />
              <Input
                label="Sous-titre / Accroche"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="ex: Les créer et paramétrer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Select
                label="Catégorie / Parcours"
                options={CATEGORY_OPTIONS}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
              <Input
                label="Tag / Étape clé"
                value={form.step_tag}
                onChange={(e) => setForm({ ...form, step_tag: e.target.value })}
                placeholder="ex: Candidatures & Veille"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Durée (mm:ss)"
                value={form.duree}
                onChange={(e) => setForm({ ...form, duree: e.target.value })}
                placeholder="ex: 12:30"
              />
              <Input
                label="Ordre d'affichage"
                type="number"
                value={form.order.toString()}
                onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) || 1 })}
              />
            </div>
          </div>

          {/* Section 2: Intervenant & Ressources */}
          <div className="space-y-3.5 pt-3.5 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-rose uppercase tracking-wider flex items-center gap-1.5">
              <User size={14} /> Intervenant(e) & Ressources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Input
                label="Nom de l'intervenant(e)"
                value={form.speaker_name}
                onChange={(e) => setForm({ ...form, speaker_name: e.target.value })}
                placeholder="ex: Coach NAYHA"
              />
              <Input
                label="Rôle / Titre"
                value={form.speaker_role}
                onChange={(e) => setForm({ ...form, speaker_role: e.target.value })}
                placeholder="ex: Experte Recrutement"
              />
            </div>

            <Input
              label="URL ressource complémentaire / Fiche outil"
              value={form.resource_url}
              onChange={(e) => setForm({ ...form, resource_url: e.target.value })}
              placeholder="https://..."
              icon={Link2}
            />
          </div>

          {/* Section 3: Vidéo & Statut */}
          <div className="space-y-3.5 pt-3.5 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-rose uppercase tracking-wider flex items-center gap-1.5">
              <Video size={14} /> Vidéo YouTube & Diffusion
            </h3>
            <Input
              label="Lien YouTube"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://youtu.be/..."
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_active_toggle"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-rose focus:ring-rose cursor-pointer"
              />
              <label htmlFor="is_active_toggle" className="text-sm font-medium text-brown cursor-pointer">
                Atelier actif et visible dans l'application mobile
              </label>
            </div>
          </div>

          {/* Section 4: Contenu pédagogique & Conseils */}
          <div className="space-y-3.5 pt-3.5 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-rose uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} /> Contenu pédagogique
            </h3>

            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium text-muted">
                Objectifs pédagogiques (1 par ligne)
              </label>
              <textarea
                value={form.objectifs}
                onChange={(e) => setForm({ ...form, objectifs: e.target.value })}
                rows={3}
                className="w-full radius-sm border border-gray-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted-light transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none"
                placeholder="Identifier les mots-clés stratégiques&#10;Configurer des alertes quotidiennes sans saturation&#10;Créer une routine efficace de candidature"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium text-muted">
                Conseils pratiques / Points clés (1 par ligne)
              </label>
              <textarea
                value={form.tips}
                onChange={(e) => setForm({ ...form, tips: e.target.value })}
                rows={3}
                className="w-full radius-sm border border-gray-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted-light transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none"
                placeholder="Utilise des mots-clés larges&#10;Choisis une fréquence quotidienne&#10;Crée une adresse email dédiée"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1.5 text-sm font-medium text-muted">
                Description détaillée
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full radius-sm border border-gray-300 bg-white px-3 py-2 text-sm text-ink placeholder:text-muted-light transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none"
                placeholder="Description complète présentée sur la fiche de l'atelier..."
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
            <div>
              {editingAtelier && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  icon={<Trash2 size={14} />}
                  onClick={handleDelete}
                  loading={saving}
                >
                  Supprimer
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleSave}
                loading={saving}
                disabled={!form.titre || !form.duree}
              >
                {editingAtelier ? 'Enregistrer les modifications' : 'Ajouter l’atelier'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
