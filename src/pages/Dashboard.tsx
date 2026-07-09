import Header from "../components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Info } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [showConditions, setShowConditions] = useState(false);

  const cards = [
    {
      route: "/wirds",
      image: "/images/wirds/1.jpg",
      title: `📖 ${t("wirdKhadirya")}`,
      description: `${t("wirdsTitle")} • ${t("spiritualReading")}`,
    },
    {
      route: "/audio",
      image: "/images/wirds/2.jpg",
      title: `🎧 ${t("audioTitle")}`,
      description: t("listenRecitations"),
    },
    {
      route: "/ebooks",
      image: "/images/wirds/3.jpg",
      title: `📚 ${t("ebookTitle")}`,
      description: t("booksTexts"),
    },
    {
      route: "/Médiatheque",
      image: "/images/wirds/4.jpg",
      title: `🎬 ${t("mediaTitle")}`,
      description: t("videosContents"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f6f6] to-white dark:from-gray-950 dark:to-gray-900">
      <Header />

      <main className="max-w-2xl mx-auto px-4 pb-24">

        {/* CONDITIONS */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowConditions(!showConditions)}
          className="
            mt-6 flex items-center justify-between
            bg-blue-500/10 backdrop-blur-xl
            border border-blue-300/30
            dark:border-blue-500/20
            rounded-2xl px-4 py-4 shadow-md
            cursor-pointer
          "
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/20">
              <Info size={18} className="text-blue-600" />
            </div>

            <span className="font-semibold text-gray-800 dark:text-white">
              {t("conditions")}
            </span>
          </div>

          <ChevronRight
            size={20}
            className={`text-blue-500 transition-transform duration-300 ${
              showConditions ? "rotate-90" : ""
            }`}
          />
        </motion.div>

        {/* CONDITIONS CONTENT */}
        <AnimatePresence>
          {showConditions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div
                className="
                  mt-3 p-5 rounded-2xl
                  bg-blue-500/5 backdrop-blur-xl
                  border border-blue-200/30
                  text-sm text-gray-600 dark:text-gray-300 leading-relaxed
                "
              >
                {t("conditionsText")}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TITLE */}
        <h2 className="text-xl font-bold mt-7 mb-4 text-gray-800 dark:text-white">
          {t("quickAccess")}
        </h2>

        {/* CARDS */}
        <div className="grid grid-cols-2 gap-4">
          {cards.map((card) => (
            <motion.div
              key={card.route}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(card.route)}
              className="cursor-pointer"
            >
              <div
                className="
                  rounded-2xl overflow-hidden
                  shadow-lg hover:shadow-2xl transition
                  bg-white dark:bg-gray-900
                "
              >
                {/* IMAGE */}
                <div className="relative h-56">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                {/* TEXTE */}
                <div className="px-3 py-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                    {card.title}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}