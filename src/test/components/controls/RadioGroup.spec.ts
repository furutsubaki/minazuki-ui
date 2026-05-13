import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import RadioGroup from '@/components/controls/RadioGroup.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

const items = [
    { label: '選択肢A', value: 'a' },
    { label: '選択肢B', value: 'b' },
    { label: '選択肢C', value: 'c', disabled: true }
];

describe('RadioGroup', () => {
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(RadioGroup, { props: { items } });
        expect(wrapper.find('.component-radio-group').exists()).toBe(true);
    });

    it('items の数だけラジオボタンがレンダリングされる', () => {
        const wrapper = mount(RadioGroup, { props: { items } });
        expect(wrapper.findAll('.component-radio')).toHaveLength(3);
    });

    it('label が表示される', () => {
        const wrapper = mount(RadioGroup, {
            props: { items, label: '選択してください' }
        });
        expect(wrapper.text()).toContain('選択してください');
    });

    it('variant prop が各ラジオボタンに反映される', () => {
        const wrapper = mount(RadioGroup, { props: { items, variant: 'danger' } });
        const radios = wrapper.findAll('.component-radio');
        expect(radios[0].classes()).toContain('danger');
    });

    it('size prop が各ラジオボタンに反映される', () => {
        const wrapper = mount(RadioGroup, { props: { items, size: 'large' } });
        const radios = wrapper.findAll('.component-radio');
        expect(radios[0].classes()).toContain('large');
    });

    it('disabled のラジオは is-disabled クラスを持つ', () => {
        const wrapper = mount(RadioGroup, { props: { items } });
        const radios = wrapper.findAll('.component-radio');
        expect(radios[2].classes()).toContain('is-disabled');
    });

    it('required が true のとき .label-placeholder に required クラスが付く', () => {
        const wrapper = mount(RadioGroup, { props: { items, required: true } });
        expect(wrapper.find('.label-placeholder.required').exists()).toBe(true);
    });

    it('ZodString.min(1) schema が設定されると isRequired が true になる', () => {
        const schema = z.string().min(1);
        const wrapper = mount(RadioGroup, { props: { items, schema } });
        expect(wrapper.find('.label-placeholder.required').exists()).toBe(true);
    });

    it('modelValue が null のとき初期値設定ブロックをスキップする', () => {
        const wrapper = mount(RadioGroup, { props: { items, modelValue: null as any } });
        expect(wrapper.find('.component-radio-group').exists()).toBe(true);
    });

    it('isErrorMessage が false のとき error コンテナがない', () => {
        const wrapper = mount(RadioGroup, { props: { items, isErrorMessage: false } });
        expect(wrapper.find('.component-radio-group .error').exists()).toBe(false);
    });

    it('item ごとに variant が設定される', () => {
        const itemsWithVariant = [
            { label: '選択肢A', value: 'a', variant: 'primary' as const },
            { label: '選択肢B', value: 'b' }
        ];
        const wrapper = mount(RadioGroup, { props: { items: itemsWithVariant } });
        const radios = wrapper.findAll('.component-radio');
        expect(radios[0].classes()).toContain('primary');
    });

    it('group の disabled が true のとき全ラジオが disabled になる', () => {
        const wrapper = mount(RadioGroup, { props: { items: [{ label: 'A', value: 'a' }], disabled: true } });
        const radios = wrapper.findAll('.component-radio');
        expect(radios[0].classes()).toContain('is-disabled');
    });

    it('modelValue が設定されたとき初期値が反映される', () => {
        const wrapper = mount(RadioGroup, {
            props: { items, modelValue: 'a' }
        });
        const vm = wrapper.vm as any;
        expect(vm.$.setupState.value).toBe('a');
    });

    it('フォームコンテキストからエラーが設定されると error div がレンダリングされる', async () => {
        const fieldName = uniqueFieldName('rg-err');
        const TestParent = defineComponent({
            setup() {
                const { setFieldError } = useForm();
                onMounted(() => {
                    setFieldError(fieldName, 'エラーメッセージ');
                });
                return () => h(RadioGroup, { name: fieldName, items });
            }
        });
        const wrapper = mount(TestParent);
        await nextTick();
        await nextTick();
        expect(wrapper.find('.component-radio-group .error').exists()).toBe(true);
    });

    it('フォームコンテキストで Radio を選択したとき watch が発火して model が更新される', async () => {
        const fieldName = uniqueFieldName('rg-watch');
        const TestParent = defineComponent({
            setup() {
                useForm();
                return () => h(RadioGroup, { name: fieldName, items });
            }
        });
        const wrapper = mount(TestParent);
        const radioInput = wrapper.findAll('input[type="radio"]')[0];
        // checked=true にして onChange の FALSE 分岐 → val=event.target.value='a' → handleChange('a')
        // → フォーム共有フィールドが更新 → RadioGroup の value 変化 → watch 発火
        (radioInput.element as HTMLInputElement).checked = true;
        await radioInput.trigger('change');
        await nextTick();
        expect(wrapper.findComponent(RadioGroup).emitted('update:modelValue')).toBeTruthy();
    });

    it('schema が min 以外のチェックのみを持つ場合 isRequired が false になる', () => {
        const schema = z.string().email();
        const wrapper = mount(RadioGroup, { props: { items, schema, required: true } });
        expect(wrapper.find('.label-placeholder.required').exists()).toBe(false);
    });

    it('useForm の initialValues で value が初期から設定されている場合も正常にマウントされる', () => {
        const fieldName = uniqueFieldName('rg-init');
        const TestParent = defineComponent({
            setup() {
                useForm({ initialValues: { [fieldName]: 'a' } });
                return () => h(RadioGroup, { name: fieldName, items });
            }
        });
        const wrapper = mount(TestParent);
        expect(wrapper.find('.component-radio-group').exists()).toBe(true);
        expect(wrapper.findAll('.component-radio')).toHaveLength(items.length);
    });
});
