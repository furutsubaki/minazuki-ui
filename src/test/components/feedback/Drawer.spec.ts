import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Drawer from '@/components/feedback/Drawer.vue';

describe('Drawer', () => {
    afterEach(() => {
        vi.useRealTimers();
    });
    it('v-model が true のとき drawer が表示される', () => {
        const wrapper = mount(Drawer, { props: { modelValue: true, position: 'right' } });
        const el = wrapper.find('.component-drawer').element as HTMLElement;
        expect(el.style.display).not.toBe('none');
    });

    it('v-model が false のとき drawer が非表示になる', () => {
        const wrapper = mount(Drawer, { props: { modelValue: false, position: 'right' } });
        const el = wrapper.find('.component-drawer').element as HTMLElement;
        expect(el.style.display).toBe('none');
    });

    it('position prop がクラスに反映される', () => {
        const wrapper = mount(Drawer, { props: { modelValue: true, position: 'bottom' } });
        expect(wrapper.find('.drawer').classes()).toContain('bottom');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Drawer, { props: { modelValue: true, position: 'left', size: 'large' } });
        expect(wrapper.find('.drawer').classes()).toContain('large');
    });

    it('closeable が true のとき閉じるボタンが表示される', () => {
        const wrapper = mount(Drawer, {
            props: { modelValue: true, position: 'left', closeable: true }
        });
        expect(wrapper.find('.closeable-box').exists()).toBe(true);
    });

    it('closeable が false のとき閉じるボタンが表示されない', () => {
        const wrapper = mount(Drawer, {
            props: { modelValue: true, position: 'left', closeable: false }
        });
        expect(wrapper.find('.closeable-box').exists()).toBe(false);
    });

    it('header slot が表示される', () => {
        const wrapper = mount(Drawer, {
            props: { modelValue: true, position: 'top' },
            slots: { header: '<div class="hdr">ヘッダー</div>' }
        });
        expect(wrapper.find('.hdr').exists()).toBe(true);
    });

    it('footer slot が表示される', () => {
        const wrapper = mount(Drawer, {
            props: { modelValue: true, position: 'top' },
            slots: { footer: '<div class="ftr">フッター</div>' }
        });
        expect(wrapper.find('.ftr').exists()).toBe(true);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Drawer, {
            props: { modelValue: true, position: 'right' },
            slots: { default: '<p class="content">内容</p>' }
        });
        expect(wrapper.find('.content').exists()).toBe(true);
    });

    it('v-model が false → true に変わると overflow が hidden になる', async () => {
        const wrapper = mount(Drawer, { props: { modelValue: false, position: 'left' } });
        await wrapper.setProps({ modelValue: true });
        expect(document.documentElement.style.overflow).toBe('hidden');
        document.documentElement.style.overflow = '';
    });

    it('外側クリックで closed イベントが発火する', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Drawer, {
            props: {
                modelValue: true,
                position: 'left',
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await vi.runAllTimersAsync();
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });

    it('position が無効な値のとき transitionFrom が undefined になる', () => {
        const wrapper = mount(Drawer, {
            props: { modelValue: true, position: 'invalid' as any }
        });
        expect((wrapper.vm as any).transitionFrom).toBeUndefined();
    });
});
