import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Star } from 'lucide-vue-next';
import Avatar from '@/components/basic/Avatar.vue';

describe('Avatar', () => {
    it('image が指定されたとき img タグが表示される', () => {
        const wrapper = mount(Avatar, { props: { image: '/test.jpg' } });
        expect(wrapper.find('img').exists()).toBe(true);
        expect(wrapper.find('img').attributes('src')).toBe('/test.jpg');
    });

    it('image がないとき div が表示される', () => {
        const wrapper = mount(Avatar);
        expect(wrapper.find('div').exists()).toBe(true);
        expect(wrapper.find('img').exists()).toBe(false);
    });

    it('icon が指定されたとき svg が表示される', () => {
        const wrapper = mount(Avatar, { props: { icon: Star } });
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Avatar, {
            slots: { default: '<span class="inner">A</span>' }
        });
        expect(wrapper.find('.inner').exists()).toBe(true);
    });

    it('image も icon も slot もないときデフォルトアイコンが表示される', () => {
        const wrapper = mount(Avatar);
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Avatar, { props: { size: 'large' } });
        expect(wrapper.classes()).toContain('large');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(Avatar, { props: { shape: 'square' } });
        expect(wrapper.classes()).toContain('square');
    });

    it('デフォルト size は medium', () => {
        const wrapper = mount(Avatar);
        expect(wrapper.classes()).toContain('medium');
    });

    it('デフォルト shape は circle', () => {
        const wrapper = mount(Avatar);
        expect(wrapper.classes()).toContain('circle');
    });

    it('color prop を指定すると color computed に反映される', () => {
        const wrapper = mount(Avatar, { props: { color: 'red' } });
        expect((wrapper.vm as any).color).toBe('red');
    });

    it('color prop を指定しないとき デフォルト色が返る', () => {
        const wrapper = mount(Avatar);
        expect((wrapper.vm as any).color).toBe('var(--color-theme-bg-secondary)');
    });
});
