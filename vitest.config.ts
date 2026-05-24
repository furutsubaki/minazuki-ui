import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import postcssNesting from 'postcss-nesting';

export default defineConfig({
    plugins: [vue()],
    test: {
        environment: 'happy-dom',
        include: ['src/test/**/*.spec.ts'],
        setupFiles: ['./src/test/setup.ts'],
        reporters: ['default', 'junit'],
        outputFile: {
            junit: './test-results/junit.xml'
        },
        coverage: {
            provider: 'istanbul',
            reporter: ['text', 'html', 'lcov', 'json-summary'],
            include: ['src/**/*.{ts,vue}'],
            exclude: [
                'src/test/**',
                'src/stories/**',
                'src/index.ts',
                'src/generate-component-index.js',
                'src/components/index.ts',
                'src/components/nuxt-map.ts'
            ]
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        postcss: {
            plugins: [postcssNesting as any]
        }
    }
});
