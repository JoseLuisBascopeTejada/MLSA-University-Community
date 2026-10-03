# PROJECT_STATE.md

Evidence-only log. Rules are in `AGENTS.md` section 5. Do not write anything here that you have not verified in this repo.

## Current phase
FASE 1 — IN PROGRESS (T1.0–T1.2 executed, pending user approval). T1.3–T1.4 NOT STARTED. (T1.0 approved by user 2026-10-03 — placeholder rendered in browser.)

## Phase status
| FASE | Name | Status | Evidence |
|---|---|---|---|
| 0 | Bootstrap | DONE — approved by user | Prior FASE 0 verification (typecheck/lint/build pass, `docker compose up -d web` + HTTP 200); user approval recorded in BUILD prompt 2026-10-03 |
| 1 | Foundations | IN PROGRESS (T1.0–T1.2) | This section + T1.0-h/T1.1/T1.2 below. `docker compose run --rm web npm run typecheck` pass (tsc -b, no errors); `npm run lint` 0 errors 1 warning on button.tsx (accepted by user); `npm run contrast` ALL REQUIRED PAIRS PASS (exit 0); `npm run build` pass (1934 modules, CSS 32.07 kB, JS 264.63 kB) + postbuild copied dist/index.html to dist/404.html; `docker compose up -d web` + Invoke-WebRequest http://localhost:5173 = 200 OK. NOTE: HTTP 200 proves the dev server responds; it does NOT prove React mounted or the toggle works — user checks in browser (manual checklist in T1.2). |
| 2 | Layout shell | NOT STARTED | — |
| 3 | Content sections | NOT STARTED | — |
| 4 | Animation layer | NOT STARTED | — |
| 5 | Legal and consent | NOT STARTED | — |
| 6 | Hero Spline background | NOT STARTED | — |
| 7 | QA, SEO, deploy | NOT STARTED | — |

