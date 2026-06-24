/*
 * ==================================================
 * File Name    composables/useTheme.ts
 * Description  テーマカラー（OKLCH 3層トークン設計）
 * ==================================================
 */

import { ref, shallowRef, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { toKebabCase } from '@/assets/ts/formatter';
import { deepMerge } from '@/assets/ts';
import { oklchToHex, oklchToHexAlpha } from '@/assets/ts/color';

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export type themeId = 'light' | 'dark' | string;

// === 旧型（型のみ後方互換のために維持。内部のテーマ生成では使用しない） ===
export interface MiThemeOptionBase extends Record<string, string> {
    whiteTrue: string;
    white: string;
    whiteDark: string;
    grayLight: string;
    gray: string;
    grayDark: string;
    blackLight: string;
    black: string;
    blackTrue: string;
    red: string;
    orange: string;
    yellow: string;
    lime: string;
    green: string;
    cyan: string;
    blue: string;
    indigo: string;
    purple: string;
    pink: string;
}
export interface MiThemeOptionStatus extends Record<string, string> {
    brand: string;
    info: string;
    success: string;
    warning: string;
    danger: string;
}
export interface MiThemeOptionTheme extends Record<string, string> {
    textPrimary: string;
    textSecondary: string;
    placeholder: string;
    link: string;
    linkHover: string;
    bgPrimary: string;
    bgSecondary: string;
    bgSelect: string;
    border: string;
    shadow: string;
}
export interface MiTheme
    extends Record<
        string,
        undefined | MiThemeOptionBase | MiThemeOptionStatus | MiThemeOptionTheme
    > {
    base?: MiThemeOptionBase;
    status?: MiThemeOptionStatus;
    theme?: MiThemeOptionTheme;
}

// === 新型: 3層トークン設計 ===
// Layer 1: Primitives（色相・彩度・明度スケール）
export interface MiPrimitiveLightness extends Record<string, number> {
    surface: number;
    subtle: number;
    muted: number;
    base: number;
    emphasis: number;
    strong: number;
}
export interface MiPrimitiveChromaScale extends Record<string, number> {
    full: number;
    moderate: number;
    subtle: number;
    tint: number;
}
export interface MiPrimitives extends Record<string, unknown> {
    hues: Record<string, number>;
    chromas: Record<string, number>;
    lightness: MiPrimitiveLightness;
    chromaScale: MiPrimitiveChromaScale;
}

// Layer 2: Role mappings（意味づけ: role が参照する hue/chroma キー）
export interface MiRoleDefinition {
    hue: string;
    chroma: string;
    // sRGBガモットの制約で黄色系は L=0.65 付近では彩度を上げても金/オリーブにしかならず
    // 鮮やかな黄色にならないため、ラダー全体の明度を底上げするための補正値（任意）
    lightnessOffset?: number;
}
export type MiRoleMap = Record<string, MiRoleDefinition>;

// Layer 3 手前: Neutrals（無彩色のテーマ依存トークン。OKLCH 合成の対象外）
export interface MiNeutrals extends Record<string, string> {
    textPrimary: string;
    textSecondary: string;
    placeholder: string;
    bgPrimary: string;
    bgSecondary: string;
    bgSelect: string;
    border: string;
    shadow: string;
}

export interface MiThemeConfig extends Record<string, unknown> {
    primitives: MiPrimitives;
    roles: MiRoleMap;
    neutrals: MiNeutrals;
}

// overrideTheme に渡す部分上書き用の型
export interface MiThemeConfigOverride extends Record<string, unknown> {
    primitives?: {
        hues?: Record<string, number>;
        chromas?: Record<string, number>;
        lightness?: Partial<MiPrimitiveLightness>;
        chromaScale?: Partial<MiPrimitiveChromaScale>;
    };
    roles?: Record<string, MiRoleDefinition>;
    neutrals?: Partial<MiNeutrals>;
}

// global state
// Node 22.4+ では bare な localStorage が globalThis の遅延 getter になり、参照だけで
// ExperimentalWarning が発火する。window 経由でアクセスすれば SSR（window 不在）では
// 触れず、Node のグローバル getter を踏まない。
const currentTheme = ref<themeId>(
    typeof window !== 'undefined' ? window.localStorage.themeId ?? 'light' : 'light'
);

// 無彩色パレット（テーマ不変。OKLCH 合成の対象外）
const NEUTRAL_BASE = {
    whiteTrue: '#ffffff',
    white: '#f7f7f7',
    whiteDark: '#dedede',
    grayLight: '#cad0ce',
    gray: '#b4c1c8',
    grayDark: '#696e70',
    blackLight: '#505050',
    black: '#2d2d2d',
    blackTrue: '#000000'
} as const;

// 有彩色プリミティブ: 色相 (deg) と彩度（sRGB ガモット内で安全な値）
const HUES: Record<string, number> = {
    red: 25,
    orange: 55,
    yellow: 95,
    lime: 135,
    green: 160,
    teal: 180,
    cyan: 200,
    blue: 250,
    indigo: 270,
    purple: 310,
    pink: 340
};
const CHROMAS: Record<string, number> = {
    red: 0.22,
    orange: 0.15,
    yellow: 0.16,
    lime: 0.15,
    green: 0.13,
    teal: 0.1,
    cyan: 0.1,
    blue: 0.15,
    indigo: 0.15,
    purple: 0.15,
    pink: 0.15
};

// role = 意味づけ（brand/info/success/warning/danger/link）が参照する hue/chroma
const ROLE_MAP: MiRoleMap = {
    brand: { hue: 'teal', chroma: 'teal' },
    info: { hue: 'lime', chroma: 'lime' },
    success: { hue: 'blue', chroma: 'blue' },
    warning: { hue: 'yellow', chroma: 'yellow', lightnessOffset: 0.2 },
    danger: { hue: 'red', chroma: 'red' },
    link: { hue: 'orange', chroma: 'orange' }
};

// 全色相プリミティブの base + alpha を role 経由せず直接公開する（ladder 展開はしない）。
// role が参照する hue（teal/lime/blue/yellow/red/orange）も対象に含む。role の base 段階と
// 同一の hue/chroma を使うため見た目は基本的に一致するが、Warning(yellow) は lightnessOffset
// 分だけ役割側の値とずれる（生の hue を確認する用途のため意図的に offset を適用しない）
const EXTENDED_HUES = Object.keys(HUES);

// 明度スケール（lightnessKey）× 彩度スケール係数（chromaScaleKey）の組み合わせ
const LIGHTNESS_LADDER = [
    { suffix: 'surface', lightnessKey: 'surface', chromaScaleKey: 'tint' },
    { suffix: 'subtle', lightnessKey: 'subtle', chromaScaleKey: 'subtle' },
    { suffix: 'muted', lightnessKey: 'muted', chromaScaleKey: 'moderate' },
    { suffix: '', lightnessKey: 'base', chromaScaleKey: 'full' },
    { suffix: 'emphasis', lightnessKey: 'emphasis', chromaScaleKey: 'full' },
    { suffix: 'strong', lightnessKey: 'strong', chromaScaleKey: 'full' }
] as const;

// 旧トークン名 -> 新トークン名（var() で参照させるだけの後方互換エイリアス）
const BACKWARD_COMPAT_ALIASES: Record<string, string> = {
    'status-brand': 'brand',
    'status-brand-alpha': 'brand-alpha',
    'status-info': 'info',
    'status-info-alpha': 'info-alpha',
    'status-success': 'success',
    'status-success-alpha': 'success-alpha',
    'status-warning': 'warning',
    'status-warning-alpha': 'warning-alpha',
    'status-danger': 'danger',
    'status-danger-alpha': 'danger-alpha',
    'theme-text-primary': 'text-primary',
    'theme-text-primary-alpha': 'text-primary-alpha',
    'theme-text-secondary': 'text-secondary',
    'theme-text-secondary-alpha': 'text-secondary-alpha',
    'theme-placeholder': 'placeholder',
    'theme-placeholder-alpha': 'placeholder-alpha',
    'theme-bg-primary': 'bg-primary',
    'theme-bg-primary-alpha': 'bg-primary-alpha',
    'theme-bg-secondary': 'bg-secondary',
    'theme-bg-secondary-alpha': 'bg-secondary-alpha',
    'theme-bg-select': 'bg-select',
    'theme-bg-select-alpha': 'bg-select-alpha',
    'theme-border': 'border',
    'theme-border-alpha': 'border-alpha',
    'theme-shadow': 'shadow',
    'theme-shadow-alpha': 'shadow-alpha',
    'theme-link': 'link',
    'theme-link-alpha': 'link-alpha',
    'theme-link-hover': 'link-emphasis',
    'base-red': 'danger',
    'base-red-alpha': 'danger-alpha',
    'base-orange': 'link',
    'base-orange-alpha': 'link-alpha',
    'base-yellow': 'warning',
    'base-yellow-alpha': 'warning-alpha',
    'base-lime': 'info',
    'base-lime-alpha': 'info-alpha',
    'base-blue': 'success',
    'base-blue-alpha': 'success-alpha',
    'base-green': 'green',
    'base-green-alpha': 'green-alpha',
    'base-cyan': 'cyan',
    'base-cyan-alpha': 'cyan-alpha',
    'base-indigo': 'indigo',
    'base-indigo-alpha': 'indigo-alpha',
    'base-purple': 'purple',
    'base-purple-alpha': 'purple-alpha',
    'base-pink': 'pink',
    'base-pink-alpha': 'pink-alpha'
};

const defaultThemes: Record<string, MiThemeConfig> = {
    light: {
        primitives: {
            hues: HUES,
            chromas: CHROMAS,
            lightness: { surface: 0.96, subtle: 0.85, muted: 0.75, base: 0.65, emphasis: 0.55, strong: 0.45 },
            chromaScale: { full: 1, moderate: 0.6, subtle: 0.3, tint: 0.15 }
        },
        roles: ROLE_MAP,
        neutrals: {
            textPrimary: NEUTRAL_BASE.black,
            textSecondary: NEUTRAL_BASE.grayDark,
            placeholder: NEUTRAL_BASE.grayDark,
            bgPrimary: NEUTRAL_BASE.white,
            bgSecondary: NEUTRAL_BASE.grayLight,
            bgSelect: '#49f9aa',
            border: NEUTRAL_BASE.gray,
            shadow: NEUTRAL_BASE.black
        }
    },
    dark: {
        primitives: {
            hues: HUES,
            chromas: CHROMAS,
            // ライトテーマと同じ絶対L値を流用すると、暗い背景との同時対比効果で
            // 同じ色でも明らかに明るく/鮮やかに見えすぎるため、base/emphasis/strongを
            // 控えめにし、chromaScaleも全体的に少し落として彩度の主張を抑える
            lightness: { surface: 0.22, subtle: 0.32, muted: 0.45, base: 0.6, emphasis: 0.7, strong: 0.78 },
            chromaScale: { full: 0.85, moderate: 0.5, subtle: 0.25, tint: 0.12 }
        },
        roles: ROLE_MAP,
        neutrals: {
            textPrimary: NEUTRAL_BASE.white,
            textSecondary: NEUTRAL_BASE.grayLight,
            placeholder: NEUTRAL_BASE.grayDark,
            bgPrimary: NEUTRAL_BASE.black,
            bgSecondary: NEUTRAL_BASE.blackLight,
            bgSelect: '#49f9aa',
            border: NEUTRAL_BASE.grayDark,
            shadow: NEUTRAL_BASE.blackLight
        }
    }
};

const themes = shallowRef<Record<string, MiThemeConfig>>(defaultThemes);

// hex の桁数（3/4/6/8桁）を判定して正規化し、alpha 版を組み立てる
// 3桁(#rgb)・4桁(#rgba)の短縮記法に対して "${hex}cc" の単純連結を行うと
// 桁数が不正な hex（CSSとして無効な値）になるため、桁数を見て expand する
const resolveHexAlpha = (hex: string): { normal: string; alpha: string } => {
    const digits = hex.slice(1);
    const expanded = digits.length === 3 || digits.length === 4 ? digits.split('').map((d) => `${d}${d}`).join('') : digits;
    const normal = `#${expanded}`;
    return expanded.length === 8 ? { normal, alpha: normal } : { normal, alpha: `${normal}cc` };
};

// neutrals は消費者が hex / oklch() / var() / 'transparent' 等の自由形式文字列で
// override できる唯一の層なので、形式を判定して alpha 版を組み立てる
const resolveNeutralColor = (color: string): { normal: string; alpha: string } => {
    if (color.startsWith('#')) {
        return resolveHexAlpha(color);
    }
    if (color.startsWith('oklch(') && !color.includes('/')) {
        return { normal: color, alpha: color.replace(/\)$/, ' / 80%)') };
    }
    if (color.startsWith('--')) {
        const normal = `var(${color})`;
        const alpha = color.endsWith('-alpha') ? normal : `var(${color}-alpha)`;
        return { normal, alpha };
    }
    return { normal: color, alpha: color };
};

