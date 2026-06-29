# Wird Makhouz Mouridiya

Application de pratique spirituelle pour la Tariqa Mouridiya.

## Architecture

- **Framework**: React 18 + TypeScript + Vite 7
- **Styling**: Tailwind CSS 3.4 avec thème personnalisé (couleurs primary, gold, cream)
- **i18n**: i18next (FR, EN, AR, MS, ES, TR, FA)
- **State**: Zustand
- **Routing**: React Router DOM 6
- **Backend**: Supabase (auth + data)
- **Animations**: Framer Motion

## Structure clé

- `src/data/litanies.ts` — Données des 14 wirds, chacun séparé en sa propre carte/section
- `src/i18n/index.ts` — Toutes les traductions (7 langues)
- `src/pages/` — Pages principales (Dashboard, WirdsPage, WirdReader, AudioPage, EbooksPage, MediaLibraryPage, AboutPage)
- `src/components/WirdCard.tsx` — Carte individuelle par wird

## Conventions

- Nom de l'app : **Wird Makhouz Mouridiya**
- Tariqa : **Mouridiya** (fondée par Cheikh Ahmadou Bamba Mbacké رضي الله عنه)
- Les wirds sont affichés individuellement (Wird 1, Wird 2... Wird 14), un par carte
- Tous les textes UI utilisent `t()` pour la traduction multilingue
- Audios : Mawahibu Nafi, Assalamu Alayka, Sindidi, Jawartu
- Build : `npm run build`
