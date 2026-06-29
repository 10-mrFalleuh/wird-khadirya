import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language =
  | 'fr'
  | 'en'
  | 'ar'
  | 'ms'
  | 'es'
  | 'tr'
  | 'fa';

export type Theme = 'light' | 'dark';

interface CounterState {
  [key: string]: number;
}

interface UserProfile {
  email: string;
  displayName: string;
  age: string;
  gender: string;
  phone: string;
  country: string;
  provider: 'email' | 'google';
}

interface MediaLink {
  id: string;
  title: string;
  url: string;
  type: 'web' | 'youtube';
  addedAt: string;
}

interface AppState {
  // Auth
  isAuthenticated: boolean;
  authLoading: boolean;
  user: UserProfile | null;

  login: (user: UserProfile) => void;
  logout: () => void;
  setAuthLoading: (loading: boolean) => void;

  // Language & Theme
  language: Language;
  theme: Theme;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Counters
  counters: CounterState;
  incrementCounter: (
    wirdId: number,
    litanyId: number
  ) => void;
  decrementCounter: (
    wirdId: number,
    litanyId: number
  ) => void;
  resetCounter: (
    wirdId: number,
    litanyId: number
  ) => void;
  resetAllCounters: (wirdId: number) => void;
  getCounter: (
    wirdId: number,
    litanyId: number
  ) => number;

  // Media Library
  mediaLinks: MediaLink[];
  addMediaLink: (
    link: Omit<MediaLink, 'id' | 'addedAt'>
  ) => void;
  removeMediaLink: (id: string) => void;

  // Settings
  notifications: boolean;
  autoReset: boolean;
  setNotifications: (val: boolean) => void;
  setAutoReset: (val: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ====================
      // AUTH
      // ====================

      isAuthenticated: false,
      authLoading: true,
      user: null,

      login: (user) =>
        set({
          isAuthenticated: true,
          user,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),

      setAuthLoading: (loading) =>
        set({
          authLoading: loading,
        }),

      // ====================
      // LANGUAGE & THEME
      // ====================

      language: 'fr',

      theme: 'light',

      setLanguage: (language) => {
        set({ language });

        document.documentElement.dir =
          language === 'ar'
            ? 'rtl'
            : 'ltr';

        document.documentElement.lang =
          language;
      },

      setTheme: (theme) => {
        set({ theme });

        if (theme === 'dark') {
          document.documentElement.classList.add(
            'dark'
          );
          document.body.classList.add(
            'dark'
          );
        } else {
          document.documentElement.classList.remove(
            'dark'
          );
          document.body.classList.remove(
            'dark'
          );
        }
      },

      toggleTheme: () => {
        const current = get().theme;

        get().setTheme(
          current === 'light'
            ? 'dark'
            : 'light'
        );
      },

      // ====================
      // COUNTERS
      // ====================

      counters: {},

      incrementCounter: (
        wirdId,
        litanyId
      ) => {
        const key = `${wirdId}-${litanyId}`;

        set((state) => ({
          counters: {
            ...state.counters,
            [key]:
              (state.counters[key] || 0) + 1,
          },
        }));
      },

      decrementCounter: (
        wirdId,
        litanyId
      ) => {
        const key = `${wirdId}-${litanyId}`;

        set((state) => ({
          counters: {
            ...state.counters,
            [key]: Math.max(
              0,
              (state.counters[key] || 0) - 1
            ),
          },
        }));
      },

      resetCounter: (
        wirdId,
        litanyId
      ) => {
        const key = `${wirdId}-${litanyId}`;

        set((state) => ({
          counters: {
            ...state.counters,
            [key]: 0,
          },
        }));
      },

      resetAllCounters: (wirdId) => {
        set((state) => {
          const newCounters = {
            ...state.counters,
          };

          Object.keys(
            newCounters
          ).forEach((key) => {
            if (
              key.startsWith(
                `${wirdId}-`
              )
            ) {
              newCounters[key] = 0;
            }
          });

          return {
            counters: newCounters,
          };
        });
      },

      getCounter: (
        wirdId,
        litanyId
      ) => {
        return (
          get().counters[
            `${wirdId}-${litanyId}`
          ] || 0
        );
      },

      // ====================
      // MEDIA LIBRARY
      // ====================

      mediaLinks: [],

      addMediaLink: (link) => {
        set((state) => ({
          mediaLinks: [
            ...state.mediaLinks,
            {
              ...link,
              id: Date.now().toString(),
              addedAt:
                new Date().toISOString(),
            },
          ],
        }));
      },

      removeMediaLink: (id) => {
        set((state) => ({
          mediaLinks:
            state.mediaLinks.filter(
              (l) => l.id !== id
            ),
        }));
      },

      // ====================
      // SETTINGS
      // ====================

      notifications: true,

      autoReset: false,

      setNotifications: (val) =>
        set({
          notifications: val,
        }),

      setAutoReset: (val) =>
        set({
          autoReset: val,
        }),
    }),
    {
      name: 'wird-tidiane-storage',

      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
        counters: state.counters,
        isAuthenticated:
          state.isAuthenticated,
        user: state.user,
        mediaLinks: state.mediaLinks,
        notifications:
          state.notifications,
        autoReset: state.autoReset,
      }),
    }
  )
);