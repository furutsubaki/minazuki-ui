import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Modal from '@/components/feedback/Modal.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';

describe('Modal', () => {
    afterEach(() => {
        vi.useRealTimers();
    });
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(Modal);
        expect(wrapper.find('.component-modal').exists()).toBe(true);
    });

    it('v-model が true のとき modal が表示される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true } });
        const el = wrapper.find('.component-modal').element as HTMLElement;
        expect(el.style.display).not.toBe('none');
    });

    it('v-model が false のとき modal が非表示になる', () => {
        const wrapper = mount(Modal, { props: { modelValue: false } });
        const el = wrapper.find('.component-modal').element as HTMLElement;
        expect(el.style.display).toBe('none');
    });

    it('title が指定されたとき .title が表示される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, title: 'テストタイトル' } });
        expect(wrapper.find('.title').text()).toBe('テストタイトル');
    });

    it('title がないとき .title が表示されない', () => {
        const wrapper = mount(Modal, { props: { modelValue: true } });
        expect(wrapper.find('.title').exists()).toBe(false);
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, size: 'large' } });
        expect(wrapper.find('.modal').classes()).toContain('large');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, shape: 'no-radius' } });
        expect(wrapper.find('.modal').classes()).toContain('no-radius');
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Modal, {
            props: { modelValue: true },
            slots: { default: '<p class="content">内容</p>' }
        });
        expect(wrapper.find('.content').exists()).toBe(true);
    });

    it('閉じるボタンをクリックすると v-model が false になる', async () => {
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.closeable-box').trigger('click');
        expect(wrapper.props('modelValue')).toBe(false);
    });

    it('v-model が false → true に変わると overflow が hidden になる', async () => {
        const wrapper = mount(Modal, { props: { modelValue: false } });
        await wrapper.setProps({ modelValue: true });
        expect(document.documentElement.style.overflow).toBe('hidden');
        document.documentElement.style.overflow = '';
    });

    it('transitionFrom="left" が反映される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, transitionFrom: 'left' } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('left-rebound');
    });

    it('transitionFrom="top" が反映される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, transitionFrom: 'top' } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('top-rebound');
    });

    it('transitionFrom="right" が反映される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, transitionFrom: 'right' } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('right-rebound');
    });

    it('transitionFrom="bottom" が反映される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, transitionFrom: 'bottom' } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('bottom-rebound');
    });

    it('閉じるボタンクリックで closed イベントが発火する', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.closeable-box').trigger('click');
        await vi.runAllTimersAsync();
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });
});