## Installed dependencies (copy from package.json, with grep proof)
Grep proof (in container, 2026-10-03): `grep -E -o -e framer-motion -e react-router -e tailwindcss -e lucide-react -e fontsource-variable/inter -e splinetool/react-spline -e splinetool/runtime /app/package.json` output:
```
fontsource-variable/inter
splinetool/react-spline
splinetool/runtime
tailwindcss
framer-motion
lucide-react
react-router
tailwindcss
```
`npm ls --depth=0` output (2026-10-03, after `npm uninstall @fontsource-variable/geist`):
```
mlsa-university-community@0.0.0 /app
+-- @base-ui/react@1.8.0
+-- @fontsource-variable/inter@5.3.0
+-- @splinetool/react-spline@4.1.0
+-- @splinetool/runtime@2.0.66
+-- @tailwindcss/vite@4.3.3
+-- @types/node@24.19.1
+-- @types/react-dom@19.3.0
+-- @types/react@19.3.0
+-- @vitejs/plugin-react@6.1.1
+-- class-variance-authority@0.7.1
+-- cn@0.4.0
+-- framer-motion@14.0.0
+-- lucide-react@1.51.0
+-- oxlint@1.86.0
+-- react-dom@19.3.0
+-- react-router@8.4.0
+-- react@19.3.0
+-- shadcn@4.21.1
+-- tailwindcss@4.3.3
+-- tw-animate-css@1.4.0
+-- typescript@6.0.3
`-- vite@8.3.2
```
- react ^19.2.8, react-dom ^19.2.8 (Vite react-ts template; installed 19.3.0)
- vite ^8.3.0, @vitejs/plugin-react ^6.1.1, typescript ~6.0.2, oxlint ^1.81.0, @types/node ^24.13.3, @types/react ^19.2.18, @types/react-dom ^19.2.7 (template ranges; installed: vite 8.3.2, typescript 6.0.3, oxlint 1.86.0, @types/node 24.19.1, @types/react 19.3.0, @types/react-dom 19.3.0)
- tailwindcss ^4.3.3, @tailwindcss/vite ^4.3.3 — Tailwind major installed: v4
- framer-motion ^14.0.0 (installed 14.0.0)
- react-router ^8.4.0 (installed 8.4.0)
- @fontsource-variable/inter ^5.3.0 (installed 5.3.0; the ONLY font dep — `@fontsource-variable/geist` uninstalled in T1.0-c)
- lucide-react ^1.51.0 (installed 1.51.0)
- @splinetool/react-spline ^4.1.0 (installed 4.1.0), @splinetool/runtime ^2.0.66 (installed 2.0.66). `next` is an optional peer (`peerDependenciesMeta = { next: { optional: true } }`) and `npm ls next --all` returns `(empty)` — NOT installed.
- Added by `shadcn init -t vite -b base -p nova`: @base-ui/react ^1.8.0, class-variance-authority ^0.7.1, cn ^0.4.0, shadcn ^4.21.1, tw-animate-css ^1.4.0 (geist entry removed by T1.0-c uninstall)
- No Radix packages anywhere: `grep -R -n radix /app/src /app/package.json` returns nothing.

## T1.0 cleanup — evidence per sub-task (all 2026-10-03, Docker only, no git writes)

### T1.0-a shadcn path misfire — cause VERIFIED, fixed, proved
- Fact: `shadcn init` wrote to a literal `@/` dir at repo root (`@/components/ui/button.tsx`, `@/lib/utils.ts`); `src/components/ui/` had only `card.tsx`, `splite.tsx`, `spotlight.tsx`.
- Cause (verified, not assumed): root `tsconfig.json` had NO `compilerOptions.paths` (only `files: []` + references; the alias lived only in `tsconfig.app.json`). `npx shadcn info` resolved `utils -> /app/@/lib/utils`, `ui -> /app/@/components/ui`. The CLI bundle (`node_modules/shadcn/dist/index.js`) imports `loadConfig` from `tsconfig-paths` and its preflight error text says "Configure path aliases in tsconfig.json" — i.e. it reads the ROOT tsconfig, which had no paths, so `@` fell back to a literal directory.
- Byte compare: `od -c` shows `@/lib/utils.ts` = `export { cn } from "cn"\n` (no semicolon) vs `src/lib/utils.ts` = `export { cn } from "cn";\n` (semicolon). Content otherwise identical; `src/` version provenance = **unknown** (one-char difference is consistent with a manual write or a formatter pass; cannot prove which).
- Fix: added `"compilerOptions": { "paths": { "@/*": ["./src/*"] } }` to root `tsconfig.json` (no `baseUrl` — TS 6 rejects it per FASE 0 `TS5101` evidence). Moved `@/components/ui/button.tsx` to `src/components/ui/button.tsx` with the single change `import { cn } from "cn"` -> `import { cn } from "@/lib/utils"` (matches `card.tsx`/`spotlight.tsx` convention). Deleted stray `@/` dir (`ls /app/@` = "No such file or directory").
- Proof: `npx shadcn info` now resolves `utils -> /app/src/lib/utils`, `ui -> /app/src/components/ui` (full output: all Resolved Paths under `/app/src/...`). `npx shadcn add separator --dry-run` previewed `+ src/components/ui/separator.tsx create`; real `npx shadcn add separator -y` created exactly that file. `package.json` unchanged by the test (only dep `cn`, already present; separator uses installed `@base-ui/react`). Test file deleted afterwards (`src/components/ui/` back to `button.tsx, card.tsx, splite.tsx, spotlight.tsx`).

### T1.0-b Vite demo replaced
- `src/App.tsx` rewritten to a minimal placeholder `<main>` (Tailwind classes `flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center`, heading `MLSA University Community`, paragraph `[TODO-CONTENT: landing placeholder — real sections arrive in FASE 3]`).
- Deleted: `src/App.css` (184 lines, 100% demo: `.counter`, `.hero`, `#center`, `#next-steps`, `#docs`, `#spacer`, `.ticks`), `src/assets/hero.png`, `src/assets/react.svg`, `src/assets/vite.svg`, `src/assets/` (now empty, removed), `public/icons.svg` (Vite community links). Verified: `ls` on all four paths = "No such file or directory".
- `src/index.css` before/after: REMOVED the scaffold-demo layer — `:root` demo vars (`--text`, `--text-h`, `--bg`, `--code-bg`, `--accent-bg`, `--accent-border`, `--social-bg`, `--shadow`, `--sans/--heading/--mono`, `font:`/`color:`/`background:` body styles + nested `max-width:1024px` font-size), the whole `@media (prefers-color-scheme: dark)` block (incl. its nested `@import "tailwindcss"` and `#social .button-icon` filter for the deleted App markup), and `#root`/`body`/`h1,h2`/`p`/`code,.counter` rules. KEPT untouched: the three `@import`s (modulo T1.0-c font swap), all oklch nova tokens in `:root` (incl. `--accent: oklch(0.97 0 0)` + `--accent-foreground`), `@custom-variant dark`, `@theme inline`, `.dark`, `@layer base`. Rationale: oklch set + theme/at-layer blocks are the shadcn nova layer (driven by `components.json` `cssVariables: true` + `shadcn/tailwind.css`); the removed rules only styled the deleted demo markup (evidence: `App.css`/`App.tsx` referenced `--text`, `--social-bg`, `#social`, `.counter`).

