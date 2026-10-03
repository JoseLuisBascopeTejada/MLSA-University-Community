# PLAN_FASES.md

One phase at a time. Each phase ends with: verification commands, `PROJECT_STATE.md` update with evidence, user approval.

## FASE 0 — Bootstrap (Docker + scaffold)
- T0.1 Scaffold Vite + React + TS in a temporary folder inside the container, then copy files to the repo root WITHOUT overwriting existing files (AGENTS.md, docs/, Dockerfile, docker-compose.yml, .gitignore, .env.example, README.md); report any conflict instead of resolving it silently. Then delete the temp folder.
- T0.2 Install Tailwind, shadcn/ui (init), `framer-motion`, `react-router`, `@fontsource-variable/inter`, `lucide-react`, `@splinetool/react-spline`, `@splinetool/runtime`.
- T0.3 Add scripts: `dev`, `build`, `typecheck`, `lint`, `preview`; path alias `@/`.
- T0.4 Copy provided components verbatim to `src/components/ui/`: `card.tsx`, `spotlight.tsx`, `splite.tsx`; if typecheck fails on them, report and propose a minimal fix, do not edit silently.
- T0.5 Add `vercel.json` and the postbuild script as in ARCHITECTURE §2 (`scripts/postbuild.mjs` wired as the `postbuild` npm script).
- Accept: `docker compose up web` serves a blank page; `typecheck`, `lint`, `build` pass.

## FASE 1 — Foundations: tokens, theme, i18n, motion presets
- T1.0 FASE 0 cleanup (do first, then T1.1–T1.4):
  - T1.0-a Shadcn path misfire: verify CLI alias resolution (root tsconfig.json has no paths; fix by adding `{"@/*": ["./src/*"]}` without baseUrl if confirmed); byte-compare `@/lib/utils.ts` vs `src/lib/utils.ts`; move `@/components/ui/button.tsx` to `src/components/ui/` importing `cn` from `@/lib/utils`; delete stray `@/` dir. Prove with `npx shadcn add separator` dry-run check (delete test file + test-only deps after; STOP and report if it lands in `@/` again).
  - T1.0-b Replace Vite demo: `App.tsx` -> minimal placeholder `<main>` (Tailwind + `[TODO-CONTENT]`); delete `App.css`, `src/assets/hero.png`, `react.svg`, `vite.svg`, `public/icons.svg`; remove ONLY Vite-template rules from `src/index.css` (show before/after), keep Tailwind/shadcn imports + nova tokens.
  - T1.0-c Fonts: uninstall `@fontsource-variable/geist`, import `@fontsource-variable/inter`, set `--font-sans` to `'Inter Variable'` + system-ui fallbacks, remove all Segoe UI mentions; verify via dist woff2 list + CSS grep for Geist/Segoe.
  - T1.0-d `index.html`: `lang="es"`, title `MLSA University Community`, meta description `[TODO-CONTENT]`, base-aware favicon href; prove with `VITE_BASE_PATH=/test/` build + grep, then rebuild default base.
  - T1.0-e `.vscode/extensions.json`: keep only `bradlc.vscode-tailwindcss`.
  - T1.0-f Keep `button.tsx` (Base UI, no Radix — approved).
  - T1.0-g PROJECT_STATE.md evidence rewrite (A6 fixes + 4 self-checks).
  - T1.0-h Verify Tailwind is really active: grep `@import "tailwindcss"` in src/; inspect `shadcn/tailwind.css` in node_modules for a tailwindcss import; grep built CSS for App.tsx classes (counts pasted). If missing, add `@import "tailwindcss";` first line of src/index.css, rebuild, paste new counts + size.
- T1.1 Tokens for both themes + area colors (AA contrast verified).
- T1.2 `useTheme` + inline no-flash script + toggle component.
- T1.2-b Theme context: shared provider so several toggles stay in sync (context+hook module + separate provider component file to avoid only-export-components warnings); same { theme, setTheme, toggle } API and behavior; mounted in main.tsx; lint shows no new warnings vs baseline.
- T1.3 i18n dictionaries + `useI18n` + browser-language detection + toggle.
- T1.4 `src/lib/motion.ts` presets + `useReducedMotion`.
- Accept: toggles persist across reload; no theme flash; `<html lang>` updates.

## FASE 2 — Layout shell
- T2.1 Navbar (anchors with smooth scroll, active indicator spring, mobile menu).
- T2.2 Footer (legal links, non-affiliation notice, contact, cookie settings link).
- T2.3 Routes: `/`, `/terminos`, `/privacidad`, `/cookies`, `/aviso-legal`, `/conducta` (placeholder pages).
- T2.4 Anchor navigation from legal pages: nav links navigate to `/` and then scroll to the target section after mount (see SPEC §5).
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
- Accept: with "Reject", no request to `spline.design` is made (verify in Network tab). Allowed final status "DONE-WITH-PLACEHOLDERS" while user inputs are pending.

## FASE 6 — Hero Spline background
- T6.1 `BackgroundLayer` with lazy `SplineScene` + `Spotlight`, gated by consent, reduced-motion, viewport and save-data.
- T6.2 Stop/unmount when hero leaves viewport; resume when it returns.
- T6.3 Gradient fallback identical in layout (no CLS).
- T6.4 Fix Spotlight listener cleanup with stable handlers, handle the unsupported `fill` prop, define the loader fallback, visually verify the Spotlight gradient under the installed Tailwind major.
- Accept: Network tab shows no Spline traffic until consent; CPU idle after leaving hero.

## FASE 7 — QA, SEO, deploy
- T7.1 Lighthouse (mobile) + axe checks; fix findings.
- T7.2 SEO basics (meta, OG image, robots, sitemap).
- T7.3 Deploy config for the chosen host; README with Docker commands.
- Accept: budgets in ARCHITECTURE.md section 9 met or deviations documented.

## FASE 8 (optional, on request) — Background across the whole page
- Move `BackgroundLayer` to fixed full-page; re-measure performance.
