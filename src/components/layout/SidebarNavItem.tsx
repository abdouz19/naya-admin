import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  collapsed: boolean;
  /** Optional counter shown next to the label (hidden when 0). */
  badge?: number;
}

export function SidebarNavItem({ icon: Icon, label, to, collapsed, badge }: SidebarNavItemProps) {
  const showBadge = typeof badge === 'number' && badge > 0;
  const badgeText = showBadge && badge > 99 ? '99+' : String(badge ?? '');

  return (
    <NavLink
      to={to}
      end={to === '/'}
      title={collapsed ? label : undefined}
      className={({ isActive }) =>
        [
          'relative flex items-center gap-3 px-4 py-2.5 rounded-r-lg transition-all duration-200',
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
      {showBadge && !collapsed && (
        <span className="ml-auto min-w-5 rounded-full bg-rose px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none text-white">
          {badgeText}
        </span>
      )}
      {showBadge && collapsed && (
        <span className="absolute right-2.5 top-1.5 h-2 w-2 rounded-full bg-rose" aria-label={`${badgeText} en attente`} />
      )}
    </NavLink>
  );
}
