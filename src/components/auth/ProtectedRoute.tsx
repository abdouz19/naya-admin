import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-rose flex items-center justify-center animate-pulse">
            <span className="text-white font-heading text-xl font-bold leading-none">N</span>
          </div>
          <Spinner size="lg" />
          <p className="text-sm text-muted">Vérification de la session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
