import { en } from './en';
import { es } from './es';
import type { Dict } from './es';

export type Locale = 'es' | 'en';

export const dictionaries: Record<Locale, Dict> = { es, en };

/** Dotted paths to string leaves, e.g. 'nav.home' | 'footer.nonAffiliation'. */
export type MessagePath<T> = {
  [K in keyof T]: T[K] extends string ? K & string : `${K & string}.${MessagePath<T[K]>}`;
}[keyof T];

export type MessageKey = MessagePath<Dict>;

/** Runtime lookup for a dotted leaf path. Falls back to the key itself. */
export function getMessage(dict: Dict, path: MessageKey): string {
  let current: unknown = dict;
  for (const part of path.split('.')) {
    if (typeof current !== 'object' || current === null || !(part in current)) {
      return path;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : path;
}
