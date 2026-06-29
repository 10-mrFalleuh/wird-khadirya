import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../store/appStore";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Globe,
  Moon,
  Sun,
  Bell,
  RotateCcw,
  LogOut,
  Settings,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ShieldCheck } from "lucide-react";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    notifications,
    autoReset,
    setNotifications,
    setAutoReset,
    logout,
  } = useAppStore();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLanguageChange = (
    lang: "fr" | "en" | "ar" | "ms" | "es" | "tr" | "fa",
  ) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();

      logout();

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const langOptions = [
    {
      code: "fr" as const,
      label: "Français",
      flag: "🇫🇷",
    },
    {
      code: "en" as const,
      label: "English",
      flag: "🇬🇧",
    },
    {
      code: "ar" as const,
      label: "العربية",
      flag: "🇸🇦",
    },
    {
      code: "ms" as const,
      label: "Melayu",
      flag: "🇲🇾",
    },
    {
      code: "es" as const,
      label: "Español",
      flag: "🇪🇸",
    },
    {
      code: "tr" as const,
      label: "Türkçe",
      flag: "🇹🇷",
    },
    {
      code: "fa" as const,
      label: "فارسی",
      flag: "🇮🇷",
    },
  ];

  return (
    <div className="min-h-screen min-h-[100dvh] bg-cream dark:bg-gray-950 pb-24">
      {/* Header */}
      <div className="glass-header text-white safe-top sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg bg-white/15 active:bg-white/25 touch-target"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="font-display font-semibold text-lg">
            {t("settings")}
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* PROFILE CARD */}
        {profile && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
          >
            <div className="flex items-center gap-3">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Avatar"
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-500"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg">
                  {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  {profile.full_name}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => navigate("/profile")}
                className="text-left text-primary-600 text-sm font-medium"
              >
                Voir mon profil
              </button>

              <button
                onClick={() => navigate("/profile/edit")}
                className="text-left text-primary-600 text-sm font-medium"
              >
                Modifier mon profil
              </button>
            </div>
          </motion.div>
        )}

        {/* THEME */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
            {t("theme")}
          </h3>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-primary-500" />
              ) : (
                <Sun className="w-5 h-5 text-yellow-500" />
              )}

              <span>{theme === "dark" ? t("darkMode") : t("lightMode")}</span>
            </div>

            <div
              className={`w-11 h-6 rounded-full flex items-center px-0.5 ${
                theme === "dark" ? "bg-primary-600" : "bg-gray-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </button>
        </motion.div>

        {/* LANGUAGES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" />
            {t("language")}
          </h3>

          <div className="grid grid-cols-3 gap-2">
            {langOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`py-2 px-3 rounded-xl text-sm flex items-center justify-center gap-2
                ${
                  language === lang.code
                    ? "bg-primary-100 dark:bg-primary-900/40 border-2 border-primary-500"
                    : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                <span>{lang.flag}</span>
                <span className="text-xs">{lang.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* PREFERENCES */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t("preferences")}
          </h3>

          <button
            onClick={() => setNotifications(!notifications)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <span>{t("notificationsLabel")}</span>
            </div>
          </button>

          <button
            onClick={() => setAutoReset(!autoReset)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-3">
              <RotateCcw className="w-5 h-5 text-gray-400" />
              <span>{t("autoResetLabel")}</span>
            </div>
          </button>
        </motion.div>

        {/* ACCOUNT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
        >
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t("account")}
          </h3>

          <button
            onClick={() => navigate("/account-security")}
            className="w-full text-left py-2"
          >
            {t("accountSecurityTitle")}
          </button>
          <button
            onClick={() => navigate("/about")}
            className="
    w-full
    flex
    items-center
    justify-between
    py-3
    text-left
  "
          >
            <span>{t("about")}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </motion.div>

        {/* ADMINISTRATION */}
        {(profile?.role === "admin" || profile?.role === "super_admin") && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4"
          >
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              {t("administration")}
            </h3>

            <button
  onClick={() => navigate("/superadmin/dashboard")}
  className="
    w-full py-3 rounded-xl
    bg-indigo-50 dark:bg-indigo-900/20
    text-indigo-600 dark:text-indigo-400
    border border-indigo-200 dark:border-indigo-800
    font-medium
  "
>
  {t("openAdminDashboard")}
</button>
          </motion.div>
        )}

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          {t("logoutBtn")}
        </button>
      </div>
    </div>
  );
}
