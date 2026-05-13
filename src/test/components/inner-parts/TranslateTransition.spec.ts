import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';

describe('TranslateTransition', () => {
    it('slot コンテンツが表示される', () => {
        const wrapper = mount(TranslateTransition, {
            slots: { default: '<div class="inner">コンテンツ</div>' }
        });
        expect(wrapper.find('.inner').exists()).toBe(true);
        expect(wrapper.find('.inner').text()).toBe('コンテンツ');
    });

    it('transitionStart イベントが発火する', () => {
        const wrapper = mount(TranslateTransition, {
            slots: { default: '<div>A</div>' }
        });
        (wrapper.vm as any).onTransitionStart();
        expect(wrapper.emitted('transitionStart')).toBeTruthy();
    });

    it('transitionEnd イベントが発火する', () => {
        const wrapper = mount(TranslateTransition, {
            slots: { default: '<div>A</div>' }
        });
        (wrapper.vm as any).onTransitionEnd();
        expect(wrapper.emitted('transitionEnd')).toBeTruthy();
    });
});
