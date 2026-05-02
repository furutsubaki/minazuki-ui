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

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Button, { props: { variant: 'primary' } });
        expect(wrapper.find('button').classes()).toContain('primary');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Button, { props: { size: 'large' } });
        expect(wrapper.find('button').classes()).toContain('large');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(Button, { props: { shape: 'rounded' } });
        expect(wrapper.find('button').classes()).toContain('rounded');
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

    it('readonly のとき click イベントが発火しない', async () => {
        const wrapper = mount(Button, { props: { readonly: true } });
        await wrapper.find('button').trigger('click');
        expect(wrapper.emitted('click')).toBeUndefined();
    });

    it('readonly クラスが付与される', () => {
        const wrapper = mount(Button, { props: { readonly: true } });
        expect(wrapper.find('button').classes()).toContain('is-readonly');
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Button, { slots: { default: 'ボタン' } });
        expect(wrapper.text()).toBe('ボタン');
    });
});
