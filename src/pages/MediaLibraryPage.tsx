import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Search,
  BookOpen,
  Headphones,
  Library,
  Heart,
  ChevronRight,
} from 'lucide-react';

export default function MediaLibraryPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const categories = [
    {
      title: t('wirdLazim') || 'Wirds',
      icon: BookOpen,
      color: 'text-primary-600',
      route: '/wirds',
    },
    {
      title: t('audio'),
      icon: Headphones,
      color: 'text-green-600',
      route: '/audio',
    },
    {
      title: 'E-books',
      icon: Library,
      color: 'text-amber-600',
      route: '/ebooks',
    },
    {
      title: t('favorites') || 'Favoris',
      icon: Heart,
      color: 'text-red-500',
      route: '/favorites',
    },
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 pb-24">

      {/* HEADER */}

      <div className="bg-primary-800 text-white">
        <div className="max-w-2xl mx-auto px-4 py-5">

          <h1 className="text-2xl font-bold">
            📚 {t('mediaLibrary')}
          </h1>

          <p className="text-sm opacity-80 mt-1">
            {t('mediaLibrarySubtitle')}
          </p>

        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">

        {/* RECHERCHE */}

        <div className="relative">

          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            className="
              w-full
              pl-12
              pr-4
              py-3
              rounded-2xl
              bg-white
              dark:bg-gray-900
              shadow
              border
              border-gray-100
              dark:border-gray-800
              outline-none
            "
          />

        </div>

        {/* CATÉGORIES */}

        <div>

          <h2 className="font-semibold text-lg mb-4">
            {t('categoriesTitle')}
          </h2>

          <div className="grid grid-cols-2 gap-4">

            {categories.map((item) => {
              const Icon = item.icon;

              return (
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  key={item.title}
                  onClick={() => navigate(item.route)}
                  className="
                    bg-white
                    dark:bg-gray-900
                    rounded-2xl
                    p-5
                    shadow
                    flex
                    flex-col
                    items-center
                    justify-center
                    gap-3
                  "
                >
                  <Icon
                    className={`w-8 h-8 ${item.color}`}
                  />

                  <span className="font-medium">
                    {item.title}
                  </span>
                </motion.button>
              );
            })}

          </div>

        </div>

        {/* DERNIERS CONTENUS */}

        <div>
  <h2 className="font-semibold text-lg mb-4">
    {t('latestContent')}
  </h2>

  <div
    className="
      bg-white
      dark:bg-gray-900
      rounded-2xl
      p-6
      text-center
      shadow
    "
  >
    <Library className="w-10 h-10 mx-auto text-primary-600 mb-3" />

    <p className="font-medium">
      {t('latestContentPlaceholder')}
    </p>

    <p className="text-sm text-gray-500 mt-1">
      {t('latestContentDesc')}
    </p>
  </div>
</div>

        {/* FAVORIS */}

        <div>

          <h2 className="font-semibold text-lg mb-4">
            {t('myFavorites')}
          </h2>

          <div
            className="
              bg-white
              dark:bg-gray-900
              rounded-2xl
              shadow
              p-6
              text-center
            "
          >
            <Heart className="w-10 h-10 mx-auto text-red-500 mb-3" />

            <p className="font-medium">
              {t('noFavorites')}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              {t('noFavoritesDesc')}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}
