import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

import {
  ArrowLeft,
  Upload,
  Save,
  BookOpen,
} from 'lucide-react';

export default function AddWirdPage() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const [pdfUrl, setPdfUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const [isPublished, setIsPublished] =
    useState(false);

  const [isFeatured, setIsFeatured] =
    useState(false);

  const uploadPdf = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('wirds')
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('wirds')
      .getPublicUrl(fileName);

    setPdfUrl(publicUrl);

    alert('PDF téléchargé');
  };

  const uploadAudio = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from('audios')
      .upload(fileName, file);

    if (error) {
      alert(error.message);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('audios')
      .getPublicUrl(fileName);

    setAudioUrl(publicUrl);

    alert('Audio téléchargé');
  };

  const handleSave = async () => {
    if (!title) {
      alert('Titre obligatoire');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('wirds')
        .insert({
          title,
          category,
          description,
          content,
          pdf_url: pdfUrl,
          audio_url: audioUrl,
          is_featured: isFeatured,
          is_published: isPublished,
        });

      if (error) {
        alert(error.message);
        return;
      }

      alert('Wird créé avec succès');

      navigate('/superadmin/wirds');
    } catch (err) {
      console.error(err);
      alert('Erreur');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">

      {/* Header */}

      <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b">

        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <h1 className="font-bold">
            Ajouter un Wird
          </h1>

          <div />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">

        {/* Hero */}

        <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white rounded-3xl p-8 mb-6">

          <BookOpen className="w-12 h-12 mb-4" />

          <h1 className="text-3xl font-bold">
            Nouveau Wird
          </h1>

          <p className="opacity-90 mt-2">
            Ajouter un nouveau wird dans la plateforme.
          </p>

        </div>

        {/* Formulaire */}

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Titre
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Catégorie
            </label>

            <input
              type="text"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={3}
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Contenu
            </label>

            <textarea
              rows={10}
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* PDF */}

          <div>
            <label className="block mb-2 font-medium">
              PDF
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={uploadPdf}
              className="w-full border rounded-xl px-4 py-3"
            />

            {pdfUrl && (
              <p className="text-green-600 mt-2">
                PDF téléchargé
              </p>
            )}
          </div>

          {/* AUDIO */}

          <div>
            <label className="block mb-2 font-medium">
              Audio MP3
            </label>

            <input
              type="file"
              accept="audio/*"
              onChange={uploadAudio}
              className="w-full border rounded-xl px-4 py-3"
            />

            {audioUrl && (
              <p className="text-green-600 mt-2">
                Audio téléchargé
              </p>
            )}
          </div>

          {/* Options */}

          <div className="flex flex-col gap-4">

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) =>
                  setIsPublished(
                    e.target.checked
                  )
                }
              />

              Publier immédiatement

            </label>

            <label className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) =>
                  setIsFeatured(
                    e.target.checked
                  )
                }
              />

              Mettre en vedette

            </label>

          </div>

          {/* Bouton */}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />

            {saving
              ? 'Enregistrement...'
              : 'Créer le Wird'}
          </button>

        </div>

      </div>
    </div>
  );
}