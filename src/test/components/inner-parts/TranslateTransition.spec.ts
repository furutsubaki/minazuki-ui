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

    it.each([
        ['transitionStart', 'onTransitionStart'],
        ['transitionEnd', 'onTransitionEnd']
    ])('%s イベントが発火する', (eventName, handlerName) => {
        const wrapper = mount(TranslateTransition, {
            slots: { default: '<div>A</div>' }
        });
        (wrapper.vm as any)[handlerName]();
        expect(wrapper.emitted(eventName)).toBeTruthy();
    });
});
