import { watch } from 'vue';
import { createPinia } from 'pinia';
import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { init } from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import translation from 'zod-i18n-map/locales/ja/zod.json';
import MinazukiUi, { useTheme } from 'minazuki-ui';
import 'minazuki-ui/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    // クッキーでテーマを SSR/CSR 間で共有し、ダークモードの初期フラッシュを防ぐ
    // useCookie はサーバー・クライアント両方で同じ値を返すため SSR ミスマッチがなくなる
    const themeCookie = useCookie<string>('themeId', { default: () => 'light' });
    const { currentTheme } = useTheme();

    // app.use(MinazukiUi) の前に設定することで、
    // install 内の setTheme(currentTheme.value) がクッキー値を使って SSR を描画する
    currentTheme.value = themeCookie.value;

    nuxtApp.vueApp.use(createPinia());

    Object.entries(all).forEach(([name, rule]) => {
        defineRule(name, rule);
    });

    init({
        lng: 'ja',
        resources: {
            ja: { zod: translation }
        }
    });

    const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
        if (
            issue.code === z.ZodIssueCode.too_small &&
            issue.type === 'string' &&
            issue.minimum === 1
        ) {
            return { message: 'この項目は必須項目です。' };
        }
        return zodI18nMap(issue, ctx);
    };
    z.setErrorMap(customErrorMap);

    nuxtApp.vueApp.use(MinazukiUi);

    // テーマ変更をクッキーに同期（次回リクエスト時の SSR も正しいテーマで描画される）
    watch(currentTheme, (newTheme) => {
        themeCookie.value = newTheme;
    });
});
