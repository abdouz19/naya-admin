import { useState, useEffect, useMemo } from 'react';
import {
  ExternalLink,
  Edit2,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Globe,
} from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { AppLink } from '@/types/app-link';
import {
  getAppLinks,
  updateAppLink,
  resetAppLink,
} from '@/services/app-links.service';
import { EditLinkModal } from './EditLinkModal';

export function AppLinksSettings() {
  const [links, setLinks] = useState<AppLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedModule, setSelectedModule] = useState('tous');
  const [selectedStep, setSelectedStep] = useState('tous');
  const [editingLink, setEditingLink] = useState<AppLink | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadLinks();
  }, []);

  async function loadLinks() {
    setLoading(true);
    try {
      const data = await getAppLinks();
      setLinks(data);
    } catch (err) {
      console.error('Failed to load app links:', err);
    } finally {
      setLoading(false);
    }
  }

  // Derived filter options
  const modules = useMemo(() => {
    return ['tous', ...Array.from(new Set(links.map((l) => l.module)))];
  }, [links]);

  const steps = useMemo(() => {
    const relevantLinks =
      selectedModule === 'tous'
        ? links
        : links.filter((l) => l.module === selectedModule);
    return ['tous', ...Array.from(new Set(relevantLinks.map((l) => l.step).filter(Boolean)))];
  }, [links, selectedModule]);

  // Filtered links
  const filteredLinks = useMemo(() => {
    return links.filter((link) => {
      if (selectedModule !== 'tous' && link.module !== selectedModule) {
        return false;
      }
      if (selectedStep !== 'tous' && link.step !== selectedStep) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          link.title.toLowerCase().includes(q) ||
          link.key.toLowerCase().includes(q) ||
          link.organisme.toLowerCase().includes(q) ||
          link.description.toLowerCase().includes(q) ||
          link.current_url.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [links, selectedModule, selectedStep, search]);

  const customCount = useMemo(() => {
    return links.filter((l) => l.current_url !== l.default_url).length;
  }, [links]);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  async function handleSave(
    key: string,
    updates: { url: string; title?: string; description?: string },
  ) {
    const updated = await updateAppLink(key, updates);
    setLinks((prev) => prev.map((l) => (l.key === key ? updated : l)));
    showToast(`Lien "${updated.title}" mis à jour avec succès.`);
  }

  async function handleReset(key: string) {
    const updated = await resetAppLink(key);
    setLinks((prev) => prev.map((l) => (l.key === key ? updated : l)));
    showToast(`Lien "${updated.title}" rétabli vers l'URL par défaut.`);
  }

  function openTestUrl(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brown text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2.5 text-sm border border-rose/30">
          <CheckCircle2 size={18} className="text-green shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Overview stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-border/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">
              Total Liens Référencés
            </div>
            <div className="text-2xl font-bold text-brown mt-1">{links.length}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-cream/80 flex items-center justify-center text-brown">
            <Globe size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-border/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">
              URLs Personnalisées (Admin)
            </div>
            <div className="text-2xl font-bold text-rose mt-1">{customCount}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-light/40 flex items-center justify-center text-rose">
            <AlertCircle size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-border/60 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-muted uppercase tracking-wider">
              URLs Officielles par Défaut
            </div>
            <div className="text-2xl font-bold text-green mt-1">
              {links.length - customCount}
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-light flex items-center justify-center text-green">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* Filters and search section */}
      <div className="bg-white rounded-xl p-4 border border-border/60 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par intitulé, organisme, mot-clé ou URL..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-cream/10 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose focus:border-rose text-brown placeholder:text-muted/60"
            />
          </div>

          {/* Module Filter */}
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter size={14} className="text-muted shrink-0" />
            <select
              value={selectedModule}
              onChange={(e) => {
                setSelectedModule(e.target.value);
                setSelectedStep('tous');
              }}
              className="w-full text-sm rounded-lg border border-border bg-white px-3 py-2 text-brown focus:ring-1 focus:ring-rose focus:border-rose"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  Module : {m === 'tous' ? 'Tous les modules' : m}
                </option>
              ))}
            </select>
          </div>

          {/* Step Filter (if steps exist) */}
          {steps.length > 2 && (
            <div className="flex items-center gap-2 min-w-[200px]">
              <select
                value={selectedStep}
                onChange={(e) => setSelectedStep(e.target.value)}
                className="w-full text-sm rounded-lg border border-border bg-white px-3 py-2 text-brown focus:ring-1 focus:ring-rose focus:border-rose"
              >
                {steps.map((st) => (
                  <option key={st} value={st}>
                    Étape : {st === 'tous' ? 'Toutes les étapes' : st}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Quick pill filters for modules */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-border/40">
          <span className="text-xs font-semibold text-muted mr-1">Modules rapides :</span>
          {modules.map((m) => (
            <button
              key={m}
              onClick={() => {
                setSelectedModule(m);
                setSelectedStep('tous');
              }}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                selectedModule === m
                  ? 'bg-brown text-white'
                  : 'bg-cream/50 text-brown hover:bg-cream'
              }`}
            >
              {m === 'tous' ? 'Tous' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List of links */}
      <div className="bg-white rounded-xl border border-border/60 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
          <div className="text-sm font-semibold text-brown">
            {filteredLinks.length} lien{filteredLinks.length > 1 ? 's' : ''} correspondant{filteredLinks.length > 1 ? 's' : ''}
          </div>
          <p className="text-xs text-muted">
            Toute modification d'URL s'applique immédiatement dans l'app mobile.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted">
            Chargement des liens...
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <Globe size={32} className="mx-auto text-muted/40 mb-2" />
            <p className="font-semibold text-brown">Aucun lien trouvé</p>
            <p className="text-xs mt-1">Essayez d'ajuster vos filtres ou termes de recherche.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredLinks.map((link) => {
              const isCustom = link.current_url !== link.default_url;

              return (
                <div
                  key={link.key}
                  className="p-4 hover:bg-cream/15 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Left Column: Info & Context */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-sm text-brown">
                        {link.title}
                      </span>
                      <Badge variant="rose" className="text-[10px] uppercase tracking-wider">
                        {link.module}
                      </Badge>
                      {link.step && (
                        <span className="text-xs px-2 py-0.5 rounded bg-cream/70 text-brown font-medium">
                          {link.step}
                        </span>
                      )}
                      {link.organisme && (
                        <span className="text-xs text-muted">
                          via <strong className="text-brown">{link.organisme}</strong>
                        </span>
                      )}
                      {isCustom ? (
                        <Badge variant="gold">🟡 Personnalisé</Badge>
                      ) : (
                        <Badge variant="green">🟢 Défaut</Badge>
                      )}
                    </div>

                    {link.description && (
                      <p className="text-xs text-muted leading-relaxed line-clamp-1">
                        {link.description}
                      </p>
                    )}

                    {/* URL display */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted font-mono shrink-0">URL :</span>
                      <a
                        href={link.current_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-rose hover:underline truncate max-w-xl inline-flex items-center gap-1"
                        title={link.current_url}
                      >
                        <span className="truncate">{link.current_url}</span>
                        <ExternalLink size={11} className="shrink-0" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<ExternalLink size={14} />}
                      onClick={() => openTestUrl(link.current_url)}
                      title="Ouvrir le lien pour tester"
                    >
                      Tester
                    </Button>

                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Edit2 size={14} />}
                      onClick={() => setEditingLink(link)}
                    >
                      Modifier
                    </Button>

                    {isCustom && (
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={<RotateCcw size={14} />}
                        onClick={() => handleReset(link.key)}
                        title="Rétablir l'URL officielle par défaut"
                      >
                        Rétablir
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditLinkModal
        link={editingLink}
        onClose={() => setEditingLink(null)}
        onSave={handleSave}
        onReset={handleReset}
      />
    </div>
  );
}
