import { useReducedMotion as useFramerReducedMotion } from 'framer-motion';

/**
 * Thin wrapper over framer-motion's useReducedMotion (v14 reads the OS
 * prefers-reduced-motion setting directly; no MotionConfig required).
 * Returns false while the value is undetermined.
 */
export function useReducedMotion(): boolean {
  return useFramerReducedMotion() ?? false;
}
