import { createPinia } from 'pinia';
import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { init } from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import translation from 'zod-i18n-map/locales/ja/zod.json';
import MinazukiUi from 'minazuki-ui';
import 'minazuki-ui/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
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
});
