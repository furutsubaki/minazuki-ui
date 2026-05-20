export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    ssr: true,
    css: [
        '@acab/reset.css',
        '@vuepic/vue-datepicker/dist/main.css',
        '~/assets/css/playground.css'
    ],
    build: {
        transpile: ['@vuepic/vue-datepicker']
    },
    devServer: {
        port: 5175
    },
    vite: {
        optimizeDeps: {
            include: [
                'minazuki-ui',
                'pinia',
                'pinia > @vue/devtools-api',
                'vee-validate',
                '@vee-validate/rules',
                'i18next',
                'zod',
                'zod-i18n-map'
            ]
        }
    }
});
