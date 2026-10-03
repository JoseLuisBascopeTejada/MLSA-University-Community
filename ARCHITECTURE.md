# ARCHITECTURE.md

Status: **proposed — pending user approval.** Versions are NOT pinned here: the agent must install the latest stable version and verify compatibility between packages before recording it in `PROJECT_STATE.md`.

## 1. Decisions

| Area | Decision | Why | Alternative |
|---|---|---|---|
| Build tool | Vite + React + TypeScript | Static output, works on Vercel and GitHub Pages, fast HMR | Next.js static export (heavier; basePath friction on GitHub Pages) |
| Styling | Tailwind CSS + shadcn/ui | Matches the provided Spline/Spotlight/Card components | — |
| Animation | `framer-motion` (the provided Spotlight imports it) | `layoutId` gives shared element transitions; springs, stagger, AnimatePresence | GSAP for complex scroll timelines (only if needed; check license terms first) |
| Hero background | `@splinetool/react-spline` + `@splinetool/runtime`, lazy loaded | Requested reference visual | CSS/SVG gradient fallback (always present) |
| i18n | Small typed dictionary (`src/i18n/es.ts`, `en.ts`) + `useI18n` hook | Only two languages and a landing page; avoids extra dependencies | `i18next` if content grows |
| Routing | `react-router` with clean URLs for legal pages | Legal pages need real URLs | Hash routing (breaks in-page anchors) |
| Fonts | Self-hosted Inter via `@fontsource-variable/inter` | Segoe UI is not licensed for web embedding; no Google Fonts request | System UI stack fallback |
| Hosting | Static build; works on **Vercel or GitHub Pages** | User has not decided yet | Decide in FASE 7 |

## 2. Hosting compatibility (both must keep working)
- `VITE_BASE_PATH` env var feeds Vite `base` (`/` for Vercel/custom domain, `/<repo>/` for GitHub Pages project sites).
- Post-build step copies `dist/index.html` to `dist/404.html` (GitHub Pages SPA fallback). Add `vercel.json` rewrite to `index.html` for Vercel.
- All asset URLs go through Vite (no absolute `/` paths in code).

## 3. Folder structure
```
.
├─ AGENTS.md  ARCHITECTURE.md  PROJECT_STATE.md
├─ docs/ SPEC.md  PLAN_FASES.md  LEGAL.md
├─ Dockerfile  docker-compose.yml  .env.example
├─ public/            (favicon, og-image, static fallbacks)
└─ src/
   ├─ main.tsx  App.tsx
   ├─ components/ui/  (shadcn: card.tsx, spotlight.tsx, splite.tsx, ...)
   ├─ components/     (Navbar, Footer, ThemeToggle, LangToggle, CookieBanner)
   ├─ sections/       (Hero, About, Activities, Areas, Faq, Join)
   ├─ pages/          (Home, Legal)
   ├─ hooks/          (useTheme, useI18n, useReducedMotion, useInView)
   ├─ i18n/           (es.ts, en.ts, index.ts)
   ├─ lib/            (utils.ts, motion.ts, consent.ts, config.ts)
   └─ styles/         (globals.css: tokens for both themes)
```

## 4. Theme system
- Tokens as CSS variables in `globals.css`; `.dark` class on `<html>`. Light theme = inverted surfaces, same brand hues, contrast re-checked.
- Initial theme: stored choice, else `prefers-color-scheme`, else dark. Stored in `localStorage` key `mlsa-theme` (strictly necessary preference, see LEGAL.md).
- Inline script in `index.html` sets the class before paint (no flash).

## 5. Language system
- Initial language: stored choice (`mlsa-lang`), else `navigator.languages` (starts with `en` -> EN), else ES.
- Toggle in navbar. Updates `<html lang>`, `<title>` and meta description.
- Crossfade + blur on text swap (see section 7).

## 6. Palette (proposal, tune in FASE 1)
Brand (Microsoft-inspired): blue `#0078D4`, plus accents from the four-color family. Area colors: RRHH green, Operativa blue, Marketing orange, Finanzas y sostenibilidad yellow. Each area color needs a dark-theme and a light-theme variant that passes AA contrast for text.

## 7. Motion system (`src/lib/motion.ts`)
- Presets: `ease.outExpo`, `ease.inOutCubic`, `spring.soft`, `spring.snappy`, `stagger.children`.
- `useReducedMotion()` gate: when true -> no parallax, no morph, no spring bounce, no stagger delays, crossfade only (<=150ms), Spline replaced by static fallback.
- Required effects and where they live:

| Effect | Where |
|---|---|
| Crossfade | Language swap, theme swap, tab/area content switch |
| Shared element (`layoutId`) | FAQ item -> expanded card; area card -> area detail |
| Blur | Hero text entrance, section reveal, language swap |
| Morph | Logo/blob shape morph in hero, theme toggle icon (sun <-> moon) |
| Stagger | Hero lines, area cards, activity cards, FAQ list |
| Spring | Hover/press on cards and buttons, navbar indicator |
| Easing | Custom cubic-bezier on all reveals |

## 8. Hero background (FASE 6)
- `SplineScene` lazy-loaded inside `Hero` only, wrapped in `Suspense` with a CSS gradient fallback.
- Loads ONLY if: visitor accepted "third-party media" in the cookie banner AND not reduced-motion AND viewport >= tablet AND (optionally) `navigator.connection.saveData` is false.
- When the hero leaves the viewport (IntersectionObserver) the scene must stop: first try the runtime's `stop()`/`play()` on the Spline `Application` (agent must verify these exist in the installed version); otherwise unmount the component.
- Later (user may request): extend as fixed full-page background. Keep it behind a single `<BackgroundLayer />` so this is a small change.

## 9. Performance budget (targets, measure in FASE 7)
Lighthouse mobile: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 (with Spline disabled). With Spline enabled it is allowed to be lower, but it must not block first paint or interaction.

## 10. Out of scope
Backend, forms, auth, CMS, analytics, newsletter, blog.
