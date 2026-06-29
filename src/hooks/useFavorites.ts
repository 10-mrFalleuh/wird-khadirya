import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const loadFavorites = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log('USER LOAD', user);

    if (!user) return;

    const { data, error } = await supabase
      .from('favorites')
      .select('wird_id')
      .eq('user_id', user.id);

    console.log('LOAD FAVORITES', data);
    console.log('LOAD ERROR', error);

    setFavorites(
      data?.map((item) => item.wird_id) || []
    );
  };

  const toggleFavorite = async (wirdId: string) => {
  console.log('TOGGLE FAVORITE');
  console.log('WIRD ID', wirdId);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('USER', user);

  if (!user) {
    console.log('NO USER');
    return;
  }

  const isFavorite = favorites.includes(wirdId);

  console.log('IS FAVORITE', isFavorite);

  if (isFavorite) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('wird_id', wirdId);

    console.log('DELETE ERROR', error);
  } else {
    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: user.id,
        wird_id: wirdId,
      });

    console.log('INSERT DATA', data);
    console.log('INSERT ERROR', error);
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