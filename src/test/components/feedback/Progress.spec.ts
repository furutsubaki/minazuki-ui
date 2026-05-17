import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Progress from '@/components/feedback/Progress.vue';

describe('Progress', () => {
    it('デフォルト props が適用される', () => {
        const wrapper = mount(Progress);
        expect(wrapper.classes()).toContain('secondary');
        expect(wrapper.classes()).toContain('medium');
        expect(wrapper.classes()).toContain('line');
    });

    it.each([
        [50, 100, '50%'],
        [0, 100, '0%'],
        [100, 100, '100%'],
        [150, 100, '100%'],
        [250, 200, '100%'],
        [-10, 100, '0%'],
        [100, 200, '50%']
    ])('modelValue=%i/max=%i のとき %s が表示される', (modelValue, max, expected) => {
        const wrapper = mount(Progress, { props: { modelValue, max } });
        expect(wrapper.find('.ratio').text()).toBe(expected);
    });

    it('noText のとき .ratio が表示されない', () => {
        const wrapper = mount(Progress, { props: { modelValue: 50, noText: true } });
        expect(wrapper.find('.ratio').exists()).toBe(false);
    });

    it('shape が line のとき .progress-bar が表示される', () => {
        const wrapper = mount(Progress, { props: { modelValue: 50 } });
        expect(wrapper.find('.progress-bar').exists()).toBe(true);
        expect(wrapper.find('svg').exists()).toBe(false);
    });

    it('shape が slim-line のとき .ratio が表示されない', () => {
        const wrapper = mount(Progress, { props: { modelValue: 50, shape: 'slim-line' } });
        expect(wrapper.find('.ratio').exists()).toBe(false);
    });

    it('shape が circle のとき svg が表示される', () => {
        const wrapper = mount(Progress, { props: { modelValue: 50, shape: 'circle' } });
        expect(wrapper.find('svg').exists()).toBe(true);
        expect(wrapper.find('.progress-bar').exists()).toBe(false);
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Progress, { props: { modelValue: 50, variant: 'success' } });
        expect(wrapper.classes()).toContain('success');
    });

    it('slot コンテンツが .ratio の代わりに表示される', () => {
        const wrapper = mount(Progress, {
            props: { modelValue: 50 },
            slots: { default: '<span class="custom">カスタム</span>' }
        });
        expect(wrapper.find('.custom').exists()).toBe(true);
        expect(wrapper.find('.ratio').exists()).toBe(false);
    });
});
