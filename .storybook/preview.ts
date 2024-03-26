import { Preview, setup } from '@storybook/vue3'
import { useArgs } from '@storybook/preview-api'
import '@acab/reset.css'
import '../src/assets/css/variables.css'
import '../src/assets/css/style.css'
import '../src/assets/css/override.css'

import { defineRule } from 'vee-validate';
import * as AllRules from '@vee-validate/rules'
import { init } from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import translation from 'zod-i18n-map/locales/ja/zod.json';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import vClickOutside from "click-outside-vue3";
import useTheme from '../src/composables/useTheme';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    switch (issue.code) {
        case z.ZodIssueCode.too_small:
            if (['string'].includes(issue.type) && issue.minimum === 1) {
                return { message: 'この項目は必須項目です。' };
            }
    }
    return zodI18nMap(issue, ctx);
};

Object.entries(AllRules).forEach(([id, validator]) => {
    defineRule(id, validator);
});

// zod
init({
    lng: 'ja',
    resources: {
        ja: { zod: translation }
    }
});
z.setErrorMap(customErrorMap);

setup((app) => {
    app.use(vClickOutside);
    app.component('VueDatePicker', VueDatePicker);

    app.use(useTheme);
    const { currentTheme, setTheme } = useTheme();
    // 初期style設定
    setTheme(currentTheme.value);
})

const preview: Preview = {
    parameters: {},
    decorators: [
        (story, context) => {
            // v-model調整
            const [args, updateArgs] = useArgs();
            if ('modelValue' in args) {
                const update = args['onUpdate:model-value'] || args['onUpdate:modelValue'];
                args['onUpdate:model-value'] = undefined;
                args['onUpdate:modelValue'] = (...vals) => {
                    update?.(...vals);
                    /**
                     * Arg with `undefined` will be deleted by `deleteUndefined()`, then loss of reactive
                     * @see {@link https://github.com/storybookjs/storybook/blob/next/code/lib/preview-api/src/modules/store/ArgsStore.ts#L63}
                     */
                    const modelValue = vals[0] === undefined ? null : vals[0];
                    updateArgs({ modelValue });
                };
            }

            // 背景色をcss変数と同期させる
            const currentBackground = context.globals.backgrounds?.value
            const backgrounds = context.parameters.backgrounds.values
            const currentBackgroundData = backgrounds.find(
                (background) => background.value === currentBackground
            )
            document.documentElement.dataset.theme = currentBackgroundData?.name || 'light'
            document.body.style.cssText = 'background-color: var(--color-theme-bg-primary) !important;';

            return {
                components: { story: story({ ...context, updateArgs }) },
                template: '<main style="display: flex; align-items: flex-start; gap:16px; flex-wrap: wrap; width: 100%;"><story /></main>',
            };
        },
    ]
}

export default preview
