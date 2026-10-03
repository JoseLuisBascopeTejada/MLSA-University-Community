// scripts/contrast.mjs — WCAG 2.2 contrast audit for src/index.css design tokens.
//
// No dependencies. Parses :root / .dark / [data-area="..."] / .dark [data-area="..."]
// blocks, resolves each theme by CSS cascade, and checks every text/surface pair.
// Supports hex (#rgb, #rrggbb) and oklch(L C H [/ alpha]).
// oklch -> linear sRGB uses the standard Ottosson matrices (same constants as
// https://bottosson.github.io/posts/oklab.html).
// Self-checks (white/black = 21.0 in both formats, red/white ~= 4.0 via hex AND
// via oklch) run on every invocation before the token table; the script aborts
// with exit code 2 if the color math drifts.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = dirname(fileURLToPath(import.meta.url));
const CSS_PATH = join(ROOT, '..', 'src', 'index.css');

// ---------------------------------------------------------------- math ---

const srgbToLinear = (c) =>
  c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); // WCAG 2.2

function hexToLinear(hex) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  const n = parseInt(h, 16);
  return {
    r: srgbToLinear(((n >> 16) & 255) / 255),
    g: srgbToLinear(((n >> 8) & 255) / 255),
    b: srgbToLinear((n & 255) / 255),
    a: 1,
  };
}

let gamutClamps = 0;
function oklchToLinear(l, c, hDeg, a = 1) {
  const h = (hDeg * Math.PI) / 180;
  const a_ = c * Math.cos(h);
  const b_ = c * Math.sin(h);
  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.291485548 * b_;
  const lms = [l_, m_, s_].map((v) => v * v * v);
  const [L, M, S] = lms;
  const clamp = (v) => {
    if (v < 0 || v > 1) gamutClamps += 1;
    return Math.min(1, Math.max(0, v));
  };
  return {
    r: clamp(4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S),
    g: clamp(-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S),
    b: clamp(-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S),
    a,
  };
}

function parseColor(raw) {
  const v = raw.trim();
  const oklch = v.match(
    /^oklch\(\s*([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+%?))?\s*\)$/,
  );
  if (oklch) {
    const alpha = oklch[4]
      ? oklch[4].endsWith('%')
        ? parseFloat(oklch[4]) / 100
        : parseFloat(oklch[4])
      : 1;
    return oklchToLinear(parseFloat(oklch[1]), parseFloat(oklch[2]), parseFloat(oklch[3]), alpha);
  }
  const hex = v.match(/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/);
  if (hex) return hexToLinear(v);
  throw new Error(`unsupported color format: ${v}`);
}

/** Composite translucent fg over opaque bg (linear space). */
function over(fg, bg) {
  return {
    r: fg.a * fg.r + (1 - fg.a) * bg.r,
    g: fg.a * fg.g + (1 - fg.a) * bg.g,
    b: fg.a * fg.b + (1 - fg.a) * bg.b,
    a: 1,
  };
}

const luminance = (c) => 0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b;
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// ---------------------------------------------------------------- parse ---

const css = readFileSync(CSS_PATH, 'utf8');

function blockVars(selectorRe) {
  const m = css.match(selectorRe);
  if (!m) return {};
  const vars = {};
  for (const [, name, value] of m[1].matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) {
    vars[name] = value.trim();
  }
  return vars;
}

const root = blockVars(/:root\s*\{([^}]*)\}/);
const darkOver = blockVars(/\.dark\s*\{([^}]*)\}/);

const AREAS = ['rrhh', 'finanzas', 'marketing', 'operativa'];
const areaLight = {};
const areaDark = {};
for (const area of AREAS) {
  areaLight[area] = blockVars(new RegExp(`\\[data-area="${area}"\\]\\s*\\{([^}]*)\\}`));
  areaDark[area] = blockVars(new RegExp(`\\.dark\\s+\\[data-area="${area}"\\]\\s*\\{([^}]*)\\}`));
}

// CSS cascade emulation: [data-area] matches in both themes; .dark [data-area]
// wins on specificity for conflicting props.
const light = { ...root };
const dark = { ...root, ...darkOver };
const lightArea = Object.fromEntries(AREAS.map((a) => [a, { ...light, ...areaLight[a] }]));
const darkArea = Object.fromEntries(
  AREAS.map((a) => [a, { ...dark, ...areaLight[a], ...areaDark[a] }]),
);

function resolve(map, ref) {
  if (ref.startsWith('--')) {
    if (!(ref.slice(2) in map)) throw new Error(`token ${ref} not defined in theme map`);
    return parseColor(map[ref.slice(2)]);
  }
  if (ref.startsWith('mix(')) {
    // mix(tokenA, tokenB, t) — linear-space interpolation, t = fraction of A.
    const m = ref.match(/^mix\((--[\w-]+),\s*(--[\w-]+),\s*([0-9.]+)\)$/);
    const A = resolve(map, m[1]);
    const B = resolve(map, m[2]);
    const t = parseFloat(m[3]);
    return { r: t * A.r + (1 - t) * B.r, g: t * A.g + (1 - t) * B.g, b: t * A.b + (1 - t) * B.b, a: 1 };
  }
  return parseColor(ref); // literal
}

// ---------------------------------------------------------------- pairs ---

const BODY = 4.5;
const LARGE = 3.0;

