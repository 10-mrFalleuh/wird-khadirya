import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AudioPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-h-[100dvh] bg-cream dark:bg-gray-950 bg-islamic-pattern pb-24">
      {/* Header */}
      <div className="glass-header text-white safe-top sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white/15 active:bg-white/25 touch-target">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold text-lg">{t('audio')}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900/20
                         flex items-center justify-center">
            <Volume2 className="w-12 h-12 text-primary-400 dark:text-primary-500" />
          </div>
          <h2 className="font-display text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
            {t('audioComingSoon')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
            {t('audioComingSoonDesc')}
          </p>

          {/* Preview cards */}
          <div className="mt-8 space-y-3 max-w-sm mx-auto">
            {['Mawahibu Nafi', 'Assalamu Alayka', 'Sindidi', 'Jawartu'].map((name, i) => (
              <motion.div key={name}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800
                           p-3 flex items-center gap-3 opacity-50"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <VolumeX className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600">{t('audioNotAvailable')}</p>
                </div>
                <div className="w-8 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
