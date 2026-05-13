import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Dialog from '@/components/feedback/Dialog.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';

describe('Dialog', () => {
    afterEach(() => {
        vi.useRealTimers();
    });
    it('v-model が true のとき dialog が表示される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true } });
        const el = wrapper.find('.component-dialog').element as HTMLElement;
        expect(el.style.display).not.toBe('none');
    });

    it('v-model が false のとき dialog が非表示になる', () => {
        const wrapper = mount(Dialog, { props: { modelValue: false } });
        const el = wrapper.find('.component-dialog').element as HTMLElement;
        expect(el.style.display).toBe('none');
    });

    it('title が指定されたとき .title が表示される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, title: 'テストタイトル' } });
        expect(wrapper.find('.title').text()).toBe('テストタイトル');
    });

    it('title がないとき .title が表示されない', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true } });
        expect(wrapper.find('.title').exists()).toBe(false);
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Dialog, { props: { modelValue: true, [prop]: value } });
        expect(wrapper.find('.dialog').classes()).toContain(value);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Dialog, {
            props: { modelValue: true },
            slots: { default: '<p class="content">内容</p>' }
        });
        expect(wrapper.find('.content').exists()).toBe(true);
    });

    it('footer slot が表示される', () => {
        const wrapper = mount(Dialog, {
            props: { modelValue: true },
            slots: { footer: '<button class="ok-btn">OK</button>' }
        });
        expect(wrapper.find('.ok-btn').exists()).toBe(true);
    });

    it('center prop のとき is-center クラスが付く', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, center: true } });
        expect(wrapper.find('.dialog').classes()).toContain('is-center');
    });

    it('position prop がクラスに反映される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, position: 'top' } });
        expect(wrapper.find('.dialog-frame').classes()).toContain('top');
    });

    it.each([
        ['top', 'top-rebound'],
        ['right', 'right-rebound'],
        ['bottom', 'bottom-rebound'],
        ['left', 'left-rebound']
    ])('transitionFrom="%s" が TranslateTransition に反映される', (transitionFrom, expectedFrom) => {
        const wrapper = mount(Dialog, { props: { modelValue: true, transitionFrom } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe(expectedFrom);
    });

    it('seamless prop のとき is-seamless クラスが付く', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, seamless: true } });
        expect(wrapper.find('.component-dialog').classes()).toContain('is-seamless');
    });

    it('外側クリックで closed イベントが発火する', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        document.body.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await vi.runAllTimersAsync();
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });

    it.each([
        ['info'],
        ['success'],
        ['warning']
    ])('variant="%s" のときクラスが付く', (variant) => {
        const wrapper = mount(Dialog, { props: { modelValue: true, variant } });
        expect(wrapper.find('.dialog').classes()).toContain(variant);
    });

    it('v-model が false → true に変わると overflow が hidden になる', async () => {
        const wrapper = mount(Dialog, { props: { modelValue: false } });
        await wrapper.setProps({ modelValue: true });
        expect(document.documentElement.style.overflow).toBe('hidden');
        // cleanup
        document.documentElement.style.overflow = '';
    });
});
