import { Preview, setup } from '@storybook/vue3-vite'
import { useArgs } from 'storybook/preview-api'
import '@acab/reset.css'
import '../src/assets/css/variables.css'
import '../src/assets/css/style.css'
import '../src/assets/css/override.css'

import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules'
import { z } from 'zod';
import { jaErrorMap } from '../src/plugins/init-validate';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import useTheme from '../src/composables/useTheme';
import { createHead } from '@unhead/vue';

const { currentTheme, setTheme } = useTheme();

const applyTheme = (themeId: string) => {
    currentTheme.value = themeId;
    setTheme(themeId);
};

Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule);
});

z.setErrorMap(jaErrorMap);

setup((app) => {
    app.component('VueDatePicker', VueDatePicker);

    const head = createHead();
    app.use(head);
    app.use(useTheme);
    // 初期style設定
    applyTheme(currentTheme.value);
})

const preview: Preview = {
    parameters: {
        // Storybook 10: backgrounds uses `options` (object) instead of `values` (array)
        backgrounds: {
            options: {
                light: { name: 'light', value: '#ffffff' },
                dark: { name: 'dark', value: '#1a1a1a' },
            },
        },
    },

    initialGlobals: {
        backgrounds: { value: 'light' },
    },

    decorators: [
        (story, context) => {
            // v-model調整
            const [args, updateArgs] = useArgs();
            if ('modelValue' in args) {
                const update = args['onUpdate:model-value'] || args['onUpdate:modelValue'];
                args['onUpdate:model-value'] = undefined;
                args['onUpdate:modelValue'] = (...vals: unknown[]) => {
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
            // Storybook 10: globals.backgrounds.value is the option key ('light' | 'dark')
            const selectedTheme = context.globals.backgrounds?.value || 'light';
            applyTheme(selectedTheme);
            document.body.style.cssText = 'background-color: var(--color-bg-primary) !important;';

            // Storybook 10: pass story function directly (do not call it)
            return {
                components: { story },
                template: '<main style="display: flex; align-items: flex-start; gap:16px; flex-wrap: wrap; width: 100%;"><story /></main>',
            };
        },
    ],

    tags: ['autodocs']
}

export default preview
