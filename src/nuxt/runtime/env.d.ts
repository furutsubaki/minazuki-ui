// Nuxt の仮想モジュールスタブ（library build 時に #imports を解決するため）
import type { Ref } from 'vue';

declare module '#imports' {
    export function defineNuxtPlugin(setup: (nuxtApp: unknown) => void): unknown;
    export function useCookie<T>(
        name: string,
        options?: {
            default?: () => T;
            maxAge?: number;
            sameSite?: 'lax' | 'strict' | 'none';
        }
    ): Ref<T>;
    export function useRuntimeConfig(): Record<string, unknown> & { public: Record<string, unknown> };
}

// Nuxt の ImportMeta 拡張は Nuxt アプリ側でしか読まれない。library build の型チェック用に補う
declare global {
    interface ImportMeta {
        readonly client: boolean;
    }
}
