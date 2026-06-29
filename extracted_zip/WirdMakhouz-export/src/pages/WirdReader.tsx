import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/appStore';
import { wirdSections } from '../data/litanies';
import Sibha from '../components/Sibha';
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

export default function WirdReader() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, resetAllCounters } = useAppStore();


const section = wirdSections.find(
  (s) => s.id === Number(id)
);

const { favorites, toggleFavorite } =
  useFavorites();

const isFavorite =
  section
    ? favorites.includes(String(section.id))
    : false;

  const [currentIndex, setCurrentIndex] = useState(0);

  // ── Swipe ────────────────────────────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();   // swipe gauche → suivant
      else goPrev();             // swipe droit  → précédent
    }
    touchStartX.current = null;
  };

  // ── Guards ───────────────────────────────────────────────────────────────
  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-gray-950">
        <p className="text-gray-500">Wird introuvable</p>
      </div>
    );
  }

  if (section.litanies.length === 0) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-950 flex flex-col">
        <header className="glass-header text-white safe-top sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center">
            <button onClick={() => navigate('/')} className="touch-target">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <p className="font-arabic text-base flex-1 text-center">{section.nameAr}</p>
            <div className="w-8" />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
              <span className="text-4xl">⏳</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t('comingSoon')}</h2>
            <p className="text-gray-500 text-sm mt-4">En cours de développement</p>
          </div>
        </div>
      </div>
    );
  }

  const litany   = section.litanies[currentIndex];
  const total    = section.litanies.length;
  const isFirst  = currentIndex === 0;
  const isLast   = currentIndex === total - 1;

  // ── Navigation ───────────────────────────────────────────────────────────
  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < total - 1 ? i + 1 : i));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  // ── Localisation ─────────────────────────────────────────────────────────
  const sectionName =
    language === 'ar' ? section.nameAr
    : language === 'en' ? section.nameEn
    : section.nameFr;

  const litanyName =
    language === 'ar' ? litany.arName
    : language === 'en' ? litany.enName
    : litany.frName;

  const translation =
    language === 'ar' ? litany.arContent
    : language === 'en' ? litany.enContent
    : language === 'ms' ? (litany.msContent || litany.frContent)
    : language === 'es' ? (litany.esContent || litany.frContent)
    : language === 'tr' ? (litany.trContent || litany.frContent)
    : language === 'fa' ? (litany.faContent || litany.frContent)
    : litany.frContent;

  return (
    <div
      className="h-screen h-[100dvh] bg-cream dark:bg-gray-950 flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* ── Header ── */}
     <header className="glass-header text-white safe-top z-50 flex-shrink-0">
  <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between">

    <button
      onClick={() => navigate('/wirds')}
      className="flex items-center gap-1 text-sm"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{t('back')}</span>
    </button>

    <div className="text-center flex-1 mx-4">
      <p className="font-arabic text-sm sm:text-base">
        {section.nameAr}
      </p>

      <p className="text-[10px] opacity-75 truncate">
        {sectionName}
      </p>
    </div>

    <div className="flex items-center gap-2">

      <button
        onClick={() =>
          toggleFavorite(String(section.id))
        }
        className="
          p-2
          rounded-lg
          bg-white/15
          hover:bg-white/25
          transition
        "
      >
        <Heart
          className={`w-4 h-4 ${
            isFavorite
              ? 'fill-red-500 text-red-500'
              : ''
          }`}
        />
      </button>

      <button
        onClick={() =>
          resetAllCounters(section.id)
        }
        className="
          p-2
          rounded-lg
          bg-white/15
          hover:bg-white/25
        "
      >
        <RotateCcw className="w-4 h-4" />
      </button>

    </div>

  </div>
</header>

      {/* ── Points de progression ── */}
      <div className="flex justify-center gap-2 py-3 flex-shrink-0">
        {section.litanies.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-4 h-2.5 bg-primary-600'
                : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* ── Contenu principal ── */}
      {/*
        Layout en 2 zones fixes :
        - Zone texte (flex-1 + overflow-y-auto) : scroll si contenu long
        - Zone Sibha (flex-shrink-0)            : toujours visible au-dessus du footer
      */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 flex flex-col overflow-hidden min-h-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22 }}
            className="flex-1 flex flex-col overflow-hidden min-h-0"
          >
            {/* Zone texte — scrollable indépendamment */}
            <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-3 pb-2">
              {/* Nom de la litanie */}
              <div className="text-center">
                <h2 className="font-arabic text-base sm:text-lg text-primary-800 dark:text-primary-300">
                  {litany.arName}
                </h2>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{litanyName}</p>
              </div>

              {/* Texte arabe */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
                <p className="arabic-text text-lg sm:text-xl leading-[2.4] text-gray-900 dark:text-gray-100 text-center">
                  {litany.arContent}
                </p>
              </div>

              {/* Translittération */}
              {litany.transcription && (
                <div className="px-1">
                  <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5 font-medium">
                    {t('transliteration')}
                  </p>
                  <p className="transliteration-text text-xs leading-snug">{litany.transcription}</p>
                </div>
              )}

              {/* Traduction */}
              <div className="px-1">
                <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-0.5 font-medium">
                  {t('translation')}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{translation}</p>
              </div>
            </div>

            {/* Sibha — toujours ancré au-dessus du footer, jamais caché */}
            {litany.total > 1 && (
              <div className="flex-shrink-0 pt-2 border-t border-gray-100 dark:border-gray-800/50">
                <Sibha
                  wirdId={section.id}
                  litanyId={litany.id}
                  target={litany.total}
                  onComplete={goNext}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Boutons précédent / suivant ── */}
      {/* mb-16 pour ne pas être masqué par la BottomNav (h-16) */}
      <footer className="flex-shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 mb-16">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <button
            onClick={goPrev}
            disabled={isFirst}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                        transition-all active:scale-95 touch-target
                        ${isFirst
                          ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow hover:shadow-md'
                        }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t('previous')}
          </button>

          {/* Compteur central */}
          <span className="text-xs text-gray-400 dark:text-gray-600 font-medium tabular-nums">
            {currentIndex + 1} / {total}
          </span>

          <button
            onClick={isLast ? () => navigate('/') : goNext}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                        transition-all active:scale-95 touch-target text-white shadow hover:shadow-md
                        ${isLast ? 'bg-gold-400 hover:bg-gold-500' : 'bg-primary-600 hover:bg-primary-700'}`}
          >
            {isLast ? t('completed') : t('next')}
            {!isLast && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </footer>
    </div>
  );
}
