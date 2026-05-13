import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FieldAccordionList from '@/components/inner-parts/FieldAccordionList.vue';

const items = [
    { label: 'りんご', value: 'apple' },
    { label: 'バナナ', value: 'banana' },
    { label: 'チェリー', value: 'cherry', disabled: true }
];

describe('FieldAccordionList', () => {
    it('items に応じてリストアイテムが表示される', () => {
        const wrapper = mount(FieldAccordionList, { props: { items, value: undefined } });
        const listItems = wrapper.findAll('.list-item');
        expect(listItems).toHaveLength(3);
        expect(listItems[0].text()).toBe('りんご');
        expect(listItems[1].text()).toBe('バナナ');
        expect(listItems[2].text()).toBe('チェリー');
    });

    it('v-model が true のとき is-open クラスが付く（items が空でないとき）', () => {
        const wrapper = mount(FieldAccordionList, {
            props: { items, value: undefined, modelValue: true }
        });
        expect(wrapper.find('.component-input-accordion-list').classes()).toContain('is-open');
    });

    it('v-model が false のとき is-open クラスが付かない', () => {
        const wrapper = mount(FieldAccordionList, {
            props: { items, value: undefined, modelValue: false }
        });
        expect(wrapper.find('.component-input-accordion-list').classes()).not.toContain('is-open');
    });

    it('アイテムを mouseup すると change イベントが発火する', async () => {
        const wrapper = mount(FieldAccordionList, {
            props: { items, value: undefined, modelValue: true }
        });
        await wrapper.findAll('.list-item')[0].trigger('mouseup');
        expect(wrapper.emitted('change')).toHaveLength(1);
        expect(wrapper.emitted('change')![0]).toEqual(['apple']);
    });

    it('アイテムを mouseup すると v-model が false になる', async () => {
        const wrapper = mount(FieldAccordionList, {
            props: {
                items,
                value: undefined,
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.findAll('.list-item')[0].trigger('mouseup');
        expect(wrapper.props('modelValue')).toBe(false);
    });

    it('value と一致するアイテムに is-selected クラスが付く', () => {
        const wrapper = mount(FieldAccordionList, {
            props: { items, value: 'banana', modelValue: true }
        });
        const listItems = wrapper.findAll('.list-item');
        expect(listItems[0].classes()).not.toContain('is-selected');
        expect(listItems[1].classes()).toContain('is-selected');
        expect(listItems[2].classes()).not.toContain('is-selected');
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(FieldAccordionList, { props: { items, value: undefined, variant: 'danger' } });
        expect(wrapper.find('.component-input-accordion-list').classes()).toContain('danger');
    });

    it('position prop がクラスに反映される', () => {
        const wrapper = mount(FieldAccordionList, { props: { items, value: undefined, position: 'top' } });
        expect(wrapper.find('.component-input-accordion-list').classes()).toContain('top');
    });
});
