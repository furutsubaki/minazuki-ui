import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import CheckboxGroup from '@/components/controls/CheckboxGroup.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

const items = [
    { label: 'りんご', value: 'apple' },
    { label: 'バナナ', value: 'banana' },
    { label: 'チェリー', value: 'cherry', disabled: true }
];

describe('CheckboxGroup', () => {
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(CheckboxGroup, { props: { items } });
        expect(wrapper.find('.component-checkbox-group').exists()).toBe(true);
    });

    it('items の数だけチェックボックスがレンダリングされる', () => {
        const wrapper = mount(CheckboxGroup, { props: { items } });
        expect(wrapper.findAll('.component-checkbox')).toHaveLength(3);
    });

    it('label が表示される', () => {
        const wrapper = mount(CheckboxGroup, {
            props: { items, label: 'フルーツ選択' }
        });
        expect(wrapper.text()).toContain('フルーツ選択');
    });

    it('variant prop が各チェックボックスに反映される', () => {
        const wrapper = mount(CheckboxGroup, { props: { items, variant: 'danger' } });
        const checkboxes = wrapper.findAll('.component-checkbox');
        expect(checkboxes[0].classes()).toContain('danger');
    });

    it('size prop が各チェックボックスに反映される', () => {
        const wrapper = mount(CheckboxGroup, { props: { items, size: 'large' } });
        const checkboxes = wrapper.findAll('.component-checkbox');
        expect(checkboxes[0].classes()).toContain('large');
    });

    it('disabled のチェックボックスは is-disabled クラスを持つ', () => {
        const wrapper = mount(CheckboxGroup, { props: { items } });
        const checkboxes = wrapper.findAll('.component-checkbox');
        expect(checkboxes[2].classes()).toContain('is-disabled');
    });

    it('required が true のとき .label-placeholder に required クラスが付く', () => {
        const wrapper = mount(CheckboxGroup, { props: { items, required: true } });
        expect(wrapper.find('.label-placeholder.required').exists()).toBe(true);
    });

    it('ZodArray.min(1) schema が設定されると isRequired が true になる', () => {
        const schema = z.array(z.string()).min(1);
        const wrapper = mount(CheckboxGroup, { props: { items, schema } });
        expect(wrapper.find('.label-placeholder.required').exists()).toBe(true);
    });

    it('isErrorMessage が false のとき error コンテナがない', () => {
        const wrapper = mount(CheckboxGroup, { props: { items, isErrorMessage: false } });
        expect(wrapper.find('.component-checkbox-group .error').exists()).toBe(false);
    });

    it('item ごとに variant が設定される', () => {
        const itemsWithVariant = [
            { label: 'りんご', value: 'apple', variant: 'danger' as const },
            { label: 'バナナ', value: 'banana' }
        ];
        const wrapper = mount(CheckboxGroup, { props: { items: itemsWithVariant } });
        const checkboxes = wrapper.findAll('.component-checkbox');
        expect(checkboxes[0].classes()).toContain('danger');
    });

    it('group の disabled が true のとき全チェックボックスが disabled になる', () => {
        const wrapper = mount(CheckboxGroup, { props: { items: [{ label: 'A', value: 'a' }], disabled: true } });
        const checkboxes = wrapper.findAll('.component-checkbox');
        expect(checkboxes[0].classes()).toContain('is-disabled');
    });

    it('modelValue が設定されたとき初期値が反映される', () => {
        const wrapper = mount(CheckboxGroup, {
            props: { items, modelValue: ['apple', 'banana'] }
        });
        const vm = wrapper.vm as any;
        expect(vm.$.setupState.value).toEqual(['apple', 'banana']);
    });

    it('フォームコンテキストからエラーが設定されると error div がレンダリングされる', async () => {
        const fieldName = uniqueFieldName('cbg-err');
        const TestParent = defineComponent({
            setup() {
                const { setFieldError } = useForm();
                onMounted(() => {
                    setFieldError(fieldName, 'エラーメッセージ');
                });
                return () => h(CheckboxGroup, { name: fieldName, items });
            }
        });
        const wrapper = mount(TestParent);
        await nextTick();
        await nextTick();
        expect(wrapper.find('.component-checkbox-group .error').exists()).toBe(true);
    });
});
