import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Frame from '@/components/frame/Frame.vue';

describe('Frame', () => {
    it('デフォルトで div タグが使われる', () => {
        const wrapper = mount(Frame);
        expect(wrapper.find('.frame-inner').element.tagName).toBe('DIV');
    });

    it('tag prop でタグを変更できる', () => {
        const wrapper = mount(Frame, { props: { tag: 'section' } });
        expect(wrapper.find('.frame-inner').element.tagName).toBe('SECTION');
    });

    it.each([
        [{ layout: 'pf-top' as const }, 'pf-top'],
        [{ shape: 'no-radius' as const }, 'no-radius'],
        [{ isPading: true }, 'is-pading'],
        [{ noShadow: true }, 'no-shadow']
    ])('prop がクラスに反映される', (props, expectedClass) => {
        const wrapper = mount(Frame, { props: props as any });
        expect(wrapper.classes()).toContain(expectedClass);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Frame, { slots: { default: '<span>コンテンツ</span>' } });
        expect(wrapper.text()).toBe('コンテンツ');
    });
});
