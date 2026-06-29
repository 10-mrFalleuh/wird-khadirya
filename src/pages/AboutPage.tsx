import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Mail, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen min-h-[100dvh] bg-cream dark:bg-gray-950 bg-islamic-pattern pb-24">
      {/* Header */}
      <div className="glass-header text-white safe-top sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white/15 active:bg-white/25 touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-display font-semibold text-lg">{t("about")}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div
            className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700
                         shadow-lg flex items-center justify-center"
          >
            <span className="font-arabic text-3xl text-white">وِرد</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-gray-800 dark:text-gray-200">
            {t("appName")}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            v1.0.0
          </p>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
        >
          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
            {t("aboutDescription")}
          </p>
        </motion.div>

        {/* Developer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
        >
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-500" />
            {t("developedBy")}
          </h3>
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-5 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t("supervisedBy")}
            </p>

            <p className="font-display text-xl font-bold text-gold-600 dark:text-gold-400 mt-2">
              Cheikh Ahmadou Bamba Mbacké
            </p>

            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              رضي الله عنه
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
              {t("developerLabel")}
            </p>

            <p className="font-bold text-lg text-primary-700 dark:text-primary-300">
              Cercle des Codeurs Mourides
            </p>
          </div>
        </motion.div>

        {/* Contributions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5"
        >
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary-500" />
            {t("contributionsTitle")}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {t("contributionsText")}
          </p>
        </motion.div>

        {/* Tariqa Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-5 text-white text-center"
        >
          <p className="font-arabic text-xl mb-2">الطريقة المريدية</p>
          <p className="text-sm opacity-90 leading-relaxed">
            {t("tariqaInfo")}
          </p>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="font-arabic text-sm text-gray-400 dark:text-gray-600">
            سُبْحَانَ ربّكَ ربِّ العِزّةِ عمَّا يَصِفُونَ
          </p>
          <p className="text-[11px] text-gray-300 dark:text-gray-700 mt-1">
            © 2026 Cercle des Codeurs Mourides — Wird Makhouz Mouridiya
          </p>
        </div>
      </div>
    </div>
  );
}
