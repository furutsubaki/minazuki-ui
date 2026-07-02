/*
 * ==================================================
 * File Name    composables/useTheme.ts
 * Description  OKLCH 2層カラーシステム（Primitive / Semantic）
 * ==================================================
 */

import { ref, shallowRef, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { toKebabCase } from '@/assets/ts/formatter';
import {
    type HueName,
    type NeutralStep,
    type StatusName,
    type HueDefinition,
    type StatusDefinition,
    HUE_NAMES,
    COLOR_STEPS,
    NEUTRAL_STEPS,
    STATUS_NAMES,
    SEMANTIC_SUFFIXES,
    SEMANTIC_STEP_MAP,
    DEFAULT_HUES,
    DEFAULT_STATUSES,
    computePrimitiveColor,
    computeNeutralColor,
    computeStatusColor
} from '@/assets/ts/colors';

// ---- Type Definitions ----

export type ThemeId = 'light' | 'dark';

// v1 → v2 のテーマ設定オプション互換チェック用
export interface LegacyThemeOptionsShape {
    theme?: unknown;
    themes?: unknown;
}

export const LEGACY_THEME_OPTIONS_MESSAGE =
    '[minazuki-ui] テーマ設定オプションが v1 形式のままです。' +
    ' `theme: string` → `themeId: string`、`themes: object` → `theme: object` に読み替えが必要です。' +
    ' 詳細: https://github.com/furutsubaki/minazuki-ui/blob/develop/docs/MIGRATION.md';

// options に v1 形式（theme が文字列 / themes キーが存在）が混在していないか検知する
export const detectLegacyThemeOptions = (options?: LegacyThemeOptionsShape | null): string | null => {
    if (!options) return null;
    const hasLegacyThemesKey = 'themes' in options && options.themes !== undefined;
    const hasLegacyThemeString = typeof options.theme === 'string';
    return hasLegacyThemesKey || hasLegacyThemeString ? LEGACY_THEME_OPTIONS_MESSAGE : null;
};

export interface UITokenPair {
    light: string;
    dark: string;
}

export interface MiPrimitives {
    hues: Record<HueName, number>;
    chromas: Record<HueName, number>;
    lightnessOffsets: Partial<Record<HueName, number>>;
    neutralHue?: number;
}

export type MiSemanticStatuses = Record<StatusName, StatusDefinition>;

export interface MiSemanticUI {
    textPrimary: UITokenPair;
    textSecondary: UITokenPair;
    textDisabled: UITokenPair;
    placeholder: UITokenPair;
    bgSurface: UITokenPair;
    bgPrimary: UITokenPair;
    bgSecondary: UITokenPair;
    bgTertiary: UITokenPair;
    bgSelect: UITokenPair;
    overlay: UITokenPair;
    border: UITokenPair;
    borderStrong: UITokenPair;
    shadow: UITokenPair;
    link: UITokenPair;
    linkHover: UITokenPair;
}

export interface MiThemeConfig {
    primitives: MiPrimitives;
    statuses: MiSemanticStatuses;
    ui: MiSemanticUI;
}

export interface MiThemeOverride {
    primitives?: {
        hues?: Partial<Record<HueName, number>>;
        chromas?: Partial<Record<HueName, number>>;
        lightnessOffsets?: Partial<Record<HueName, number>>;
        neutralHue?: number;
    };
    statuses?: Partial<Record<StatusName, Partial<StatusDefinition>>>;
    ui?: Partial<Record<keyof MiSemanticUI, string | UITokenPair>>;
}

// ---- Defaults ----

function buildDefaultPrimitives(): MiPrimitives {
    const hues = {} as Record<HueName, number>;
    const chromas = {} as Record<HueName, number>;
    const lightnessOffsets: Partial<Record<HueName, number>> = {};
    for (const name of HUE_NAMES) {
        hues[name] = DEFAULT_HUES[name].hue;
        chromas[name] = DEFAULT_HUES[name].chroma;
        if (DEFAULT_HUES[name].lightnessOffset) {
            lightnessOffsets[name] = DEFAULT_HUES[name].lightnessOffset;
        }
    }
    return { hues, chromas, lightnessOffsets };
}

const DEFAULT_UI: MiSemanticUI = {
    textPrimary: { light: 'var(--mi-neutral-700)', dark: 'var(--mi-neutral-50)' },
    textSecondary: { light: 'var(--mi-neutral-600)', dark: 'var(--mi-neutral-300)' },
    textDisabled: { light: 'var(--mi-neutral-400)', dark: 'var(--mi-neutral-500)' },
    placeholder: { light: 'var(--mi-neutral-400)', dark: 'var(--mi-neutral-500)' },
    bgSurface: { light: 'var(--mi-neutral-50)', dark: 'var(--mi-neutral-900)' },
    bgPrimary: { light: 'var(--mi-neutral-100)', dark: 'var(--mi-neutral-800)' },
    bgSecondary: { light: 'var(--mi-neutral-200)', dark: 'var(--mi-neutral-700)' },
    bgTertiary: { light: 'var(--mi-neutral-300)', dark: 'var(--mi-neutral-600)' },
    bgSelect: { light: 'var(--color-brand-alpha)', dark: 'var(--color-brand-alpha)' },
    overlay: { light: '#00000066', dark: '#000000b3' },
    border: { light: 'var(--mi-neutral-300)', dark: 'var(--mi-neutral-600)' },
    borderStrong: { light: 'var(--mi-neutral-400)', dark: 'var(--mi-neutral-500)' },
    shadow: { light: 'var(--mi-neutral-800)', dark: 'var(--mi-neutral-900)' },
    link: { light: 'var(--mi-blue-400)', dark: 'var(--mi-blue-300)' },
    linkHover: { light: 'var(--mi-blue-500)', dark: 'var(--mi-blue-200)' }
};

function buildDefaultConfig(): MiThemeConfig {
    return {
        primitives: buildDefaultPrimitives(),
        statuses: structuredClone(DEFAULT_STATUSES),
        ui: structuredClone(DEFAULT_UI)
    };
}

// ---- CSS Generation ----

function buildHueDefs(p: MiPrimitives): Record<HueName, HueDefinition> {
    const defs = {} as Record<HueName, HueDefinition>;
    for (const name of HUE_NAMES) {
        const def: HueDefinition = { hue: p.hues[name], chroma: p.chromas[name] };
        const offset = p.lightnessOffsets?.[name];
        if (offset) def.lightnessOffset = offset;
        defs[name] = def;
    }
    return defs;
}

function genPrimitives(p: MiPrimitives): string {
    const out: string[] = [];
    const defs = buildHueDefs(p);

    for (const name of HUE_NAMES) {
        out.push(`--mi-hue-${name}:${p.hues[name]}`);
        out.push(`--mi-chroma-${name}:${p.chromas[name]}`);

        for (const step of COLOR_STEPS) {
            const { hex } = computePrimitiveColor(defs[name], step);
            out.push(`--mi-${name}-${step}:${hex}`);
        }
        out.push(`--mi-${name}:var(--mi-${name}-400)`);
    }

    for (const step of NEUTRAL_STEPS) {
        const { hex } = computeNeutralColor(step, p.neutralHue);
        out.push(`--mi-neutral-${step}:${hex}`);
    }

    return out.join(';');
}

function genStatuses(statuses: MiSemanticStatuses, p: MiPrimitives): string {
    const out: string[] = [];
    const defs = buildHueDefs(p);

    const ALPHA_HEX: Partial<Record<string, string>> = {
        alpha: 'cc',
        'surface-alpha': '80'
    };

    for (const name of STATUS_NAMES) {
        const def = statuses[name];
        const hasOffset = def.lightnessOffset !== 0;
        const hue = def.hue;

        const base = computeStatusColor(def, defs, 400);
        out.push(hasOffset ? `--color-${name}:${base.hex}` : `--color-${name}:var(--mi-${hue}-400)`);

        for (const suffix of SEMANTIC_SUFFIXES) {
            const step = SEMANTIC_STEP_MAP[suffix];
            const alphaHex = ALPHA_HEX[suffix];
            const { hex } = computeStatusColor(def, defs, step);

            if (alphaHex) {
                out.push(`--color-${name}-${suffix}:${hex}${alphaHex}`);
            } else if (hasOffset) {
                out.push(`--color-${name}-${suffix}:${hex}`);
            } else {
                out.push(`--color-${name}-${suffix}:var(--mi-${hue}-${step})`);
            }
        }
    }

    return out.join(';');
}

function genUI(ui: MiSemanticUI): string {
    const out: string[] = [];
    for (const [key, pair] of Object.entries(ui) as [string, UITokenPair][]) {
        const varName = `--color-${toKebabCase(key)}`;
        if (pair.light === pair.dark) {
            out.push(`${varName}:${pair.light}`);
        } else {
            out.push(`${varName}:light-dark(${pair.light},${pair.dark})`);
        }
    }
    return out.join(';');
}

function genExtraAlphas(p: MiPrimitives): string {
    const out: string[] = [];
    const defs = buildHueDefs(p);

    const linkLight = computePrimitiveColor(defs.blue, 400);
    const linkDark = computePrimitiveColor(defs.blue, 300);
    out.push(`--color-link-alpha:light-dark(${linkLight.hex}cc,${linkDark.hex}cc)`);

    const shadowLight = computeNeutralColor(800 as NeutralStep, p.neutralHue);
    const shadowDark = computeNeutralColor(900 as NeutralStep, p.neutralHue);
    out.push(`--color-shadow-alpha:light-dark(${shadowLight.hex}4d,${shadowDark.hex}4d)`);

    return out.join(';');
}

function genAliases(): string {
    const m: [string, string][] = [
        ...STATUS_NAMES.flatMap((s) => [
            [`--color-status-${s}`, `var(--color-${s})`],
            ...SEMANTIC_SUFFIXES.map((suffix) =>
                [`--color-status-${s}-${suffix}`, `var(--color-${s}-${suffix})`]
            )
        ] as [string, string][]),

        ...HUE_NAMES.map((h) => [`--color-base-${h}`, `var(--mi-${h})`] as [string, string]),

        ['--color-base-white-true', 'var(--mi-neutral-50)'],
        ['--color-base-white', 'var(--mi-neutral-100)'],
        ['--color-base-white-dark', 'var(--mi-neutral-200)'],
        ['--color-base-gray-light', 'var(--mi-neutral-300)'],
        ['--color-base-gray', 'var(--mi-neutral-400)'],
        ['--color-base-gray-dark', 'var(--mi-neutral-600)'],
        ['--color-base-black-light', 'var(--mi-neutral-700)'],
        ['--color-base-black', 'var(--mi-neutral-800)'],
        ['--color-base-black-true', 'var(--mi-neutral-900)'],

        ['--color-base-blue-alpha', 'var(--color-link-alpha)'],

        ['--color-theme-text-primary', 'var(--color-text-primary)'],
        ['--color-theme-text-secondary', 'var(--color-text-secondary)'],
        ['--color-theme-placeholder', 'var(--color-placeholder)'],
        ['--color-theme-link', 'var(--color-link)'],
        ['--color-theme-link-hover', 'var(--color-link-hover)'],
        ['--color-theme-bg-primary', 'var(--color-bg-primary)'],
        ['--color-theme-bg-secondary', 'var(--color-bg-secondary)'],
        ['--color-theme-bg-select', 'var(--color-bg-select)'],
        ['--color-theme-border', 'var(--color-border)'],
        ['--color-theme-shadow', 'var(--color-shadow)'],
        ['--color-theme-shadow-alpha', 'var(--color-shadow-alpha)']
    ];

    return m.map(([k, v]) => `${k}:${v}`).join(';');
}

export function generateFullCss(config: MiThemeConfig): string {
    const sections = [
        genPrimitives(config.primitives),
        genStatuses(config.statuses, config.primitives),
        genUI(config.ui),
        genExtraAlphas(config.primitives),
        genAliases()
    ].join(';');

    return `:root{color-scheme:light;${sections}}[data-theme="dark"]{color-scheme:dark}`;
}

// ---- Global State ----

const THEME_STYLE_ID = 'minazuki-theme-vars';

const currentTheme = ref<ThemeId>(
    typeof window !== 'undefined'
        ? (window.localStorage.getItem('themeId') as ThemeId) ?? 'light'
        : 'light'
);

const themeConfig = shallowRef<MiThemeConfig>(buildDefaultConfig());

const setTheme = (themeId: ThemeId) => {
    const id: ThemeId = themeId === 'dark' ? 'dark' : 'light';
    currentTheme.value = id;

    const css = generateFullCss(themeConfig.value);

    if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', id);

        let styleEl = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = THEME_STYLE_ID;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = css;

        try {
            window.localStorage.setItem('themeId', id);
        } catch {
            // private browsing
        }
    } else {
        useHead({
            htmlAttrs: { 'data-theme': id },
            style: [{ id: THEME_STYLE_ID, textContent: css }]
        });
    }
};

