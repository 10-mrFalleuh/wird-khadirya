import { useEffect, useState } from 'react';
import { supabase } from '../../lib/neon';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  Headphones,
  Star,
  Eye,
} from 'lucide-react';

type AudioItem = {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  cover_url: string;
  duration: string;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

export default function AudiosManagementPage() {
  const navigate = useNavigate();

  const [audios, setAudios] = useState<AudioItem[]>([]);
  const [filteredAudios, setFilteredAudios] = useState<AudioItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudios();
  }, []);

  useEffect(() => {
    const filtered = audios.filter(
      (audio) =>
        audio.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        audio.category
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredAudios(filtered);
  }, [search, audios]);

  const loadAudios = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('audios')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      if (error) throw error;

      setAudios(data || []);
      setFilteredAudios(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteAudio = async (id: string) => {
    const confirmDelete = window.confirm(
      'Voulez-vous vraiment supprimer cet audio ?'
    );

    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from('audios')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAudios((prev) =>
        prev.filter((audio) => audio.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* HEADER */}

      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          <button
            onClick={() => navigate('/superadmin/dashboard')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <h1 className="font-bold text-lg">
            Gestion des Audios
          </h1>

          <button
            onClick={() =>
              navigate('/superadmin/audios/add')
            }
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-4">

        {/* HERO */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="
            bg-gradient-to-r
            from-purple-700
            via-purple-800
            to-indigo-900
            text-white
            rounded-3xl
            p-8
            shadow-xl
            mb-6
          "
        >
          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Headphones className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-3xl font-bold">
                Bibliothèque Audio
              </h2>

              <p className="opacity-90 mt-1">
                Gérer les récitations, conférences
                et contenus audio.
              </p>
            </div>

          </div>
        </motion.div>

        {/* SEARCH */}

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow mb-6">

          <div className="relative">

            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Rechercher un audio..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                pl-12
                pr-4
                py-3
                rounded-xl
                border
                border-gray-200
                dark:border-gray-700
                bg-transparent
              "
            />

          </div>

        </div>

        {/* LISTE */}

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow overflow-hidden">

          {loading ? (
            <div className="p-8 text-center">
              Chargement...
            </div>
          ) : filteredAudios.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun audio trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100 dark:bg-gray-800">

                  <tr>
                    <th className="text-left p-4">
                      Audio
                    </th>

                    <th className="text-left p-4">
                      Catégorie
                    </th>

                    <th className="text-left p-4">
                      Durée
                    </th>

                    <th className="text-left p-4">
                      Statut
                    </th>

                    <th className="text-left p-4">
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredAudios.map((audio) => (
                    <tr
                      key={audio.id}
                      className="border-t"
                    >
                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          {audio.cover_url ? (
                            <img
                              src={audio.cover_url}
                              alt=""
                              className="w-14 h-14 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                              <Headphones className="w-6 h-6 text-purple-600" />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">
                              {audio.title}
                            </p>

                            <p className="text-sm text-gray-500 line-clamp-1">
                              {audio.description}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="p-4">
                        {audio.category || '-'}
                      </td>

                      <td className="p-4">
                        {audio.duration || '-'}
                      </td>

                      <td className="p-4">

                        <div className="flex flex-col gap-2">

                          {audio.is_published ? (
                            <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 w-fit">
                              Publié
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 w-fit">
                              Brouillon
                            </span>
                          )}

                          {audio.is_featured && (
                            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-amber-100 text-amber-700 w-fit">
                              <Star className="w-3 h-3" />
                              Mis en avant
                            </span>
                          )}

                        </div>

                      </td>

                      <td className="p-4">

                        <div className="flex gap-2">

                          {audio.audio_url && (
                            <a
                              href={audio.audio_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 rounded-lg bg-blue-100 text-blue-600"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          )}

                          <button
                            onClick={() =>
                              navigate(
                                `/superadmin/audios/edit/${audio.id}`
                              )
                            }
                            className="p-2 rounded-lg bg-green-100 text-green-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              deleteAudio(audio.id)
                            }
                            className="p-2 rounded-lg bg-red-100 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </td>
                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}