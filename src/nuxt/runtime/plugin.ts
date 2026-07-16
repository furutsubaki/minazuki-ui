// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - #imports は Nuxt ランタイムの仮想モジュール（library build 時は未解決）
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports';
import { watch } from 'vue';
import MinazukiUi, { useTheme, useFormData, useNotification, useOutsideClick } from 'minazuki-ui';
import type { ThemeId, MiThemeOverride } from 'minazuki-ui';

type MinazukiUiConfig = {
    themeId: ThemeId;
    cookieName: string;
    cookieMaxAge: number;
    install: boolean;
    theme: MiThemeOverride;
};

export default defineNuxtPlugin((nuxtApp: { vueApp: import('vue').App }) => {
    const config = useRuntimeConfig();
    const cfg = config.public.minazukiUi as MinazukiUiConfig;

    const themeCookie = useCookie<ThemeId>(cfg.cookieName, {
        default: () => cfg.themeId,
        maxAge: cfg.cookieMaxAge,
        sameSite: 'lax'
    });

    const { currentTheme, overrideTheme, setTheme } = useTheme();

    currentTheme.value = themeCookie.value === 'dark' ? 'dark' : 'light';

    if (cfg.install) {
        nuxtApp.vueApp.use(MinazukiUi, {
            theme: cfg.theme,
            themeId: themeCookie.value
        });
    } else {
        if (cfg.theme && Object.keys(cfg.theme).length > 0) {
            overrideTheme(cfg.theme);
        }
        setTheme(currentTheme.value);

        nuxtApp.vueApp.provide('useFormData', useFormData);
        nuxtApp.vueApp.provide('useNotification', useNotification);
        nuxtApp.vueApp.provide('useTheme', useTheme);
        nuxtApp.vueApp.provide('useOutsideClick', useOutsideClick);
    }

    if (import.meta.client) {
        watch(currentTheme, (v) => {
            themeCookie.value = v;
        });
    }
});
