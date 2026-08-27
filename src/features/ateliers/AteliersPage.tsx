import { useCallback, useMemo, useState } from 'react';
import { Film, Eye, Users, TrendingUp, Plus } from 'lucide-react';
import { Card, Spinner, Stat, Button, Modal, Input, Select } from '@/components/ui';
import { useService } from '@/hooks/use-service';
import { getAteliers, getAtelierStats, addAtelier, updateAtelier } from '@/services/ateliers.service';
import type { AtelierVideo, AtelierStats } from '@/types/atelier';
import { formatNumber, formatPercent } from '@/lib/format';
import { AtelierCard } from './AtelierCard';
import { AtelierCompletionChart } from './AtelierCompletionChart';

const PALIER_OPTIONS = [
  { value: 'palier_1', label: 'Palier 1 - Se connaitre' },
  { value: 'palier_2', label: 'Palier 2 - Se positionner' },
  { value: 'palier_3', label: 'Palier 3 - Avancer' },
];

const PALIER_LABELS: Record<string, string> = {
  palier_1: 'Palier 1 - Se connaitre',
  palier_2: 'Palier 2 - Se positionner',
  palier_3: 'Palier 3 - Avancer',
};

interface AtelierFormData {
  titre: string;
  palier: string;
  duree: string;
  description: string;
  video_url: string;
}

const emptyForm: AtelierFormData = {
  titre: '',
  palier: 'palier_1',
  duree: '',
  description: '',
  video_url: '',
};

export default function AteliersPage() {
  const statsFn = useCallback(() => getAtelierStats(), []);
  const ateliersFn = useCallback(() => getAteliers(), []);
  const { data: stats, loading: loadingStats, refetch: refetchStats } = useService<AtelierStats[]>(statsFn);
  const { data: ateliers, loading: loadingAteliers, refetch: refetchAteliers } = useService<AtelierVideo[]>(ateliersFn);

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
      palier: atelier.palier,
      duree: atelier.duree,
      description: atelier.description,
      video_url: atelier.video_url ?? '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editingAtelier) {
      await updateAtelier(editingAtelier.id, {
        titre: form.titre,
        palier: form.palier,
        palier_label: PALIER_LABELS[form.palier] ?? form.palier,
        duree: form.duree,
        description: form.description,
        video_url: form.video_url || undefined,
      });
    } else {
      await addAtelier({
        titre: form.titre,
        palier: form.palier,
        palier_label: PALIER_LABELS[form.palier] ?? form.palier,
        duree: form.duree,
        description: form.description,
        video_url: form.video_url || undefined,
      });
    }
    setSaving(false);
    setModalOpen(false);
    refetchStats();
    refetchAteliers();
  };

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
          <Stat label="Total ateliers" value={formatNumber(kpis.total)} icon={Film} />
        </Card>
        <Card className="p-6">
          <Stat label="Total vues" value={formatNumber(kpis.totalViews)} icon={Eye} />
        </Card>
        <Card className="p-6">
          <Stat
            label="Taux moyen de completion"
            value={formatPercent(kpis.avgCompletion)}
            icon={TrendingUp}
          />
        </Card>
        <Card className="p-6">
          <Stat
            label="Atelier le plus vu"
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

      {/* Atelier cards grid */}
      {stats && stats.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold text-brown">
              Tous les ateliers
            </h2>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={openAdd}
            >
              Ajouter un atelier
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((s) => {
              const atelier = ateliers?.find((a) => a.id === s.id);
              return (
                <div key={s.id} onClick={() => atelier && openEdit(atelier)} className="cursor-pointer">
                  <AtelierCard stats={s} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingAtelier ? 'Modifier l\'atelier' : 'Nouvel atelier'}
        className="max-w-lg"
      >
        <div className="space-y-4">
          <Input
            label="Titre"
            value={form.titre}
            onChange={(e) => setForm({ ...form, titre: e.target.value })}
            placeholder="ex: Comprendre ton blocage"
          />

          <Select
            label="Palier"
            options={PALIER_OPTIONS}
            value={form.palier}
            onChange={(e) => setForm({ ...form, palier: e.target.value })}
          />

          <Input
            label="Duree"
            value={form.duree}
            onChange={(e) => setForm({ ...form, duree: e.target.value })}
            placeholder="ex: 12:30"
          />

          <Input
            label="URL video"
            value={form.video_url}
            onChange={(e) => setForm({ ...form, video_url: e.target.value })}
            placeholder="https://youtu.be/..."
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-brown">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full radius-sm border border-gray-200 px-3 py-2 text-sm text-brown outline-none transition-colors focus:border-rose placeholder:text-muted"
              placeholder="Description de l'atelier..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
      </Modal>
    </div>
  );
}