### T1.0-c fonts: Geist removed, Inter active
- `docker compose run --rm web npm uninstall @fontsource-variable/geist` → "removed 1 package, and audited 378 packages".
- `src/index.css`: `@import "@fontsource-variable/geist"` -> `@import "@fontsource-variable/inter"`; `--font-sans: 'Geist Variable', sans-serif` -> `--font-sans: 'Inter Variable', system-ui, sans-serif`; all `Segoe UI` mentions removed (they lived in the deleted `--sans/--heading/--mono` stacks).
- `grep -R -n -i -e geist -e segoe /app/src /app/index.html /app/package.json` → no matches. `grep -R -c -e Geist -e Segoe /app/dist/assets` → `0` for every file (css, js, all woff2).
- `ls /app/dist/assets` (default-base build): 7 `inter-*-wght-normal-*.woff2` (cyrillic, cyrillic-ext, greek, greek-ext, latin, latin-ext, vietnamese) + `index-*.js/css`. Zero Geist files. (Earlier "single `inter` substring" question resolved: `grep -o -i -e inter` on the new CSS returns 15 hits, all inside `Inter Variable` font references — `grep -o -e "Inter Variable"` returns 8; the old hit belonged to the pre-cleanup bundle and is superseded.)
- `npx shadcn info` still prints `Preset font: geist` — that is registry preset metadata, not our code; no Geist package or import remains.

### T1.0-d index.html: lang/title/base-aware favicon
- New `index.html`: `<html lang="es">`, `<title>MLSA University Community</title>`, `<meta name="description" content="[TODO-CONTENT: meta description ES]">`, favicon `href="%BASE_URL%favicon.svg"` (was absolute `/favicon.svg`, which breaks under a GitHub Pages sub-path per ARCHITECTURE §2).
- Proof: `docker compose run --rm -e VITE_BASE_PATH=/test/ web npm run build` then `cat /app/dist/index.html` shows `href="/test/favicon.svg"` and `src="/test/assets/index-BbU8gw2c.js"`. Rebuilt afterwards with default base (`npm run build`, no env): `dist/index.html` 0.55 kB, `index-WtlXfHip.js` 219.93 kB, `index-unXGmjHX.css` 7.01 kB, postbuild copied to `dist/404.html`.
- `public/favicon.svg` is the Vite template icon — PLACEHOLDER, replace with own logo (pending user input per SPEC §9).

### T1.0-e .vscode/extensions.json
- Now `{ "recommendations": ["bradlc.vscode-tailwindcss"] }`. Removed `dbaeumer.vscode-eslint` + `esbenp.prettier-vscode` (repo lints with oxlint via `npm run lint`; no eslint/prettier configs exist). No extension added.

### T1.0-f button.tsx
- Kept at `src/components/ui/button.tsx` (Base UI `@base-ui/react/button` + `class-variance-authority` + `cn` from `@/lib/utils`). No Radix introduced (approved Base UI decision).
- `npm run lint` (oxlint) real output 2026-10-03: `Found 1 warning and 0 errors. Finished in 76ms on 9 files` — warning is `react(only-export-components)` on `src/components/ui/button.tsx:57` (`buttonVariants` export). Status: **accepted by user** (BUILD prompt 2026-10-03).

### T1.0-g verification commands + real outputs (2026-10-03)
- `docker compose run --rm web npm run typecheck` → `> tsc -b` with no errors (pass).
- `docker compose run --rm web npm run lint` → 0 errors, 1 warning (see T1.0-f).
- `docker compose run --rm web npm run build` → `tsc -b && vite build` pass: "16 modules transformed", dist files listed in T1.0-d, "built in 424ms" + postbuild "copied dist/index.html to dist/404.html".
- `docker compose up -d web` → `Container mlsa-university-community-web-1 Running`. `Invoke-WebRequest http://localhost:5173` → `StatusCode 200, Length 726`.

