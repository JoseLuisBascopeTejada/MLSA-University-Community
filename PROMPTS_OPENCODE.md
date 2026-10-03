# PROMPTS_OPENCODE.md

Prompts are in English (agent convention). Each starts with the OpenCode mode. Recommended loop per phase:
**PLAN (review) -> BUILD (implement) -> PLAN (audit against spec)**. Paste one prompt at a time; approve before moving on.

---

## P0 — Onboarding audit
**MODE: PLAN** (no edits)

```
MODE: PLAN

Read, in this order: AGENTS.md, docs/SPEC.md, ARCHITECTURE.md, docs/PLAN_FASES.md, docs/LEGAL.md, PROJECT_STATE.md.

Do NOT edit any file. Produce:
1. A 10-line summary of what you understood.
2. Contradictions or gaps between the documents (cite file + section).
3. Risks in the proposed stack (verify package names/compatibility with `npm view` inside Docker only if the repo already runs; otherwise mark as "to verify in FASE 0").
4. Blocking questions for the user (max 5). Anything non-blocking goes to a "assumptions" list.
Do not invent facts. Mark unknowns as unknown.
```

---

## P1 — FASE 0 Bootstrap
**MODE: BUILD**

```
MODE: BUILD

Execute FASE 0 from docs/PLAN_FASES.md (T0.1 to T0.5) and nothing else.
Rules: Docker only (docker compose run --rm web ...), no git write commands, no invented versions: install latest stable and record the exact versions from package.json.
The provided components (card, spotlight, splite) go in src/components/ui/ exactly as supplied in docs/provided-components.md (if that file is missing, ask me for them and stop).
Finish by running typecheck, lint and build, paste the real output, and update PROJECT_STATE.md following the 4 evidence self-checks in AGENTS.md section 5.
Stop and wait for my approval.
```

---

## P2 — FASE 1 plan, then build
**MODE: PLAN**

```
MODE: PLAN

Prepare FASE 1 (tokens, theme, i18n, motion presets). Propose:
- the exact CSS variables for dark and light themes (incl. the four area colors, with measured WCAG contrast ratios for text on each surface),
- file list and public API of useTheme, useI18n, useReducedMotion and src/lib/motion.ts,
- how the no-flash inline script will work.
Do not edit files. End with a task checklist I can approve.
```

**MODE: BUILD**

```
MODE: BUILD

Implement FASE 1 exactly as approved in your last plan. No extra features. Verify both themes and both languages manually where possible and run typecheck/lint/build. Update PROJECT_STATE.md with evidence. Stop for approval.
```

---

## P3 — FASE 2 Layout shell
**MODE: BUILD**

```
MODE: BUILD

Implement FASE 2 (navbar, footer, routes with placeholder legal pages). Navbar: language and theme toggles, anchor navigation via scroll (no hash routing), mobile menu, skip-link. Footer: legal links, non-affiliation notice from docs/LEGAL.md section 4 (ES/EN), contact email from config, "Cookie settings" link (stub for now).
All text through the i18n dictionaries. Verify 360px and 1440px. Update PROJECT_STATE.md with evidence. Stop for approval.
```

---

## P4 — FASE 3 Content
**MODE: BUILD**

```
MODE: BUILD

Implement FASE 3 using docs/SPEC.md section 4. Write ES and EN copy. Use only facts given in SPEC.md; everything else must be a visible-in-code marker [TODO-CONTENT: ...] and listed in PROJECT_STATE.md under "Content to confirm with the leader". Do not invent numbers, dates, names, partners or testimonials. The WhatsApp URL comes from VITE_WHATSAPP_URL (placeholder if empty; the button must not break). No fancy animations yet. Verify responsive + both themes + both languages. Update PROJECT_STATE.md. Stop.
```

---

## P5 — FASE 4 Animations
**MODE: PLAN**

```
MODE: PLAN

Plan FASE 4. For each effect in ARCHITECTURE.md section 7, specify: component, framer-motion API used, easing/spring values, reduced-motion fallback, and cost risk (layout vs transform/opacity/filter). For the shared element transitions (FAQ and area cards), describe the layoutId scheme and how to avoid layout jumps, z-index issues and scroll jumps. Propose any extra effects from docs/SPEC.md section 6 you consider worth it, with a performance justification. No edits.
```

**MODE: BUILD**

```
MODE: BUILD

Implement FASE 4 as approved. Animate only transform/opacity/filter. Every effect must honor prefers-reduced-motion through useReducedMotion. Measure with the browser performance panel and report numbers (do not claim "60fps" without evidence). Update PROJECT_STATE.md. Stop.
```

---

## P6 — FASE 5 Legal and consent
**MODE: PLAN**

```
MODE: PLAN

Read docs/LEGAL.md. Draft (in chat, not in files) the outline of the five legal pages in ES and EN and the cookie banner/preferences UX (equal-weight Accept/Reject/Customize). List every browser storage key actually used in the code (grep) and any network request to third parties. Flag anything in LEGAL.md that contradicts the code. Do not cite statutes unless I confirm them.
```

**MODE: BUILD**

```
MODE: BUILD

Implement FASE 5 per the approved outline. Legal pages must carry a visible "template — pending legal review" comment in code (not on the page) and use the operator data from src/lib/config.ts (placeholders if missing). The storage table in the Cookies page must match grep results exactly. Verify in the Network tab that rejecting consent produces zero requests to spline.design. Update PROJECT_STATE.md. Stop.
```

---

## P7 — FASE 6 Hero Spline background
**MODE: PLAN**

```
MODE: PLAN

Plan FASE 6. Inspect the installed @splinetool/react-spline and @splinetool/runtime (node_modules, README, types) and report which methods really exist to pause/stop/resume the scene. If none, propose unmounting. Define the gating logic (consent, reduced motion, viewport, saveData) and the fallback to avoid layout shift. No edits.
```

**MODE: BUILD**

```
MODE: BUILD

Implement FASE 6 as approved: BackgroundLayer with lazy SplineScene + Spotlight inside the hero only, stops when the hero leaves the viewport. Scene URL goes in src/lib/config.ts (use the one from the reference demo only if I confirm I may use it; otherwise leave a placeholder and the gradient fallback). Verify: no Spline requests before consent, CPU/GPU activity stops after leaving the hero (report how you measured). Update PROJECT_STATE.md. Stop.
```

---

## P8 — FASE 7 QA and deploy
**MODE: PLAN**

```
MODE: PLAN

Run an audit against docs/SPEC.md and ARCHITECTURE.md: Lighthouse mobile numbers, axe findings, bundle size per chunk, a11y keyboard walkthrough, theme/lang edge cases. Output a prioritized fix list. No edits.
```

**MODE: BUILD**

```
MODE: BUILD

Fix the approved items from the audit, add SEO basics, deploy config for [VERCEL | GITHUB PAGES], and a README with Docker commands. Update PROJECT_STATE.md with evidence. Stop.
```

---

## Utility prompts

**Bug with unknown cause — MODE: PLAN**
```
MODE: PLAN
Bug: <describe + steps + expected vs actual>. Reproduce inside Docker, find the root cause with evidence (file + line), propose the minimal fix and the files it touches. Do not edit.
```

**Approved fix — MODE: BUILD**
```
MODE: BUILD
Apply exactly the fix you proposed for <bug>. Re-run typecheck/lint/build and the reproduction steps. Update PROJECT_STATE.md.
```

**Spec change — MODE: PLAN**
```
MODE: PLAN
I want to change: <change>. Show which sections of SPEC.md, ARCHITECTURE.md and PLAN_FASES.md must change and which code is affected. Do not edit.
```
