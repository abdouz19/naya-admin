import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/hooks/use-sidebar';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { PageContainer } from './PageContainer';

const routeTitles: Record<string, string> = {
  '/': 'Tableau de bord',
  '/utilisatrices': 'Utilisatrices',
  '/candidatures': 'Candidatures',
  '/ia': 'Intelligence artificielle',
  '/ateliers': 'Ateliers vidéo',
  '/communaute': 'Communauté',
  '/abonnements': 'Abonnements',
  '/reglages': 'Réglages',
};

export function AppLayout() {
  const { collapsed } = useSidebar();
  const location = useLocation();

  const title = routeTitles[location.pathname] ?? 'Nayha';

  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />

      <main
        className="flex-1 flex flex-col min-h-screen transition-all duration-300"
        style={{ marginLeft: collapsed ? 64 : 240 }}
      >
        <Header title={title} />

        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex-1"
          >
            <PageContainer>
              <Outlet />
            </PageContainer>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
