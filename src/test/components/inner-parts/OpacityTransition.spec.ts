import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';

describe('OpacityTransition', () => {
    it('slot コンテンツが表示される', () => {
        const wrapper = mount(OpacityTransition, {
            slots: { default: '<div class="inner">コンテンツ</div>' }
        });
        expect(wrapper.find('.inner').exists()).toBe(true);
        expect(wrapper.find('.inner').text()).toBe('コンテンツ');
    });

    it.each([
        ['transitionStart', 'onTransitionStart'],
        ['transitionEnd', 'onTransitionEnd']
    ])('%s イベントが発火する', (eventName, handlerName) => {
        const wrapper = mount(OpacityTransition, {
            slots: { default: '<div>A</div>' }
        });
        (wrapper.vm as any)[handlerName]();
        expect(wrapper.emitted(eventName)).toBeTruthy();
    });
});
