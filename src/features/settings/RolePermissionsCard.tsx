import { useState } from 'react';
import { Card } from '@/components/ui';
import type { AdminRole, RolePermissions } from '@/types/admin';
import { ROLE_LABELS } from '@/types/admin';
import { cn } from '@/lib/cn';

interface RolePermissionsCardProps {
  permissions: RolePermissions[];
  onUpdate: (role: AdminRole, permissions: RolePermissions['permissions']) => void;
}

type PermissionKey = keyof RolePermissions['permissions'];

interface PermissionSection {
  label: string;
  keys: { key: PermissionKey; label: string }[];
}

const PERMISSION_SECTIONS: PermissionSection[] = [
  {
    label: 'Tableau de bord',
    keys: [{ key: 'dashboard', label: 'Tableau de bord' }],
  },
  {
    label: 'Utilisatrices',
    keys: [
      { key: 'users_view', label: 'Voir les utilisatrices' },
      { key: 'users_edit', label: 'Modifier les utilisatrices' },
    ],
  },
  {
    label: 'Candidatures',
    keys: [{ key: 'candidatures_view', label: 'Voir les candidatures' }],
  },
  {
    label: 'IA',
    keys: [
      { key: 'ai_view', label: 'Voir les stats IA' },
      { key: 'ai_config', label: "Configurer l'IA" },
    ],
  },
  {
    label: 'Ateliers',
    keys: [
      { key: 'ateliers_view', label: 'Voir les ateliers' },
      { key: 'ateliers_edit', label: 'Modifier les ateliers' },
    ],
  },
  {
    label: 'Communauté',
    keys: [
      { key: 'community_view', label: 'Voir la communauté' },
      { key: 'community_moderate', label: 'Modérer la communauté' },
    ],
  },
  {
    label: 'Abonnements',
    keys: [
      { key: 'subscriptions_view', label: 'Voir les abonnements' },
      { key: 'subscriptions_edit', label: 'Gérer les offres' },
    ],
  },
  {
    label: 'Réglages',
    keys: [
      { key: 'settings_view', label: 'Voir les réglages' },
      { key: 'settings_edit', label: 'Modifier les réglages' },
    ],
  },
];

const ROLE_ORDER: AdminRole[] = ['super_admin', 'admin', 'moderator', 'viewer'];

export function RolePermissionsCard({ permissions, onUpdate }: RolePermissionsCardProps) {
  const [localPerms, setLocalPerms] = useState(permissions);

  function getPermsForRole(role: AdminRole) {
    return localPerms.find((rp) => rp.role === role)?.permissions;
  }

  function handleToggle(role: AdminRole, key: PermissionKey) {
    if (role === 'super_admin') return; // locked

    const current = getPermsForRole(role);
    if (!current) return;

    const updated = { ...current, [key]: !current[key] };
    setLocalPerms((prev) =>
      prev.map((rp) => (rp.role === role ? { ...rp, permissions: updated } : rp)),
    );
    onUpdate(role, updated);
  }

  return (
    <Card title="Matrice des permissions" subtitle="Gérer les accès par rôle">
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_repeat(4,100px)] items-end gap-2 border-b border-gray-200 pb-3 mb-2">
            <div className="text-xs font-medium uppercase tracking-wider text-muted">
              Permission
            </div>
            {ROLE_ORDER.map((role) => (
              <div
                key={role}
                className="text-center text-xs font-medium uppercase tracking-wider text-muted"
              >
                {ROLE_LABELS[role]}
              </div>
            ))}
          </div>

          {/* Sections */}
          {PERMISSION_SECTIONS.map((section) => (
            <div key={section.label} className="mb-1">
              {/* Section header */}
              <div className="px-1 py-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted/70">
                  {section.label}
                </span>
              </div>

              {/* Permission rows */}
              {section.keys.map((perm) => (
                <div
                  key={perm.key}
                  className="grid grid-cols-[1fr_repeat(4,100px)] items-center gap-2 rounded-md px-1 py-1.5 transition-colors hover:bg-cream/50"
                >
                  <span className="text-sm text-brown">{perm.label}</span>

                  {ROLE_ORDER.map((role) => {
                    const rolePerms = getPermsForRole(role);
                    const checked = rolePerms?.[perm.key] ?? false;
                    const isSuperAdmin = role === 'super_admin';

                    return (
                      <div key={role} className="flex justify-center">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={checked}
                          aria-label={`${perm.label} - ${ROLE_LABELS[role]}`}
                          disabled={isSuperAdmin}
                          onClick={() => handleToggle(role, perm.key)}
                          className={cn(
                            'flex h-5 w-5 items-center justify-center rounded border transition-all duration-150',
                            checked
                              ? 'border-rose bg-rose text-white'
                              : 'border-gray-300 bg-white',
                            isSuperAdmin && 'cursor-not-allowed opacity-60',
                            !isSuperAdmin && !checked && 'hover:border-rose/50',
                          )}
                        >
                          {checked && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              className="shrink-0"
                            >
                              <path
                                d="M2.5 6L5 8.5L9.5 3.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
