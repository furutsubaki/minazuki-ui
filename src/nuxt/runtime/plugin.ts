// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - #imports は Nuxt ランタイムの仮想モジュール（library build 時は未解決）
import { defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports';
import { watch } from 'vue';
import MinazukiUi, { useTheme, useFormData, useNotification, useOutsideClick } from 'minazuki-ui';

type MinazukiUiConfig = {
    theme: string;
    cookieName: string;
    cookieMaxAge: number;
    install: boolean;
    themes: Record<string, unknown>;
};

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig();
    const cfg = config.public.minazukiUi as MinazukiUiConfig;

    const themeCookie = useCookie<string>(cfg.cookieName, {
        default: () => cfg.theme,
        maxAge: cfg.cookieMaxAge,
        sameSite: 'lax'
    });

    const { currentTheme, overrideTheme, setTheme } = useTheme();

    // app.use() より前に currentTheme を設定 → SSR フェーズで正しい data-theme を発行（フラッシュ防止）
    currentTheme.value = themeCookie.value;

    if (cfg.install) {
        // install: true のとき全コンポーネントをグローバル登録（互換性優先）
        nuxtApp.vueApp.use(MinazukiUi, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            themes: cfg.themes as Record<string, any>,
            theme: themeCookie.value
        });
    } else {
        // install: false のときはテーマ初期化のみ（Tree Shaking 優先）
        if (Object.keys(cfg.themes).length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            overrideTheme(cfg.themes as Record<string, any>);
        }
        setTheme(currentTheme.value);

        // inject 経路の確保（install: false でも app.inject() 使用者のために）
        nuxtApp.vueApp.provide('useFormData', useFormData);
        nuxtApp.vueApp.provide('useNotification', useNotification);
        nuxtApp.vueApp.provide('useTheme', useTheme);
        nuxtApp.vueApp.provide('useOutsideClick', useOutsideClick);
    }

    // クライアントでのみ watch（テーマ変更をクッキーに同期）
    if (import.meta.client) {
        watch(currentTheme, (v) => {
            themeCookie.value = v;
        });
    }
});
