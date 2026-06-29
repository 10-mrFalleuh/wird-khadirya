import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  Search,
  Users,
  Shield,
  Crown,
  Trash2,
  Mail,
  Globe,
} from "lucide-react";

type Profile = {
  id: string;
  email: string;
  full_name: string;
  country: string;
  role: string;
  created_at: string;
};

export default function UsersManagementPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    loadCurrentUser();
    loadUsers();
  }, []);

  const loadCurrentUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      console.log("USERS LOADED:", data);
      console.log("COUNT:", data?.length);

      if (error) {
        console.error(error);
        return;
      }

      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    const user = users.find((u) => u.id === userId);

    if (!user) return;

    const currentRole = user.role;

    if (newRole === "super_admin" && currentRole === "user") {
      const code = prompt("Entrez le code Super Admin");

      if (code !== import.meta.env.VITE_SUPER_ADMIN_SECRET) {
        alert("Code incorrect");
        return;
      }
    }

    if (
      currentRole === "super_admin" &&
      userId === currentUserId &&
      newRole !== "super_admin"
    ) {
      alert("Vous ne pouvez pas retirer votre propre rôle Super Admin.");
      return;
    }

    const confirmed = window.confirm(`Changer le rôle de ${user.full_name} ?`);

    if (!confirmed) return;

    const superAdminsCount = users.filter(
      (u) => u.role === "super_admin",
    ).length;

    if (
      currentRole === "super_admin" &&
      newRole !== "super_admin" &&
      superAdminsCount <= 1
    ) {
      alert("Impossible de retirer le dernier Super Admin.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        role: newRole,
      })
      .eq("id", userId);

    if (error) {
      alert("Erreur");
      return;
    }

    loadUsers();
  };

  const deleteUser = async (userId: string) => {
    if (userId === currentUserId) {
      alert("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }

    const userToDelete = users.find((u) => u.id === userId);

    const superAdminsCount = users.filter(
      (u) => u.role === "super_admin",
    ).length;

    if (userToDelete?.role === "super_admin" && superAdminsCount <= 1) {
      alert("Impossible de supprimer le dernier Super Admin.");
      return;
    }

    const confirmed = window.confirm(`Supprimer ${userToDelete?.full_name} ?`);

    if (!confirmed) return;

    const { error } = await supabase.from("profiles").delete().eq("id", userId);

    if (error) {
      alert("Erreur de suppression");
      return;
    }

    loadUsers();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalUsers = users.length;

  const totalAdmins = users.filter((u) => u.role === "admin").length;

  const totalSuperAdmins = users.filter((u) => u.role === "super_admin").length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            👑 Super Admin
          </span>
        );

      case "admin":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            🛠️ Admin
          </span>
        );

      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            👤 Utilisateur
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* HEADER */}
      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate("/superadmin/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <h1 className="font-bold text-lg">Gestion des utilisateurs</h1>

          <div />
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
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
            <Users className="w-14 h-14" />

            <div>
              <h1 className="text-3xl font-bold">Utilisateurs</h1>

              <p className="opacity-90">Administration des comptes</p>
            </div>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow">
            <Users className="w-8 h-8 text-primary-600 mb-2" />
            <p className="text-sm text-gray-500">Utilisateurs</p>
            <h2 className="text-3xl font-bold">{totalUsers}</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow">
            <Shield className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-500">Admins</p>
            <h2 className="text-3xl font-bold">{totalAdmins}</h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow">
            <Crown className="w-8 h-8 text-amber-600 mb-2" />
            <p className="text-sm text-gray-500">Super Admins</p>
            <h2 className="text-3xl font-bold">{totalSuperAdmins}</h2>
          </div>
        </div>

        {/* RECHERCHE */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-2xl dark:bg-gray-800"
            />
          </div>
        </div>

        {/* TABLEAU */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-4">Utilisateur</th>

                  <th className="text-left p-4">Pays</th>

                  <th className="text-left p-4">Rôle</th>

                  <th className="text-left p-4">Date</th>

                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-t dark:border-gray-800">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{user.full_name}</p>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Mail className="w-4 h-4" />

                          {user.email}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        {user.country || "-"}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-2">
                        {getRoleBadge(user.role)}

                        {user.id === currentUserId && (
                          <span className="text-xs text-green-600 font-semibold">
                            Votre compte
                          </span>
                        )}

                        <select
                          value={user.role}
                          disabled={
                            user.id === currentUserId &&
                            user.role === "super_admin"
                          }
                          onChange={(e) => updateRole(user.id, e.target.value)}
                          className="w-full border rounded-lg px-2 py-2 dark:bg-gray-800"
                        >
                          <option value="user">Utilisateur</option>

                          <option value="admin">Admin</option>

                          <option value="super_admin">Super Admin</option>
                        </select>
                      </div>
                    </td>

                    <td className="p-4">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <button
                        disabled={user.id === currentUserId}
                        onClick={() => deleteUser(user.id)}
                        className={`
    flex items-center gap-2 px-4 py-2 rounded-xl text-white
    ${
      user.id === currentUserId
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-red-600 hover:bg-red-700"
    }
  `}
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
