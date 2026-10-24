import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui';

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  moderator: 'Modérateur',
  viewer: 'Lecteur',
};

interface HeaderProps {
  isMobileNavOpen: boolean;
  onMenuClick: () => void;
}

/** Full-width top bar: mobile navigation, brand, and signed-in admin. */
export function Header({ isMobileNavOpen, onMenuClick }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="flex w-full min-w-0 max-w-full items-center justify-between rounded-[18px] border border-line bg-white px-4 py-3 shadow-card sm:px-6">
      <Link to="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
        <img
          src="/nayha-logo.png"
          alt="NAYHA"
          className="h-9 w-9 shrink-0 rounded-xl shadow-sm sm:h-10 sm:w-10"
        />
        <span className="whitespace-nowrap font-body text-base font-bold tracking-tight text-ink sm:text-[17px]">
          NAYHA <span className="text-rose">Admin</span>
        </span>
      </Link>

      <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
        {user && (
          <div className="hidden items-center gap-2 rounded-full border border-line bg-canvas/60 py-1 pl-1 pr-2 min-[420px]:flex sm:gap-2.5 sm:pr-4">
            <Avatar name={user.name} size="sm" />
            <div className="hidden text-left leading-tight sm:block">
              <p className="max-w-36 truncate text-[13px] font-semibold text-ink">{user.name}</p>
              <p className="text-[11px] font-semibold text-rose">
                {ROLE_LABEL[user.role] ?? user.role}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Ouvrir la navigation"
          aria-haspopup="dialog"
          aria-controls="mobile-admin-navigation"
          aria-expanded={isMobileNavOpen}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-ink-soft transition hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose lg:hidden"
        >
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="h-0.5 w-[18px] rounded-full bg-current" />
            <span className="h-0.5 w-[18px] rounded-full bg-current" />
            <span className="h-0.5 w-[18px] rounded-full bg-current" />
          </span>
        </button>
      </div>
    </header>
  );
}