### T1.0-h Tailwind was NOT active — fixed (2026-10-03)
- Concern: built CSS was 7.01 kB and `src/index.css` had no `@import "tailwindcss"` (the only one had been nested inside the deleted `@media` block).
- Evidence: (1) `grep -R -n -e "tailwindcss" /app/src` → no matches. (2) `cat /app/node_modules/shadcn/dist/tailwind.css` → only `@theme`/`@custom-variant`/`@utility` directives, NO tailwindcss import; `grep -n -e "@import" /app/node_modules/tw-animate-css/dist/tw-animate.css` → no matches. So nothing pulled in Tailwind preflight/utilities. (3) Before fix, `grep -c` on `dist/assets/index-unXGmjHX.css`: `min-h-svh` 0, `text-2xl` 0, `font-semibold` 0, `text-muted-foreground` 0, `items-center` 0 — all App.tsx utilities missing (page rendered unstyled; the T1.0 "placeholder renders" approval saw unstyled HTML).
- Fix: added `@import "tailwindcss";` as FIRST line of `src/index.css` (before tw-animate-css/shadcn/font). Rebuild: CSS `index-Bg5B1Ll3.css` 31.01 kB, and all five class counts = 1. (Counts are per-line on minified single-line CSS.)

### npm audit — read-only report (2026-10-03, NO fix run)
- `docker compose run --rm web npm audit` → **7 high, 0 others**. All 7 are the SAME root advisory counted along the chain: `braces*` GHSA-vfj7-8cjw-p6xm (stack-exhaustion DoS via deeply nested patterns) → `micromatch` → `fast-glob` → `@shadcn/registry` → `shadcn` (plus the `@ts-morph/common` → `ts-morph` branch under the same tree). Fix would force `shadcn@1.0.0` (breaking) — NOT run per instruction.
- Blast radius: all vulnerable packages live under the `shadcn` CLI dependency tree = **build-time tooling only**. `shadcn` is listed under `dependencies` (not devDependencies), but it does NOT ship in the production bundle: nothing in `src/` imports it (Vite bundles only imported modules; dist JS is app code). It matters for install surface/supply chain and future `THIRD_PARTY_NOTICES` (FASE 7), not for what browsers download.

### T1.1 design tokens (2026-10-03)
- Tokens stay in `src/index.css` (components.json `css` target). ARCHITECTURE.md §3 tree amended (`index.css` replaces `styles/globals.css`) + §4 wording (`src/index.css` instead of `globals.css`) — docs-only edits.
- Semantic names kept (`--background`, `--foreground`, `--card*`, `--popover*`, `--primary*`, `--secondary*`, `--muted*`, `--accent*`, `--destructive`, `--border`, `--input`, `--ring`); sidebar/chart tokens untouched. Changed values: light `--primary #0078D4` (+`#ffffff` ink), `--ring #0078D4`; dark `--primary #3a9bdc` (+`#06121f` ink), `--ring #6cb8f0`; `--destructive` tuned both themes (`oklch(0.55 0.22 27.325)` light, `oklch(0.735 0.185 22.216)` dark) to pass text-on-tint.
- Area colors scoped ONLY under `[data-area="rrhh|finanzas|marketing|operativa"]` (+ `.dark [data-area]` for `--area-text`): `--area` fill, `--area-foreground` ink on fill, `--area-text` colored text on page surface. Registered in `@theme inline` (`--color-area[-foreground|-text]`) so `bg-area`/`text-area-text`/`text-area-foreground` utilities exist — verified in built CSS (`grep -c` on `index-5kTAkiLp.css`: each = 1).
- Final values: rrhh fill `#7fba00`/ink `#0e1400`/text `#4a7300` light + `#b9e04d` dark; finanzas `#ffb900`/`#241a00`/`#7a5200` + `#ffc933`; marketing `#f25022`/`#1c0d00`/`#b53a10` + `#ff9e73`; operativa `#0078d4`/`#ffffff`/`#0078d4` + `#3a9bdc`.
- `scripts/contrast.mjs` (Node, no deps; `npm run contrast` added to package.json): parses `:root`/`.dark`/`[data-area]`/`.dark [data-area]`, resolves themes by cascade, supports hex + oklch (Ottosson matrices) + `mix()` + slash-alpha compositing. oklch path validated: white/black = 21.000 both formats, red/white = 3.998 via hex AND via `oklch(0.62796 0.25773 29.234)` (all 4 self-checks OK on every run; exit 2 on drift). Gamut clamps are counted and reported (final run: 2 — measurement matches browser rendering since browsers clamp identically).
- `npm run contrast` final table (2026-10-03): **ALL REQUIRED PAIRS PASS** (exit 0). Key rows: primary-fg/primary 4.53 light / 6.20 dark; primary-as-link-text 4.53 light / 6.51 dark; muted 4.73 light / 7.63 dark; destructive-tint 4.99 light / 4.51 dark; ring 4.53 light / 9.19 dark (≥3.0); all 16 area ink/text rows PASS (5.37–13.04). Info-only (not gating): light `--border`/bg 1.26, dark `--border`/bg 2.88 (nova decorative defaults, kept), rrhh/finanzas light fills 2.35/1.72 (large decorative regions).
- No color literals outside tokens: `grep -R -n -E -e "#[0-9a-fA-F]{3,8}" -e "oklch\(" -e "rgb[a]?\(" -e "hsl[a]?\(" /app/src` → hits ONLY in `src/index.css` (75 lines listed, all token declarations).
- TEMP preview: `src/App.tsx` rewritten (marked `TEMP: delete in FASE 3`): ThemeToggle, primary+outline Buttons, foreground/muted/primary text samples, 4 `data-area` Cards using `bg-area`/`text-area-foreground`/`text-area-text`. Hardcoded strings exist ONLY there.

