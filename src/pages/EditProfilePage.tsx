import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTranslation } from 'react-i18next';

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      console.error(uploadError);
      alert(t('uploadError'));
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    setAvatarUrl(publicUrl);

    alert(t('uploadSuccess'));
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
        alert(t('saveError'));
        return;
      }

      alert(t('saveSuccess'));
      navigate('/profile');
    } catch (err) {
      console.error(err);
      alert(t('saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4">
      <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">

        <h1 className="text-2xl font-bold mb-6 text-center">
          {t('editProfileTitle')}
        </h1>

        <div className="space-y-4">

          {/* NOM */}
          <div>
            <label className="block mb-1 font-medium">
              {t('fullName')}
            </label>
            <input
              type="text"
              value={full_name}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block mb-1 font-medium">
              {t('phone')}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="block mb-1 font-medium">
              {t('country')}
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* AGE */}
          <div>
            <label className="block mb-1 font-medium">
              {t('age')}
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          {/* GENDER */}
          <div>
            <label className="block mb-1 font-medium">
              {t('gender')}
            </label>

            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full border rounded-xl px-4 py-3"
            >
              <option value="">{t('choose')}</option>
              <option value="male">{t('male')}</option>
              <option value="female">{t('female')}</option>
            </select>
          </div>

          {/* AVATAR */}
          <div>
            <label className="block mb-2 font-medium">
              {t('profilePhoto')}
            </label>

            {avatarUrl && (
              <img
                src={avatarUrl}
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

          {/* SAVE */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-medium"
          >
            {saving ? t('saving') : t('saveChanges')}
          </button>

        </div>
      </div>
    </div>
  );
}