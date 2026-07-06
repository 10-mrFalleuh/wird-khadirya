import { useState } from 'react';
import { supabase } from '../../lib/neon';
import { useNavigate } from 'react-router-dom';

import {
  ArrowLeft,
  Upload,
  Save,
  Headphones,
} from 'lucide-react';

export default function AddAudioPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');

  const [coverFile, setCoverFile] =
    useState<File | null>(null);

  const [audioFile, setAudioFile] =
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

  const uploadAudio = async () => {
    if (!audioFile) return '';

    const fileName =
      `${Date.now()}-${audioFile.name}`;

    const { error } =
      await supabase.storage
        .from('audios')
        .upload(fileName, audioFile);

    if (error) throw error;

    const { data } =
      supabase.storage
        .from('audios')
        .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('Titre obligatoire');
      return;
    }

    if (!audioFile) {
      alert('Sélectionnez un fichier audio');
      return;
    }

    try {
      setLoading(true);

      const coverUrl =
        await uploadCover();

      const audioUrl =
        await uploadAudio();

      const { error } =
        await supabase
          .from('audios')
          .insert({
            title,
            description,
            category,
            duration,
            audio_url: audioUrl,
            cover_url: coverUrl,
            is_published:
              isPublished,
            is_featured:
              isFeatured,
          });

      if (error) throw error;

      alert(
        'Audio ajouté avec succès'
      );

      navigate(
        '/superadmin/audios'
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
                '/superadmin/audios'
              )
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>

          <h1 className="font-bold">
            Ajouter un Audio
          </h1>

          <div />
        </div>

      </div>

      <div className="max-w-4xl mx-auto p-4">

        {/* HERO */}

        <div className="bg-gradient-to-r from-purple-700 to-indigo-900 rounded-3xl p-8 text-white mb-6">

          <Headphones className="w-12 h-12 mb-3" />

          <h1 className="text-3xl font-bold">
            Nouvel Audio
          </h1>

          <p className="opacity-90 mt-2">
            Ajouter une récitation
            ou conférence.
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
              Description
            </label>

            <textarea
              rows={4}
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

          <div>
            <label className="font-medium">
              Durée
            </label>

            <input
              type="text"
              placeholder="Ex: 12 min"
              value={duration}
              onChange={(e) =>
                setDuration(
                  e.target.value
                )
              }
              className="w-full border rounded-xl p-3 mt-2"
            />
          </div>

          {/* COVER */}

          <div>
            <label className="font-medium">
              Image de couverture
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

          {/* AUDIO */}

          <div>
            <label className="font-medium">
              Fichier MP3
            </label>

            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setAudioFile(
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

          {/* SAVE */}

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