### T1.2 theme (2026-10-03)
- Files (all `ls`-verified): `src/lib/config.ts` (`THEME_KEY='mlsa-theme'`, `LANG_KEY`, `CONSENT_KEY`; typed `readEnv` with `unknown` narrow + `''` fallback for `VITE_SITE_URL`, `VITE_WHATSAPP_URL`, `VITE_CONTACT_EMAIL`, `VITE_SPLINE_SCENE_URL`), `src/hooks/useTheme.ts` (`{ theme, setTheme, toggle }`; persist ONLY on explicit choice; `matchMedia('(prefers-color-scheme: light)')` listener while no stored choice, with cleanup + stored-recheck in handler; all storage in try/catch), `src/components/ThemeToggle.tsx` (shadcn `Button` ghost icon, lucide Sun/Moon swap, `label` prop → `aria-label`, `aria-pressed`, focus via Button styles; NO morph — FASE 4).
- `index.html`: `<meta name="color-scheme" content="dark light">` + pre-paint inline script (stored → OS-light→light else dark; try/catch defaults dark; key duplicated with comment pointing to `config.ts`).
- Final verify (2026-10-03): typecheck pass; lint `Found 1 warning and 0 errors … on 13 files` (same accepted buttonVariants warning); build pass (`1934 modules transformed`, `index-5kTAkiLp.css 32.07 kB`, `index-Z1O6nhH9.js 264.63 kB`, postbuild OK); `docker compose up -d web` Running + HTTP 200.
- UNVERIFIED (no browser access) — user manual checklist: (1) toggle switches sun/moon + whole preview incl. area cards; (2) reload keeps choice (`mlsa-theme` in localStorage); (3) clear storage + OS light → light initial, OS dark → dark initial; (4) hard reload with throttled network shows no flash (dark stays dark, no light blink); (5) preview readable at 360px and 1440px in both themes.

## Open decisions
- ARCHITECTURE.md approved by user (with amendments).
- Hosting: dual-compat until FASE 7.
- Spline demo scene: dev-only until permission confirmed or own scene provided.
- Community wording: independent until official chapter confirmed.
- Placeholders accepted (FASE 5 may close as DONE-WITH-PLACEHOLDERS).
- UI primitives: Base UI, no Radix (approved 2026-10-03).
- Lint `buttonVariants` warning: accepted by user (2026-10-03).
- Favicon: Vite placeholder, replace with own logo.

## Pending inputs from the user
See `docs/SPEC.md` section 9. Plus: T1.0–T1.2 approval to proceed to T1.3–T1.4; T1.2 browser checklist results.

