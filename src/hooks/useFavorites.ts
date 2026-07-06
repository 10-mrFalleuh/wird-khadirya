import { useEffect, useState } from 'react';
import { db } from '../lib/neon';
import { favorites as favoritesTable } from '../db/schema';
import { eq, and } from 'drizzle-orm';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = async () => {
    // On garde l'authentification Supabase pour récupérer l'utilisateur
    const { data: { user } } = await supabase.auth.getUser();

    console.log('USER LOAD', user);

    if (!user) return;

    try {
      // 🚀 Requête SELECT avec Drizzle
      const data = await db
        .select({ wirdId: favoritesTable.wirdId })
        .from(favoritesTable)
        .where(eq(favoritesTable.userId, user.id));

      console.log('LOAD FAVORITES', data);

      setFavorites(data.map((item) => item.wirdId) || []);
    } catch (error) {
      console.log('LOAD ERROR', error);
    }
  };

  const toggleFavorite = async (wirdId: string) => {
    console.log('TOGGLE FAVORITE');
    console.log('WIRD ID', wirdId);

    const { data: { user } } = await supabase.auth.getUser();

    console.log('USER', user);

    if (!user) {
      console.log('NO USER');
      return;
    }

    const isFavorite = favorites.includes(wirdId);
    console.log('IS FAVORITE', isFavorite);

    try {
      if (isFavorite) {
        // 🚀 Requête DELETE avec Drizzle (utilisation de and() pour combiner les conditions)
        await db
          .delete(favoritesTable)
          .where(
            and(
              eq(favoritesTable.userId, user.id),
              eq(favoritesTable.wirdId, wirdId)
            )
          );
      } else {
        // 🚀 Requête INSERT avec Drizzle
        await db.insert(favoritesTable).values({
          userId: user.id,
          wirdId: wirdId,
        });
      }
    } catch (error) {
      console.log('TOGGLE ERROR', error);
    }

    await loadFavorites();
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  return {
    favorites,
    toggleFavorite,
  };
}