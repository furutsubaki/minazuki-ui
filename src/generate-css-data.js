import fs from 'fs';
import path from 'path';

const HUE_NAMES = [
    'red', 'orange', 'yellow', 'lime', 'green',
    'teal', 'blue', 'indigo', 'purple', 'pink'
];
const COLOR_STEPS = [100, 200, 300, 400, 500, 600, 700];
const NEUTRAL_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const STATUS_NAMES = ['brand', 'info', 'success', 'warning', 'danger'];
const SEMANTIC_SUFFIXES = ['surface', 'subtle', 'muted', 'emphasis', 'strong', 'alpha', 'surface-alpha'];

const UI_TOKENS = [
    { name: 'text-primary', desc: 'Primary text color' },
    { name: 'text-secondary', desc: 'Secondary text color' },
    { name: 'text-disabled', desc: 'Disabled text color' },
    { name: 'placeholder', desc: 'Placeholder text color' },
    { name: 'bg-surface', desc: 'Surface background (cards, floating elements)' },
    { name: 'bg-primary', desc: 'Page background' },
    { name: 'bg-secondary', desc: 'Section background' },
    { name: 'bg-tertiary', desc: 'Nested section background' },
    { name: 'bg-select', desc: 'Selection highlight (brand alpha)' },
    { name: 'overlay', desc: 'Modal/dialog overlay (semi-transparent black)' },
    { name: 'border', desc: 'Default border color' },
    { name: 'border-strong', desc: 'Emphasized border color' },
    { name: 'shadow', desc: 'Shadow color' },
    { name: 'link', desc: 'Link text color (blue)' },
    { name: 'link-hover', desc: 'Link hover color' },
    { name: 'link-alpha', desc: 'Link color with 80% opacity' },
    { name: 'shadow-alpha', desc: 'Shadow color with 30% opacity' }
];

const DEFAULT_HUES = {
    red: { hue: 25, chroma: 0.18 },
    orange: { hue: 50, chroma: 0.16 },
    yellow: { hue: 95, chroma: 0.14 },
    lime: { hue: 135, chroma: 0.15 },
    green: { hue: 155, chroma: 0.14 },
    teal: { hue: 180, chroma: 0.10 },
    blue: { hue: 250, chroma: 0.15 },
    indigo: { hue: 270, chroma: 0.12 },
    purple: { hue: 310, chroma: 0.13 },
    pink: { hue: 340, chroma: 0.13 }
};

const LIGHTNESS_SCALE = { 100: 0.96, 200: 0.88, 300: 0.76, 400: 0.65, 500: 0.55, 600: 0.45, 700: 0.35 };

const STATUS_MAP = {
    brand: 'teal', info: 'blue', success: 'green', warning: 'yellow', danger: 'red'
};

const properties = [];

for (const name of HUE_NAMES) {
    const { hue, chroma } = DEFAULT_HUES[name];

    properties.push({
        name: `--mi-hue-${name}`,
        description: `Hue angle for ${name} (default: ${hue})`
    });
    properties.push({
        name: `--mi-chroma-${name}`,
        description: `Base chroma for ${name} (default: ${chroma})`
    });

    for (const step of COLOR_STEPS) {
        const L = LIGHTNESS_SCALE[step];
        properties.push({
            name: `--mi-${name}-${step}`,
            description: `${name} ${step} — oklch(${L} ${(chroma * (step === 400 ? 1 : 0.15 + (step < 400 ? step / 600 : (800 - step) / 600))).toFixed(3)} ${hue})`
        });
    }

    properties.push({
        name: `--mi-${name}`,
        description: `${name} base color (alias for --mi-${name}-400)`
    });
}

for (const step of NEUTRAL_STEPS) {
    properties.push({
        name: `--mi-neutral-${step}`,
        description: `Neutral ${step} — perceptually uniform gray`
    });
}

for (const status of STATUS_NAMES) {
    const hueName = STATUS_MAP[status];
    properties.push({
        name: `--color-${status}`,
        description: `${status} semantic color (maps to ${hueName})`
    });
    for (const suffix of SEMANTIC_SUFFIXES) {
        const descMap = {
            alpha: '80% opacity',
            'surface-alpha': 'Semi-transparent surface (50% opacity)'
        };
        const desc = descMap[suffix] || `${suffix} variant`;
        properties.push({
            name: `--color-${status}-${suffix}`,
            description: `${status} ${desc}`
        });
    }
}

for (const token of UI_TOKENS) {
    properties.push({
        name: `--color-${token.name}`,
        description: `${token.desc} (theme-aware: light-dark)`
    });
}

const cssData = {
    version: 1.1,
    properties
};

const outPath = path.resolve('dist', 'minazuki-ui.css-data.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(cssData, null, 2) + '\n');
