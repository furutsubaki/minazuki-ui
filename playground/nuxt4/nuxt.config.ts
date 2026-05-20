import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const _require = createRequire(import.meta.url);

const piniaDir = resolve(_require.resolve('pinia/package.json'), '..');
const piniaRequire = createRequire(resolve(piniaDir, 'index.js'));
const devtoolsApiEsm = piniaRequire.resolve('@vue/devtools-api/lib/esm/index.js');

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
        port: 5176
    },
    vite: {
        resolve: {
            alias: [
                {
                    find: /^@vue\/devtools-api$/,
                    replacement: devtoolsApiEsm
                }
            ]
        },
        optimizeDeps: {
            exclude: ['minazuki-ui']
        }
    }
});
