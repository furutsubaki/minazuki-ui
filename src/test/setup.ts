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
