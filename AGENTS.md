# AGENTS.md — MLSA University Community landing page

Single source of rules for every AI agent working in this repo. Read this file, then `docs/SPEC.md`, `docs/PLAN_FASES.md`, `ARCHITECTURE.md`, `docs/LEGAL.md` and `PROJECT_STATE.md` before doing anything.

## 1. Project in one paragraph
Static, bilingual (ES default / EN toggle), dark/light landing page for the **MLSA University Community** (a Microsoft-themed student tech community based in Bolivia, open to any major and any university). No backend, no forms, no accounts, no analytics. The only call-to-action is a link to a WhatsApp group.

## 2. Methodology: SDD (Spec-Driven Development)
1. `docs/SPEC.md` is the source of truth for WHAT to build. `ARCHITECTURE.md` is the source of truth for HOW.
2. No code without a task in `docs/PLAN_FASES.md`. No task without acceptance criteria.
3. If code and spec disagree, STOP and report. Never silently change the spec; propose the change and wait for approval.
4. Work is organized in numbered phases (FASE 0..N). One phase at a time. Do not start FASE N+1 until the user approves FASE N.

## 3. OpenCode modes
- **PLAN mode** = read-only analysis, proposals, audits, diagnosis. Must not edit files.
- **BUILD mode** = edits files, runs commands.
- Every prompt from the user starts with `MODE: PLAN` or `MODE: BUILD`. If a task needs the other mode, say so and stop.
- If the cause of a bug is uncertain, or a change touches shared logic (theme, i18n, layout, animation primitives), go through PLAN first.

## 4. Environment rules (Windows host, Docker only)
- Everything runs in Docker Compose. Never assume local Node/npm. Use `docker compose run --rm web <cmd>`.
- Dev server: `docker compose up web` -> http://localhost:5173
- Bind mounts on Windows need polling for HMR (already set in `docker-compose.yml`).
- **Git: never run `git add`, `commit`, `push`, `reset` or `checkout`.** The user handles git manually. You may run read-only git commands (`status`, `diff`, `log`).

## 5. Anti-fabrication (evidence-only)
- Never invent dependencies, versions, files, routes, component props or API details. Verify with `ls`, `cat`, `grep`, `npm view <pkg>`, or the official docs before citing.
- Unknown = say "unknown" and list how to verify. Do not guess.
- `PROJECT_STATE.md` rules:
  1. Every path mentioned must exist (check with `ls`).
  2. Every dependency mentioned must appear in `package.json` (check with `grep`).
  3. Every task marked DONE must list the command you ran and its real result (build/lint/typecheck output).
  4. Every claim about behavior (theme, i18n, animation) must name the file that implements it (verify with `grep`).
  Run these four self-checks before finishing every phase and paste the results.

## 6. Code conventions
- TypeScript `strict: true`. No `any`, no `@ts-ignore` without a comment explaining why.
- Tailwind + shadcn/ui. Reusable UI in `src/components/ui/`. Section components in `src/sections/`. Hooks in `src/hooks/`. Copy in `src/i18n/` (never hardcode user-visible text in components).
- Design tokens (colors, radius, easing, spring presets) live in one place; no magic hex values inside components.
- Animations: use shared presets from `src/lib/motion.ts`. Animate only `transform`, `opacity` and `filter`. Every animation must respect `prefers-reduced-motion` (see ARCHITECTURE.md).
- Accessibility target: WCAG 2.2 AA. Semantic HTML, visible focus, keyboard navigation, contrast checked in BOTH themes.
- External requests allowed: none, except the Spline scene, and only after the visitor opts in (see `docs/LEGAL.md`). Fonts are self-hosted. No CDN scripts, no analytics, no trackers.

## 7. Content and branding rules
- Do not invent facts about the community (member counts, event names, dates, testimonials, partners). Use clearly marked placeholders: `[TODO-CONTENT: ...]`.
- Do not use the Microsoft logo or any Microsoft trademarked artwork. Microsoft-inspired colors are fine. Always render the non-affiliation notice from `docs/LEGAL.md` in the footer.
- Area colors (green/blue/orange/yellow) appear ONLY inside their own area sections. The rest of the site uses the Microsoft-inspired palette.

## 8. Definition of done (per task)
- `docker compose run --rm web npm run typecheck`, `lint` and `build` pass (paste real output).
- Works in dark and light themes, ES and EN, mobile (360px) and desktop (1440px).
- Reduced motion verified.
- `PROJECT_STATE.md` updated with evidence (see section 5).
