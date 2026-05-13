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

    it('layout prop がクラスに反映される', () => {
        const wrapper = mount(Frame, { props: { layout: 'pf-top' } });
        expect(wrapper.classes()).toContain('pf-top');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(Frame, { props: { shape: 'no-radius' } });
        expect(wrapper.classes()).toContain('no-radius');
    });

    it('isPading が true のとき is-pading クラスが付く', () => {
        const wrapper = mount(Frame, { props: { isPading: true } });
        expect(wrapper.classes()).toContain('is-pading');
    });

    it('noShadow が true のとき no-shadow クラスが付く', () => {
        const wrapper = mount(Frame, { props: { noShadow: true } });
        expect(wrapper.classes()).toContain('no-shadow');
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Frame, { slots: { default: '<span>コンテンツ</span>' } });
        expect(wrapper.text()).toBe('コンテンツ');
    });
});
