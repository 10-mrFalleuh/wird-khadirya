import { useState } from 'react';
import { supabase } from '../../lib/neon';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Save,
  Library,
} from 'lucide-react';

export default function AddEbookPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] =
    useState('');
  const [category, setCategory] =
    useState('');

  const [coverFile, setCoverFile] =
    useState<File | null>(null);

  const [pdfFile, setPdfFile] =
    useState<File | null>(null);

  const [isPublished, setIsPublished] =
    useState(true);

  const [isFeatured, setIsFeatured] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const uploadCover = async () => {
    if (!coverFile) return '';

    const fileName =
      `${Date.now()}-${coverFile.name}`;

    const { error } =
      await supabase.storage
        .from('media')
        .upload(fileName, coverFile);

    if (error) throw error;

    const { data } =
      supabase.storage
        .from('media')
        .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const uploadPdf = async () => {
    if (!pdfFile) return '';

    const fileName =
      `${Date.now()}-${pdfFile.name}`;

    const { error } =
      await supabase.storage
        .from('ebooks')
        .upload(fileName, pdfFile);

    if (error) throw error;

    const { data } =
      supabase.storage
        .from('ebooks')
        .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('Titre obligatoire');
      return;
    }

    if (!pdfFile) {
      alert('Veuillez choisir un PDF');
      return;
    }

    try {
      setLoading(true);

      const coverUrl =
        await uploadCover();

      const pdfUrl =
        await uploadPdf();

      const { error } =
        await supabase
          .from('ebooks')
          .insert({
            title,
            author,
            description,
            category,
            cover_url: coverUrl,
            pdf_url: pdfUrl,
            is_published:
              isPublished,
            is_featured:
              isFeatured,
          });

      if (error) throw error;

      alert(
        'E-book ajouté avec succès'
      );

      navigate(
        '/superadmin/ebooks'
      );
    } catch (error) {
      console.error(error);

      alert(
        "Erreur lors de l'ajout"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* HEADER */}

      <div className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b">

        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

          <button
            onClick={() =>
              navigate(
                '/superadmin/ebooks'
              )
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <h1 className="font-bold">
            Ajouter un E-book
          </h1>

          <div />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">

        {/* HERO */}

        <div className="bg-gradient-to-r from-orange-600 via-orange-700 to-red-700 rounded-3xl p-8 text-white mb-6">

          <Library className="w-12 h-12 mb-3" />

          <h1 className="text-3xl font-bold">
            Nouvel E-book
          </h1>

          <p className="opacity-90 mt-2">
            Ajouter un livre numérique
          </p>

        </div>

        {/* FORM */}

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow space-y-5">

          <div>
            <label className="font-medium">
              Titre
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-medium">
              Auteur
            </label>

            <input
              type="text"
              value={author}
              onChange={(e) =>
                setAuthor(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-medium">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-medium">
              Catégorie
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* COVER */}

          <div>
            <label className="font-medium">
              Couverture
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCoverFile(
                  e.target.files?.[0] ||
                    null
                )
              }
              className="w-full mt-2"
            />
          </div>

          {/* PDF */}

          <div>
            <label className="font-medium">
              Fichier PDF
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setPdfFile(
                  e.target.files?.[0] ||
                    null
                )
              }
              className="w-full mt-2"
            />
          </div>

          {/* OPTIONS */}

          <div className="space-y-3">

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  isPublished
                }
                onChange={(e) =>
                  setIsPublished(
                    e.target.checked
                  )
                }
              />
              Publié
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={
                  isFeatured
                }
                onChange={(e) =>
                  setIsFeatured(
                    e.target.checked
                  )
                }
              />
              Mis en avant
            </label>

          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full
              bg-primary-600
              hover:bg-primary-700
              text-white
              py-4
              rounded-2xl
              flex
              items-center
              justify-center
              gap-3
            "
          >
            {loading ? (
              'Upload en cours...'
            ) : (
              <>
                <Save className="w-5 h-5" />
                Enregistrer
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}