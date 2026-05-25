import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '@/components/basic/Button.vue';

describe('Button', () => {
    it('デフォルト props が適用される', () => {
        const wrapper = mount(Button);
        const button = wrapper.find('button');
        expect(button.classes()).toContain('secondary');
        expect(button.classes()).toContain('medium');
        expect(button.classes()).toContain('normal');
        expect(button.attributes('disabled')).toBeUndefined();
    });

    it.each([
        ['variant', 'primary'],
        ['size', 'large'],
        ['shape', 'rounded']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Button, { props: { [prop]: value } });
        expect(wrapper.find('button').classes()).toContain(value);
    });

    it('disabled のとき button が無効になる', () => {
        const wrapper = mount(Button, { props: { disabled: true } });
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    });

    it('クリックで click イベントが発火する', async () => {
        const wrapper = mount(Button);
        await wrapper.find('button').trigger('click');
        expect(wrapper.emitted('click')).toHaveLength(1);
    });

    it('readonly のとき click イベントが発火せず is-readonly クラスが付く', async () => {
        const wrapper = mount(Button, { props: { readonly: true } });
        await wrapper.find('button').trigger('click');
        expect(wrapper.emitted('click')).toBeUndefined();
        expect(wrapper.find('button').classes()).toContain('is-readonly');
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Button, { slots: { default: 'ボタン' } });
        expect(wrapper.text()).toBe('ボタン');
    });
});
