import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Download, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Ebook {
  id: string;
  title: string;
  author: string;
  description?: string;
  category?: string;
  pdf_url: string;
  cover_url?: string;
}

export default function EbooksPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    try {
      const { data, error } = await supabase
        .from('ebooks')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setEbooks(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-950 pb-24">

      {/* Header */}
      <div className="bg-primary-800 text-white">
        <div className="max-w-2xl mx-auto p-4 flex items-center gap-3">

          <button onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-bold">
            📚 {t('ebooksTitle')}
          </h1>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-10">
          {t('loading')}
        </div>
      )}

      {/* Liste */}
      {!loading && (
        <div className="max-w-2xl mx-auto p-4 space-y-4">

          {ebooks.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto text-primary-400 mb-4" />
              <p className="font-medium">{t('noEbooks')}</p>
              <p className="text-sm mt-2">{t('noEbooksDesc')}</p>
            </div>
          )}

          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="
                bg-white
                dark:bg-gray-900
                rounded-2xl
                shadow
                overflow-hidden
              "
            >

              {ebook.cover_url && (
                <img
                  src={ebook.cover_url}
                  alt={ebook.title}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-4">

                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-lg">
                    {ebook.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-500">
                  {ebook.author}
                </p>

                {ebook.category && (
                  <span
                    className="
                      inline-block
                      mt-2
                      text-xs
                      px-2
                      py-1
                      bg-primary-100
                      dark:bg-primary-900/30
                      text-primary-700
                      dark:text-primary-300
                      rounded-full
                    "
                  >
                    {ebook.category}
                  </span>
                )}

                {ebook.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                    {ebook.description}
                  </p>
                )}

                <a
                  href={ebook.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-3
                    inline-flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-primary-600
                    hover:text-primary-700
                  "
                >
                  <Download className="w-4 h-4" />
                  {t('downloadEbook')}
                </a>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
