export const PROJECT = import.meta.env.VITE_PROJECT || "khadirya";

export const APP_CONFIG = {
  makhouz: {
    name: "Wird Makhouz Mouridya",
    shortName: "Makhouz",
    theme: {
      primary: "#0ea5e9",
      secondary: "#1e293b",
    },
  },

  khadirya: {
    name: "Wird Khadirya",
    shortName: "Khadirya",
    theme: {
      primary: "#16a34a",
      secondary: "#14532d",
    },
  },
};

export const ACTIVE_APP = APP_CONFIG[PROJECT as keyof typeof APP_CONFIG];