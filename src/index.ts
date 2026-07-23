import '@/assets/css/reset.css';
import '@/assets/css/variables.css';
import '@/assets/css/style.css';
import '@/assets/css/override.css';

import type { App } from 'vue';
import useNotification from '@/composables/useNotification';
import useTheme, {
    type MiThemeOverride,
    type ThemeId,
    detectLegacyThemeOptions
} from '@/composables/useTheme';
import useOutsideClick from './directives/useOutsideClick';
import { componentNameMap } from '@/components';

export * from '@/components';
export * from '@/composables';
export * from '@/directives';
export { default as initValidate } from '@/plugins/init-validate';
export { useNotification, useTheme };

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
        app.provide('useNotification', useNotification);
        app.provide('useTheme', useTheme);

        // directives
        app.provide('useOutsideClick', useOutsideClick);

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
