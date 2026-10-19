import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
  /** Optional counter shown next to the label (hidden when 0). */
  badge?: number;
}

export function SidebarNavItem({ icon: Icon, label, to, badge }: SidebarNavItemProps) {
  const showBadge = typeof badge === 'number' && badge > 0;
  const badgeText = showBadge && badge > 99 ? '99+' : String(badge ?? '');

  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          'flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-[13.5px] transition-all duration-150',
          isActive
            ? 'bg-rose font-semibold text-white shadow-[0_4px_14px_rgba(196,133,122,0.35)]'
            : 'font-medium text-ink-soft hover:bg-canvas hover:text-ink',
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} className="shrink-0" />
          <span className="truncate">{label}</span>
          {showBadge && (
            <span
              className={`ml-auto rounded-full px-2 py-px text-[10.5px] font-semibold ${
                isActive ? 'bg-white/25 text-white' : 'bg-rose/15 text-rose-dark'
              }`}
            >
              {badgeText}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
