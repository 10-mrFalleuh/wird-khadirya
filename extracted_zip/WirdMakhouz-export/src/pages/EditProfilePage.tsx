import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function EditProfilePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [full_name, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setFullName(data.full_name || '');
      setPhone(data.phone || '');
      setCountry(data.country || '');
      setAge(data.age || '');
      setGender(data.gender || '');
      setAvatarUrl(data.avatar_url || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const fileExt = file.name.split('.').pop();
  const fileName = `${user.id}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error(uploadError);
    alert("Erreur lors de l'upload");
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  setAvatarUrl(publicUrl);

  alert('Photo téléchargée avec succès');
};

  const handleSave = async () => {
    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name,
          phone,
          country,
          age,
          gender,
          avatar_url: avatarUrl,
        })
        .eq('id', user.id);

      if (error) {
        console.error(error);
        alert('Erreur lors de la sauvegarde');
        return;
      }

      alert('Profil mis à jour avec succès');
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde');
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Modifier mon profil
        </h1>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 font-medium">
              Nom complet
            </label>
            <input
              type="text"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Téléphone
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Pays
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Âge
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Sexe
            </label>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">Choisir</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
            </select>
          </div>

          <div>
  <label className="block mb-2 font-medium">
    Photo de profil
  </label>

  {avatarUrl && (
    <img
      src={avatarUrl}
      alt="Avatar"
      className="w-24 h-24 rounded-full object-cover border mb-3"
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={handleAvatarUpload}
    className="w-full border rounded-xl px-4 py-3"
  />
</div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium"
          >
            {saving
              ? 'Sauvegarde...'
              : 'Enregistrer les modifications'}
          </button>

        </div>
      </div>
    </div>
  );
}