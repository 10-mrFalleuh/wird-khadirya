import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  Star,
  BookOpen,
} from 'lucide-react';
import { supabase } from '../../lib/neon';

type Wird = {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
  pdf_url: string;
  audio_url: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

export default function WirdsManagementPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [wirds, setWirds] = useState<Wird[]>([]);

  useEffect(() => {
    loadWirds();
  }, []);

  const loadWirds = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('wirds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setWirds(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteWird = async (id: string) => {
    const confirmed = window.confirm(
      'Supprimer ce wird ?'
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from('wirds')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('Erreur de suppression');
      return;
    }

    loadWirds();
  };

  const togglePublish = async (
    id: string,
    currentValue: boolean
  ) => {
    const { error } = await supabase
      .from('wirds')
      .update({
        is_published: !currentValue,
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      return;
    }

    loadWirds();
  };

  const toggleFeatured = async (
    id: string,
    currentValue: boolean
  ) => {
    const { error } = await supabase
      .from('wirds')
      .update({
        is_featured: !currentValue,
      })
      .eq('id', id);

    if (error) {
      console.error(error);
      return;
    }

    loadWirds();
  };

  const filteredWirds = wirds.filter(
    (wird) =>
      wird.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      wird.category
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-6">

      {/* Header */}

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <button
              onClick={() =>
                navigate('/superadmin/dashboard')
              }
              className="flex items-center gap-2 text-primary-600 font-medium mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour Dashboard
            </button>

            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary-600" />
              Gestion des Wirds
            </h1>

            <p className="text-gray-500 mt-2">
              Gérez tous les wirds de la plateforme
            </p>
          </div>

          <button
            onClick={() =>
              navigate('/superadmin/wirds/add')
            }
            className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Ajouter un Wird
          </button>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow">
            <p className="text-gray-500">
              Total Wirds
            </p>
            <h2 className="text-3xl font-bold">
              {wirds.length}
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow">
            <p className="text-gray-500">
              Publiés
            </p>
            <h2 className="text-3xl font-bold text-green-600">
              {
                wirds.filter(
                  (w) => w.is_published
                ).length
              }
            </h2>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow">
            <p className="text-gray-500">
              Mis en avant
            </p>
            <h2 className="text-3xl font-bold text-yellow-500">
              {
                wirds.filter(
                  (w) => w.is_featured
                ).length
              }
            </h2>
          </div>

        </div>

        {/* Recherche */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow mb-6">

          <div className="relative">

            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Rechercher un wird..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full pl-12 pr-4 py-3 border rounded-xl"
            />

          </div>

        </div>

        {/* Tableau */}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow overflow-hidden">

          {loading ? (
            <div className="p-8 text-center">
              Chargement...
            </div>
          ) : filteredWirds.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun wird trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-100 dark:bg-gray-800">

                  <tr>

                    <th className="text-left p-4">
                      Titre
                    </th>

                    <th className="text-left p-4">
                      Catégorie
                    </th>

                    <th className="text-left p-4">
                      Publication
                    </th>

                    <th className="text-left p-4">
                      Vedette
                    </th>

                    <th className="text-left p-4">
                      Date
                    </th>

                    <th className="text-center p-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredWirds.map((wird) => (
                    <tr
                      key={wird.id}
                      className="border-t"
                    >
                      <td className="p-4 font-medium">
                        {wird.title}
                      </td>

                      <td className="p-4">
                        {wird.category || '-'}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            togglePublish(
                              wird.id,
                              wird.is_published
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm ${
                            wird.is_published
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {wird.is_published
                            ? 'Publié'
                            : 'Brouillon'}
                        </button>
                      </td>

                      <td className="p-4">

                        <button
                          onClick={() =>
                            toggleFeatured(
                              wird.id,
                              wird.is_featured
                            )
                          }
                        >
                          <Star
                            className={`w-5 h-5 ${
                              wird.is_featured
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>

                      </td>

                      <td className="p-4">
                        {new Date(
                          wird.created_at
                        ).toLocaleDateString()}
                      </td>

                      <td className="p-4">

                        <div className="flex justify-center gap-3">

                          <button
                            onClick={() =>
                              navigate(
                                `/superadmin/wirds/edit/${wird.id}`
                              )
                            }
                            className="text-blue-600"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() =>
                              deleteWird(wird.id)
                            }
                            className="text-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
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