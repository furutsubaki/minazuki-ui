import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import BottomNav from '@/components/navigation/BottomNav.vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';
import { Home as IconHome, Settings as IconSettings } from 'lucide-vue-next';

const items = [
    { label: 'ホーム', icon: IconHome, to: '/', isCurrent: true },
    { label: '設定', icon: IconSettings, to: '/settings' }
];

describe('BottomNav', () => {
    it('items の数だけボタンがレンダリングされる', () => {
        const wrapper = mount(BottomNav, { props: { items } });
        expect(wrapper.findAll('.item')).toHaveLength(2);
    });

    it('items のラベルが表示される', () => {
        const wrapper = mount(BottomNav, { props: { items } });
        const labels = wrapper.findAll('.button-label');
        expect(labels[0].text()).toBe('ホーム');
        expect(labels[1].text()).toBe('設定');
    });

    it('isCurrent のアイテムに is-current クラスが付く', () => {
        const wrapper = mount(BottomNav, { props: { items } });
        const buttons = wrapper.findAll('.item');
        expect(buttons[0].classes()).toContain('is-current');
        expect(buttons[1].classes()).not.toContain('is-current');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(BottomNav, { props: { items, size: 'large' } });
        expect(wrapper.find('.component-bottom-nav').classes()).toContain('large');
    });

    it('center が true のとき is-center クラスが付く', () => {
        const wrapper = mount(BottomNav, { props: { items, center: true } });
        expect(wrapper.find('.component-bottom-nav-inner').classes()).toContain('is-center');
    });

    it('shape="picture-frame" のとき PictureFrame コンポーネントが使われる', () => {
        const wrapper = mount(BottomNav, { props: { items, shape: 'picture-frame' } });
        expect(wrapper.findComponent(PictureFrame).exists()).toBe(true);
    });

    it('item.to が空の場合クリックしても何もしない', async () => {
        const hrefSetter = vi.fn();
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, set href(v: string) { hrefSetter(v); } }
        });
        try {
            const emptyToItems = [{ label: 'ホーム', icon: IconHome, to: '' }];
            const wrapper = mount(BottomNav, { props: { items: emptyToItems as any } });
            await wrapper.find('.item').trigger('click');
            expect(hrefSetter).not.toHaveBeenCalled();
        } finally {
            Object.defineProperty(window, 'location', {
                configurable: true,
                value: originalLocation
            });
        }
    });

    it('router がない場合 location.href にアイテムの to が設定される', async () => {
        const hrefSetter = vi.fn();
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, set href(v: string) { hrefSetter(v); } }
        });
        try {
            const wrapper = mount(BottomNav, { props: { items } });
            await wrapper.findAll('.item')[1].trigger('click');
            expect(hrefSetter).toHaveBeenCalledWith('/settings');
        } finally {
            Object.defineProperty(window, 'location', {
                configurable: true,
                value: originalLocation
            });
        }
    });

    it('不正な URL（javascript:）を渡した場合は location.href が設定されない', async () => {
        const hrefSetter = vi.fn();
        const originalLocation = window.location;
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { ...originalLocation, set href(v: string) { hrefSetter(v); } }
        });
        try {
            const maliciousItems = [{ label: 'XSS', icon: IconHome, to: 'javascript:alert(1)' }];
            const wrapper = mount(BottomNav, { props: { items: maliciousItems as any } });
            await wrapper.find('.item').trigger('click');
            expect(hrefSetter).not.toHaveBeenCalled();
        } finally {
            Object.defineProperty(window, 'location', {
                configurable: true,
                value: originalLocation
            });
        }
    });

    it('router がある場合 router.push が呼ばれる', async () => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [
                { path: '/', component: { template: '<div />' } },
                { path: '/settings', component: { template: '<div />' } }
            ]
        });
        const pushSpy = vi.spyOn(router, 'push').mockResolvedValue(undefined as any);
        const wrapper = mount(BottomNav, {
            props: { items },
            global: { plugins: [router] }
        });
        await router.isReady();
        await wrapper.findAll('.item')[0].trigger('click');
        expect(pushSpy).toHaveBeenCalledWith('/');
        pushSpy.mockRestore();
    });
});
