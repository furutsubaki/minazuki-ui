import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Modal from '@/components/feedback/Modal.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';

describe('Modal', () => {
    afterEach(() => {
        vi.useRealTimers();
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

    it.each([
        ['size', 'large'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Modal, { props: { modelValue: true, [prop]: value } });
        expect(wrapper.find('.modal').classes()).toContain(value);
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

    it.each([
        ['top', 'top-rebound'],
        ['right', 'right-rebound'],
        ['bottom', 'bottom-rebound'],
        ['left', 'left-rebound']
    ])('transitionFrom="%s" が TranslateTransition に反映される', (transitionFrom, expectedFrom) => {
        const wrapper = mount(Modal, { props: { modelValue: true, transitionFrom } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe(expectedFrom);
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
