import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const _require = createRequire(import.meta.url);

// pinia v3 では @vue/devtools-api@7.x を使用するため、pinia の依存として解決する
// （@vue/devtools-api@7.x は ./package.json を exports で公開していないため CJS main から逆算）
const piniaDir = resolve(_require.resolve('pinia/package.json'), '..');
const piniaRequire = createRequire(resolve(piniaDir, 'index.js'));
const devtoolsApiCjs = piniaRequire.resolve('@vue/devtools-api');  // -> dist/index.cjs
const devtoolsApiEsm = resolve(devtoolsApiCjs, '..', 'index.js');  // -> dist/index.js

// workspace:* でのサブパス export の CJS 解決問題を回避するため絶対パスを使用
const minazukiNuxtModule = resolve(__dirname, '../../dist/nuxt/module.mjs');

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    ssr: true,
    modules: ['@pinia/nuxt', ...(existsSync(minazukiNuxtModule) ? [minazukiNuxtModule] : [])],
    // モジュールオプション（nuxt.config.ts）経由でのテーマオーバーライド動作確認用
    // (playground/shared/pages/HomePage.vue の Theme Override セクション参照)
    minazukiUi: {
        themeId: 'light',
        theme: {
            statuses: {
                info: { hue: 'pink', chroma: 'pink' }
            }
        }
    },
    css: ['playground-shared/styles/playground.css'],
    build: {
        transpile: ['playground-shared']
    },
    devServer: {
        port: 5175
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
