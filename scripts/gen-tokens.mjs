// ============================================================
//  TARS mobile — design-token generator
//  Reads the synced design-system CSS (the upstream source of truth) and emits
//  src/theme/tokens.ts, which ThemeContext consumes. React Native can't read CSS
//  at runtime, so we transpile the tokens at sync time.
//
//  Run:  node scripts/gen-tokens.mjs   (after a design sync)
// ============================================================
import fs from 'fs';
import path from 'path';

const root = process.cwd();
const colorsCss = fs.readFileSync(path.join(root, 'design-system/tokens/colors.css'), 'utf8');

// Extract a `selector { ... }` block and parse its --var: value; pairs.
function parseBlock(css, selector) {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = css.match(new RegExp(esc + '\\s*\\{([\\s\\S]*?)\\}'));
  const vars = {};
  if (!m) return vars;
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let x;
  while ((x = re.exec(m[1]))) vars['--' + x[1]] = x[2].trim();
  return vars;
}

const light = parseBlock(colorsCss, ':root');
const dark  = { ...light, ...parseBlock(colorsCss, '[data-theme="dark"]') }; // dark overrides light

// RN theme key -> CSS custom property (role-based; see DESIGN.md mapping)
const MAP = {
  bgBase: '--bg', bgSurface: '--surface', bgElevated: '--bg-2',
  bgBorder: '--border', bgBorder2: '--border-2',
  textPrimary: '--ink', textSecondary: '--ink-2', textMuted: '--ink-3', textInverse: '--text-inverse',
  primary: '--primary', primary2: '--primary-2',
  indigo: '--buy', indigo2: '--buy-2',   // mobile "indigo" == design "buy" (violet)
  cyan: '--sell', cyan2: '--sell-2',      // mobile "cyan"   == design "sell" (cyan)
  amber: '--warning',
  success: '--success', success2: '--success-2',
  warning: '--warning', warning2: '--warning-2',
  danger: '--danger', danger2: '--danger-2',
  buy: '--buy', sell: '--sell',
};

function emit(vars) {
  return Object.entries(MAP).map(([k, cssVar]) => {
    const v = vars[cssVar];
    if (!v) throw new Error(`Missing token ${cssVar} for key ${k} in colors.css`);
    return `  ${k}: '${v}',`;
  }).join('\n');
}

const out = `// AUTO-GENERATED from design-system/tokens/colors.css by scripts/gen-tokens.mjs
// Design (claude.ai/design) is upstream. Do NOT edit by hand — run: node scripts/gen-tokens.mjs
export const lightColors = {
${emit(light)}
} as const;

export const darkColors = {
${emit(dark)}
} as const;
`;

const outPath = path.join(root, 'src/theme/tokens.ts');
fs.writeFileSync(outPath, out);
console.log('Wrote ' + outPath + ' (' + Object.keys(MAP).length + ' keys × light/dark)');
