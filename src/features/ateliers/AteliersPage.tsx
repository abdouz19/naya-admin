import { useCallback, useMemo, useState } from 'react';
import { Film, Eye, Users, TrendingUp, Plus, Trash2 } from 'lucide-react';
import { Card, Spinner, Stat, Button, Modal, Input, Select } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import {
  getAteliers,
  getAtelierStats,
  addAtelier,
  updateAtelier,
  deleteAtelier,
} from '@/services/ateliers.service';
import type { AtelierVideo, AtelierStats } from '@/types/atelier';
import { formatNumber, formatPercent } from '@/lib/format';
import { AtelierCard } from './AtelierCard';
import { AtelierCompletionChart } from './AtelierCompletionChart';

const CATEGORY_OPTIONS = [
  { value: 'emploi', label: 'Retour à l’emploi' },
  { value: 'reconversion', label: 'Reconversion professionnelle' },
  { value: 'activite', label: 'Création d’activité' },
  { value: 'palier_1', label: 'Palier 1 - Se connaître' },
  { value: 'palier_2', label: 'Palier 2 - Se positionner' },
  { value: 'palier_3', label: 'Palier 3 - Avancer' },
];

const CATEGORY_LABELS: Record<string, string> = {
  emploi: 'Retour à l’emploi',
  reconversion: 'Reconversion professionnelle',
  activite: 'Création d’activité',
  palier_1: 'Palier 1 - Se connaître',
  palier_2: 'Palier 2 - Se positionner',
  palier_3: 'Palier 3 - Avancer',
};

interface AtelierFormData {
  titre: string;
  subtitle: string;
  category: string;
  duree: string;
  description: string;
  video_url: string;
  tips: string;
}

const emptyForm: AtelierFormData = {
  titre: '',
  subtitle: '',
  category: 'emploi',
  duree: '15:00',
  description: '',
  video_url: 'https://youtu.be/6A1xfGvUFgk',
  tips: '',
};

