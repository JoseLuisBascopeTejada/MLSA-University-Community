# SPEC.md — MLSA University Community landing page

Status: draft v1 (based on the user's answers). Source of truth for WHAT to build.

## 1. Goal
Present the MLSA University Community, explain what it does, show the four learning areas, and send interested students to a WhatsApp group.

## 2. Audience
University students of any major, any university, any country (community is based in Bolivia). Mostly mobile users. Spanish first, English available.

## 3. Non-goals
Forms, sign-up, login, backend, database, analytics, newsletter, blog, member profiles, photo galleries of people.

## 4. Sections (single page, in this order)
1. **Navbar** — logo (own, NOT Microsoft's), anchors, language toggle (ES/EN), theme toggle (dark/light).
2. **Hero** — headline, subheadline, primary CTA "Join" (WhatsApp link), secondary CTA "Explore areas". Spline background + Spotlight (FASE 6; before that, gradient fallback).
3. **About** — we are a Microsoft-themed student community; we run courses, hackathons and similar activities; we help each member learn in the area they like most; open to any major and any university, anywhere.
4. **Activities** — courses, hackathons, workshops/events. No invented dates or numbers.
5. **Areas** (4 cards -> expand with shared element transition into detail):
   | Area | Color | Summary |
   |---|---|---|
   | RRHH | green | Human resources, people management, team culture |
   | Finanzas y sostenibilidad | yellow | Agreements (convenios) and sponsorships |
   | Marketing | orange | Banners, promotional material, social media management |
   | Operativa | blue | Planning and creating events and courses |
   Each area detail: what you learn, example tasks, who it suits. Mark everything not given by the user as `[TODO-CONTENT]` for leader review.
6. **How to join** — 3 steps, CTA to the WhatsApp group link (`VITE_WHATSAPP_URL`; placeholder until provided).
7. **FAQ** — shared element transition (`layoutId`): item expands fluidly into its answer. Suggested questions: Who can join? Do I need experience? Does it cost anything? Which university? How much time? How do I join? (answers marked `[TODO-CONTENT]` where facts are unknown).
8. **Footer** — links to legal pages, non-affiliation notice, contact email, language/theme toggles repeated optional.

## 5. Behaviors
- **Language**: ES default; EN if browser language is English; manual toggle persists. See ARCHITECTURE.md section 5.
- **Theme**: dark and light, light = inverted colors; follows OS preference on first visit; manual toggle persists.
- **Colors**: Microsoft-inspired palette globally; area colors only inside area sections.
- **Hero background**: Spline only in hero; stops once the visitor scrolls past it; opt-in via cookie banner (third-party media); static fallback otherwise. Loads ONLY if: consent AND not reduced-motion AND viewport >= tablet AND `navigator.connection.saveData` is false. Extending to the whole page is a possible later task.
- **Navigation from legal pages**: nav links navigate to `/` and then scroll to the target section after mount.
- **Cookie/storage notice**: banner on first visit, equal-weight Accept / Reject / Customize; categories: Necessary (always on), Third-party media (Spline, off by default). Choice can be changed from the footer ("Cookie settings").

## 6. Animations (all must degrade under prefers-reduced-motion)
Crossfade, shared element transitions (FAQ + area cards), blur reveals, morph (hero shape, theme icon), stagger (lists/cards), spring (hover/press), custom easing, plus: scroll-linked progress bar, subtle parallax in hero, animated underline in navbar, magnetic CTA button, count-free reveal on scroll, card tilt/spotlight on hover, animated focus rings. Details in ARCHITECTURE.md section 7.

## 7. Content rules
No invented facts. Placeholders: `[TODO-CONTENT: ...]`. Tone: friendly, motivating, student-to-student. All text exists in ES and EN.

## 8. Quality
WCAG 2.2 AA, keyboard accessible, tested at 360px and 1440px, both themes, both languages. Performance targets in ARCHITECTURE.md section 9. SEO: title, meta description, Open Graph, `lang`, sitemap/robots (basic).

## 9. Pending inputs from the user
- WhatsApp group link (later task).
- Full contact email (the domain after `selomyespindola11` is missing).
- Legal responsible person/entity name.
- Own logo and final domain (if any).
- Hosting choice: Vercel or GitHub Pages.
- Community wording defaults to INDEPENDENT until the user confirms an official chapter (affects branding wording).
- Spline demo scene is DEV-ONLY until the user confirms permission or provides their own scene.
