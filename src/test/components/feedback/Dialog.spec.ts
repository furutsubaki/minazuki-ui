import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Dialog from '@/components/feedback/Dialog.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';

describe('Dialog', () => {
    afterEach(() => {
        vi.useRealTimers();
    });
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(Dialog);
        expect(wrapper.find('.component-dialog').exists()).toBe(true);
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

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, variant: 'danger' } });
        expect(wrapper.find('.dialog').classes()).toContain('danger');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, size: 'large' } });
        expect(wrapper.find('.dialog').classes()).toContain('large');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, shape: 'no-radius' } });
        expect(wrapper.find('.dialog').classes()).toContain('no-radius');
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

    it('transitionFrom="top" が反映される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, transitionFrom: 'top' } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('top-rebound');
    });

    it('transitionFrom="right" が反映される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, transitionFrom: 'right' } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('right-rebound');
    });

    it('transitionFrom="bottom" が反映される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, transitionFrom: 'bottom' } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('bottom-rebound');
    });

    it('transitionFrom="left" が反映される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, transitionFrom: 'left' } });
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('left-rebound');
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

    it('variant="info" のとき info クラスが付く', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, variant: 'info' } });
        expect(wrapper.find('.dialog').classes()).toContain('info');
    });

    it('variant="success" のとき success クラスが付く', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, variant: 'success' } });
        expect(wrapper.find('.dialog').classes()).toContain('success');
    });

    it('variant="warning" のとき warning クラスが付く', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, variant: 'warning' } });
        expect(wrapper.find('.dialog').classes()).toContain('warning');
    });

    it('v-model が false → true に変わると overflow が hidden になる', async () => {
        const wrapper = mount(Dialog, { props: { modelValue: false } });
        await wrapper.setProps({ modelValue: true });
        expect(document.documentElement.style.overflow).toBe('hidden');
        // cleanup
        document.documentElement.style.overflow = '';
    });
});
