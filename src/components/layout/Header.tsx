import { useAuth } from '@/context/AuthContext';
import { Avatar, Badge } from '@/components/ui';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const ROLE_BADGE: Record<string, 'rose' | 'gold' | 'green' | 'muted'> = {
  super_admin: 'rose',
  admin: 'gold',
  moderator: 'green',
  viewer: 'muted',
};

const ROLE_LABEL: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  moderator: 'Modérateur',
  viewer: 'Lecteur',
};

export function Header({ title, subtitle }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-4 z-40 mx-4 mt-4 flex items-center justify-between rounded-3xl bg-cream/95 px-7 py-4 backdrop-blur-sm">
      <div>
        <h1 className="font-heading text-3xl text-brown font-semibold">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <Badge variant={ROLE_BADGE[user.role] || 'muted'}>
            {ROLE_LABEL[user.role] || user.role}
          </Badge>
          <div className="flex items-center gap-2.5 pl-3 border-l border-gray-200">
            <Avatar name={user.name} size="sm" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-brown">{user.name}</p>
              <p className="text-[11px] text-muted">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
