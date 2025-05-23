/*
 * ==================================================
 * File Name    composables/useTheme.ts
 * Description  テーマカラー
 * ==================================================
 */

import { ref, watch } from 'vue';
import { useHead } from '@unhead/vue';
import { toKebabCase } from '@/assets/ts/formatter';
import merge from 'lodash.merge';

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
const currentTheme = ref<themeId>(
    typeof localStorage !== 'undefined' ? localStorage.themeId ?? 'light' : 'light'
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
const themes = ref<{ [key: string]: RecursivePartial<MiTheme> }>({
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
    const joinTheme = merge(baseTheme, defaultTheme, targetTheme) as RecursiveRequired<MiTheme>;

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
const setTheme = (themeId: string) => {
    useHead({
        bodyAttrs: {
            'data-theme': themeId
        },
        style: [
            {
                hid: 'theme',
                children: createThemeCss(themeId)
            }
        ]
    });
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('themeId', themeId);
    }
};

// theme変更検知
watch(currentTheme, setTheme);

const overrideTheme = (overrideThemes: { [key: string]: RecursivePartial<MiTheme> }) => {
    themes.value = merge(themes.value, overrideThemes);
};

export default function () {
    return { currentTheme, baseTheme, themes, overrideTheme, setTheme };
}
