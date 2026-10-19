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
          'group relative flex items-center gap-3 rounded-xl py-2.5 transition-colors duration-200',
          collapsed ? 'justify-center px-0' : 'px-3',
          isActive ? 'bg-white text-brown' : 'text-muted hover:text-brown hover:bg-white/60',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {/* Accent bar on the sidebar's edge for the current page. */}
          {isActive && (
            <span className="absolute -left-4 top-1/2 h-8 w-1.5 -translate-y-1/2 rounded-r-full bg-rose" />
          )}
          <Icon
            size={20}
            strokeWidth={isActive ? 2.4 : 1.8}
            className={`shrink-0 ${isActive ? 'text-rose' : ''}`}
          />
          {!collapsed && (
            <span
              className={`text-[15px] whitespace-nowrap overflow-hidden ${
                isActive ? 'font-semibold' : 'font-normal'
              }`}
            >
              {label}
            </span>
          )}
          {showBadge && !collapsed && (
            <span className="ml-auto min-w-6 rounded-md bg-brown px-1.5 py-1 text-center text-[11px] font-semibold leading-none text-cream">
              {badgeText}
            </span>
          )}
          {showBadge && collapsed && (
            <span
              className="absolute right-3 top-1.5 h-2 w-2 rounded-full bg-rose"
              aria-label={`${badgeText} en attente`}
            />
          )}
        </>
      )}
    </NavLink>
  );
}
