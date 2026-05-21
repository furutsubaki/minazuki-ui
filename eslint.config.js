// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';

export default [{
    ignores: [
        'dist/**',
        '**/dist/**',
        'node_modules/**',
        '**/node_modules/**',
        'storybook-static/**',
        'src/components/index.ts',
        'src/components/nuxt-map.ts',
        'src/composables/index.ts',
        'src/directives/index.ts',
        'src/nuxt/composable-map.ts',
        '.eslintrc.cjs',
        'playground/**/.nuxt/**',
        'playground/**/.output/**'
    ]
}, js.configs.recommended, ...pluginVue.configs['flat/essential'], ...vueTsEslintConfig(), {
    rules: {
        'vue/multi-word-component-names': 'off',
        'no-console': 'error'
    }
}, {
    files: ['src/test/**/*.ts', 'src/stories/**/*.ts'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/ban-ts-comment': 'off'
    }
}, {
    files: ['vite.config.ts', 'vitest.config.ts'],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off'
    }
}, ...storybook.configs["flat/recommended"]];
