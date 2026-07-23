import {
    defineNuxtModule,
    addComponent,
    addImports,
    addPlugin,
    createResolver,
    useLogger
} from '@nuxt/kit';
import { miComponentList } from '../components/nuxt-map';
import { miComposableList } from './composable-map';
import { detectLegacyThemeOptions } from '../composables/useTheme';

export interface ModuleOptions {
    /** components / composables の auto-import を有効化（default: true） */
    autoImport?: boolean;
    /** CSS 自動注入（default: true） */
    css?: boolean;
    /** デフォルトテーマ ID（default: 'light'） */
    themeId?: string;
    /** テーマ設定のオーバーライド */
    theme?: Record<string, unknown>;
    /** テーマ用クッキー名（default: 'themeId'） */
    cookieName?: string;
    /** テーマクッキー maxAge 秒（default: 1年） */
    cookieMaxAge?: number;
    /**
     * app.use(MinazukiUi) を実行するか（default: false）
     * - false: Tree Shaking 優先（auto-import 経由でのみコンポーネント解決）
     * - true: Vue3 同等の全コンポーネント一括グローバル登録（互換性優先）
     */
    install?: boolean;
    /** @vuepic/vue-datepicker の auto-import と CSS 注入（default: false） */
    datepicker?: boolean;
}

// TS2742 回避: @nuxt/schema への直接参照を避けるためローカル型でラップ
type _NuxtModuleFn<T> = (inlineOptions: T, nuxt: unknown) => void | Promise<void>;
interface _NuxtModule<T> extends _NuxtModuleFn<T> {
    meta?: { name?: string; configKey?: string; version?: string; compatibility?: Record<string, string> };
    getOptions?: (inlineOptions?: Partial<T>, nuxt?: unknown) => Promise<T>;
    getMeta?: () => Promise<_NuxtModule<T>['meta']>;
}

const _module = defineNuxtModule<ModuleOptions>({
    meta: {
        name: 'minazuki-ui',
        configKey: 'minazukiUi',
        compatibility: { nuxt: '>=3.0.0' }
    },
    defaults: {
        autoImport: true,
        css: true,
        themeId: 'light',
        cookieName: 'themeId',
        cookieMaxAge: 60 * 60 * 24 * 365,
        install: false,
        datepicker: false
    },
    setup(options, nuxt) {
        const legacyThemeMessage = detectLegacyThemeOptions(options);
        if (legacyThemeMessage) {
            useLogger('minazuki-ui').error(legacyThemeMessage);
        }

        const resolver = createResolver(import.meta.url);

        // CSS 自動注入
        if (options.css) {
            nuxt.options.css = nuxt.options.css ?? [];
            if (!nuxt.options.css.includes('minazuki-ui/dist/style.css')) {
                nuxt.options.css.unshift('minazuki-ui/dist/style.css');
            }
        }

        // workspace:* 参照パッケージの二重インスタンス化を防止
        nuxt.options.vite = nuxt.options.vite ?? {};
        nuxt.options.vite.optimizeDeps = nuxt.options.vite.optimizeDeps ?? {};
        nuxt.options.vite.optimizeDeps.exclude = nuxt.options.vite.optimizeDeps.exclude ?? [];
        if (!nuxt.options.vite.optimizeDeps.exclude.includes('minazuki-ui')) {
            nuxt.options.vite.optimizeDeps.exclude.push('minazuki-ui');
        }

        // vue-datepicker の transpile（datepicker 有効時のみ）
        if (options.datepicker) {
            nuxt.options.build.transpile = nuxt.options.build.transpile ?? [];
            if (!nuxt.options.build.transpile.includes('@vuepic/vue-datepicker')) {
                nuxt.options.build.transpile.push('@vuepic/vue-datepicker');
            }
        }

        if (options.autoImport) {
            // コンポーネント auto-import
            for (const component of miComponentList) {
                addComponent({
                    name: component.name,
                    export: component.export,
                    filePath: component.filePath
                });
            }
            // datepicker 有効時のみ auto-import
            if (options.datepicker) {
                addComponent({
                    name: 'MiDatePicker',
                    export: 'MiDatePicker',
                    filePath: 'minazuki-ui/datepicker'
                });
                addComponent({
                    name: 'VueDatePicker',
                    export: 'default',
                    filePath: '@vuepic/vue-datepicker'
                });
            }

            // composables / directives auto-import
            for (const composable of miComposableList) {
                addImports({
                    name: composable.name,
                    from: composable.from,
                    as: composable.name
                });
            }
        }

        // runtimeConfig に設定を流し込む
        (nuxt.options.runtimeConfig.public as Record<string, unknown>).minazukiUi = {
            themeId: options.themeId ?? 'light',
            cookieName: options.cookieName ?? 'themeId',
            cookieMaxAge: options.cookieMaxAge ?? 60 * 60 * 24 * 365,
            install: options.install ?? false,
            theme: options.theme ?? {}
        };

        // ランタイム plugin を追加
        addPlugin(resolver.resolve('./runtime/plugin'));
    }
}) as unknown as _NuxtModule<ModuleOptions>;

export default _module;
