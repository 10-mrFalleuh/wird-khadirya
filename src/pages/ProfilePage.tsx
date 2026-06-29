import { useEffect, useState } from "react";
import { User, Mail, Phone, Globe } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("USER ID:", user.id);
      console.log("PROFILE:", data);
      console.log("ERROR:", error);

      if (error) {
        console.error(error);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-xl mx-auto">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
          {/* Avatar + Nom */}
          <div className="flex flex-col items-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Avatar"
                className="w-28 h-28 rounded-full object-cover border-4 border-primary-500"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-primary-600 text-white flex items-center justify-center text-4xl font-bold">
                {profile?.full_name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <h1 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
              {profile?.full_name || "Utilisateur"}
            </h1>

            <p className="text-gray-500">{profile?.email || "-"}</p>
          </div>

          {/* Informations */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-primary-600" />
              <span>{profile?.full_name || "-"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary-600" />
              <span>{profile?.email || "-"}</span>
            </div>

            <p className="text-sm font-medium text-primary-600 mt-1">
              {profile?.role === "super_admin"
                ? "👑 Super Administrateur"
                : profile?.role === "admin"
                  ? "🛠️ Administrateur"
                  : "👤 Utilisateur"}
            </p>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary-600" />
              <span>{profile?.phone || "-"}</span>
            </div>

            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-primary-600" />
              <span>{profile?.country || "-"}</span>
            </div>

            <div className="flex justify-between border-t pt-3">
              <span className="font-medium">Âge</span>
              <span>{profile?.age || "-"}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Genre</span>
              <span>
                {profile?.gender === "male"
                  ? "Homme"
                  : profile?.gender === "female"
                    ? "Femme"
                    : "-"}
              </span>
            </div>
          </div>

          {/* Bouton Modifier */}
          <button
            onClick={() => navigate("/profile/edit")}
            className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium transition-colors"
          >
            Modifier mon profil
          </button>
        </div>
      </div>
    </div>
  );
}
