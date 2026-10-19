import { motion } from 'framer-motion';
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
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';
import { useAuth } from '@/context/AuthContext';
import { useSupportWaitingCount } from '@/hooks/use-support-waiting-count';
import { Avatar } from '@/components/ui';
import { SIDEBAR_WIDTH } from './sidebar-width';
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
  const { collapsed, toggle } = useSidebar();
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
    <motion.aside
      className="fixed left-4 top-4 bottom-4 z-50 flex flex-col overflow-hidden rounded-3xl bg-white shadow-card"
      animate={{ width: collapsed ? SIDEBAR_WIDTH.collapsed - 32 : SIDEBAR_WIDTH.open - 32 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo and collapse toggle */}
      <div
        className={`flex items-center pt-7 pb-6 ${
          collapsed ? 'flex-col gap-4 px-0' : 'justify-between px-6'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-rose">
            <span className="font-heading text-lg font-bold leading-none text-rose">N</span>
          </div>
          {!collapsed && (
            <span className="font-heading text-2xl font-semibold tracking-wide text-brown whitespace-nowrap">
              NAYHA
            </span>
          )}
        </div>
        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-muted transition-colors hover:bg-cream hover:text-brown cursor-pointer"
          aria-label={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
          title={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${collapsed ? 'px-3' : 'px-4'}`}>
        {sections.map((section, index) => (
          <div key={section.title} className={index > 0 ? 'mt-7' : ''}>
            {collapsed ? (
              index > 0 && <div className="mx-auto mb-4 h-px w-8 bg-gray-200" />
            ) : (
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.12em] text-muted-light">
                {section.title}
              </p>
            )}
            <div className="flex flex-col gap-1">
              {section.items.map((item) => (
                <SidebarNavItem
                  key={item.to}
                  icon={item.icon}
                  label={item.label}
                  to={item.to}
                  collapsed={collapsed}
                  badge={item.to === '/support' ? supportWaiting : undefined}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Current admin */}
      {user && (
        <div className={`p-3 ${collapsed ? '' : 'px-4 pb-4'}`}>
          <div
            className={`flex items-center gap-3 rounded-2xl bg-cream p-3 ${
              collapsed ? 'flex-col px-0 py-3' : ''
            }`}
          >
            <Avatar name={user.name} size="sm" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-brown">{user.name}</p>
                <p className="truncate text-xs text-muted">
                  {ROLE_LABEL[user.role] ?? user.role}
                </p>
              </div>
            )}
            <button
              onClick={logout}
              title="Se déconnecter"
              aria-label="Se déconnecter"
              className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white hover:text-rose cursor-pointer"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </motion.aside>
  );
}
