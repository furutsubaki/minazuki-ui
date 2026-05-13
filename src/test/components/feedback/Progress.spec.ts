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

    it('進捗率が正しく計算される', () => {
        const wrapper = mount(Progress, { props: { modelValue: 50 } });
        expect(wrapper.find('.ratio').text()).toBe('50%');
    });

    it('0% が正しく表示される', () => {
        const wrapper = mount(Progress, { props: { modelValue: 0 } });
        expect(wrapper.find('.ratio').text()).toBe('0%');
    });

    it('100% が正しく表示される', () => {
        const wrapper = mount(Progress, { props: { modelValue: 100 } });
        expect(wrapper.find('.ratio').text()).toBe('100%');
    });

    it('max を超えた値は max でクランプされる', () => {
        const wrapper = mount(Progress, { props: { modelValue: 150 } });
        expect(wrapper.find('.ratio').text()).toBe('100%');
    });

    it('max=200 で modelValue=250 のとき 100% にクランプされる', () => {
        const wrapper = mount(Progress, { props: { modelValue: 250, max: 200 } });
        expect(wrapper.find('.ratio').text()).toBe('100%');
    });

    it('modelValue が負数のとき 0% にクランプされる', () => {
        const wrapper = mount(Progress, { props: { modelValue: -10 } });
        expect(wrapper.find('.ratio').text()).toBe('0%');
    });

    it('カスタム max で進捗率が計算される', () => {
        const wrapper = mount(Progress, { props: { modelValue: 100, max: 200 } });
        expect(wrapper.find('.ratio').text()).toBe('50%');
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
