import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Brain,
  PlayCircle,
  MessageSquare,
  CreditCard,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useSidebar } from '@/hooks/use-sidebar';
import { SidebarNavItem } from './SidebarNavItem';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Users, label: 'Utilisatrices', to: '/utilisatrices' },
  { icon: Briefcase, label: 'Candidatures', to: '/candidatures' },
  { icon: Brain, label: 'IA', to: '/ia' },
  { icon: PlayCircle, label: 'Ateliers', to: '/ateliers' },
  { icon: MessageSquare, label: 'Communauté', to: '/communaute' },
  { icon: CreditCard, label: 'Abonnements', to: '/abonnements' },
];

export function Sidebar() {
  const { collapsed, toggle } = useSidebar();

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
        {navItems.map((item) => (
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
        <SidebarNavItem
          icon={Settings}
          label="Réglages"
          to="/reglages"
          collapsed={collapsed}
        />

        {/* Collapse toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 px-4 py-2.5 rounded-r-lg text-cream/50 hover:text-white hover:bg-white/5 transition-all duration-200 cursor-pointer"
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
