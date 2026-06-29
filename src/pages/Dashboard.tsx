import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import WirdCard from '../components/WirdCard';
import { ACTIVE_WIRDS } from '../data/wirds';
import { motion, AnimatePresence } from 'framer-motion';
import { useFavorites } from '../hooks/useFavorites';
import {
  BookOpen,
  Info,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { favorites } = useFavorites();

  const [showConditions, setShowConditions] = useState(false);

  return (
    <div className="min-h-screen min-h-[100dvh] bg-cream dark:bg-gray-950 bg-islamic-pattern">

      <Header />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pb-24">

        {/* HERO (FIXED COMMENT) */}
        {/*
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            relative overflow-hidden
            rounded-3xl
            mt-4
            p-6
            bg-gradient-to-br
            from-primary-700
            via-primary-800
            to-primary-900
            text-white
            shadow-2xl
          "
        >
          <div className="absolute inset-0 opacity-10 bg-islamic-pattern" />

          <div className="relative z-10 text-center">

            <p className="font-arabic text-3xl sm:text-4xl mb-4 leading-loose">
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
            </p>

            <h1 className="text-2xl font-bold">
              {t('appName')}
            </h1>

            <p className="mt-2 text-sm opacity-90">
              Lecture quotidienne • Wirds • Audios • E-books
            </p>

          </div>
        </motion.div>
        */}

        {/* CONDITIONS */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          onClick={() => setShowConditions(!showConditions)}
          className="
            w-full
            mt-6
            flex
            items-center
            justify-between
            rounded-2xl
            p-4
            bg-primary-50
            dark:bg-primary-900/20
            border
            border-primary-100
            dark:border-primary-800
          "
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-primary-600" />
            <span className="font-medium">
              {t('conditions')}
            </span>
          </div>

          <ChevronRight
            className={`w-5 h-5 transition-transform ${
              showConditions ? 'rotate-90' : ''
            }`}
          />
        </motion.button>

        <AnimatePresence>
          {showConditions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 mt-3 shadow">

                <div className="flex gap-3">
                  <BookOpen className="w-5 h-5 text-primary-600 mt-1" />

                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {t('conditionsText')}
                  </p>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MES WIRDS */}
        <div className="mt-8">

          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {t('wirdLazim')}
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

            {ACTIVE_WIRDS.slice(0, 6).map((section: any, index: number) => {

              const isFavorite = favorites.includes(String(section.id));

              return (
                <div key={section.id} className="relative">

                  <WirdCard
                    section={section}
                    index={index}
                  />

                </div>
              );
            })}

          </div>

        </div>

      </main>
    </div>
  );
}