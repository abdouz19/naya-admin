import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  PlayCircle,
  BookOpen,
  MessageSquare,
  CreditCard,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui';
import { SidebarNavItem } from './SidebarNavItem';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/', perm: 'dashboard' },
  { icon: Users, label: 'Utilisatrices', to: '/utilisatrices', perm: 'users_view' },
  { icon: Briefcase, label: 'Candidatures', to: '/candidatures', perm: 'candidatures_view' },
  { icon: PlayCircle, label: 'Ateliers', to: '/ateliers', perm: 'ateliers_view' },
  { icon: BookOpen, label: 'Blog & Conseils', to: '/blog', perm: 'community_view' },
  { icon: MessageSquare, label: 'Communauté', to: '/communaute', perm: 'community_view' },
  { icon: CreditCard, label: 'Abonnements', to: '/abonnements', perm: 'subscriptions_view' },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();
  const { user, logout, permissions } = useAuth();

  const visibleNavItems = navItems.filter((item) => {
    if (!item.perm) return true;
    if (permissions && typeof permissions[item.perm] === 'boolean') {
      return permissions[item.perm];
    }
    return true;
  });

  const canViewSettings =
    !permissions ||
    typeof permissions.settings_view !== 'boolean' ||
    permissions.settings_view;

  return (
    <motion.aside
      className="fixed left-0 top-0 h-screen bg-brown flex flex-col z-50 overflow-hidden"
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-9 h-9 rounded-full bg-rose flex items-center justify-center shrink-0">
          <span className="text-white font-heading text-lg font-bold leading-none">
            N
          </span>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-heading text-xl text-cream font-semibold tracking-wide whitespace-nowrap"
          >
            NAYHA
          </motion.span>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-white/10" />

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
        {visibleNavItems.map((item) => (
          <SidebarNavItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            collapsed={collapsed}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-4 flex flex-col gap-1">
        {/* Divider */}
        <div className="mx-2 mb-2 border-t border-white/10" />

        {/* Settings */}
        {canViewSettings && (
          <SidebarNavItem
            icon={Settings}
            label="Réglages"
            to="/reglages"
            collapsed={collapsed}
          />
        )}

        {/* Current user & logout */}
        {user && (
          <div
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/5 mx-1 mb-1 ${
              collapsed ? 'justify-center px-0' : ''
            }`}
          >
            <Avatar name={user.name} size="sm" />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-cream truncate">
                  {user.name}
                </p>
                <p className="text-[10px] text-cream/50 capitalize truncate">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
            )}
            <button
              onClick={logout}
              title="Se déconnecter"
              className="text-cream/50 hover:text-rose transition-colors cursor-pointer p-1"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-4 py-2 rounded-r-lg text-cream/50 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
          style={collapsed ? { justifyContent: 'center', paddingInline: 0 } : undefined}
          aria-label={collapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
          {!collapsed && (
            <span className="text-sm font-medium whitespace-nowrap">Réduire</span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
