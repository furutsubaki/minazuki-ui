import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from '@/components/feedback/Badge.vue';

describe('Badge', () => {
    it('content が表示される', () => {
        const wrapper = mount(Badge, { props: { content: 42 } });
        expect(wrapper.find('.component-badge').text()).toBe('42');
    });

    it('content が 99 以下のときはそのまま表示される', () => {
        const wrapper = mount(Badge, { props: { content: 99 } });
        expect(wrapper.find('.component-badge').text()).toBe('99');
    });

    it('content が 100 以上のとき 99+ と表示される', () => {
        const wrapper = mount(Badge, { props: { content: 100 } });
        expect(wrapper.find('.component-badge').text()).toBe('99+');
    });

    it('content が文字列のときはそのまま表示される', () => {
        const wrapper = mount(Badge, { props: { content: 'NEW' } });
        expect(wrapper.find('.component-badge').text()).toBe('NEW');
    });

    it('shape が dot のとき content が表示されない', () => {
        const wrapper = mount(Badge, { props: { content: 5, shape: 'dot' } });
        expect(wrapper.find('.component-badge').text()).toBe('');
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Badge, { props: { content: 1, variant: 'danger' } });
        expect(wrapper.classes()).toContain('danger');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(Badge, { props: { content: 1, shape: 'dot' } });
        expect(wrapper.classes()).toContain('dot');
    });

    it('inline prop のとき inline クラスが付く', () => {
        const wrapper = mount(Badge, { props: { content: 1, inline: true } });
        expect(wrapper.classes()).toContain('inline');
    });

    it('v-model が false のとき badge が非表示になる', () => {
        const wrapper = mount(Badge, { props: { content: 5, modelValue: false } });
        const el = wrapper.find('.component-badge').element as HTMLElement;
        expect(el.style.display).toBe('none');
    });

    it('v-model が true のとき badge が表示される', () => {
        const wrapper = mount(Badge, { props: { content: 5, modelValue: true } });
        const el = wrapper.find('.component-badge').element as HTMLElement;
        expect(el.style.display).not.toBe('none');
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Badge, {
            props: { content: 1 },
            slots: { default: '<span class="inner">コンテンツ</span>' }
        });
        expect(wrapper.find('.inner').exists()).toBe(true);
    });
});
