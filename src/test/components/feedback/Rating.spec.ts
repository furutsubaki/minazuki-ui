import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Rating from '@/components/feedback/Rating.vue';
import Button from '@/components/basic/Button.vue';

describe('Rating', () => {
    it('デフォルトで 5 つの星グループが表示される', () => {
        const wrapper = mount(Rating);
        expect(wrapper.findAll('.rate').length).toBe(5);
    });

    it('length prop で星の数を変更できる', () => {
        const wrapper = mount(Rating, { props: { length: 3 } });
        expect(wrapper.findAll('.rate').length).toBe(3);
    });

    it('half が true のとき各グループに 2 つのボタンが表示される', () => {
        const wrapper = mount(Rating, { props: { half: true } });
        const rateGroups = wrapper.findAll('.rate');
        rateGroups.forEach((group) => {
            expect(group.findAll('button').length).toBe(2);
        });
    });

    it('クリックで modelValue が更新される', async () => {
        const wrapper = mount(Rating, {
            props: {
                modelValue: 0,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.findAll('button')[0].trigger('click');
        expect(wrapper.props('modelValue')).toBe(1);
    });

    it('readonly のとき クリックしても modelValue が変わらない', async () => {
        const wrapper = mount(Rating, {
            props: {
                modelValue: 3,
                readonly: true,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.findAll('button')[0].trigger('click');
        expect(wrapper.props('modelValue')).toBe(3);
    });

    it('clearable のとき同じ値をクリックすると 0 になる', async () => {
        const wrapper = mount(Rating, {
            props: {
                modelValue: 1,
                clearable: true,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.findAll('button')[0].trigger('click');
        expect(wrapper.props('modelValue')).toBe(0);
    });

    it('clearable でないとき同じ値をクリックしても変わらない', async () => {
        const wrapper = mount(Rating, {
            props: {
                modelValue: 1,
                clearable: false,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.findAll('button')[0].trigger('click');
        expect(wrapper.props('modelValue')).toBe(1);
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Rating, { props: { variant: 'flat' } });
        expect(wrapper.classes()).toContain('flat');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Rating, { props: { size: 'large' } });
        expect(wrapper.classes()).toContain('large');
    });

    it('マウスオーバーで is-over クラスが付く', async () => {
        const wrapper = mount(Rating, { props: { modelValue: 0 } });
        await wrapper.findAll('button')[2].trigger('mouseover');
        expect(wrapper.findAllComponents(Button)[2].classes()).toContain('is-over');
    });

    it('マウスリーブで is-over クラスが model の値に応じて戻る', async () => {
        const wrapper = mount(Rating, { props: { modelValue: 3 } });
        await wrapper.findAll('button')[0].trigger('mouseover');
        await wrapper.findAll('button')[0].trigger('mouseleave');
        expect(wrapper.findAllComponents(Button)[2].classes()).toContain('is-over');
    });

    it('readonly のとき onClick が early return する', async () => {
        const wrapper = mount(Rating, {
            props: {
                modelValue: 3,
                readonly: true,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        // Button blocks click emit when readonly — emit directly to reach Rating's onClick
        const buttons = wrapper.findAllComponents(Button);
        await buttons[0].vm.$emit('click');
        expect(wrapper.props('modelValue')).toBe(3);
    });
});
