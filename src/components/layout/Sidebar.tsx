import {
  LayoutDashboard,
  Users,
  Briefcase,
  PlayCircle,
  BookOpen,
  MessageSquare,
  CreditCard,
  LifeBuoy,
  Settings,
  LogOut,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSupportWaitingCount } from '@/hooks/use-support-waiting-count';
import { SidebarNavItem } from './SidebarNavItem';

interface NavItem {
  icon: LucideIcon;
  label: string;
  to: string;
  perm?: string;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: 'Menu',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', to: '/', perm: 'dashboard' },
      { icon: Users, label: 'Utilisatrices', to: '/utilisatrices', perm: 'users_view' },
      { icon: Briefcase, label: 'Candidatures', to: '/candidatures', perm: 'candidatures_view' },
      { icon: CreditCard, label: 'Abonnements', to: '/abonnements', perm: 'subscriptions_view' },
    ],
  },
  {
    title: 'Contenu',
    items: [
      { icon: PlayCircle, label: 'Ateliers', to: '/ateliers', perm: 'ateliers_view' },
      { icon: BookOpen, label: 'Blog & Conseils', to: '/blog', perm: 'community_view' },
      { icon: MessageSquare, label: 'Communauté', to: '/communaute', perm: 'community_view' },
    ],
  },
  {
    title: 'Général',
    items: [
      { icon: LifeBuoy, label: 'Support', to: '/support', perm: 'support' },
      { icon: Settings, label: 'Réglages', to: '/reglages', perm: 'settings_view' },
    ],
  },
];

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  moderator: 'Modérateur',
  viewer: 'Lecteur',
};

export function Sidebar() {
  const { user, token, logout, permissions } = useAuth();

  // An item is hidden only when its permission is explicitly false.
  const allowed = (item: NavItem) =>
    !item.perm ||
    !permissions ||
    typeof permissions[item.perm] !== 'boolean' ||
    permissions[item.perm];

  const sections = navSections
    .map((section) => ({ ...section, items: section.items.filter(allowed) }))
    .filter((section) => section.items.length > 0);

  const canViewSupport = sections.some((s) => s.items.some((i) => i.to === '/support'));
  const supportWaiting = useSupportWaitingCount(token, canViewSupport);

  return (
    <aside className="sticky top-4 flex h-[calc(100vh-104px)] w-[265px] shrink-0 flex-col justify-between rounded-[18px] border border-line bg-white px-3.5 py-5 shadow-card">
      <div className="overflow-y-auto">
        {user && (
          <div className="mb-4 rounded-xl border border-line-light bg-canvas/60 px-3 py-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-rose" />
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-rose">
                {ROLE_LABEL[user.role] ?? user.role}
              </span>
            </div>
            <p className="mt-1 truncate text-[11px] text-muted">{user.email}</p>
          </div>
        )}

        {sections.map((section) => (
          <div key={section.title} className="mb-[18px]">
            <p className="mb-2 px-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-light">
              {section.title}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  badge={item.to === '/support' ? supportWaiting : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={logout}
        className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-3.5 py-2.5 text-[13px] font-medium text-rose-dark transition-all hover:border-rose/20 hover:bg-rose/10"
      >
        <LogOut size={18} />
        Déconnexion
      </button>
    </aside>
  );
}
