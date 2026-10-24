import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from '@/components/icons';
import { useAuth } from '@/context/AuthContext';

const inputClass =
  'w-full min-w-0 rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink placeholder:text-muted-light outline-none transition-colors focus:border-rose focus:ring-2 focus:ring-rose/15';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || '/';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Saisis ton adresse e-mail et ton mot de passe.');
      return;
    }

    setError(null);
    setLoading(true);
    const res = await login(email.trim(), password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'E-mail ou mot de passe incorrect.');
    }
  };

  return (
    <div className="flex min-h-dvh w-full min-w-0 max-w-full overflow-x-hidden bg-canvas p-2 sm:min-h-screen sm:p-4">
      <div className="flex min-h-[calc(100dvh-1rem)] w-full min-w-0 max-w-full overflow-hidden rounded-[24px] bg-white p-2 shadow-card sm:min-h-[calc(100vh-2rem)] sm:rounded-[28px] sm:p-3">
        {/* Visual */}
        <div className="relative hidden min-w-0 w-1/2 overflow-hidden rounded-[22px] lg:block">
          <img
            src="/login-visual.jpg"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brown/90 via-brown/35 to-transparent" />
          <div className="relative p-12">
            <h2 className="max-w-md text-[44px] font-semibold leading-[1.1] tracking-tight text-white">
              Chaque parcours mérite d’être accompagné.
            </h2>
            <p className="mt-4 max-w-sm text-base text-white/80">
              L’espace de l’équipe NAYHA pour suivre et soutenir les
              utilisatrices.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="flex w-full min-w-0 flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 lg:w-1/2 lg:flex-none">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full min-w-0 max-w-[440px]"
          >
            <img
              src="/nayha-logo.png"
              alt="NAYHA"
              className="h-16 w-16 rounded-2xl shadow-sm"
            />
            <h1 className="mt-8 text-[clamp(1.75rem,7vw,2rem)] font-semibold tracking-tight text-ink">
              Connexion à l’administration
            </h1>
            <p className="mt-2 text-base text-muted">
              Connecte-toi avec ton compte de l’équipe NAYHA.
            </p>

            <div className="my-8 h-px bg-line-light" />

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-danger-light px-4 py-3 text-sm text-danger">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm text-ink-soft"
                >
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="prenom@nayha.fr"
                  className={inputClass}
                  autoFocus
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm text-ink-soft"
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="••••••••"
                    className={`${inputClass} pr-12`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 text-muted transition-colors hover:text-ink"
                    aria-label={
                      showPassword
                        ? 'Masquer le mot de passe'
                        : 'Afficher le mot de passe'
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-14 w-full cursor-pointer rounded-3xl bg-rose text-base font-semibold text-white transition-colors hover:bg-rose-dark disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Accès réservé à l’équipe NAYHA.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
