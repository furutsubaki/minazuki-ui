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

    it('layout prop がクラスに反映される', () => {
        const wrapper = mount(PictureFrame, { props: { layout: 'pf-right' } });
        expect(wrapper.classes()).toContain('pf-right');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(PictureFrame, { props: { shape: 'circle' } });
        expect(wrapper.classes()).toContain('circle');
    });

    it('isPading が true のとき is-pading クラスが付く', () => {
        const wrapper = mount(PictureFrame, { props: { isPading: true } });
        expect(wrapper.classes()).toContain('is-pading');
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(PictureFrame, { slots: { default: '<span>コンテンツ</span>' } });
        expect(wrapper.text()).toBe('コンテンツ');
    });
});
