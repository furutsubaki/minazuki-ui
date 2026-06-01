import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import Radio from '@/components/controls/Radio.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

describe('Radio', () => {
    it('label が表示される', () => {
        const wrapper = mount(Radio, { props: { label: 'テストラベル' } });
        expect(wrapper.find('.label-placeholder').text()).toBe('テストラベル');
    });

    it('disabled が true のとき is-disabled クラスが付く', () => {
        const wrapper = mount(Radio, { props: { disabled: true } });
        expect(wrapper.find('.component-radio').classes()).toContain('is-disabled');
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Radio, { props: { [prop]: value } });
        expect(wrapper.find('.component-radio').classes()).toContain(value);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Radio, { slots: { default: '選択肢A' } });
        expect(wrapper.find('.text').text()).toBe('選択肢A');
    });

    it.each([
        [true, true, true],
        [false, true, false],
        ['apple', 'apple', true],
        [42, 42, true]
    ])('modelValue と value の一致で is-checked が制御される (modelValue=%s, value=%s)', (modelValue, value, shouldBeChecked) => {
        const wrapper = mount(Radio, { props: { modelValue, value } });
        const classes = wrapper.find('.component-radio').classes();
        if (shouldBeChecked) {
            expect(classes).toContain('is-checked');
        } else {
            expect(classes).not.toContain('is-checked');
        }
    });

    it('required が true かつ label なしのとき .text に required クラスが付く', () => {
        const wrapper = mount(Radio, { props: { required: true }, slots: { default: '選択肢' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('label があり required が true のとき .label-placeholder に required クラスが付く', () => {
        const wrapper = mount(Radio, { props: { required: true, label: 'テスト' } });
        expect(wrapper.find('.label-placeholder.required').exists()).toBe(true);
    });

    it('ZodString.min(1) schema が設定されると isRequired が true になる', () => {
        const schema = z.string().min(1);
        const wrapper = mount(Radio, { props: { schema, value: 'test' }, slots: { default: '選択肢' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('isErrorMessage が false のとき error コンテナがレンダリングされない', () => {
        const wrapper = mount(Radio, { props: { isErrorMessage: false } });
        expect(wrapper.find('.error').exists()).toBe(false);
    });

    it('input に trigger("change") すると onChange が呼ばれる', async () => {
        const wrapper = mount(Radio, { props: { value: 'apple' } });
        const input = wrapper.find('input[type="radio"]');
        (input.element as HTMLInputElement).checked = true;
        await input.trigger('change');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('フォームコンテキストで touched かつエラーが設定されると error div がレンダリングされる', async () => {
        const fieldName = uniqueFieldName('radio-err');
        const TestParent = defineComponent({
            setup() {
                const { setFieldError, setFieldTouched } = useForm();
                onMounted(() => {
                    setFieldTouched(fieldName, true);
                    setFieldError(fieldName, 'エラーメッセージ');
                });
                return () => h(Radio, { name: fieldName });
            }
        });
        const wrapper = mount(TestParent);
        await nextTick();
        await nextTick();
        expect(wrapper.find('.error').exists()).toBe(true);
    });

    it('schema + initialValues 未指定でマウント直後はエラーが表示されない', () => {
        const schema = z.string().min(1);
        const fieldName = uniqueFieldName('radio-no-err');
        const TestParent = defineComponent({
            setup() {
                useForm();
                return () => h(Radio, { name: fieldName, schema, value: 'apple' });
            }
        });
        const wrapper = mount(TestParent);
        expect(wrapper.find('.error').exists()).toBe(false);
    });

    it('エラーあり・未操作（not touched）ではエラーが表示されず、change 後（touched）に表示される', async () => {
        const schema = z.string().min(1);
        const fieldName = uniqueFieldName('radio-touched-err');
        const TestParent = defineComponent({
            setup() {
                const { setFieldError } = useForm();
                onMounted(() => {
                    setFieldError(fieldName, '選択してください。');
                });
                return () => h(Radio, { name: fieldName, schema, value: 'apple' });
            }
        });
        const wrapper = mount(TestParent);
        await nextTick();
        await nextTick();
        expect(wrapper.find('.error').exists()).toBe(false);
        const input = wrapper.find('input[type="radio"]');
        (input.element as HTMLInputElement).checked = true;
        await input.trigger('change');
        await nextTick();
        expect(wrapper.find('.error').exists()).toBe(true);
    });

    it('checked が false→true に変わったとき watch コールバックが model を props.value に更新する', async () => {
        const wrapper = mount(Radio, { props: { value: 'apple' } });
        // fieldVal は未設定, checked = false
        const input = wrapper.find('input[type="radio"]');
        (input.element as HTMLInputElement).checked = true;
        await input.trigger('change');
        await nextTick();
        // onChange: !true=false → val='apple' → handleChange('apple') → checked=true
        // watch: flg=true → model.value = props.value = 'apple'
        expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['apple']);
    });

    it('checked が true→false に変わったとき watch コールバックが model を unCheckValue に更新する', async () => {
        const wrapper = mount(Radio, { props: { value: 'apple', modelValue: 'apple' } });
        await nextTick();
        // fieldVal='apple', checked=true
        const input = wrapper.find('input[type="radio"]');
        (input.element as HTMLInputElement).checked = false;
        await input.trigger('change');
        await nextTick();
        // onChange: !false=true → val=unCheckValue='' → handleChange('') → checked=false
        // watch: flg=false → model.value = unCheckValue = ''
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    });
});
