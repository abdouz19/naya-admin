import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  XIcon,
  FileText,
  LinkIcon,
  Play,
  CalendarDays,
  ShieldBan,
  ShieldCheck,
} from 'lucide-react';
import { Avatar, Badge, Button, ProgressBar } from '@/components/ui';
import { formatDate } from '@/lib/format';
import { blockUser, unblockUser } from '@/services/users.service';
import type { UserProfile } from '@/types/user';

interface UserDetailPanelProps {
  user: UserProfile | null;
  onClose: () => void;
  onUserUpdated?: (user: UserProfile) => void;
}

const PARCOURS_LABELS: Record<string, string> = {
  retour_emploi: 'Retour emploi',
  reconversion: 'Reconversion',
  creation_activite: "Creation d'activite",
};

function CheckItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-brown">{label}</span>
      {checked ? (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-light text-green">
          <Check size={12} />
        </span>
      ) : (
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-muted">
          <XIcon size={12} />
        </span>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="radius-md border border-gray-200 bg-white p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </h4>
      {children}
    </div>
  );
}

export function UserDetailPanel({ user, onClose, onUserUpdated }: UserDetailPanelProps) {
  const ateliersWatched = user?.ateliers_emploi_watched?.length ?? 0;
  const ateliersTotal = 4;
  const [blocking, setBlocking] = useState(false);

  const handleToggleBlock = async () => {
    if (!user) return;
    setBlocking(true);
    const updated = user.is_blocked
      ? await unblockUser(user.id)
      : await blockUser(user.id);
    setBlocking(false);
    if (updated) onUserUpdated?.(updated);
  };

  return (
    <AnimatePresence>
      {user && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/20"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[420px] flex-col bg-white shadow-modal"
          >
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold text-brown">
                  Profil utilisatrice
                </h3>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-gray-100 hover:text-brown"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex items-center gap-4">
                <Avatar name={user.name} size="lg" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-brown">{user.name}</p>
                    {user.is_blocked && (
                      <Badge variant="danger">Bloquee</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted">{user.email}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                    <CalendarDays size={12} />
                    Inscrite le {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  variant={user.is_blocked ? 'secondary' : 'danger'}
                  size="sm"
                  icon={user.is_blocked ? <ShieldCheck size={14} /> : <ShieldBan size={14} />}
                  loading={blocking}
                  onClick={handleToggleBlock}
                  className="w-full"
                >
                  {user.is_blocked ? 'Debloquer' : 'Bloquer cette utilisatrice'}
                </Button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {/* Parcours section */}
              <Section title="Parcours">
                <div className="divide-y divide-gray-100">
                  <CheckItem label="RGPD accepte" checked={user.rgpd_accepted} />
                  <CheckItem
                    label="Diagnostic vie"
                    checked={user.diagnostic_vie_completed}
                  />
                  <CheckItem
                    label="Diagnostic pro"
                    checked={user.diagnostic_pro_completed}
                  />

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-brown">Metier selectionne</span>
                    {user.metier_selected ? (
                      <span className="text-sm font-medium text-green">
                        {user.selected_metier_titre}
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-muted">
                        <XIcon size={12} />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-brown">Type de parcours</span>
                    {user.parcours_type ? (
                      <Badge variant="rose">
                        {PARCOURS_LABELS[user.parcours_type]}
                      </Badge>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-muted">
                        <XIcon size={12} />
                      </span>
                    )}
                  </div>

                  <CheckItem
                    label="Analyse completee"
                    checked={user.parcours_analyse_completed}
                  />
                  <CheckItem
                    label="Premiere candidature"
                    checked={user.parcours_first_candidature_completed}
                  />
                </div>
              </Section>

              {/* Documents section */}
              <Section title="Documents">
                <div className="divide-y divide-gray-100">
                  <div className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-sm text-brown">
                      <FileText size={14} className="text-muted" />
                      CV genere
                    </span>
                    {user.cv_generated ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-light text-green">
                        <Check size={12} />
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-muted">
                        <XIcon size={12} />
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <span className="flex items-center gap-2 text-sm text-brown">
                      <LinkIcon size={14} className="text-muted" />
                      LinkedIn optimise
                    </span>
                    {user.linkedin_optimized ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-light text-green">
                        <Check size={12} />
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-muted">
                        <XIcon size={12} />
                      </span>
                    )}
                  </div>
                </div>
              </Section>

              {/* Ateliers section */}
              <Section title="Ateliers">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brown">Videos regardees</span>
                    <span className="text-sm font-medium text-brown">
                      {ateliersWatched}/{ateliersTotal}
                    </span>
                  </div>

                  <ProgressBar
                    value={(ateliersWatched / ateliersTotal) * 100}
                    color="gold"
                  />

                  {ateliersWatched > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {user.ateliers_emploi_watched.map((id) => (
                        <span
                          key={id}
                          className="inline-flex items-center gap-1 rounded-full bg-gold-light/30 px-2 py-0.5 text-xs text-gold"
                        >
                          <Play size={10} />
                          {id}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Section>

              {/* Actions semaine section */}
              <Section title="Actions semaine">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-brown">Progression</span>
                    <span className="text-sm font-medium text-brown">
                      {user.actions_semaine_count}/10
                    </span>
                  </div>

                  <ProgressBar
                    value={(user.actions_semaine_count / 10) * 100}
                    color={user.actions_semaine_count >= 7 ? 'green' : 'rose'}
                  />
                </div>
              </Section>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
