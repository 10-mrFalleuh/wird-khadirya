import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  Home,
  Volume2,
  Library,
  Settings,
  BookOpen,
} from 'lucide-react';

const navItems = [
  {
    to: '/',
    icon: Home,
    labelKey: 'dashboard',
  },
  {
    to: '/wirds',
    icon: BookOpen,
    labelKey: 'wirds',
  },
  {
    to: '/audio',
    icon: Volume2,
    labelKey: 'audio',
  },
  {
    to: '/media',
    icon: Library,
    labelKey: 'mediaLibrary',
  },
  {
    to: '/settings',
    icon: Settings,
    labelKey: 'settings',
  },
];

export default function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-white/95 dark:bg-gray-900/95
        backdrop-blur-md
        border-t border-gray-200 dark:border-gray-800
        safe-bottom
      "
    >
      <div className="max-w-2xl mx-auto flex items-center justify-around px-2">
        {navItems.map(({ to, icon: Icon, labelKey }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `
              flex flex-col items-center gap-0.5
              py-2 px-3
              text-[10px] sm:text-xs
              font-medium
              transition-colors
              touch-target
              ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-400 dark:text-gray-500 active:text-gray-600 dark:active:text-gray-300'
              }
            `
            }
          >
            <Icon className="w-5 h-5" />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}