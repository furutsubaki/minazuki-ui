/*
 * ==================================================
 * File Name    composables/useTheme.ts
 * Description  テーマカラー
 * ==================================================
 */

import { ref, shallowRef, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { toKebabCase } from '@/assets/ts/formatter';
import { deepMerge } from '@/assets/ts';

type RecursiveRequired<T> = {
    [P in keyof T]-?: RecursiveRequired<T[P]>;
};
type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export type themeId = 'light' | 'dark' | string;

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

// global state
// Node 22.4+ では bare な localStorage が globalThis の遅延 getter になり、参照だけで
// ExperimentalWarning が発火する。window 経由でアクセスすれば SSR（window 不在）では
// 触れず、Node のグローバル getter を踏まない。
const currentTheme = ref<themeId>(
    typeof window !== 'undefined' ? window.localStorage.themeId ?? 'light' : 'light'
);
const baseTheme: MiTheme = {
    base: {
        whiteTrue: '#fff',
        white: '#f7f7f7',
        whiteDark: '#dedede',
        grayLight: '#cad0ce',
        gray: '#b4c1c8',
        grayDark: '#696e70',
        blackLight: '#505050',
        black: '#2d2d2d',
        blackTrue: '#000',
        red: '#dc143c',
        orange: '#f86624',
        yellow: '#f9dc5c',
        lime: '#71b340',
        green: '#3db680',
        cyan: '#57aeb5',
        blue: '#2196f3',
        indigo: '#2e5077',
        purple: '#b276bc',
        pink: '#ffa9e7'
    },
    status: {
        brand: '#2e7e16',
        info: '--color-base-lime',
        success: '--color-base-blue',
        warning: '--color-base-yellow',
        danger: '--color-base-red'
    }
} as const;
const themes = shallowRef<{ [key: string]: RecursivePartial<MiTheme> }>({
    light: {
        theme: {
            textPrimary: '--color-base-black',
            textSecondary: '--color-base-gray-dark',
            placeholder: '--color-base-gray-dark',
            link: '--color-base-orange-alpha',
            linkHover: '--color-base-orange',
            bgPrimary: '--color-base-white',
            bgSecondary: '--color-base-gray-light',
            bgSelect: '#49f9aa',
            border: '--color-base-gray',
            shadow: '--color-base-black'
        }
    },
    dark: {
        theme: {
            textPrimary: '--color-base-white',
            textSecondary: '--color-base-gray-light',
            placeholder: '--color-base-gray-dark',
            link: '--color-base-orange-alpha',
            linkHover: '--color-base-orange',
            bgPrimary: '--color-base-black',
            bgSecondary: '--color-base-black-light',
            bgSelect: '#49f9aa',
            border: '--color-base-gray-dark',
            shadow: '--color-base-black-light'
        }
    }
});

// style生成
const createThemeCss = (themeId: string) => {
    const targetTheme = themes.value[themeId];
    const defaultTheme = themes.value.light;
    // structuredClone でディープコピー: deepMerge が参照代入で元データを汚染するのを防ぐ
    const joinTheme = deepMerge(
        {} as RecursivePartial<MiTheme>,
        structuredClone(baseTheme) as RecursivePartial<MiTheme>,
        structuredClone(defaultTheme) as RecursivePartial<MiTheme>,
        structuredClone(targetTheme) as RecursivePartial<MiTheme>
    ) as RecursiveRequired<MiTheme>;

    let style = '';
    const optionKeys = ['base', 'status', 'theme'];
    optionKeys.forEach((key) => {
        const joinThemeData = joinTheme[key];
        if (!joinThemeData) {
            return;
        }

        Object.entries(joinThemeData).forEach(([property, color]) => {
            const kebabCaseKey = toKebabCase(property);
            let normalColor = color;
            let alphaColor = color;

            // color生成
            if (color.startsWith('#') && !color.endsWith('cc')) {
                alphaColor = `${color}cc;`;
            } else if (color.startsWith('--')) {
                normalColor = `var(${color})`;
                if (!color.endsWith('-alpha')) {
                    alphaColor = `var(${color}-alpha);`;
                } else {
                    alphaColor = `var(${color})`;
                }
            }
            style += `--color-${key}-${kebabCaseKey}:${normalColor};`;
            style += `--color-${key}-${kebabCaseKey}-alpha:${alphaColor};`;
        });
    });

    return `:root{${style}}`;
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

const overrideTheme = (overrideThemes: { [key: string]: RecursivePartial<MiTheme> }) => {
    // useRuntimeConfig() 由来の reactive Proxy は structuredClone できないため JSON round-trip で剥がす
    const rawThemes: typeof overrideThemes = JSON.parse(JSON.stringify(overrideThemes));
    themes.value = deepMerge(themes.value, rawThemes);
};

export default function () {
    return { currentTheme, baseTheme, themes, overrideTheme, setTheme };
}
