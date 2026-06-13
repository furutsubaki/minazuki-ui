import { existsSync } from 'node:fs';
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
    // Nuxt 4.4.x の DevTools (websocket) が dev サーバーで read ECONNRESET を起こし
    // 無限再起動ループに陥るため無効化する。playground は動作確認用途で DevTools 不要。
    // （nuxt3 環境では再現しないため、nuxt4 のみ対象）
    devtools: { enabled: false },
    modules: ['@pinia/nuxt', ...(existsSync(minazukiNuxtModule) ? [minazukiNuxtModule] : [])],
    minazukiUi: {
        theme: 'light'
    },
    css: ['playground-shared/styles/playground.css'],
    build: {
        transpile: ['playground-shared']
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
        }
    }
});
