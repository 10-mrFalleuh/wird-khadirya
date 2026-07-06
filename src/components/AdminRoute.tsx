import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { db } from '../lib/neon';
import { profiles } from '../db/schema';
import { eq } from 'drizzle-orm';

interface Props {
  children: ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      // ⚠️ Note : On garde temporairement l'appel Auth de Supabase s'il est encore actif,
      // ou remplacez-le par votre nouvel objet d'authentification si nécessaire.
      const { data: { user } } = await supabase.auth.getUser();

      console.log('USER:', user);

      if (!user) {
        setAuthorized(false);
        return;
      }

      // 🚀 Requête de base de données convertie sur Neon avec Drizzle
      const userProfile = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, user.id))
        .limit(1);

      // Drizzle retourne toujours un tableau, on prend le premier élément
      const data = userProfile[0] || null;

      console.log('PROFILE DATA:', data);

      if (!data) {
        setAuthorized(false);
        return;
      }

      // Récupération sécurisée du rôle (on force le type en "any" temporairement si le champ n'est pas encore strict dans votre schema.ts)
      const role = (data as any).role?.toLowerCase();
      console.log('ROLE:', role);

      if (role === 'admin' || role === 'super_admin') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (error) {
      console.error('AdminRoute Error:', error);
      setAuthorized(false);
    } file {
      setLoading(false);
    }
  };

  // Chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-300">
            Vérification des permissions...
          </p>
        </div>
      </div>
    );
  }

  // Refus d'accès
  if (!authorized) {
    console.warn('Accès refusé : utilisateur non admin');
    return <Navigate to="/" replace />;
  }

  // Accès autorisé
  return <>{children}</>;
}