import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TranslateTransitionGroup from '@/components/inner-parts/TranslateTransitionGroup.vue';

describe('TranslateTransitionGroup', () => {
    it('slot コンテンツが表示される', () => {
        const wrapper = mount(TranslateTransitionGroup, {
            slots: { default: '<div class="inner" key="a">コンテンツ</div>' }
        });
        expect(wrapper.find('.inner').exists()).toBe(true);
        expect(wrapper.find('.inner').text()).toBe('コンテンツ');
    });

    it('transitionStart イベントが発火する', () => {
        const wrapper = mount(TranslateTransitionGroup, {
            slots: { default: '<div key="a">A</div>' }
        });
        (wrapper.vm as any).onTransitionStart();
        expect(wrapper.emitted('transitionStart')).toBeTruthy();
    });

    it('transitionEnd イベントが発火する', () => {
        const wrapper = mount(TranslateTransitionGroup, {
            slots: { default: '<div key="a">A</div>' }
        });
        (wrapper.vm as any).onTransitionEnd();
        expect(wrapper.emitted('transitionEnd')).toBeTruthy();
    });
});
