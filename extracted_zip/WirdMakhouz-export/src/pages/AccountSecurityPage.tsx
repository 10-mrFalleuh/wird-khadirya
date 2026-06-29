import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

import {
  ArrowLeft,
  Shield,
  Mail,
  Lock,
  RefreshCcw,
  LogOut,
  Trash2,
} from 'lucide-react';

export default function AccountSecurityPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleChangeEmail = async () => {
    if (!email) {
      alert('Entrez un email');
      return;
    }

    try {
      setLoadingEmail(true);

      const { error } =
        await supabase.auth.updateUser({
          email,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        'Un email de confirmation a été envoyé.'
      );

      setEmail('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (password.length < 6) {
      alert(
        'Le mot de passe doit contenir au moins 6 caractères.'
      );
      return;
    }

    try {
      setLoadingPassword(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        'Mot de passe modifié avec succès'
      );

      setPassword('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleResendVerification =
    async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        alert('Aucun email trouvé');
        return;
      }

      const { error } =
        await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert(
        'Email de vérification renvoyé.'
      );
    };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <h1 className="font-bold text-lg">
            Sécurité
          </h1>

          <div />
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-4">

        {/* HERO */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            rounded-3xl
            p-8
            mb-6
            bg-gradient-to-br
            from-primary-700
            via-primary-800
            to-primary-900
            text-white
            shadow-2xl
          "
        >
          <div className="flex items-center gap-4">

            <Shield className="w-14 h-14" />

            <div>
              <h1 className="text-3xl font-bold">
                Sécurité du compte
              </h1>

              <p className="opacity-90">
                Gérez vos informations
                d'authentification et la
                sécurité de votre compte.
              </p>
            </div>

          </div>
        </motion.div>

        {/* EMAIL */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">
            <Mail className="w-6 h-6 text-primary-600" />
            <h2 className="font-bold text-lg">
              Modifier l'email
            </h2>
          </div>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Nouvel email"
            className="w-full border rounded-2xl px-4 py-3 mb-4 dark:bg-gray-800"
          />

          <button
            onClick={handleChangeEmail}
            disabled={loadingEmail}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-2xl"
          >
            {loadingEmail
              ? 'Modification...'
              : "Modifier l'email"}
          </button>

        </div>

        {/* PASSWORD */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-primary-600" />
            <h2 className="font-bold text-lg">
              Modifier le mot de passe
            </h2>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Nouveau mot de passe"
            className="w-full border rounded-2xl px-4 py-3 mb-4 dark:bg-gray-800"
          />

          <button
            onClick={handleChangePassword}
            disabled={loadingPassword}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-2xl"
          >
            {loadingPassword
              ? 'Modification...'
              : 'Modifier le mot de passe'}
          </button>

        </div>

        {/* VERIFICATION */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">
            <RefreshCcw className="w-6 h-6 text-primary-600" />
            <h2 className="font-bold text-lg">
              Vérification email
            </h2>
          </div>

          <button
            onClick={
              handleResendVerification
            }
            className="w-full border-2 border-primary-600 text-primary-600 py-3 rounded-2xl hover:bg-primary-50 dark:hover:bg-primary-900/20"
          >
            Renvoyer l'email de vérification
          </button>

        </div>

        {/* LOGOUT */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 mb-6">

          <div className="flex items-center gap-3 mb-4">
            <LogOut className="w-6 h-6 text-orange-500" />
            <h2 className="font-bold text-lg">
              Déconnexion
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl"
          >
            Se déconnecter
          </button>

        </div>

        {/* DANGER ZONE */}
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-3xl p-6">

          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />

            <h2 className="font-bold text-lg text-red-600">
              Zone dangereuse
            </h2>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Cette action supprimera définitivement
            votre compte et toutes vos données.
          </p>

          <button
            disabled
            className="w-full bg-red-600 text-white py-3 rounded-2xl opacity-50"
          >
            Suppression du compte
            (bientôt disponible)
          </button>

        </div>

      </div>
    </div>
  );
}