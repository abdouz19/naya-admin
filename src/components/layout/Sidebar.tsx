import { useEffect, useRef } from 'react';
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
  X,
  type LucideIcon,
} from '@/components/icons';
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

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const { user, token, logout, permissions } = useAuth();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDialogRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    if (!isMobileOpen) return;

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const desktopBreakpoint = window.matchMedia('(min-width: 64rem)');
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onMobileClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const focusable = mobileDialogRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const focusIsOutsideDialog = !mobileDialogRef.current?.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === first || focusIsOutsideDialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || focusIsOutsideDialog)) {
        event.preventDefault();
        first.focus();
      }
    };
    const closeOnDesktop = () => {
      if (desktopBreakpoint.matches) onMobileClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    desktopBreakpoint.addEventListener('change', closeOnDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      desktopBreakpoint.removeEventListener('change', closeOnDesktop);
      if (previouslyFocused instanceof HTMLElement && !desktopBreakpoint.matches) {
        previouslyFocused.focus();
      }
    };
  }, [isMobileOpen, onMobileClose]);

  const renderNavigation = (onNavigate?: () => void) => (
    <>
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
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <>
      <aside className="sticky top-4 hidden h-[calc(100dvh-104px)] w-[265px] shrink-0 flex-col justify-between rounded-[18px] border border-line bg-white px-3.5 py-5 shadow-card lg:flex">
        <nav aria-label="Navigation principale" className="min-h-0 flex-1 overflow-y-auto">
          {renderNavigation()}
        </nav>

        <button
          onClick={logout}
          className="mt-3 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-3.5 py-2.5 text-left text-[13px] font-medium text-rose-dark transition-all hover:border-rose/20 hover:bg-rose/10"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </aside>

      {isMobileOpen && (
        <>
          <button
            type="button"
            aria-label="Fermer la navigation"
            onClick={onMobileClose}
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default bg-ink/40 backdrop-blur-[1px] lg:hidden"
          />
          <aside
            id="mobile-admin-navigation"
            ref={mobileDialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-admin-navigation-title"
            className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(86vw,320px)] flex-col rounded-r-[18px] border-r border-line bg-white px-3.5 py-5 shadow-modal lg:hidden"
          >
            <div className="mb-4 flex items-center justify-between px-2">
              <h2 id="mobile-admin-navigation-title" className="text-base font-semibold">
                Navigation
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onMobileClose}
                aria-label="Fermer la navigation"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose"
              >
                <X size={20} />
              </button>
            </div>

            <nav aria-label="Navigation principale" className="min-h-0 flex-1 overflow-y-auto">
              {renderNavigation(onMobileClose)}
            </nav>

            <button
              onClick={() => {
                onMobileClose();
                logout();
              }}
              className="mt-3 flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-transparent px-3.5 py-2.5 text-left text-[13px] font-medium text-rose-dark transition-all hover:border-rose/20 hover:bg-rose/10"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </aside>
        </>
      )}
    </>
  );
}
