import type { Transition, Variants } from 'motion-dom';

// Shared animation presets (ARCHITECTURE.md section 7).
// STARTING values — tune in FASE 4 against the Chrome performance panel.
// Animate only transform, opacity and filter. Every consumer must branch on
// useReducedMotion() and fall back to reducedTransition (crossfade <=150ms).

export const ease = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutCubic: [0.65, 0, 0.35, 1] as [number, number, number, number],
};

export const spring = {
  soft: { type: 'spring', stiffness: 120, damping: 20 } satisfies Transition,
  snappy: { type: 'spring', stiffness: 400, damping: 30 } satisfies Transition,
};

export const stagger = {
  children: {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  } satisfies Variants,
  item: {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  } satisfies Variants,
};

/** Crossfade-only fallback for prefers-reduced-motion (duration <= 0.15s). */
export const reducedTransition: Transition = { duration: 0.15, ease: 'linear' };
