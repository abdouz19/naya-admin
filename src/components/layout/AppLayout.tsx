import { useCallback, useEffect, useState } from 'react';
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

/** Top bar and page shell, with a drawer for navigation on narrow screens. */
export function AppLayout() {
  const location = useLocation();
  const title = routeTitles[location.pathname] ?? 'NAYHA';
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const closeMobileNav = useCallback(() => setIsMobileNavOpen(false), []);

  useEffect(() => {
    closeMobileNav();
  }, [location.pathname, closeMobileNav]);

  return (
    <div className="flex min-h-screen flex-col gap-3 bg-canvas px-3 py-3 sm:gap-4 sm:px-5 sm:py-4">
      <Header
        isMobileNavOpen={isMobileNavOpen}
        onMenuClick={() => setIsMobileNavOpen(true)}
      />

      <div className="flex min-w-0 flex-1 gap-4">
        <Sidebar isMobileOpen={isMobileNavOpen} onMobileClose={closeMobileNav} />

        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="flex min-w-0 flex-col gap-3 sm:gap-4"
            >
              <h1 className="px-1 pt-1 text-2xl font-bold tracking-tight text-ink sm:text-[26px]">
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
