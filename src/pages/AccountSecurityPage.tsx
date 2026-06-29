import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  Shield,
  Clock,
} from 'lucide-react';

export default function AccountSecurityPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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
            {t('settings')}
          </h1>

          <div />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-10 mb-6 bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-white shadow-2xl text-center"
        >
          <div className="flex flex-col items-center gap-4">

            <Shield className="w-16 h-16" />

            <h1 className="text-3xl font-bold">
              {t('accountSecurityTitle')}
            </h1>

            <p className="opacity-90 text-lg">
              {t('accountSecuritySubtitle')}
            </p>

          </div>
        </motion.div>

        {/* COMING SOON CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-3xl shadow p-10 text-center"
        >

          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary-100 dark:bg-primary-900">
              <Clock className="w-10 h-10 text-primary-600" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            {t('comingSoonTitle')}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('comingSoonSubtitle')}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-medium"
          >
            {t('back')}
          </button>

        </motion.div>

      </div>
    </div>
  );
}