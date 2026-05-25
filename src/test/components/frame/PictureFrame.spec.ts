import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import PictureFrame from '@/components/frame/PictureFrame.vue';

describe('PictureFrame', () => {
    it('デフォルトで div タグが使われる', () => {
        const wrapper = mount(PictureFrame);
        expect(wrapper.find('.picture-frame-inner').element.tagName).toBe('DIV');
    });

    it('tag prop でタグを変更できる', () => {
        const wrapper = mount(PictureFrame, { props: { tag: 'article' } });
        expect(wrapper.find('.picture-frame-inner').element.tagName).toBe('ARTICLE');
    });

    it.each([
        [{ layout: 'pf-right' as const }, 'pf-right'],
        [{ shape: 'circle' as const }, 'circle'],
        [{ isPading: true }, 'is-pading']
    ])('prop がクラスに反映される', (props, expectedClass) => {
        const wrapper = mount(PictureFrame, { props: props as any });
        expect(wrapper.classes()).toContain(expectedClass);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(PictureFrame, { slots: { default: '<span>コンテンツ</span>' } });
        expect(wrapper.text()).toBe('コンテンツ');
    });
});
