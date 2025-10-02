# 03-react-movies

Vite + React + TypeScript. Movies search via TMDB API.

## Setup

1. Install deps
   ```bash
   npm i
   ```

2. Create `.env` from template:
   ```
   VITE_TMDB_TOKEN=your_tmdb_read_access_token
   ```

3. Run dev
   ```bash
   npm run dev
   ```

> **Important:** `.env` is intentionally **ignored** by Git (see `.gitignore`). For Vercel, set the variable in Project Settings → Environment Variables.

## Scripts
- `npm run dev` – start dev server on 5174
- `npm run build` – type-check + build
- `npm run preview` – preview production build
- `npm run format` – Prettier format

## Structure
- `src/types/movie.ts` – shared Movie interface
- `src/services/movieService.ts` – axios calls + image URL helper
- `src/components/*` – UI components with CSS Modules
- `src/App.tsx` – glue logic: search, loader, errors, modal via portal