## Known issues
- spotlight.tsx verbatim copy failed typecheck (TS6133 unused `React` import; TS1484 `SpringOptions` needs type-only import under verbatimModuleSyntax). Minimal fix applied and reported: dropped default `React` import, split `import type { SpringOptions }`. File otherwise verbatim. (Fix in FASE 6 T6.4 still covers listener cleanup + fill prop + loader.)
- Template `tsconfig.app.json` + `"baseUrl": "."` rejected by TS 6 (`error TS5101: Option 'baseUrl' is deprecated`). Removed `baseUrl`, kept `"paths": { "@/*": ["./src/*"] }`; typecheck passes. Root `tsconfig.json` now carries the same `paths` (no `baseUrl`) so the shadcn CLI resolves `@/` to `src/` (T1.0-a proof above).
- Scaffold conflicts kept existing (not overwritten): `.gitignore`, `README.md`.
- Image CMD note: `docker compose up web` fails until package.json exists; all scaffold steps overrode CMD via `docker compose run --rm web <cmd>`.
- No `button.tsx`/`utils.ts` sync-lag speculation remains: the FASE 0 `@/` misfire cause is verified in T1.0-a; `src/lib/utils.ts` provenance (manual vs CLI) is recorded as **unknown** (one-semicolon byte difference, see T1.0-a).
- `useTheme` has no shared context: two mounted instances (e.g. preview + navbar later) track independent state and converge only via storage reload. Single-instance use (T1.2 preview) is unaffected; lift to context in FASE 2 if a second toggle appears.
- `npx shadcn info` prints `Preset font: geist` — registry preset metadata only; no Geist code/package remains (see T1.0-c greps).
- Info-only contrast rows below threshold are accepted decorative defaults (borders, light green/yellow fills); recorded in T1.1, not gating.

## AGENTS.md §5 self-checks (2026-10-03, before finishing T1.0)
1. Paths exist — `ls` on 16 paths (`components.json`, `index.html`, `public/favicon.svg`, `scripts/postbuild.mjs`, `src/App.tsx`, `src/components/ui/{button,card,splite,spotlight}.tsx`, `src/index.css`, `src/lib/utils.ts`, `src/main.tsx`, `tsconfig.json`, `tsconfig.app.json`, `vercel.json`, `vite.config.ts`): all listed, none missing.
2. Dependencies in package.json — `grep -E -o -e base-ui/react -e fontsource-variable/inter -e class-variance-authority -e '"cn"' /app/package.json` matched all 4; full `npm ls --depth=0` pasted above.
3. DONE tasks list commands + real results — FASE 0 approval is the user's (not re-claimed); T1.0 sub-tasks each cite the exact command and its output above.
4. Behavior claims name implementing files — T1.0 makes no theme/i18n/animation behavior claims (T1.2–T1.4 NOT STARTED). Favicon base behavior implemented by `index.html` (`%BASE_URL%`) + `vite.config.ts` (`base: process.env.VITE_BASE_PATH || '/'`), verified by `grep` of built `dist/index.html`.

## AGENTS.md §5 self-checks (2026-10-03, before finishing T1.1–T1.2)
1. Paths exist — `ls /app/src/lib/config.ts /app/src/hooks/useTheme.ts /app/src/components/ThemeToggle.tsx /app/scripts/contrast.mjs`: all 4 listed. Deleted paths confirmed gone: `/app/@`, `/app/src/App.css`, `/app/src/assets`, `/app/public/icons.svg` (all "No such file or directory"); `grep -e geist` over `package.json`+`src/index.css`+`index.html` → no matches.
2. Dependencies in package.json — no dependency ADDED or REMOVED since the T1.0 `npm ls` paste except none (geist already removed in T1.0; `contrast` is a script, not a dep). Deps named in T1.1/T1.2 (`@base-ui/react`, `class-variance-authority`, `cn`, `lucide-react`, `@fontsource-variable/inter`) all verified in package.json by the T1.0 grep + `npm ls --depth=0` above.
3. DONE tasks list commands + real results — T1.0-h (import greps + 5 class counts 0→1, CSS 7.01→31.01 kB), audit (full `npm audit` output summarized), T1.1 (3 contrast runs pasted as final table + iteration deltas 4.39→4.99, 4.32→4.49→4.51), T1.2 (typecheck/lint/build outputs) each cite exact commands above. T1.0 approval is the user's ("page renders the placeholder").
4. Behavior claims name implementing files — theme behavior: `index.html` inline bootstrap script, `src/hooks/useTheme.ts` (persist-on-choice + OS-follow + class sync), `src/components/ThemeToggle.tsx` (toggle UI). Contrast behavior: `scripts/contrast.mjs` + tokens in `src/index.css`. Browser-visible results (toggle, no-flash, 360/1440px) explicitly marked UNVERIFIED with a user checklist instead of claimed.
