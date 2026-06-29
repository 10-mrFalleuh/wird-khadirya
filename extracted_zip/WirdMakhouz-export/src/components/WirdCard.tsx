import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/appStore';
import type { WirdSection } from '../data/litanies';
import { motion } from 'framer-motion';

interface WirdCardProps {
  section: WirdSection;
  index: number;
}

export default function WirdCard({ section, index }: WirdCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useAppStore();

  const name = language === 'ar' ? section.nameAr
    : language === 'en' ? section.nameEn
    : language === 'ms' ? section.nameEn
    : language === 'es' ? section.nameEn
    : language === 'tr' ? section.nameEn
    : language === 'fa' ? section.nameEn
    : section.nameFr;

  const description = language === 'ar' ? section.descriptionAr
    : language === 'en' ? section.descriptionEn
    : language === 'ms' ? section.descriptionMs
    : language === 'es' ? section.descriptionEs
    : language === 'tr' ? section.descriptionTr
    : language === 'fa' ? (section.descriptionFa || section.descriptionFr)
    : section.descriptionFr;

  
  const labels = [t('wirdLazim'), t('wazifa'), t('haylala'), t('litanies')];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      onClick={() => navigate(`/wird/${section.id}`)}
      className="wird-card group no-select"
    >
      {/* Image */}
      <div className="relative h-28 sm:h-36 md:h-44 overflow-hidden">
        <img
          src={section.image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${section.color} opacity-40`} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-arabic text-lg sm:text-xl text-gray-900 dark:text-white leading-tight truncate">
              {section.nameAr}
            </h3>
            <p className="text-xs sm:text-sm font-display font-semibold text-primary-700 dark:text-primary-400 mt-1 truncate">
              {labels[index] || name}
            </p>
          </div>
        </div>

        <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1.5 sm:mt-2 line-clamp-2">
          {description}
        </p>

        {/* Progress dots */}
        <div className="flex gap-1 mt-2 sm:mt-3">
          {section.litanies.slice(0, 5).map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary-200 dark:bg-primary-800"
            />
          ))}
          {section.litanies.length > 5 && (
            <span className="text-[10px] text-gray-400 ml-1">+{section.litanies.length - 5}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
