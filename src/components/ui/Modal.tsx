import { type ReactNode, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
  children: ReactNode;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, duration: 0.35, bounce: 0.15 },
  },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.2 } },
};

export function Modal({ open, onClose, title, className, children }: ModalProps) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal
            className={cn(
              'relative z-10 w-full radius-lg bg-white p-6 shadow-modal',
              !className?.includes('max-w-') && 'max-w-md',
              className,
            )}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            {title && (
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold text-brown">
                  {title}
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-1 text-muted transition-colors hover:bg-beige hover:text-brown"
                  aria-label="Fermer"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            {/* Close button when no title */}
            {!title && (
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full p-1 text-muted transition-colors hover:bg-beige hover:text-brown"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
