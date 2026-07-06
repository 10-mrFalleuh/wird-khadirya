import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Props {
  children: ReactNode;
}

export default function AdminRoute({
  children,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] =
    useState(false);

  useEffect(() => {
    checkRole();
  }, []);

  const checkRole = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log('USER:', user);

      if (!user) {
        setAuthorized(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('PROFILE DATA:', data);
      console.log('PROFILE ERROR:', error);

      if (error) {
        setAuthorized(false);
        return;
      }

      const role = data?.role?.toLowerCase();

      console.log('ROLE:', role);

      if (
        role === 'admin' ||
        role === 'super_admin'
      ) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } catch (error) {
      console.error('AdminRoute Error:', error);
      setAuthorized(false);
    } finally {
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
    console.warn(
      'Accès refusé : utilisateur non admin'
    );

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Accès autorisé
  return <>{children}</>;
}