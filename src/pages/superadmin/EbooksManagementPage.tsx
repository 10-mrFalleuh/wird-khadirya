import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  Library,
  Star,
} from 'lucide-react';

type Ebook = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  pdf_url: string;
  category: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
};

export default function EbooksManagementPage() {
  const navigate = useNavigate();

  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [filteredEbooks, setFilteredEbooks] =
    useState<Ebook[]>([]);

  const [search, setSearch] = useState('');
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadEbooks();
  }, []);

  useEffect(() => {
    const filtered = ebooks.filter(
      (ebook) =>
        ebook.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        ebook.author
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        ebook.category
          ?.toLowerCase()
          .includes(search.toLowerCase())
    );

    setFilteredEbooks(filtered);
  }, [search, ebooks]);

  const loadEbooks = async () => {
    try {
      const { data, error } =
        await supabase
          .from('ebooks')
          .select('*')
          .order('created_at', {
            ascending: false,
          });

      if (error) throw error;

      setEbooks(data || []);
      setFilteredEbooks(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteEbook = async (
    id: string
  ) => {
    const confirmDelete =
      window.confirm(
        'Supprimer cet e-book ?'
      );

    if (!confirmDelete) return;

    try {
      const { error } =
        await supabase
          .from('ebooks')
          .delete()
          .eq('id', id);

      if (error) throw error;

      setEbooks((prev) =>
        prev.filter(
          (ebook) =>
            ebook.id !== id
        )
      );
    } catch (error) {
      console.error(error);
      alert(
        'Erreur de suppression'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* HEADER */}

      <div className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b">

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          <button
            onClick={() =>
              navigate(
                '/superadmin/dashboard'
              )
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <h1 className="font-bold">
            Gestion E-books
          </h1>

          <button
            onClick={() =>
              navigate(
                '/superadmin/ebooks/add'
              )
            }
            className="bg-primary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Ajouter
          </button>

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
            bg-gradient-to-r
            from-orange-600
            via-orange-700
            to-red-700
            rounded-3xl
            p-8
            text-white
            mb-6
          "
        >
          <Library className="w-12 h-12 mb-3" />

          <h1 className="text-3xl font-bold">
            Bibliothèque E-books
          </h1>

          <p className="opacity-90 mt-2">
            Gérez tous les livres
            numériques.
          </p>

        </motion.div>

        {/* SEARCH */}

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow mb-6">

          <div className="relative">

            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-full pl-12 pr-4 py-3 border rounded-xl"
            />

          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow overflow-hidden">

          {loading ? (
            <div className="p-8 text-center">
              Chargement...
            </div>
          ) : (
            <table className="w-full">

              <thead className="bg-gray-100 dark:bg-gray-800">

                <tr>
                  <th className="p-4 text-left">
                    Livre
                  </th>

                  <th className="p-4 text-left">
                    Auteur
                  </th>

                  <th className="p-4 text-left">
                    Catégorie
                  </th>

                  <th className="p-4 text-left">
                    Statut
                  </th>

                  <th className="p-4 text-left">
                    Actions
                  </th>
                </tr>

              </thead>

              <tbody>

                {filteredEbooks.map(
                  (ebook) => (
                    <tr
                      key={
                        ebook.id
                      }
                      className="border-t"
                    >
                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          {ebook.cover_url ? (
                            <img
                              src={
                                ebook.cover_url
                              }
                              alt=""
                              className="w-14 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-14 h-20 bg-orange-100 rounded-lg flex items-center justify-center">
                              <Library className="text-orange-600" />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">
                              {
                                ebook.title
                              }
                            </p>

                            <p className="text-sm text-gray-500">
                              {
                                ebook.description
                              }
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="p-4">
                        {ebook.author}
                      </td>

                      <td className="p-4">
                        {ebook.category}
                      </td>

                      <td className="p-4">

                        <div className="flex flex-col gap-2">

                          {ebook.is_published ? (
                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                              Publié
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                              Brouillon
                            </span>
                          )}

                          {ebook.is_featured && (
                            <span className="flex items-center gap-1 text-xs text-amber-600">
                              <Star className="w-3 h-3" />
                              Vedette
                            </span>
                          )}

                        </div>

                      </td>

                      <td className="p-4">

                        <div className="flex gap-2">

                          {ebook.pdf_url && (
                            <a
                              href={
                                ebook.pdf_url
                              }
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
                                `/superadmin/ebooks/edit/${ebook.id}`
                              )
                            }
                            className="p-2 rounded-lg bg-green-100 text-green-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() =>
                              deleteEbook(
                                ebook.id
                              )
                            }
                            className="p-2 rounded-lg bg-red-100 text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </td>
                    </tr>
                  )
                )}

              </tbody>

            </table>
          )}

        </div>
      </div>
    </div>
  );
}