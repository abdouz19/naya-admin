import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui';

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  moderator: 'Modérateur',
  viewer: 'Lecteur',
};

/** Full-width top bar: brand on the left, signed-in admin on the right. */
export function Header() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between rounded-[18px] border border-line bg-white px-6 py-3 shadow-card">
      <Link to="/" className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brown shadow-sm">
          <span className="font-heading text-lg font-bold leading-none text-rose-light">N</span>
        </div>
        <span className="font-body text-[17px] font-bold tracking-tight text-ink">
          NAYHA <span className="text-rose">Admin</span>
        </span>
      </Link>

      {user && (
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-canvas/60 py-1 pl-1 pr-4">
          <Avatar name={user.name} size="sm" />
          <div className="hidden text-left leading-tight sm:block">
            <p className="text-[13px] font-semibold text-ink">{user.name}</p>
            <p className="text-[11px] font-semibold text-rose">
              {ROLE_LABEL[user.role] ?? user.role}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
