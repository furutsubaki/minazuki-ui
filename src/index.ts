import '@/assets/css/reset.css';
import '@/assets/css/variables.css';
import '@/assets/css/style.css';
import '@/assets/css/override.css';

import type { App } from 'vue';
import useFormData from '@/composables/useFormData';
import useNotification from '@/composables/useNotification';
import useTheme, {
    type MiThemeOverride,
    type ThemeId,
    detectLegacyThemeOptions
} from '@/composables/useTheme';
import useOutsideClick from './directives/useOutsideClick';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { componentNameMap } from '@/components';

export * from '@/components';
export * from '@/composables';
export * from '@/directives';
export { default as initValidate } from '@/plugins/init-validate';
export { useFormData, useNotification, useTheme };

export default {
    install(app: App, options?: { theme?: MiThemeOverride; themeId?: ThemeId }) {
        const legacyThemeMessage = detectLegacyThemeOptions(options);
        if (legacyThemeMessage) {
            // eslint-disable-next-line no-console
            console.error(legacyThemeMessage);
        }

        for (const { name, component } of Object.values(componentNameMap)) {
            app.component(name, component);
        }

        // composables
        app.provide('useFormData', useFormData);
        app.provide('useNotification', useNotification);
        app.provide('useTheme', useTheme);

        // directives
        app.provide('useOutsideClick', useOutsideClick);

        // component
        app.component('VueDatePicker', VueDatePicker);

        const { currentTheme, overrideTheme, setTheme } = useTheme();
        if (options?.theme) {
            overrideTheme(options.theme);
        }
        if (options?.themeId) {
            currentTheme.value = options.themeId;
        }
        setTheme(currentTheme.value);
    }
};
