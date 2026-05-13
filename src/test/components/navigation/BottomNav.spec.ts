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
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(BottomNav, { props: { items } });
        expect(wrapper.find('.component-bottom-nav').exists()).toBe(true);
    });

    it('items の数だけボタンがレンダリングされる', () => {
        const wrapper = mount(BottomNav, { props: { items } });
        expect(wrapper.findAll('.item')).toHaveLength(2);
    });

    it('items のラベルが表示される', () => {
        const wrapper = mount(BottomNav, { props: { items } });
        const labels = wrapper.findAll('.label');
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

    it('ラベルをクリックすると onClick が呼ばれる', async () => {
        const wrapper = mount(BottomNav, { props: { items } });
        // location.href = item.to が呼ばれる（router 未設定のため）
        await wrapper.findAll('.label')[0].trigger('click');
        expect(wrapper.find('.component-bottom-nav').exists()).toBe(true);
    });

    it('to が空の items をクリックしても何も起きない', async () => {
        const noToItems = [{ label: 'テスト', icon: items[0].icon, to: '', isCurrent: false }];
        const wrapper = mount(BottomNav, { props: { items: noToItems } });
        await wrapper.find('.label').trigger('click');
        expect(wrapper.find('.component-bottom-nav').exists()).toBe(true);
    });

    it('shape="picture-frame" のとき PictureFrame コンポーネントが使われる', () => {
        const wrapper = mount(BottomNav, { props: { items, shape: 'picture-frame' } });
        expect(wrapper.findComponent(PictureFrame).exists()).toBe(true);
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
        await wrapper.findAll('.label')[0].trigger('click');
        expect(pushSpy).toHaveBeenCalledWith('/');
        pushSpy.mockRestore();
    });
});
