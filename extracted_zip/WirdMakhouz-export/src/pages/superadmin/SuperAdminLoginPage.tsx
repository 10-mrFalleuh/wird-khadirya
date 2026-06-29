import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Mail, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SuperAdminLoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      const user = data.user;

      if (!user) {
        alert(
          'Impossible de récupérer l’utilisateur.'
        );
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        alert(profileError.message);
        return;
      }

      if (
        profile?.role === 'super_admin' ||
        profile?.role === 'admin'
      ) {
        navigate('/superadmin/dashboard');
      } else {
        await supabase.auth.signOut();

        alert(
          'Accès réservé aux administrateurs.'
        );

        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 p-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Crown className="w-10 h-10 text-primary-600" />
          </div>

          <h1 className="mt-4 text-3xl font-bold">
            Super Admin
          </h1>

          <p className="text-gray-500 mt-2">
            Connexion à l'administration
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >

          <div>
            <label className="text-sm font-medium">
              Email
            </label>

            <div className="mt-1 flex items-center border rounded-xl px-3">
              <Mail className="w-4 h-4 text-gray-400" />

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full p-3 outline-none bg-transparent"
                placeholder="admin@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">
              Mot de passe
            </label>

            <div className="mt-1 flex items-center border rounded-xl px-3">
              <Lock className="w-4 h-4 text-gray-400" />

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full p-3 outline-none bg-transparent"
                placeholder="********"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition"
          >
            {loading
              ? 'Connexion...'
              : 'Se connecter'}
          </button>

        </form>

        <button
          onClick={() => navigate('/login')}
          className="w-full mt-4 text-primary-600 text-sm"
        >
          Retour à la connexion utilisateur
        </button>

      </div>
    </div>
  );
}