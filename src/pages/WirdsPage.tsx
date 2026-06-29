import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Heart } from 'lucide-react';

import WirdCard from '../components/WirdCard';
import { wirdSections } from '../data/litanies';
import { useFavorites } from '../hooks/useFavorites';

export default function WirdsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { favorites } = useFavorites();

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 pb-24">

      {/* HEADER */}

      <div className="bg-primary-800 text-white">

        <div className="max-w-2xl mx-auto p-4 flex items-center gap-3">

          <button
            onClick={() => navigate(-1)}
            className="
              p-2
              rounded-xl
              hover:bg-white/10
              transition
            "
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>

            <h1 className="text-xl font-bold">
              📖 {t('wirdLazim')}
            </h1>

          </div>

        </div>

      </div>

      {/* CONTENU */}

      <div className="max-w-2xl mx-auto p-4">

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

          {wirdSections.map((section, index) => {

            const isFavorite =
              favorites.includes(String(section.id));

            return (
              <div
                key={section.id}
                className="relative"
              >

                {/* BADGE FAVORI */}

                {isFavorite && (
                  <div
                    className="
                      absolute
                      top-2
                      left-2
                      z-20
                      bg-white/95
                      rounded-full
                      p-1.5
                      shadow-lg
                    "
                  >
                    <Heart
                      className="
                        w-4
                        h-4
                        fill-red-500
                        text-red-500
                      "
                    />
                  </div>
                )}

                <WirdCard
                  section={section}
                  index={index}
                />

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}