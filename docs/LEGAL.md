# LEGAL.md — legal and compliance requirements

**These are working templates and requirements, not legal advice. A lawyer (ideally in Bolivia) should review the final texts before publishing.** References to specific laws below come from general knowledge and have NOT been verified; the agent must not cite statutes as fact in the published pages unless the user confirms them.

## 1. Facts about the site (drive what the legal texts must say)
- Operator: [TODO: legal responsible person/entity], contact: [TODO: full email].
- Based in Bolivia; visitors may come from anywhere (so also write texts to be GDPR-friendly as good practice).
- The site collects **no personal data**: no forms, accounts, analytics or ads.
- Browser storage used (strictly necessary preferences): `mlsa-theme`, `mlsa-lang`, `mlsa-consent`.
- Third-party connection: Spline scene (`prod.spline.design`) loaded **only after opt-in**; the visitor's IP address and browser data reach that third party. The outbound WhatsApp link leaves the site (WhatsApp/Meta privacy policy applies after click).
- Hosting provider (Vercel or GitHub Pages) may log IP addresses in server logs; mention it once the host is chosen.

## 2. Documents to produce (ES + EN, routes in SPEC/PLAN)
1. **Terms and Conditions** (`/terminos`): purpose of the site, acceptable use, intellectual property (own content vs Microsoft trademarks), no warranties, limitation of liability, external links, changes to terms, governing law and jurisdiction: Bolivia [TODO: confirm with lawyer], contact.
2. **Privacy Policy** (`/privacidad`): states no personal data is collected by the site; explains browser storage, hosting logs, the Spline third-party connection, the WhatsApp outbound link; visitor rights and contact; no children-targeted services.
3. **Cookie/Storage Policy** (`/cookies`): inventory table (name, purpose, duration, category) that matches reality exactly; how to change the choice.
4. **Legal Notice** (`/aviso-legal`): operator identification and contact, non-affiliation notice, trademark notice.
5. **Code of Conduct** (`/conducta`): respectful behavior in the community channels (WhatsApp group), reporting path, consequences. [TODO-CONTENT: leader to confirm rules.]

## 3. Cookie/consent behavior
- Strictly necessary preferences (theme, language, consent record) do not need opt-in but must be disclosed.
- Spline = "third-party media" category: **off by default**, opt-in. Reject and Accept have equal visual weight. Choice stored in `mlsa-consent` and changeable from the footer.
- If analytics or any other third party is added later, this document and the banner must be updated BEFORE shipping.

## 4. Non-affiliation notice (default: independent wording until the user confirms an official chapter)
- ES: "MLSA University Community es una comunidad estudiantil independiente. No está afiliada, respaldada ni patrocinada por Microsoft Corporation salvo que se indique expresamente. Microsoft y los nombres de sus productos son marcas registradas de Microsoft Corporation."
- EN: "MLSA University Community is an independent student community. It is not affiliated with, endorsed by or sponsored by Microsoft Corporation unless expressly stated. Microsoft and its product names are trademarks of Microsoft Corporation."
- If the community IS an official program chapter, the user must check the program's branding guidelines and replace this text accordingly.

## 5. Branding and licensing checklist
- [ ] No Microsoft logo or four-square mark unless written permission/guidelines allow it.
- [ ] Fonts: Inter (SIL OFL) self-hosted; no Segoe UI embedding.
- [ ] Icons: `lucide-react` (check license file in the installed package).
- [ ] Spline scene: dev-only until permission confirmed (confirm the user may use that scene — own it or license allows reuse — or provide their own scene). If not, create their own in Spline.
- [ ] Images: own or properly licensed; keep credits in an `ASSETS.md`.
- [ ] Third-party code: keep `THIRD_PARTY_NOTICES` generated from installed packages.
