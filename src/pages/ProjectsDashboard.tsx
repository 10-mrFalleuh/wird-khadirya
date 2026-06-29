import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
  FolderKanban,
  Clock,
  CheckCircle2,
  Pause,
  RefreshCw,
} from "lucide-react";
import { client } from "../api/client";

interface Projet {
  id: number;
  userId: string;
  titre: string;
  description: string | null;
  statut: string | null;
  createdAt: number | null;
  updatedAt: number | null;
}

interface Stats {
  total: number;
  en_cours: number;
  termine: number;
  en_attente: number;
}

const STATUT_OPTIONS = [
  { value: "en_cours", label: "En cours", icon: Clock, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { value: "termine", label: "Terminé", icon: CheckCircle2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30" },
  { value: "en_attente", label: "En attente", icon: Pause, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30" },
];

function StatCard({ label, count, icon: Icon, color, bg }: { label: string; count: number; icon: any; color: string; bg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${bg} rounded-2xl p-4 flex items-center gap-3`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </motion.div>
  );
}

function ProjetCard({
  projet,
  onEdit,
  onDelete,
}: {
  projet: Projet;
  onEdit: (projet: Projet) => void;
  onDelete: (id: number) => void;
}) {
  const statutOption = STATUT_OPTIONS.find((s) => s.value === projet.statut) || STATUT_OPTIONS[0];
  const StatutIcon = statutOption.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{projet.titre}</h3>
          {projet.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{projet.description}</p>
          )}
        </div>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={() => onEdit(projet)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => onDelete(projet.id)}
            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statutOption.bg} ${statutOption.color}`}>
          <StatutIcon className="w-3 h-3" />
          {statutOption.label}
        </span>
        {projet.createdAt && (
          <span className="text-xs text-gray-400">
            {new Date(projet.createdAt).toLocaleDateString("fr-FR")}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export default function ProjectsDashboard() {
  const { t } = useTranslation();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, en_cours: 0, termine: 0, en_attente: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProjet, setEditingProjet] = useState<Projet | null>(null);
  const [formData, setFormData] = useState({ titre: "", description: "", statut: "en_cours" });
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [projetsRes, statsRes] = await Promise.all([
        client.api.fetch("/api/projets"),
        client.api.fetch("/api/projets/stats/summary"),
      ]);
      const projetsData = await projetsRes.json();
      const statsData = await statsRes.json();
      setProjets(projetsData.data || []);
      setStats(statsData.data || { total: 0, en_cours: 0, termine: 0, en_attente: 0 });
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titre.trim()) return;

    try {
      if (editingProjet) {
        await client.api.fetch(`/api/projets/${editingProjet.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await client.api.fetch("/api/projets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setShowForm(false);
      setEditingProjet(null);
      setFormData({ titre: "", description: "", statut: "en_cours" });
      fetchData();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
    }
  };

  const handleEdit = (projet: Projet) => {
    setEditingProjet(projet);
    setFormData({
      titre: projet.titre,
      description: projet.description || "",
      statut: projet.statut || "en_cours",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce projet ?")) return;
    try {
      await client.api.fetch(`/api/projets/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingProjet(null);
    setFormData({ titre: "", description: "", statut: "en_cours" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mes Projets</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-300 ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouveau
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard label="Total" count={stats.total} icon={FolderKanban} color="text-gray-600 dark:text-gray-300" bg="bg-gray-100 dark:bg-gray-800" />
        <StatCard label="En cours" count={stats.en_cours} icon={Clock} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard label="Terminés" count={stats.termine} icon={CheckCircle2} color="text-blue-600 dark:text-blue-400" bg="bg-blue-50 dark:bg-blue-900/20" />
        <StatCard label="En attente" count={stats.en_attente} icon={Pause} color="text-amber-600 dark:text-amber-400" bg="bg-amber-50 dark:bg-amber-900/20" />
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4"
            onClick={cancelForm}
          >
            <motion.form
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                {editingProjet ? "Modifier le projet" : "Nouveau projet"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Titre *
                  </label>
                  <input
                    type="text"
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Nom du projet"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                    rows={3}
                    placeholder="Description du projet"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Statut
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    {STATUT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-medium"
                >
                  <Check className="w-4 h-4" />
                  {editingProjet ? "Modifier" : "Créer"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {projets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <FolderKanban className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400">Aucun projet pour l'instant</p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Cliquez sur "Nouveau" pour créer votre premier projet
              </p>
            </motion.div>
          ) : (
            projets.map((projet) => (
              <ProjetCard
                key={projet.id}
                projet={projet}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
