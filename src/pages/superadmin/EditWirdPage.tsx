import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/neon';

import {
  ArrowLeft,
  Save,
  BookOpen,
} from 'lucide-react';

export default function EditWirdPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (id) {
      loadWird();
    }
  }, [id]);

  const loadWird = async () => {
    try {
      const { data, error } = await supabase
        .from('wirds')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error(error);
        alert('Wird introuvable');
        navigate('/superadmin/wirds');
        return;
      }

      setTitle(data.title || '');
      setCategory(data.category || '');
      setDescription(data.description || '');
      setContent(data.content || '');

      setPdfUrl(data.pdf_url || '');
      setAudioUrl(data.audio_url || '');

      setIsPublished(data.is_published || false);
      setIsFeatured(data.is_featured || false);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const uploadPdf = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName =
      Date.now() + '-' + file.name;

    const { error } = await supabase.storage
      .from('wirds')
      .upload(fileName, file, {
        upsert: true,
      });

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

    alert('PDF remplacé');
  };

  const uploadAudio = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const fileName =
      Date.now() + '-' + file.name;

    const { error } = await supabase.storage
      .from('audios')
      .upload(fileName, file, {
        upsert: true,
      });

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

    alert('Audio remplacé');
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const { error } = await supabase
        .from('wirds')
        .update({
          title,
          category,
          description,
          content,

          pdf_url: pdfUrl,
          audio_url: audioUrl,

          is_featured: isFeatured,
          is_published: isPublished,

          updated_at:
            new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        alert(error.message);
        return;
      }

      alert('Wird mis à jour');

      navigate('/superadmin/wirds');
    } catch (err) {
      console.error(err);
      alert('Erreur');
    } finally {
      setSaving(false);
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
            Modifier un Wird
          </h1>

          <div />
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">

        {/* HERO */}

        <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white rounded-3xl p-8 mb-6">

          <BookOpen className="w-12 h-12 mb-4" />

          <h1 className="text-3xl font-bold">
            Modifier le Wird
          </h1>

          <p className="opacity-90 mt-2">
            Mise à jour du contenu
          </p>

        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow p-6 space-y-6">

          <div>
            <label className="block mb-2">
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
            <label className="block mb-2">
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
            <label className="block mb-2">
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
            <label className="block mb-2">
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

          <div>
            <label className="block mb-2">
              Remplacer le PDF
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={uploadPdf}
            />

            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary-600 block mt-2"
              >
                Voir le PDF actuel
              </a>
            )}
          </div>

          <div>
            <label className="block mb-2">
              Remplacer l'audio
            </label>

            <input
              type="file"
              accept="audio/*"
              onChange={uploadAudio}
            />

            {audioUrl && (
              <audio
                controls
                className="mt-3 w-full"
              >
                <source
                  src={audioUrl}
                />
              </audio>
            )}
          </div>

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
            Publier
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

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />

            {saving
              ? 'Mise à jour...'
              : 'Enregistrer les modifications'}
          </button>

        </div>
      </div>
    </div>
  );
}