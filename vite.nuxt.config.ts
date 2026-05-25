import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// Nuxt 仮想モジュール・kit・vue はすべて external
const externalPatterns = [
    /^#/,               // #imports, #app 等の Nuxt 仮想モジュール
    /^nuxt/,            // nuxt, nuxt/app 等
    /^@nuxt\//,         // @nuxt/kit 等
    /^vue$/,
    /^vue\//,
    /^minazuki-ui/,     // 自己参照を external 化
];

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                module: resolve(__dirname, './src/nuxt/module.ts'),
                'runtime/plugin': resolve(__dirname, './src/nuxt/runtime/plugin.ts')
            },
            external: externalPatterns,
            output: {
                dir: './dist/nuxt',
                format: 'es',
                entryFileNames: '[name].mjs',
                chunkFileNames: '[name]-[hash].mjs'
            },
            preserveEntrySignatures: 'strict'
        },
        outDir: './dist/nuxt',
        emptyOutDir: false
    },
    plugins: [
        dts({
            tsconfigPath: 'tsconfig.nuxt.json',
            outDir: './dist/nuxt',
            include: ['src/nuxt/module.ts', 'src/nuxt/composable-map.ts'],
            exclude: ['src/nuxt/runtime/**'],
            entryRoot: 'src/nuxt'
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
});
