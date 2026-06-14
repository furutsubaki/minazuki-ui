import { config } from '@vue/test-utils';

config.global.stubs = {};

// v-outside-click はグローバル状態を持つため、no-op スタブに置き換える
config.global.directives = {
    outsideClick: {
        mounted: () => {},
        updated: () => {},
        beforeUnmount: () => {}
    }
};

// happy-dom は ResizeObserver を実装していない
class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
}
if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// この happy-dom + Node 26 環境では window.localStorage が undefined を返し機能しないため、
// 実ブラウザ相当の動作する Storage を window に注入する（useTheme の動作確認用）。
// 実 Storage は `storage.foo` の名前付きプロパティアクセスもサポートするため Proxy で再現する。
if (typeof window !== 'undefined' && !window.localStorage) {
    const createStorage = (): Storage => {
        const store: Record<string, string> = {};
        const api = {
            getItem: (key: string) => (key in store ? store[key] : null),
            setItem: (key: string, value: string) => {
                store[key] = String(value);
            },
            removeItem: (key: string) => {
                delete store[key];
            },
            clear: () => {
                for (const key of Object.keys(store)) delete store[key];
            },
            key: (index: number) => Object.keys(store)[index] ?? null,
            get length() {
                return Object.keys(store).length;
            }
        };
        return new Proxy(api, {
            get: (target, prop: string) =>
                prop in target ? (target as never)[prop] : store[prop],
            set: (_target, prop: string, value) => {
                store[prop] = String(value);
                return true;
            }
        }) as unknown as Storage;
    };
    Object.defineProperty(window, 'localStorage', {
        configurable: true,
        value: createStorage()
    });
}
