import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/appStore';
import { ACTIVE_WIRDS } from "../data/wirds";
import Sibha from '../components/Sibha';
import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../hooks/useFavorites';

export default function WirdReader() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language, resetAllCounters } = useAppStore();

  // ── Index global sur les 14 wirds ───────────────────────────────────────
  const [currentWirdIndex, setCurrentWirdIndex] = useState(0);
  const [currentLitanyIndex, setCurrentLitanyIndex] = useState(0);

  const section = ACTIVE_WIRDS[currentWirdIndex];

  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(String(section.id));

  // ── Swipe ────────────────────────────────────────────────────────────────
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const totalWirds   = ACTIVE_WIRDS.length;
  const isFirstWird  = currentWirdIndex === 0;
  const isLastWird   = currentWirdIndex === totalWirds - 1;

  const litany = section.litanies[currentLitanyIndex] ?? section.litanies[0];

  // ── Navigation entre wirds ───────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (currentWirdIndex < totalWirds - 1) {
      setCurrentWirdIndex((i) => i + 1);
      setCurrentLitanyIndex(0);
    }
  }, [currentWirdIndex, totalWirds]);

  const goPrev = useCallback(() => {
    if (currentWirdIndex > 0) {
      setCurrentWirdIndex((i) => i - 1);
      setCurrentLitanyIndex(0);
    }
  }, [currentWirdIndex]);

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
  <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">

    <button
      onClick={() => navigate(-1)}
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
        onClick={() => toggleFavorite(String(section.id))}
        className="p-2 rounded-lg bg-white/15 hover:bg-white/25 transition"
      >
        <Heart
          className={`w-4 h-4 ${
            isFavorite ? 'fill-red-500 text-red-500' : ''
          }`}
        />
      </button>

      <button
        onClick={() => resetAllCounters(section.id)}
        className="p-2 rounded-lg bg-white/15 hover:bg-white/25"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>

  </div>
</header>

{/* ── Points de progression ── */}
{section.litanies.length > 1 && (
  <div className="flex justify-center gap-2 py-4 flex-shrink-0">
    {section.litanies.map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentLitanyIndex(i)}
        className={`rounded-full transition-all duration-300 ${
          i === currentLitanyIndex
            ? 'w-4 h-2.5 bg-primary-600'
            : 'w-2.5 h-2.5 bg-gray-300 dark:bg-gray-700'
        }`}
      />
    ))}
  </div>
)}

{/* ── Contenu principal ── */}
<main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 pt-2 flex flex-col overflow-hidden min-h-0">
  <AnimatePresence mode="wait">
    <motion.div
      key={currentWirdIndex}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.22 }}
      className="flex-1 flex flex-col overflow-hidden min-h-0"
    >
      {/* Zone texte scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0 flex flex-col gap-4 pt-1 pb-4">

        {/* Nom de la litanie */}
        <div className="text-center px-2">
          <h2 className="font-arabic text-base sm:text-lg text-primary-800 dark:text-primary-300 leading-relaxed">
            {litany.arName}
          </h2>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            {litanyName}
          </p>
        </div>

        {/* Texte arabe */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
          <p className="arabic-text text-lg sm:text-xl leading-[2.4] text-gray-900 dark:text-gray-100 text-center">
            {litany.arContent}
          </p>
        </div>

        {/* Translittération */}
        {litany.transcription && (
          <div className="px-1">
            <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1 font-medium">
              {t('transliteration')}
            </p>
            <p className="transliteration-text text-xs leading-snug">
              {litany.transcription}
            </p>
          </div>
        )}

        {/* Traduction */}
        <div className="px-1">
          <p className="text-[9px] uppercase tracking-wider text-gray-400 mb-1 font-medium">
            {t('translation')}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">
            {translation}
          </p>
        </div>

      </div>

      {/* Sibha */}
      {litany.total > 1 && (
        <div className="flex-shrink-0 pt-3 border-t border-gray-100 dark:border-gray-800/50">
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

      {/* ── Footer Précédent / Compteur / Suivant ── */}
      <footer className="flex-shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 mb-16">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

          <button
            onClick={goPrev}
            disabled={isFirstWird}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                        transition-all active:scale-95 touch-target
                        ${isFirstWird
                          ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow hover:shadow-md'
                        }`}
          >
            <ChevronLeft className="w-4 h-4" />
            {t('previous')}
          </button>

          {/* Compteur 1 / 14 */}
          <span className="text-xs text-gray-400 dark:text-gray-600 font-medium tabular-nums">
            {currentWirdIndex + 1} / {totalWirds}
          </span>

          <button
            onClick={isLastWird ? () => navigate('/') : goNext}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
                        transition-all active:scale-95 touch-target text-white shadow hover:shadow-md
                        ${isLastWird
                          ? 'bg-gold-400 hover:bg-gold-500'
                          : 'bg-primary-600 hover:bg-primary-700'
                        }`}
          >
            {isLastWird ? t('completed') : t('next')}
            {!isLastWird && <ChevronRight className="w-4 h-4" />}
          </button>

        </div>
      </footer>

    </div>
  );
}