watch(currentTheme, (newTheme) => {
    if (typeof document === 'undefined') return;
    setTheme(newTheme);
});

const overrideTheme = (overrides: MiThemeOverride) => {
    const raw: MiThemeOverride = JSON.parse(JSON.stringify(overrides));
    const config = structuredClone(themeConfig.value);

    if (raw.primitives) {
        if (raw.primitives.hues) {
            Object.assign(config.primitives.hues, raw.primitives.hues);
        }
        if (raw.primitives.chromas) {
            Object.assign(config.primitives.chromas, raw.primitives.chromas);
        }
        if (raw.primitives.lightnessOffsets) {
            Object.assign(config.primitives.lightnessOffsets, raw.primitives.lightnessOffsets);
        }
        if (raw.primitives.neutralHue !== undefined) {
            config.primitives.neutralHue = raw.primitives.neutralHue;
        }
    }

    if (raw.statuses) {
        for (const [name, partial] of Object.entries(raw.statuses)) {
            if (partial && config.statuses[name as StatusName]) {
                Object.assign(config.statuses[name as StatusName], partial);
            }
        }
    }

    if (raw.ui) {
        for (const [key, val] of Object.entries(raw.ui)) {
            if (val === undefined) continue;
            const uiKey = key as keyof MiSemanticUI;
            if (typeof val === 'string') {
                config.ui[uiKey] = { light: val, dark: val };
            } else {
                config.ui[uiKey] = { ...config.ui[uiKey], ...val };
            }
        }
    }

    themeConfig.value = config;
    setTheme(currentTheme.value);
};

export default function useTheme() {
    return { currentTheme, themeConfig, overrideTheme, setTheme };
}
