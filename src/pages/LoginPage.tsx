import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Connexion Email / Mot de passe
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');

    if (!email || !password) {
      setError(t('fillAllFields'));
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user) {
      navigate('/');
      }
      
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  // Connexion Google
  const handleGoogleLogin = async () => {
  if (loading) return;

  setLoading(true);
  setError('');

  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  } catch (err) {
    console.error(err);
    setError('Impossible de se connecter avec Google.');
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen min-h-[100dvh] bg-cream dark:bg-gray-950 bg-islamic-pattern flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8"
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="font-arabic text-2xl text-primary-800 dark:text-primary-300 mb-1">
            بِسۡمِ ٱللَّهِ
          </h1>

          <h2 className="font-display text-xl font-semibold text-gray-800 dark:text-gray-200">
            {t('appName')}
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('loginSubtitle')}
          </p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                     bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700
                     hover:bg-gray-50 dark:hover:bg-gray-750 transition-all
                     text-gray-700 dark:text-gray-200 font-medium text-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>

          {t('loginWithGoogle')}
        </button>

        {/* Admin */}
        <div className="mt-4 text-center">
          <a
            href="/superadmin/login"
            className="text-xs text-gray-400 hover:text-blue-600"
          >
            Accès Administrateur
          </a>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400">{t('or')}</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Formulaire Email */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700
                         text-gray-800 dark:text-gray-200"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              className="w-full pl-10 pr-12 py-3 rounded-xl bg-gray-50 dark:bg-gray-800
                         border border-gray-200 dark:border-gray-700
                         text-gray-800 dark:text-gray-200"
            />

            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPwd ? (
                <EyeOff className="w-4 h-4 text-gray-400" />
              ) : (
                <Eye className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700
                       text-white font-semibold"
          >
            {loading ? 'Connexion...' : t('login')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          {t('noAccount')}{' '}
          <Link
            to="/register"
            className="text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            {t('register')}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}