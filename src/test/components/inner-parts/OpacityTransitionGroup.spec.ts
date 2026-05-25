import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import OpacityTransitionGroup from '@/components/inner-parts/OpacityTransitionGroup.vue';

describe('OpacityTransitionGroup', () => {
    it('slot コンテンツが表示される', () => {
        const wrapper = mount(OpacityTransitionGroup, {
            slots: { default: '<div class="inner" key="a">コンテンツ</div>' }
        });
        expect(wrapper.find('.inner').exists()).toBe(true);
        expect(wrapper.find('.inner').text()).toBe('コンテンツ');
    });

    it.each([
        ['transitionStart', 'onTransitionStart'],
        ['transitionEnd', 'onTransitionEnd']
    ])('%s イベントが発火する', (eventName, handlerName) => {
        const wrapper = mount(OpacityTransitionGroup, {
            slots: { default: '<div key="a">A</div>' }
        });
        (wrapper.vm as any)[handlerName]();
        expect(wrapper.emitted(eventName)).toBeTruthy();
    });
});
