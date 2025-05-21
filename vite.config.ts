import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import postcssNesting from "postcss-nesting";

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, './src/index.ts'),
            name: 'minazuki-ui',
            fileName: 'index',
            formats: ['es', 'umd']
        },
        rollupOptions: {
            external: ['vue','unhead'],
            output: {
                globals: {
                    vue: 'Vue'
                },
                exports: 'named'
            },
        }
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
