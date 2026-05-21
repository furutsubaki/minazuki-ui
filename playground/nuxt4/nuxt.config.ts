import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const _require = createRequire(import.meta.url);

const piniaDir = resolve(_require.resolve('pinia/package.json'), '..');
const piniaRequire = createRequire(resolve(piniaDir, 'index.js'));
const devtoolsApiEsm = piniaRequire.resolve('@vue/devtools-api/lib/esm/index.js');

// workspace:* でのサブパス export の CJS 解決問題を回避するため絶対パスを使用
const minazukiNuxtModule = resolve(__dirname, '../../dist/nuxt/module.mjs');

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    ssr: true,
    modules: ['@pinia/nuxt', minazukiNuxtModule],
    minazukiUi: {
        theme: 'light'
    },
    css: ['~/assets/css/playground.css'],
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
        }
    }
});
