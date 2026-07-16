import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import postcssNesting from "postcss-nesting";

const externalPackages = [
    'vue',
    'unhead',
    '@unhead/vue',
    '@vee-validate/rules',
    '@vee-validate/zod',
    '@vuepic/vue-datepicker',
    'dayjs',
    'i18next',
    'lucide-vue-next',
    'vee-validate',
    'vue-router',
    'zod',
    'zod-i18n-map',
];

const externalRegexps = externalPackages.map(
    (pkg) => new RegExp(`^${pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(/.*)?$`)
);

export default defineConfig({
    build: {
        minify: false,
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'minazuki-ui',
            cssFileName: 'style',
        },
        rollupOptions: {
            external: externalRegexps,
            output: [
                {
                    // Tree-shakable ES Modules
                    format: 'es',
                    dir: './dist',
                    preserveModules: true,
                    preserveModulesRoot: 'src',
                    entryFileNames: '[name].js',
                    exports: 'named',
                },
                {
                    // UMD single bundle (legacy / CDN)
                    format: 'umd',
                    dir: './dist',
                    name: 'minazuki-ui',
                    entryFileNames: 'index.umd.cjs',
                    exports: 'named',
                    globals: {
                        'vue': 'Vue',
                        'unhead': 'Unhead',
                        '@unhead/vue': 'UnheadVue',
                        '@vee-validate/rules': 'VeeValidateRules',
                        '@vee-validate/zod': 'VeeValidateZod',
                        '@vuepic/vue-datepicker': 'VueDatePicker',
                        'dayjs': 'dayjs',
                        'i18next': 'i18next',
                        'lucide-vue-next': 'LucideVueNext',
                        'vee-validate': 'VeeValidate',
                        'vue-router': 'VueRouter',
                        'zod': 'Zod',
                        'zod-i18n-map': 'ZodI18nMap',
                    },
                },
            ],
        },
    },
    plugins: [
        vue(),
        dts({
            tsconfigPath: 'tsconfig.build.json',
        }),
    ],
    resolve: {
        dedupe: ['vue'],
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        }
    },
    css: {
        postcss: {
            plugins: [postcssNesting as any]
        }
    }
})
