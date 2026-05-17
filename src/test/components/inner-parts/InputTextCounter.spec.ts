import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InputTextCounter from '@/components/inner-parts/InputTextCounter.vue';

describe('InputTextCounter', () => {
    it('text が空文字のとき 0/max を表示する', () => {
        const wrapper = mount(InputTextCounter, { props: { text: '', max: 10 } });
        expect(wrapper.find('.component-counter').text()).toBe('0/10');
    });

    it('テキスト長/max を表示する', () => {
        const wrapper = mount(InputTextCounter, { props: { text: 'hello', max: 10 } });
        expect(wrapper.find('.component-counter').text()).toBe('5/10');
    });

    it('max を超えると is-error クラスが付く', () => {
        const wrapper = mount(InputTextCounter, { props: { text: '12345678901', max: 10 } });
        expect(wrapper.find('.component-counter').classes()).toContain('is-error');
    });

    it('max 以下では is-error クラスが付かない', () => {
        const wrapper = mount(InputTextCounter, { props: { text: '1234567890', max: 10 } });
        expect(wrapper.find('.component-counter').classes()).not.toContain('is-error');
    });

    it('text が undefined のとき 0/max を表示する', () => {
        const wrapper = mount(InputTextCounter, { props: { text: undefined, max: 10 } });
        expect(wrapper.find('.component-counter').text()).toBe('0/10');
    });
});
