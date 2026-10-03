// Spanish dictionary. This file DEFINES the shape: every leaf is a string,
// every branch is a nested object. en.ts is checked against this type, so a
// missing or extra key there is a compile error. Site chrome only — real page
// copy arrives in FASE 3.

export const es = {
  nav: {
    home: 'Inicio',
    about: 'Nosotros',
    activities: 'Actividades',
    areas: 'Áreas',
    join: 'Únete',
    faq: 'Preguntas',
  },
  theme: {
    toggle: 'Cambiar tema',
  },
  language: {
    toggle: 'Cambiar idioma',
    english: 'English',
    spanish: 'Español',
  },
  footer: {
    nonAffiliation:
      'MLSA University Community es una comunidad estudiantil independiente. No está afiliada, respaldada ni patrocinada por Microsoft Corporation salvo que se indique expresamente. Microsoft y los nombres de sus productos son marcas registradas de Microsoft Corporation.',
    cookieSettings: 'Configurar cookies',
  },
  legal: {
    terms: 'Términos y condiciones',
    privacy: 'Política de privacidad',
    cookies: 'Política de cookies',
    notice: 'Aviso legal',
    conduct: 'Código de conducta',
  },
  meta: {
    title: 'MLSA University Community',
    description: '[TODO-CONTENT: meta description ES]',
  },
};

/** Dictionary shape: nested objects with string leaves. */
export type Dict = typeof es;
