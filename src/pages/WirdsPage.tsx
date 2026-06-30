import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { ACTIVE_WIRDS } from '../data/wirds';

export default function WirdsPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const total = ACTIVE_WIRDS.length;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#f6f7fb] via-[#f2f4f7] to-[#eef2f6] dark:from-gray-950 dark:via-gray-950 dark:to-gray-900 pb-24">

      {/* ========================= */}
      {/* 🌟 SPIRITUAL BACKGROUND */}
      {/* ========================= */}

      {/* soft glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[420px] h-[420px] bg-green-300/20 blur-[130px] rounded-full" />
      <div className="absolute bottom-[-120px] right-[-60px] w-[320px] h-[320px] bg-blue-300/10 blur-[120px] rounded-full" />

      {/* particles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

        <div className="absolute w-2 h-2 bg-white/40 rounded-full animate-pulse top-[10%] left-[20%]" />
        <div className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping top-[30%] left-[70%]" />
        <div className="absolute w-2 h-2 bg-green-200/30 rounded-full animate-pulse top-[60%] left-[40%]" />
        <div className="absolute w-1 h-1 bg-white/20 rounded-full animate-ping top-[80%] left-[20%]" />
        <div className="absolute w-2 h-2 bg-green-300/20 rounded-full animate-pulse top-[20%] left-[80%]" />

      </div>

      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}
      <div className="bg-primary-800 text-white relative z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-white/10 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-xl font-bold">
            📖 {t('wirdLazim')}
          </h1>
        </div>
      </div>

      {/* ========================= */}
      {/* CARD WRAPPER */}
      {/* ========================= */}
      <div className="max-w-2xl mx-auto px-4 pt-10 relative z-10">

        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/wird/1')}
          className="
            relative rounded-[28px] overflow-hidden cursor-pointer
            shadow-2xl border border-white/20
            bg-white/10 backdrop-blur-xl
          "
        >

          {/* IMAGE */}
          <div className="relative h-60 sm:h-72">

            <img
              src="/images/wirds/1.jpg"
              alt="Wird Khadiriya"
              className="w-full h-full object-cover scale-[1.05] hover:scale-110 transition-transform duration-700"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* badge */}
            <div className="
              absolute top-5 left-5
              bg-white/10 backdrop-blur-md
              border border-white/20
              rounded-full px-4 py-1.5
              flex items-center gap-2
            ">
              <BookOpen className="w-4 h-4 text-white" />
              <span className="text-white text-xs font-medium">
                {total} wirds
              </span>
            </div>

          </div>

          {/* TEXT */}
          <div className="bg-white/90 dark:bg-gray-900/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-wide">
                الورد الخضيرية
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Wird Khadirya • {total} litanies
              </p>
            </div>

            {/* button */}
            <div className="
              bg-gradient-to-br from-primary-600 to-primary-800
              rounded-full p-3 shadow-lg
              hover:scale-110 transition
            ">
              <ChevronRight className="w-5 h-5 text-white" />
            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
}