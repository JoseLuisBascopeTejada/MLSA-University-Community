# PLAN_FASES.md

One phase at a time. Each phase ends with: verification commands, `PROJECT_STATE.md` update with evidence, user approval.

## FASE 0 — Bootstrap (Docker + scaffold)
- T0.1 Create Vite + React + TS project inside the container (files at repo root, keep existing docs).
- T0.2 Install Tailwind, shadcn/ui (init), `framer-motion`, `react-router`, `@fontsource-variable/inter`, `lucide-react`, `@splinetool/react-spline`, `@splinetool/runtime`.
- T0.3 Add scripts: `dev`, `build`, `typecheck`, `lint`, `preview`; path alias `@/`.
- T0.4 Add provided components to `src/components/ui/`: `card.tsx`, `spotlight.tsx`, `splite.tsx`.
- T0.5 Add `vercel.json` and the `404.html` post-build copy.
- Accept: `docker compose up web` serves a blank page; `typecheck`, `lint`, `build` pass.

## FASE 1 — Foundations: tokens, theme, i18n, motion presets
- T1.1 Tokens for both themes + area colors (AA contrast verified).
- T1.2 `useTheme` + inline no-flash script + toggle component.
- T1.3 i18n dictionaries + `useI18n` + browser-language detection + toggle.
- T1.4 `src/lib/motion.ts` presets + `useReducedMotion`.
- Accept: toggles persist across reload; no theme flash; `<html lang>` updates.

## FASE 2 — Layout shell
- T2.1 Navbar (anchors with smooth scroll, active indicator spring, mobile menu).
- T2.2 Footer (legal links, non-affiliation notice, contact, cookie settings link).
- T2.3 Routes: `/`, `/terminos`, `/privacidad`, `/cookies`, `/aviso-legal`, `/conducta` (placeholder pages).
- Accept: keyboard navigation works; skip-link present.

## FASE 3 — Content sections (static, no fancy animation yet)
- T3.1 Hero (gradient fallback), About, Activities, Areas, How to join, FAQ (basic accordion).
- T3.2 All copy in ES and EN with `[TODO-CONTENT]` markers where facts are missing.
- Accept: responsive 360px–1440px, both themes, both languages.

## FASE 4 — Animation layer
- T4.1 Scroll reveals (blur + stagger + custom easing).
- T4.2 Shared element transition on FAQ and area cards (`layoutId`, `AnimatePresence`).
- T4.3 Crossfade on language/theme swap; morph on theme icon and hero shape.
- T4.4 Springs on hover/press; card spotlight/tilt; scroll progress; magnetic CTA.
- Accept: 60fps in Chrome performance panel on a mid-range profile (report numbers); reduced-motion mode verified.

## FASE 5 — Legal and consent
- T5.1 Write the five legal pages from `docs/LEGAL.md` (ES + EN).
- T5.2 Cookie banner + preferences modal + `consent.ts` (stores choice, re-openable from footer).
- T5.3 Storage inventory in the Cookies page matches reality (verify with grep and DevTools).
- Accept: with "Reject", no request to `spline.design` is made (verify in Network tab).

## FASE 6 — Hero Spline background
- T6.1 `BackgroundLayer` with lazy `SplineScene` + `Spotlight`, gated by consent, reduced-motion, viewport and save-data.
- T6.2 Stop/unmount when hero leaves viewport; resume when it returns.
- T6.3 Gradient fallback identical in layout (no CLS).
- Accept: Network tab shows no Spline traffic until consent; CPU idle after leaving hero.

## FASE 7 — QA, SEO, deploy
- T7.1 Lighthouse (mobile) + axe checks; fix findings.
- T7.2 SEO basics (meta, OG image, robots, sitemap).
- T7.3 Deploy config for the chosen host; README with Docker commands.
- Accept: budgets in ARCHITECTURE.md section 9 met or deviations documented.

## FASE 8 (optional, on request) — Background across the whole page
- Move `BackgroundLayer` to fixed full-page; re-measure performance.
