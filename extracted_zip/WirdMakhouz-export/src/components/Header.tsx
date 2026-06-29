import { useTranslation } from 'react-i18next';
import { useAppStore, type Language } from '../store/appStore';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'ar', label: 'عر', flag: '🇸🇦' },
  { code: 'ms', label: 'MS', flag: '🇲🇾' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'tr', label: 'TR', flag: '🇹🇷' },
];

export default function Header() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme, language, setLanguage } = useAppStore();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setShowLangMenu(false);
  };

  const currentLang = languages.find((l) => l.code === language);

  return (
    <header className="glass-header text-white safe-top sticky top-0 z-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        {/* Top row: greeting + controls */}
        <div className="flex items-center justify-between">
          <div>
            <p className="font-arabic text-base sm:text-lg leading-tight opacity-90">
              {t('greeting')}
            </p>
            <p className="text-xs sm:text-sm font-light opacity-75 mt-0.5">
              {t('greetingSub')}
            </p>
            <h1 className="text-sm sm:text-base font-display font-semibold mt-0.5 tracking-wide">
              {t('appName')}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Selector */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-2 rounded-lg 
                           bg-white/15 hover:bg-white/25 active:bg-white/35 transition-colors 
                           text-sm touch-target"
              >
                <span className="text-sm">{currentLang?.flag}</span>
                <span className="text-[10px] sm:text-xs font-medium">{currentLang?.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 
                                rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 
                                overflow-hidden z-50 min-w-[130px] animate-slide-up
                                max-h-[280px] overflow-y-auto">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-3 py-3 sm:py-2.5 text-left flex items-center gap-2 
                                  hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 
                                  dark:active:bg-gray-600 transition-colors
                                  text-gray-800 dark:text-gray-200 text-sm touch-target
                                  ${language === lang.code ? 'bg-primary-50 dark:bg-primary-900/30' : ''}`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/35 
                         transition-colors touch-target"
              aria-label={theme === 'light' ? t('darkMode') : t('lightMode')}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
