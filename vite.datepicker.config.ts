import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'path';

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

const srcDir = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
    build: {
        minify: false,
        rollupOptions: {
            input: resolve(__dirname, './src/datepicker.ts'),
            external: (id, importer) => {
                if (externalRegexps.some(re => re.test(id))) return true;
                if (importer && id.startsWith(srcDir) && !id.endsWith('datepicker.ts')) return true;
                return false;
            },
            preserveEntrySignatures: 'strict',
            output: {
                format: 'es',
                dir: './dist',
                entryFileNames: '[name].js',
                exports: 'named',
                paths: (id) => {
                    if (id.startsWith(srcDir)) {
                        const relative = id.slice(srcDir.length);
                        return '.' + relative.replace(/\.vue$/, '.vue.js').replace(/\.ts$/, '.js');
                    }
                    return id;
                },
            },
        },
        outDir: './dist',
        emptyOutDir: false,
    },
    plugins: [
        vue(),
        dts({
            tsconfigPath: 'tsconfig.build.json',
            outDir: './dist',
            include: ['src/datepicker.ts'],
            entryRoot: 'src',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
});
