import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { motion } from 'framer-motion';
import { ACTIVE_WIRDS } from '../data/wirds';

// 👉 TYPE GLOBAL (MAKHOUZ + KHADIRIYA)
type WirdSection = typeof ACTIVE_WIRDS[number];

interface WirdCardProps {
  section: WirdSection;
  index: number;
}

export default function WirdCard({ section, index }: WirdCardProps) {
  const navigate = useNavigate();
  const { language } = useAppStore();

  // =========================
  // TITLE SAFE MULTI-LANG
  // =========================
  const name =
    language === 'ar'
      ? section.nameAr
      : language === 'en'
      ? section.nameEn
      : language === 'ms'
      ? section.nameEn
      : language === 'es'
      ? section.nameEn
      : language === 'tr'
      ? section.nameEn
      : language === 'fa'
      ? section.nameEn
      : section.nameFr;

  // =========================
  // DESCRIPTION SAFE MULTI-LANG
  // =========================
  const description =
    language === 'ar'
      ? section.descriptionAr
      : language === 'en'
      ? section.descriptionEn
      : language === 'ms'
      ? section.descriptionMs || section.descriptionEn
      : language === 'es'
      ? section.descriptionEs || section.descriptionEn
      : language === 'tr'
      ? section.descriptionTr || section.descriptionEn
      : language === 'fa'
      ? section.descriptionFa || section.descriptionFr
      : section.descriptionFr;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => navigate(`/wird/${section.id}`)}
      className="wird-card group no-select"
    >
      {/* IMAGE */}
      <div className="relative h-28 sm:h-36 md:h-44 overflow-hidden">
        <img
          src={section.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-40`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* CONTENT */}
      <div className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm font-display font-semibold text-primary-700 dark:text-primary-400 truncate">
          {name}
        </p>

        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2 line-clamp-2">
          {description}
        </p>

        {/* REPETITIONS */}
        {section.litanies?.[0]?.total > 1 && (
          <p className="text-[10px] text-primary-500 mt-1">
            ×{section.litanies[0].total}
          </p>
        )}
      </div>
    </motion.div>
  );
}