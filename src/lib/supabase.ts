import { createClient } from '@supabase/supabase-js';

// Récupération des clés avec une chaîne vide par défaut pour éviter le crash fatal
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Attention : Les variables d'environnement Supabase sont manquantes dans le fichier .env");
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder'
);