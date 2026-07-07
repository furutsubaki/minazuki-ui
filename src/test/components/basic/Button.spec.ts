import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, markRaw } from 'vue';
import Button from '@/components/basic/Button.vue';

const StubIcon = markRaw(defineComponent({
    name: 'StubIcon',
    render: () => h('svg', { class: 'stub-icon' })
}));

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

    it('label prop でテキストが表示される', () => {
        const wrapper = mount(Button, { props: { label: 'ボタン' } });
        expect(wrapper.find('.button-label').text()).toBe('ボタン');
    });

    it('label が未指定のとき .button-label が描画されない', () => {
        const wrapper = mount(Button);
        expect(wrapper.find('.button-label').exists()).toBe(false);
    });

    it('prefixIcon を指定するとアイコンが描画される', () => {
        const wrapper = mount(Button, { props: { prefixIcon: StubIcon } });
        expect(wrapper.findComponent(StubIcon).exists()).toBe(true);
    });

    it('suffixIcon を指定するとアイコンが描画される', () => {
        const wrapper = mount(Button, { props: { suffixIcon: StubIcon } });
        expect(wrapper.findComponent(StubIcon).exists()).toBe(true);
    });

    it.each(['info', 'success', 'warning', 'danger'] as const)(
        'variant=%s のとき auto-icon が付与される',
        (variant) => {
            const wrapper = mount(Button, { props: { variant } });
            expect(wrapper.findAll('.button-icon').length).toBe(1);
        }
    );

    it.each(['primary', 'secondary'] as const)(
        'variant=%s のとき auto-icon が付与されない',
        (variant) => {
            const wrapper = mount(Button, { props: { variant } });
            expect(wrapper.findAll('.button-icon').length).toBe(0);
        }
    );

    it('prefixIcon 明示指定で auto-icon がオーバーライドされる', () => {
        const wrapper = mount(Button, { props: { variant: 'info', prefixIcon: StubIcon } });
        const icons = wrapper.findAll('.button-icon');
        expect(icons.length).toBe(1);
        expect(wrapper.findComponent(StubIcon).exists()).toBe(true);
    });

    it('icon-only ボタンで aria-label が button に伝搬する', () => {
        const wrapper = mount(Button, {
            props: { prefixIcon: StubIcon },
            attrs: { 'aria-label': '閉じる' }
        });
        expect(wrapper.find('button').attributes('aria-label')).toBe('閉じる');
    });
});
