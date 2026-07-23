import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Star } from '@lucide/vue';
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

    it.each([
        [{ size: 'large' }, 'large'],
        [{ shape: 'square' }, 'square'],
        [{}, 'medium'],
        [{}, 'circle']
    ])('size/shape prop とデフォルト値がクラスに反映される', (props, expectedClass) => {
        const wrapper = mount(Avatar, { props });
        expect(wrapper.classes()).toContain(expectedClass);
    });

    it.each([
        [{}, 'var(--color-bg-secondary)'],
        [{ color: '#ff0000' }, '#ff0000']
    ])('color prop が defineExpose 経由で取得できる', (props, expected) => {
        const wrapper = mount(Avatar, { props });
        expect((wrapper.vm as unknown as { color: string }).color).toBe(expected);
    });
});
