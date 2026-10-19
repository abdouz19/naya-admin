import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const routeTitles: Record<string, string> = {
  '/': 'Tableau de bord',
  '/utilisatrices': 'Utilisatrices',
  '/candidatures': 'Candidatures',
  '/ia': 'Intelligence artificielle',
  '/ateliers': 'Ateliers vidéo',
  '/blog': 'Blog & Conseils',
  '/communaute': 'Communauté',
  '/support': 'Support',
  '/abonnements': 'Abonnements',
  '/reglages': 'Réglages',
};

/** Top bar, then the sidebar and the page side by side, on a soft canvas. */
export function AppLayout() {
  const location = useLocation();
  const title = routeTitles[location.pathname] ?? 'NAYHA';

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-canvas px-5 py-4">
      <Header />

      <div className="flex flex-1 gap-4">
        <Sidebar />

        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex flex-col gap-4"
            >
              <h1 className="px-1 pt-1 font-body text-[26px] font-bold tracking-tight text-ink">
                {title}
              </h1>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