// style生成
const createThemeCss = (themeId: string) => {
    const targetTheme = themes.value[themeId];
    const defaultTheme = themes.value.light;
    // structuredClone でディープコピー: deepMerge が参照代入で元データを汚染するのを防ぐ
    const joinTheme = deepMerge(
        {} as RecursivePartial<MiThemeConfig>,
        structuredClone(defaultTheme) as RecursivePartial<MiThemeConfig>,
        structuredClone(targetTheme) as RecursivePartial<MiThemeConfig>
    ) as MiThemeConfig;

    const { primitives, roles, neutrals } = joinTheme;

    let primitiveStyle = '';
    let semanticStyle = '';
    let oklchStyle = '';

    // === Layer 1: Primitives ===
    Object.entries(primitives.hues).forEach(([name, value]) => {
        primitiveStyle += `--mi-hue-${toKebabCase(name)}:${value};`;
    });
    Object.entries(primitives.chromas).forEach(([name, value]) => {
        primitiveStyle += `--mi-chroma-${toKebabCase(name)}:${value};`;
    });
    Object.entries(primitives.lightness).forEach(([name, value]) => {
        primitiveStyle += `--mi-l-${toKebabCase(name)}:${value};`;
    });
    Object.entries(primitives.chromaScale).forEach(([name, value]) => {
        primitiveStyle += `--mi-c-scale-${toKebabCase(name)}:${value};`;
    });

    // === Layer 2: Role -> primitive エイリアス（個別 override 可能にするための間接参照） ===
    Object.entries(roles).forEach(([role, def]) => {
        const kebabRole = toKebabCase(role);
        primitiveStyle += `--mi-hue-${kebabRole}:var(--mi-hue-${toKebabCase(def.hue)});`;
        primitiveStyle += `--mi-chroma-${kebabRole}:var(--mi-chroma-${toKebabCase(def.chroma)});`;
    });

    // === Layer 3: Role ごとの明度ラダー展開 ===
    Object.entries(roles).forEach(([role, def]) => {
        const h = primitives.hues[def.hue];
        const baseChroma = primitives.chromas[def.chroma];
        const kebabRole = toKebabCase(role);

        const offset = def.lightnessOffset ?? 0;

        LIGHTNESS_LADDER.forEach((step) => {
            const l = Math.min(0.98, Math.max(0.02, primitives.lightness[step.lightnessKey] + offset));
            const c = baseChroma * primitives.chromaScale[step.chromaScaleKey];
            const name = step.suffix ? `${kebabRole}-${step.suffix}` : kebabRole;
            const lExpr = offset
                ? `clamp(0.02, calc(var(--mi-l-${step.lightnessKey}) + ${offset}), 0.98)`
                : `var(--mi-l-${step.lightnessKey})`;

            semanticStyle += `--color-${name}:${oklchToHex(l, c, h)};`;
            oklchStyle += `--color-${name}:oklch(${lExpr} calc(var(--mi-chroma-${kebabRole}) * var(--mi-c-scale-${step.chromaScaleKey})) var(--mi-hue-${kebabRole}));`;
        });

        const baseLightness = Math.min(0.98, Math.max(0.02, primitives.lightness.base + offset));
        const baseLExpr = offset
            ? `clamp(0.02, calc(var(--mi-l-base) + ${offset}), 0.98)`
            : 'var(--mi-l-base)';
        semanticStyle += `--color-${kebabRole}-alpha:${oklchToHexAlpha(baseLightness, baseChroma, h, 0.8)};`;
        oklchStyle += `--color-${kebabRole}-alpha:oklch(${baseLExpr} var(--mi-chroma-${kebabRole}) var(--mi-hue-${kebabRole}) / 80%);`;
    });

    // === 拡張色（role 非依存。base + alpha のみ） ===
    EXTENDED_HUES.forEach((name) => {
        const h = primitives.hues[name];
        const c = primitives.chromas[name];
        const l = primitives.lightness.base;
        const kebabName = toKebabCase(name);

        semanticStyle += `--color-${kebabName}:${oklchToHex(l, c, h)};`;
        semanticStyle += `--color-${kebabName}-alpha:${oklchToHexAlpha(l, c, h, 0.8)};`;
        oklchStyle += `--color-${kebabName}:oklch(var(--mi-l-base) var(--mi-chroma-${kebabName}) var(--mi-hue-${kebabName}));`;
        oklchStyle += `--color-${kebabName}-alpha:oklch(var(--mi-l-base) var(--mi-chroma-${kebabName}) var(--mi-hue-${kebabName}) / 80%);`;
    });

    // === Neutrals（無彩色。OKLCH 合成なし、消費者が自由形式で override 可能） ===
    Object.entries(neutrals).forEach(([property, color]) => {
        const kebabKey = toKebabCase(property);
        const { normal, alpha } = resolveNeutralColor(color);
        semanticStyle += `--color-${kebabKey}:${normal};`;
        semanticStyle += `--color-${kebabKey}-alpha:${alpha};`;
    });

    // === 無彩色パレット（テーマ不変） ===
    Object.entries(NEUTRAL_BASE).forEach(([property, color]) => {
        const kebabKey = toKebabCase(property);
        const { normal, alpha } = resolveHexAlpha(color);
        semanticStyle += `--color-base-${kebabKey}:${normal};`;
        semanticStyle += `--color-base-${kebabKey}-alpha:${alpha};`;
    });

    // === 後方互換エイリアス ===
    let aliasStyle = '';
    Object.entries(BACKWARD_COMPAT_ALIASES).forEach(([oldName, newName]) => {
        aliasStyle += `--color-${oldName}:var(--color-${newName});`;
    });

    // role ladder が空でも EXTENDED_HUES（green/cyan/indigo/purple/pink）は必ず
    // oklchStyle に出力するため、oklchStyle が空になる経路は存在しない
    return `:root{${primitiveStyle}${semanticStyle}${aliasStyle}}@supports (color: oklch(0 0 0)){:root{${oklchStyle}}}`;
};
const THEME_STYLE_ID = 'minazuki-theme-vars';

