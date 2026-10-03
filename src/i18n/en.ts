import type { Dict } from './es';

// English dictionary. Typed against Dict (defined by es.ts): a missing or
// extra key here is a compile error. Verbatim legal wording from docs/LEGAL.md.

export const en: Dict = {
  nav: {
    home: 'Home',
    about: 'About',
    activities: 'Activities',
    areas: 'Areas',
    join: 'Join',
    faq: 'FAQ',
  },
  theme: {
    toggle: 'Toggle theme',
  },
  language: {
    toggle: 'Change language',
    english: 'English',
    spanish: 'Español',
  },
  footer: {
    nonAffiliation:
      'MLSA University Community is an independent student community. It is not affiliated with, endorsed by or sponsored by Microsoft Corporation unless expressly stated. Microsoft and its product names are trademarks of Microsoft Corporation.',
    cookieSettings: 'Cookie settings',
  },
  legal: {
    terms: 'Terms and Conditions',
    privacy: 'Privacy Policy',
    cookies: 'Cookie Policy',
    notice: 'Legal Notice',
    conduct: 'Code of Conduct',
  },
  meta: {
    title: 'MLSA University Community',
    description: '[TODO-CONTENT: meta description EN]',
  },
};
