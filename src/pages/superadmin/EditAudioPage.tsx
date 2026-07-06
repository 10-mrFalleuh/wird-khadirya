import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';

import {
  ArrowLeft,
  Save,
  Headphones,
} from 'lucide-react';

export default function EditAudioPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [title, setTitle] =
    useState('');

  const [description, setDescription] =
    useState('');

  const [category, setCategory] =
    useState('');

  const [duration, setDuration] =
    useState('');

  const [coverUrl, setCoverUrl] =
    useState('');

  const [audioUrl, setAudioUrl] =
    useState('');

  const [coverFile, setCoverFile] =
    useState<File | null>(null);

  const [audioFile, setAudioFile] =
    useState<File | null>(null);

  const [isPublished, setIsPublished] =
    useState(false);

  const [isFeatured, setIsFeatured] =
    useState(false);

  useEffect(() => {
    if (id) {
      loadAudio();
    }
  }, [id]);

  const loadAudio = async () => {
    try {
      const { data, error } =
        await supabase
          .from('audios')
          .select('*')
          .eq('id', id)
          .single();

      if (error) throw error;

      setTitle(data.title || '');
      setDescription(
        data.description || ''
      );
      setCategory(data.category || '');
      setDuration(data.duration || '');

      setCoverUrl(
        data.cover_url || ''
      );

      setAudioUrl(
        data.audio_url || ''
      );

      setIsPublished(
        data.is_published || false
      );

      setIsFeatured(
        data.is_featured || false
      );

    } catch (error) {
      console.error(error);
      alert(
        "Impossible de charger l'audio"
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadCover = async () => {
    if (!coverFile) return coverUrl;

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
    if (!audioFile) return audioUrl;

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

  const handleSave = async () => {
    try {
      setSaving(true);

      const finalCoverUrl =
        await uploadCover();

      const finalAudioUrl =
        await uploadAudio();

      const { error } =
        await supabase
          .from('audios')
          .update({
            title,
            description,
            category,
            duration,

            cover_url:
              finalCoverUrl,

            audio_url:
              finalAudioUrl,

            is_published:
              isPublished,

            is_featured:
              isFeatured,

            updated_at:
              new Date().toISOString(),
          })
          .eq('id', id);

      if (error) throw error;

      alert(
        'Audio mis à jour avec succès'
      );

      navigate(
        '/superadmin/audios'
      );

    } catch (error) {
      console.error(error);

      alert(
        'Erreur lors de la mise à jour'
      );
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
            Modifier Audio
          </h1>

          <div />
        </div>

      </div>

      <div className="max-w-4xl mx-auto p-4">

        {/* HERO */}

        <div className="bg-gradient-to-r from-purple-700 to-indigo-900 rounded-3xl p-8 text-white mb-6">

          <Headphones className="w-12 h-12 mb-3" />

          <h1 className="text-3xl font-bold">
            Modifier Audio
          </h1>

          <p className="opacity-90 mt-2">
            Mise à jour du contenu audio
          </p>

        </div>

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
              Couverture actuelle
            </label>

            {coverUrl && (
              <img
                src={coverUrl}
                alt="cover"
                className="w-40 rounded-2xl mt-3 mb-3"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCoverFile(
                  e.target.files?.[0] ||
                    null
                )
              }
            />

          </div>

          {/* AUDIO */}

          <div>

            <label className="font-medium">
              Audio actuel
            </label>

            {audioUrl && (
              <audio
                controls
                className="w-full mt-3 mb-3"
              >
                <source
                  src={audioUrl}
                />
              </audio>
            )}

            <input
              type="file"
              accept="audio/*"
              onChange={(e) =>
                setAudioFile(
                  e.target.files?.[0] ||
                    null
                )
              }
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
            onClick={handleSave}
            disabled={saving}
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
            {saving ? (
              'Enregistrement...'
            ) : (
              <>
                <Save className="w-5 h-5" />
                Mettre à jour
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}