import fs from 'fs';
import path from 'path';
import {
    HUE_NAMES,
    COLOR_STEPS,
    NEUTRAL_STEPS,
    STATUS_NAMES,
    SEMANTIC_SUFFIXES,
    DEFAULT_HUES,
    LIGHTNESS_SCALE,
    CHROMA_SCALE
} from './assets/ts/colors';

const STATUS_MAP: Record<string, string> = {
    brand: 'teal',
    info: 'blue',
    success: 'green',
    warning: 'yellow',
    danger: 'red'
};

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

interface CssProperty {
    name: string;
    description: string;
}

const properties: CssProperty[] = [];

for (const name of HUE_NAMES) {
    const def = DEFAULT_HUES[name];
    properties.push({
        name: `--mi-hue-${name}`,
        description: `Hue angle for ${name} (default: ${def.hue})`
    });
    properties.push({
        name: `--mi-chroma-${name}`,
        description: `Base chroma for ${name} (default: ${def.chroma})`
    });
    for (const step of COLOR_STEPS) {
        const L = LIGHTNESS_SCALE[step];
        const C = def.chroma * CHROMA_SCALE[step];
        const offsetNote = def.lightnessOffset ? `, lightnessOffset: ${def.lightnessOffset}` : '';
        properties.push({
            name: `--mi-${name}-${step}`,
            description: `${name} ${step} — oklch(${L} ${C.toFixed(3)} ${def.hue}${offsetNote})`
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
        description: `Neutral ${step} (achromatic)`
    });
}

const allSuffixes = [...SEMANTIC_SUFFIXES, 'surface-alpha'] as const;

for (const status of STATUS_NAMES) {
    const hue = STATUS_MAP[status];
    properties.push({
        name: `--color-${status}`,
        description: `${status} base color (mapped from ${hue})`
    });
    for (const suffix of allSuffixes) {
        properties.push({
            name: `--color-${status}-${suffix}`,
            description: `${status} ${suffix} variant`
        });
    }
}

for (const token of UI_TOKENS) {
    properties.push({
        name: `--color-${token.name}`,
        description: token.desc
    });
}

const cssData = {
    version: 1.1,
    properties
};

const distDir = path.resolve(import.meta.dirname ?? __dirname, '..', 'dist');
fs.mkdirSync(distDir, { recursive: true });
fs.writeFileSync(
    path.join(distDir, 'minazuki-ui.css-data.json'),
    JSON.stringify(cssData, null, 2)
);
