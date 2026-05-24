import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from '@/components/feedback/Badge.vue';

describe('Badge', () => {
    it.each([
        [42, '42'],
        [99, '99'],
        [100, '99+'],
        ['NEW', 'NEW']
    ])('content=%s のとき %s と表示される', (content, expected) => {
        const wrapper = mount(Badge, { props: { content } });
        expect(wrapper.find('.component-badge').text()).toBe(expected);
    });

    it('shape が dot のとき content が表示されない', () => {
        const wrapper = mount(Badge, { props: { content: 5, shape: 'dot' } });
        expect(wrapper.find('.component-badge').text()).toBe('');
    });

    it.each([
        [{ variant: 'danger' as const }, 'danger'],
        [{ shape: 'dot' as const }, 'dot'],
        [{ inline: true }, 'inline']
    ])('prop がクラスに反映される', (props, expectedClass) => {
        const wrapper = mount(Badge, { props: { content: 1, ...props } });
        expect(wrapper.classes()).toContain(expectedClass);
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
