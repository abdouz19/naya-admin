import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui';

const DEMO_ACCOUNTS = [
  {
    name: 'Meriem Boussaïd',
    email: 'meriem@nayha.fr',
    role: 'Super Admin',
  },
  {
    name: 'Abderraouf Zouaid',
    email: 'abderraouf@progix.dev',
    role: 'Administrateur',
  },
  {
    name: 'Sarah Benali',
    email: 'sarah@nayha.fr',
    role: 'Modératrice',
  },
];

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Veuillez saisir votre adresse e-mail et votre mot de passe.');
      return;
    }

    setError(null);
    setLoading(true);

    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Identifiants invalides');
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('nayha2026');
    setError(null);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4 py-12 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-rose/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="radius-lg border border-gray-200 bg-white p-8 shadow-card">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-rose flex items-center justify-center shadow-md mb-4">
              <span className="text-white font-heading text-2xl font-bold leading-none">N</span>
            </div>
            <h1 className="font-heading text-2xl font-semibold text-brown">
              NAYHA Administration
            </h1>
            <p className="text-sm text-muted mt-1">
              Connectez-vous pour gérer la plateforme et les utilisatrices
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-brown">
                Adresse e-mail
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nayha.fr"
                  required
                  className="w-full radius-sm border border-gray-300 bg-white pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-muted-light transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-brown">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full radius-sm border border-gray-300 bg-white pl-9 pr-10 py-2.5 text-sm text-ink placeholder:text-muted-light transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted hover:text-brown transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full justify-center py-2.5"
                icon={<ArrowRight size={16} />}
              >
                Se connecter
              </Button>
            </div>
          </form>

          {/* Demo Quick Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3 text-center">
              Comptes de démonstration
            </p>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-rose/5 hover:border-rose/30 transition-all text-left cursor-pointer group"
                >
                  <div>
                    <p className="text-xs font-medium text-brown group-hover:text-rose transition-colors">
                      {acc.name}
                    </p>
                    <p className="text-[11px] text-muted">{acc.email}</p>
                  </div>
                  <span className="text-[11px] font-medium text-muted px-2 py-0.5 bg-white rounded border border-gray-200">
                    {acc.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
          <ShieldCheck size={14} className="text-green" />
          <span>Espace sécurisé réservé à l'équipe NAYHA</span>
        </div>
      </motion.div>
    </div>
  );
}
