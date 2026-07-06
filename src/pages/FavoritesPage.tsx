import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ACTIVE_WIRDS } from "../data/wirds";

export default function FavoritesPage() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error(error);
      return;
    }

    setFavorites(data || []);
    setLoading(false);
  };

  const favoriteWirds = ACTIVE_WIRDS.filter((section) =>
    favorites.some(
      (fav) => fav.wird_id === String(section.id)
    )
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 pb-24">

      {/* HEADER */}

      <div className="bg-primary-800 text-white">
        <div className="max-w-2xl mx-auto p-4 flex items-center gap-3">

          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-bold">
            Mes Favoris
          </h1>
          <p className="text-sm text-white/80">
  {favoriteWirds.length} favori(s)
</p>

        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">

        {loading ? (
          <div className="text-center py-10">
            Chargement...
          </div>
        ) : favoriteWirds.length === 0 ? (
          <div
            className="
              bg-white
              dark:bg-gray-900
              rounded-2xl
              shadow
              p-10
              text-center
            "
          >
            <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />

            <h2 className="font-semibold text-lg">
              Aucun favori
            </h2>

            <p className="text-gray-500 mt-2">
              Ajoutez vos wirds favoris.
            </p>
          </div>
        ) : (
          <div className="space-y-4">

            {favoriteWirds.map((section) => (
              <button
                key={section.id}
                onClick={() =>
                  navigate(`/wird/${section.id}`)
                }
                className="
                  w-full
                  bg-white
                  dark:bg-gray-900
                  rounded-2xl
                  shadow
                  p-4
                  text-left
                  flex
                  items-center
                  gap-4
                "
              >
                <img
                  src={section.image}
                  alt={section.nameFr}
                  className="
                    w-16
                    h-16
                    rounded-xl
                    object-cover
                  "
                />

                <div>
                  <h3 className="font-semibold">
                    {section.nameFr}
                  </h3>

                  <p className="text-sm text-gray-500">
                    ❤️ Favori
                  </p>
                </div>
              </button>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}