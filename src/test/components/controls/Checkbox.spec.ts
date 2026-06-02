import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import Checkbox from '@/components/controls/Checkbox.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

describe('Checkbox', () => {
    it('label が表示される', () => {
        const wrapper = mount(Checkbox, { props: { label: 'テストラベル' } });
        expect(wrapper.find('.label-placeholder').text()).toBe('テストラベル');
    });

    it('disabled が true のとき is-disabled クラスが付く', () => {
        const wrapper = mount(Checkbox, { props: { disabled: true } });
        expect(wrapper.find('.component-checkbox').classes()).toContain('is-disabled');
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Checkbox, { props: { [prop]: value } });
        expect(wrapper.find('.component-checkbox').classes()).toContain(value);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Checkbox, { slots: { default: '選択肢A' } });
        expect(wrapper.find('.text').text()).toBe('選択肢A');
    });

    it.each([
        [true, true, true],
        [false, true, false],
        ['apple', 'apple', true],
        [42, 42, true]
    ])('modelValue と value の一致で is-checked が制御される (modelValue=%s, value=%s)', (modelValue, value, shouldBeChecked) => {
        const wrapper = mount(Checkbox, { props: { modelValue, value } });
        const classes = wrapper.find('.component-checkbox').classes();
        if (shouldBeChecked) {
            expect(classes).toContain('is-checked');
        } else {
            expect(classes).not.toContain('is-checked');
        }
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

    it('input に setValue(true) すると update:modelValue が apple で emit される', async () => {
        const wrapper = mount(Checkbox, { props: { value: 'apple' } });
        const input = wrapper.find('input[type="checkbox"]');
        await input.setValue(true);
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple']);
    });

    it('input に setValue(false) すると update:modelValue が空文字で emit される', async () => {
        const wrapper = mount(Checkbox, { props: { value: 'apple', modelValue: 'apple' } });
        const input = wrapper.find('input[type="checkbox"]');
        await input.setValue(false);
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    });

    it('フォームコンテキストで touched かつエラーが設定されると error div がレンダリングされる', async () => {
        const fieldName = uniqueFieldName('checkbox-err');
        const TestParent = defineComponent({
            setup() {
                const { setFieldError, setFieldTouched } = useForm();
                onMounted(() => {
                    setFieldTouched(fieldName, true);
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

    it('literal(true) schema + initialValues 未指定でマウント直後はエラーが表示されない', () => {
        const schema = z.literal(true);
        const fieldName = uniqueFieldName('checkbox-no-err');
        const TestParent = defineComponent({
            setup() {
                useForm();
                return () => h(Checkbox, { name: fieldName, schema });
            }
        });
        const wrapper = mount(TestParent);
        expect(wrapper.find('.error').exists()).toBe(false);
    });

    it('エラーあり・未操作（not touched）ではエラーが表示されず、change 後（touched）に表示される', async () => {
        const schema = z.literal(true);
        const fieldName = uniqueFieldName('checkbox-touched-err');
        const TestParent = defineComponent({
            setup() {
                const { setFieldError } = useForm();
                onMounted(() => {
                    // バリデーション済みエラーがある状態を再現
                    setFieldError(fieldName, 'チェックしてください。');
                });
                return () => h(Checkbox, { name: fieldName, schema });
            }
        });
        const wrapper = mount(TestParent);
        await nextTick();
        await nextTick();
        // touched 前はエラーを表示しない
        expect(wrapper.find('.error').exists()).toBe(false);
        // ユーザーが操作（change → setTouched(true)）するとエラーが表示される
        await wrapper.find('input[type="checkbox"]').trigger('change');
        await nextTick();
        expect(wrapper.find('.error').exists()).toBe(true);
    });
});
