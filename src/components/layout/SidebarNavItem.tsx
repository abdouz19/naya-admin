import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  collapsed: boolean;
}

export function SidebarNavItem({ icon: Icon, label, to, collapsed }: SidebarNavItemProps) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 px-4 py-2.5 rounded-r-lg transition-all duration-200',
          isActive
            ? 'bg-brown-light/20 text-white border-l-3 border-rose'
            : 'text-cream/70 hover:text-white hover:bg-white/5 border-l-3 border-transparent',
          collapsed ? 'justify-center px-0' : '',
        ].join(' ')
      }
    >
      <Icon size={20} className="shrink-0" />
      {!collapsed && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden">
          {label}
        </span>
      )}
    </NavLink>
  );
}
