# DSA Quest — Frontend (Redesigned)

A modern, premium visual refresh of the DSA Quest learning app, inspired by the
UI/UX patterns of LeetCode, Duolingo, Khan Academy, NeetCode, AlgoMonster,
HackerRank, and Codeforces — no code or branding copied from any of them.

This redesign is **frontend-only**. It works as a drop-in replacement for your
existing `frontend/` folder and talks to your existing backend exactly as
before: same routes, same request/response shapes, same auth, same env vars.

## What changed

- **Visual system** — new CSS-variable-based theme (`src/index.css`) covering
  light and dark mode, without touching `tailwind.config.js`. Colors still
  come from the `quest-*` tokens already defined there.
- **Typography** — Baloo 2 (display/headings, used sparingly), Inter (body/UI
  text), JetBrains Mono (indices, XP counts, Big-O complexity tags) — loaded
  via `index.html`.
- **Dark/light mode** — new `ThemeContext`, toggled from the navbar, persisted
  in `localStorage`, defaults to system preference.
- **Dashboard** — hero section with an XP progress ring, a "Learning Path"
  presentation of your topics (they're already ordered 1/2/3 in the schema),
  a restyled progress chart, and a badge shelf.
- **Badges** — computed client-side from data the dashboard endpoint already
  returns (`visualizerDone`, `quizBestScore`, `xp`). No backend changes.
- **Streak** — tracked locally in the browser (`localStorage`), since the
  backend has no streak field. This is intentionally a local, per-device
  indicator rather than an account-wide synced stat — labelled as such via
  its tooltip.
- **Sound effects** — small synthesized beeps via the Web Audio API (no audio
  files, no new packages), toggleable from the navbar, off/on persisted
  locally.
- **Visualizers** (Arrays/Stack/Queue) — same interaction logic and XP
  thresholds as before, restyled with a LeetCode-style complexity chip row
  (e.g. `Access by index · O(1)`) and a "How it works" step list plus a
  real-life example callout.
- **Quiz** — same submit flow, now also surfaces the `correctCount`,
  `total`, and per-question `results` fields your backend already returns
  but the old UI didn't use — added as an optional "Review answers" screen.

## What did not change

- `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`,
  `tailwind.config.js`, `postcss.config.js` — byte-identical to your originals.
- No new npm packages. Everything above is built from what was already
  installed: `axios`, `canvas-confetti`, `framer-motion`, `lucide-react`,
  `react-hook-form` + `zod` + `@hookform/resolvers`, `react-router-dom`,
  `recharts`, `sonner`.
- `src/App.tsx` and `src/context/AuthContext.tsx` — untouched. Same routes,
  same login/signup/logout/token logic, same `localStorage` key
  (`dsaquest_token`).
- Every API call: same endpoints, same HTTP methods, same request bodies,
  same base URL resolution (`VITE_API_URL` env var, unchanged).

## Running it

1. Delete your current `frontend/` folder.
2. Paste this folder in as `frontend/`.
3. From inside `frontend/`:
   ```bash
   npm install
   npm run dev
   ```
4. Make sure your backend is running (unchanged) and `VITE_API_URL` (if you
   set one) still points at it — defaults to `http://localhost:4000/api`.

That's it — no new env vars, no new config, no backend changes required.

## New files added

```
src/context/ThemeContext.tsx       dark/light mode
src/components/ThemeToggle.tsx
src/components/SoundToggle.tsx
src/components/XPRing.tsx          radial XP/level indicator
src/components/StreakWidget.tsx    local daily-streak indicator
src/components/BadgeShelf.tsx
src/components/ComplexityChip.tsx  Big-O tag used on visualizer pages
src/lib/sound.ts                   Web Audio synthesized sound effects
src/lib/badges.ts                  client-side badge computation
src/lib/streak.ts                  local streak tracking
```

All other files under `src/` are the same files you had, restyled in place.