/** [name, theme, fgRef, bgRef, threshold, required] */
const PAIRS = [
  // global — light
  ['foreground/background', 'light', '--foreground', '--background', BODY, true],
  ['muted-foreground/background', 'light', '--muted-foreground', '--background', BODY, true],
  ['primary-foreground/primary (button)', 'light', '--primary-foreground', '--primary', BODY, true],
  ['primary/background (link text)', 'light', '--primary', '--background', BODY, true],
  ['secondary pair', 'light', '--secondary-foreground', '--secondary', BODY, true],
  ['card pair', 'light', '--card-foreground', '--card', BODY, true],
  ['popover pair', 'light', '--popover-foreground', '--popover', BODY, true],
  ['accent pair', 'light', '--accent-foreground', '--accent', BODY, true],
  ['destructive/10%-tint', 'light', '--destructive', 'mix(--destructive,--background,0.1)', BODY, true],
  ['ring/background (focus)', 'light', '--ring', '--background', LARGE, true],
  ['border/background', 'light', '--border', '--background', LARGE, false],
  // global — dark
  ['foreground/background', 'dark', '--foreground', '--background', BODY, true],
  ['muted-foreground/background', 'dark', '--muted-foreground', '--background', BODY, true],
  ['primary-foreground/primary (button)', 'dark', '--primary-foreground', '--primary', BODY, true],
  ['primary/background (link text)', 'dark', '--primary', '--background', BODY, true],
  ['secondary pair', 'dark', '--secondary-foreground', '--secondary', BODY, true],
  ['card pair', 'dark', '--card-foreground', '--card', BODY, true],
  ['popover pair', 'dark', '--popover-foreground', '--popover', BODY, true],
  ['accent pair', 'dark', '--accent-foreground', '--accent', BODY, true],
  ['destructive/10%-tint', 'dark', '--destructive', 'mix(--destructive,--background,0.1)', BODY, true],
  ['ring/background (focus)', 'dark', '--ring', '--background', LARGE, true],
  ['border/background', 'dark', '--border', '--background', LARGE, false],
  // areas — both themes (ink-on-fill is theme-independent by construction,
  // but both rows are checked against the resolved maps anyway)
  ...AREAS.flatMap((a) => [
    [`${a}: area-foreground/area (light)`, 'light', '--area-foreground', '--area', BODY, true],
    [`${a}: area-text/background (light)`, 'light', '--area-text', '--background', BODY, true],
    [`${a}: area-foreground/area (dark)`, 'dark', '--area-foreground', '--area', BODY, true],
    [`${a}: area-text/background (dark)`, 'dark', '--area-text', '--background', BODY, true],
    [`${a}: area/background fill (light, info)`, 'light', '--area', '--background', LARGE, false],
    [`${a}: area/background fill (dark, info)`, 'dark', '--area', '--background', LARGE, false],
  ]),
];

const maps = { light, dark };
for (const a of AREAS) {
  maps[`light:${a}`] = lightArea[a];
  maps[`dark:${a}`] = darkArea[a];
}

// ---------------------------------------------------------------- run ---

function selfCheck() {
  const checks = [
    ['hex white/black', ratio(parseColor('#ffffff'), parseColor('#000000')), 21.0, 0.01],
    ['oklch white/black', ratio(parseColor('oklch(1 0 0)'), parseColor('oklch(0 0 0)')), 21.0, 0.01],
    ['hex red/white', ratio(parseColor('#ff0000'), parseColor('#ffffff')), 4.0, 0.02],
    [
      'oklch red/white',
      ratio(parseColor('oklch(0.62796 0.25773 29.234)'), parseColor('#ffffff')),
      4.0,
      0.05,
    ],
  ];
  let ok = true;
  for (const [name, got, want, tol] of checks) {
    const pass = Math.abs(got - want) <= tol;
    if (!pass) ok = false;
    console.log(`self-check ${pass ? 'OK  ' : 'FAIL'} ${name}: got ${got.toFixed(3)}, want ${want} (±${tol})`);
  }
  if (!ok) {
    console.error('SELF-CHECK FAILED — color math is wrong, aborting.');
    process.exit(2);
  }
}

selfCheck();
gamutClamps = 0; // reset: self-check uses in-gamut colors; count only token conversions

console.log('\n| pair | theme | ratio | threshold | result |');
console.log('|---|---|---|---|---|');
let failures = 0;
for (const [name, theme, fgRef, bgRef, threshold, required] of PAIRS) {
  const area = name.includes(': ') ? name.split(': ')[0] : null;
  const map = area ? maps[`${theme}:${area}`] : maps[theme];
  let fg = resolve(map, fgRef);
  const bg = resolve(map, bgRef);
  if (fg.a < 1) fg = over(fg, bg); // translucent token composited over its bg
  const r = ratio(fg, bg);
  const pass = r >= threshold;
  if (!pass && required) failures += 1;
  const tag = pass ? 'PASS' : required ? 'FAIL' : 'FAIL (info only)';
  console.log(`| ${name} | ${theme} | ${r.toFixed(2)} | ${threshold.toFixed(1)} | ${tag} |`);
}

if (gamutClamps > 0) console.log(`\nwarning: ${gamutClamps} oklch channel(s) clamped to sRGB gamut.`);
console.log(failures === 0 ? '\nALL REQUIRED PAIRS PASS' : `\n${failures} REQUIRED PAIR(S) FAIL`);
process.exit(failures === 0 ? 0 : 1);
