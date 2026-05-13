import { describe, it, expect } from 'vitest';
import { nextTick, h } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { Form as VeeForm } from 'vee-validate';
import Select from '@/components/controls/Select.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

const items = [
    { label: 'りんご', value: 'apple' },
    { label: 'バナナ', value: 'banana' },
    { label: 'チェリー', value: 'cherry', disabled: true }
];

describe('Select', () => {
    it('label が表示される', () => {
        const wrapper = mount(Select, {
            props: { items, label: '選択してください' }
        });
        expect(wrapper.find('.label').text()).toBe('選択してください');
    });

    it('select をクリックするとリストが開く', async () => {
        const wrapper = mount(Select, { props: { items } });
        await wrapper.find('.select').trigger('click');
        expect(wrapper.find('.component-select-group').classes()).toContain('is-focus');
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Select, { props: { items, [prop]: value } });
        expect(wrapper.find('.component-select-group').classes()).toContain(value);
    });

    it.each([
        [{ required: true }],
        [{ schema: z.string().min(1) }]
    ])('required/schema で isRequired になる', (extraProps) => {
        const wrapper = mount(Select, { props: { items, ...extraProps } });
        expect(wrapper.find('.component-input-frame').classes()).toContain('is-required');
    });

    it('clearable が true のとき削除ボタン領域がレンダリングされる', () => {
        const wrapper = mount(Select, { props: { items, clearable: true } });
        expect(wrapper.find('.clearable-box').exists()).toBe(true);
    });

    it('アイテムを選択すると onChange が呼ばれて value が更新される', async () => {
        const wrapper = mount(Select, { props: { items } });
        await wrapper.find('.select').trigger('click');
        await nextTick();
        const listItems = wrapper.findAll('.list-item');
        expect(listItems.length).toBeGreaterThan(0);
        await listItems[0].trigger('mouseup');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('clearable で値がある状態でクリアアイコンをクリックすると onDelete が呼ばれる', async () => {
        const wrapper = mount(Select, {
            props: { items, clearable: true, modelValue: 'apple' }
        });
        await nextTick();
        const clearIcon = wrapper.find('.clearable-box svg');
        expect(clearIcon.exists()).toBe(true);
        await clearIcon.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('modelValue が設定されたとき初期値が反映される', async () => {
        const wrapper = mount(Select, {
            props: { items, modelValue: 'apple' }
        });
        await nextTick();
        expect(wrapper.find('.selected-label').text()).toBe('りんご');
    });

    it('position prop がクラスに反映される', () => {
        const wrapper = mount(Select, { props: { items, position: 'top' } });
        expect(wrapper.find('.component-select-group').classes()).toContain('top');
    });

    it('onDelete を呼ぶと value が空になり isOpen が false になる', async () => {
        const wrapper = mount(Select, { props: { items, modelValue: 'apple' } });
        await nextTick();
        const vm = wrapper.vm as any;
        vm.$.setupState.isOpen = true;
        await nextTick();
        expect(wrapper.find('.component-select-group').classes()).toContain('is-focus');
        vm.$.setupState.onDelete();
        await nextTick();
        expect(vm.$.setupState.value).toBe('');
        expect(wrapper.find('.component-select-group').classes()).not.toContain('is-focus');
    });

    it('vee-validate フォーム初期値が設定済みの場合 value は model で上書きされない', async () => {
        const fieldName = uniqueFieldName('sel-form-test');
        const wrapper = mount(
            h(VeeForm, { initialValues: { [fieldName]: 'apple' } }, {
                default: () => h(Select, { items, name: fieldName, modelValue: 'banana' })
            })
        );
        await nextTick();
        const vm = wrapper.findComponent(Select).vm as any;
        expect(vm.$.setupState.value).toBe('apple');
    });
});
