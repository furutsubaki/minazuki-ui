import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import Checkbox from '@/components/controls/Checkbox.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

describe('Checkbox', () => {
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(Checkbox);
        expect(wrapper.find('.component-checkbox').exists()).toBe(true);
    });

    it('label が表示される', () => {
        const wrapper = mount(Checkbox, { props: { label: 'テストラベル' } });
        expect(wrapper.find('.label-placeholder').text()).toBe('テストラベル');
    });

    it('disabled が true のとき is-disabled クラスが付く', () => {
        const wrapper = mount(Checkbox, { props: { disabled: true } });
        expect(wrapper.find('.component-checkbox').classes()).toContain('is-disabled');
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Checkbox, { props: { variant: 'danger' } });
        expect(wrapper.find('.component-checkbox').classes()).toContain('danger');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Checkbox, { props: { size: 'large' } });
        expect(wrapper.find('.component-checkbox').classes()).toContain('large');
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Checkbox, { slots: { default: '選択肢A' } });
        expect(wrapper.find('.text').text()).toBe('選択肢A');
    });

    it('modelValue が value と等しいとき is-checked クラスが付く', () => {
        const wrapper = mount(Checkbox, {
            props: { modelValue: true, value: true }
        });
        expect(wrapper.find('.component-checkbox').classes()).toContain('is-checked');
    });

    it('modelValue が value と異なるとき is-checked クラスが付かない', () => {
        const wrapper = mount(Checkbox, {
            props: { modelValue: false, value: true }
        });
        expect(wrapper.find('.component-checkbox').classes()).not.toContain('is-checked');
    });

    it('required が true かつ label なしのとき .text に required クラスが付く', () => {
        const wrapper = mount(Checkbox, { props: { required: true }, slots: { default: '選択肢' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('required が true かつ label があるとき .label-placeholder に required クラスが付く', () => {
        const wrapper = mount(Checkbox, { props: { required: true, label: 'テスト' } });
        expect(wrapper.find('.label-placeholder.required').exists()).toBe(true);
    });

    it('ZodLiteral schema が設定されると isRequired が true になる', () => {
        const schema = z.literal(true);
        const wrapper = mount(Checkbox, { props: { schema }, slots: { default: '選択肢' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('ZodString.min(1) schema が設定されると isRequired が true になる', () => {
        const schema = z.string().min(1);
        const wrapper = mount(Checkbox, { props: { schema, value: 'test' }, slots: { default: '選択肢' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('isErrorMessage が false のとき error コンテナがレンダリングされない', () => {
        const wrapper = mount(Checkbox, { props: { isErrorMessage: false } });
        expect(wrapper.find('.error').exists()).toBe(false);
    });

    it('value が string のとき modelValue と一致すると is-checked になる', () => {
        const wrapper = mount(Checkbox, { props: { value: 'apple', modelValue: 'apple' } });
        expect(wrapper.find('.component-checkbox').classes()).toContain('is-checked');
    });

    it('value が number のとき modelValue と一致すると is-checked になる', () => {
        const wrapper = mount(Checkbox, { props: { value: 42, modelValue: 42 } });
        expect(wrapper.find('.component-checkbox').classes()).toContain('is-checked');
    });

    it('input に setChecked(true) すると update:modelValue が apple で emit される', async () => {
        const wrapper = mount(Checkbox, { props: { value: 'apple' } });
        const input = wrapper.find('input[type="checkbox"]');
        await input.setChecked(true);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple']);
    });

    it('input に setChecked(false) すると update:modelValue が空文字で emit される', async () => {
        const wrapper = mount(Checkbox, { props: { value: 'apple', modelValue: 'apple' } });
        const input = wrapper.find('input[type="checkbox"]');
        await input.setChecked(false);
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    });

    it('フォームコンテキストからエラーが設定されると error div がレンダリングされる', async () => {
        const fieldName = uniqueFieldName('checkbox-err');
        const TestParent = defineComponent({
            setup() {
                const { setFieldError } = useForm();
                onMounted(() => {
                    setFieldError(fieldName, 'エラーメッセージ');
                });
                return () => h(Checkbox, { name: fieldName });
            }
        });
        const wrapper = mount(TestParent);
        await nextTick();
        await nextTick();
        expect(wrapper.find('.error').exists()).toBe(true);
    });
});
