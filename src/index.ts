import '@acab/reset.css';
import '@/assets/css/variables.css';
import '@/assets/css/style.css';
import '@/assets/css/override.css';

import type { App } from 'vue';
import useFormData from '@/composables/useFormData';
import useNotification from '@/composables/useNotification';
import useTheme, { type MiTheme } from '@/composables/useTheme';
import useOutsideClick from './directives/useOutsideClick';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import * as components from '@/components';
export * from './composables/useFormData';
export * from './composables/useNotification';
export * from './composables/useTheme';
export * from './directives/useOutsideClick';
export * from '@/components';

export { useFormData, useNotification, useTheme };

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
};

export default {
    install(app: App, options?: { themes?: { [key: string]: RecursivePartial<MiTheme> } }) {
        Object.values(components).forEach((component) => {
            app.component(`Mi${component.__name!}`, component);
        });

        // composables
        app.provide('useFormData', useFormData);
        app.provide('useNotification', useNotification);
        app.provide('useTheme', useTheme);

        // directives
        app.provide('useOutsideClick', useOutsideClick);

        // component
        app.component('VueDatePicker', VueDatePicker);

        // themeのoverride
        const { currentTheme, overrideTheme, setTheme } = useTheme();
        if (options?.themes) {
            overrideTheme(options.themes);
        }
        // 初期style設定
        setTheme(currentTheme.value);
    }
};
