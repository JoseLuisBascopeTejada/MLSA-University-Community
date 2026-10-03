// Shared keys + env readers. Storage keys are disclosed in docs/LEGAL.md.

export const THEME_KEY = 'mlsa-theme';
export const LANG_KEY = 'mlsa-lang';
export const CONSENT_KEY = 'mlsa-consent';

function readEnv(name: string): string {
  const value: unknown = import.meta.env[name];
  return typeof value === 'string' ? value : '';
}

/** Empty string = not provided (placeholder until the user supplies values). */
export const VITE_SITE_URL = readEnv('VITE_SITE_URL');
export const VITE_WHATSAPP_URL = readEnv('VITE_WHATSAPP_URL');
export const VITE_CONTACT_EMAIL = readEnv('VITE_CONTACT_EMAIL');
export const VITE_SPLINE_SCENE_URL = readEnv('VITE_SPLINE_SCENE_URL');