export default function AteliersPage() {
  const statsFn = useCallback(() => getAtelierStats(), []);
  const ateliersFn = useCallback(() => getAteliers(), []);
  const { data: stats, loading: loadingStats, refetch: refetchStats } = useService<AtelierStats[]>(statsFn);
  const { data: ateliers, loading: loadingAteliers, refetch: refetchAteliers } = useService<AtelierVideo[]>(ateliersFn);

  const [selectedFilter, setSelectedFilter] = useState('tous');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAtelier, setEditingAtelier] = useState<AtelierVideo | null>(null);
  const [form, setForm] = useState<AtelierFormData>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditingAtelier(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (atelier: AtelierVideo) => {
    setEditingAtelier(atelier);
    setForm({
      titre: atelier.titre,
      subtitle: atelier.subtitle ?? '',
      category: atelier.category ?? atelier.palier ?? 'emploi',
      duree: atelier.duree,
      description: atelier.description,
      video_url: atelier.video_url ?? '',
      tips: Array.isArray(atelier.tips) ? atelier.tips.join('\n') : '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const tipsArray = form.tips
      .split('\n')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingAtelier) {
      await updateAtelier(editingAtelier.id, {
        titre: form.titre,
        subtitle: form.subtitle || undefined,
        category: form.category,
        palier: form.category,
        palier_label: CATEGORY_LABELS[form.category] ?? form.category,
        duree: form.duree,
        description: form.description,
        video_url: form.video_url || undefined,
        tips: tipsArray,
      });
    } else {
      await addAtelier({
        titre: form.titre,
        subtitle: form.subtitle || undefined,
        category: form.category,
        palier: form.category,
        palier_label: CATEGORY_LABELS[form.category] ?? form.category,
        duree: form.duree,
        description: form.description,
        video_url: form.video_url || undefined,
        tips: tipsArray,
      });
    }
    setSaving(false);
    setModalOpen(false);
    refetchStats();
    refetchAteliers();
  };

  const handleDelete = async () => {
    if (!editingAtelier) return;
    if (window.confirm(`Supprimer l'atelier "${editingAtelier.titre}" ?`)) {
      setSaving(true);
      await deleteAtelier(editingAtelier.id);
      setSaving(false);
      setModalOpen(false);
      refetchStats();
      refetchAteliers();
    }
  };

  const filteredStats = useMemo(() => {
    if (!stats) return [];
    if (selectedFilter === 'tous') return stats;
    return stats.filter(
      (s) => s.category === selectedFilter || s.palier === selectedFilter,
    );
  }, [stats, selectedFilter]);

  const kpis = useMemo(() => {
    if (!stats || stats.length === 0) {
      return { total: 0, totalViews: 0, avgCompletion: 0, mostViewed: '' };
    }
    const totalViews = stats.reduce((s, a) => s + a.watch_count, 0);
    const avgCompletion =
      stats.reduce((s, a) => s + a.completion_rate, 0) / stats.length;
    const mostViewed = [...stats].sort(
      (a, b) => b.watch_count - a.watch_count,
    )[0].titre;

    return {
      total: stats.length,
      totalViews,
      avgCompletion,
      mostViewed,
    };
  }, [stats]);

  const loading = loadingStats || loadingAteliers;

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
              Vidéos & Ateliers ({filteredStats.length})
            </h2>
            <p className="text-xs text-muted">
              Gérez les vidéos affichées dans l'application mobile (Emploi, Reconversion, Activité, Paliers).
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={openAdd}
          >
            Ajouter une vidéo
          </Button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedFilter('tous')}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedFilter === 'tous'
                ? 'bg-rose text-white'
                : 'bg-gray-100 text-brown hover:bg-gray-200'
            }`}
          >
            Tous ({stats?.length ?? 0})
          </button>
          {CATEGORY_OPTIONS.map((opt) => {
            const count = stats?.filter((s) => s.category === opt.value || s.palier === opt.value).length ?? 0;
            return (
              <button
                key={opt.value}
                onClick={() => setSelectedFilter(opt.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedFilter === opt.value
                    ? 'bg-rose text-white'
                    : 'bg-gray-100 text-brown hover:bg-gray-200'
                }`}
              >
                {opt.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredStats.map((s) => {
            const atelier = ateliers?.find((a) => a.id === s.id);
            return (
              <div key={s.id} onClick={() => atelier && openEdit(atelier)} className="cursor-pointer">
                <AtelierCard stats={s} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAtelier ? 'Modifier la vidéo / l\'atelier' : 'Nouvelle vidéo / atelier'}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <Input
            label="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            placeholder="ex: Alertes emploi"
          />

          <Input
            label="Sous-titre"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            placeholder="ex: Les créer et paramétrer"
          />

          <Select
            label="Catégorie / Parcours"
            options={CATEGORY_OPTIONS}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Durée"
              value={form.duree}
              onChange={(e) => setForm({ ...form, duree: e.target.value })}
              placeholder="ex: 12:30"
            />
            <Input
              label="URL Vidéo (YouTube)"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://youtu.be/..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brown">
              Points clés / Conseils (1 par ligne)
            </label>
            <textarea
              value={form.tips}
              onChange={(e) => setForm({ ...form, tips: e.target.value })}
              rows={3}
              className="w-full radius-sm border border-gray-200 px-3 py-2 text-sm text-brown outline-none transition-colors focus:border-rose placeholder:text-muted"
              placeholder="Conseil 1&#10;Conseil 2&#10;Conseil 3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-brown">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full radius-sm border border-gray-200 px-3 py-2 text-sm text-brown outline-none transition-colors focus:border-rose placeholder:text-muted"
              placeholder="Description détaillée de la vidéo..."
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            {editingAtelier ? (
              <Button
                variant="danger"
                size="sm"
                icon={<Trash2 size={14} />}
                onClick={handleDelete}
                loading={saving}
              >
                Supprimer
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                loading={saving}
                disabled={!form.titre || !form.duree}
              >
                {editingAtelier ? 'Enregistrer' : 'Ajouter'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
