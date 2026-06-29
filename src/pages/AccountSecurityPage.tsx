import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import {
  ArrowLeft,
  Shield,
  Mail,
  Lock,
  RefreshCcw,
  LogOut,
  Trash2,
} from 'lucide-react';

export default function AccountSecurityPage() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  // ✅ FIX: synchronisation langue
  useEffect(() => {
    const savedLang = localStorage.getItem('lang');

    if (savedLang) {
      i18n.changeLanguage(savedLang);
    } else {
      i18n.changeLanguage('fr'); // base FR obligatoire
      localStorage.setItem('lang', 'fr');
    }
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleChangeEmail = async () => {
    if (!email) {
      alert(t('emailEmptyError'));
      return;
    }

    try {
      setLoadingEmail(true);

      const { error } =
        await supabase.auth.updateUser({
          email,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert(t('emailSuccess'));
      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.length < 6) {
      alert(t('passwordTooShortError'));
      return;
    }

    try {
      setLoadingPassword(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert(t('passwordSuccess'));
      setPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleResendVerification = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      alert(t('noEmailError'));
      return;
    }

    const { error } =
      await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert(t('verificationSent'));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>

          <h1 className="font-bold text-lg">
            {t('security')}
          </h1>

          <div />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-8 mb-6 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white shadow-2xl"
        >
          <div className="flex items-center gap-4">

            <Shield className="w-14 h-14" />

            <div>
              <h1 className="text-3xl font-bold">
                {t('accountSecurityTitle')}
              </h1>

              <p className="opacity-90">
                {t('accountSecuritySubtitle')}
              </p>
            </div>

          </div>
        </motion.div>

        {/* EMAIL */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-primary-600" />
            <h2 className="font-bold text-lg">
              {t('changeEmail')}
            </h2>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholderNew')}
            className="w-full border rounded-2xl px-4 py-3 mb-4 dark:bg-gray-800"
          />

          <button
            onClick={handleChangeEmail}
            disabled={loadingEmail}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-2xl"
          >
            {loadingEmail ? 'Modification...' : t('changeEmail')}
          </button>
        </div>

        {/* PASSWORD */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-primary-600" />
            <h2 className="font-bold text-lg">
              {t('changePassword')}
            </h2>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholderNew')}
            className="w-full border rounded-2xl px-4 py-3 mb-4 dark:bg-gray-800"
          />

          <button
            onClick={handleChangePassword}
            disabled={loadingPassword}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-2xl"
          >
            {loadingPassword ? 'Modification...' : t('changePassword')}
          </button>
        </div>

        {/* VERIFICATION */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="w-6 h-6 text-primary-600" />
            <h2 className="font-bold text-lg">
              {t('resendVerification')}
            </h2>
          </div>

          <button
            onClick={handleResendVerification}
            className="w-full border-2 border-primary-600 text-primary-600 py-3 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            {t('resendVerification')}
          </button>
        </div>

        {/* LOGOUT */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">
            <LogOut className="w-6 h-6 text-orange-500" />
            <h2 className="font-bold text-lg">
              {t('logoutBtn')}
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl"
          >
            {t('logoutBtn')}
          </button>
        </div>

        {/* DANGER ZONE */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-3xl p-6">

          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />

            <h2 className="font-bold text-lg text-red-600">
              {t('dangerZone')}
            </h2>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('deleteWarning')}
          </p>

          <button
            disabled
            className="w-full bg-red-600 text-white py-3 rounded-2xl opacity-50"
          >
            {t('deleteAccount')}
          </button>

        </div>

      </div>
    </div>
  );
}