const setTheme = (themeId: string) => {
    const themeCss = createThemeCss(themeId);

    if (typeof document !== 'undefined') {
        // クライアント: DOM直操作（Unheadの重複排除によるスタイル上書き失敗を回避）
        document.body.setAttribute('data-theme', themeId);
        let styleEl = document.getElementById(THEME_STYLE_ID) as HTMLStyleElement | null;
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = THEME_STYLE_ID;
            document.head.appendChild(styleEl);
        }
        styleEl.textContent = themeCss;
    } else {
        // SSR: useHeadでHTMLに注入
        useHead({
            bodyAttrs: { 'data-theme': themeId },
            style: [{ textContent: themeCss }]
        });
    }

    if (typeof window !== 'undefined') {
        window.localStorage.setItem('themeId', themeId);
    }
};

// theme変更検知（SSR では useHead コンテキスト外のため setTheme をスキップ、plugin の明示呼び出しに委譲）
watch(currentTheme, (newTheme) => {
    if (typeof document === 'undefined') return;
    setTheme(newTheme);
});

const overrideTheme = (overrideThemes: { [key: string]: MiThemeConfigOverride }) => {
    // useRuntimeConfig() 由来の reactive Proxy は structuredClone できないため JSON round-trip で剥がす
    const rawThemes: typeof overrideThemes = JSON.parse(JSON.stringify(overrideThemes));
    themes.value = deepMerge(themes.value, rawThemes as Partial<Record<string, MiThemeConfig>>);
};

export default function () {
    return { currentTheme, defaultThemes, themes, overrideTheme, setTheme };
}
