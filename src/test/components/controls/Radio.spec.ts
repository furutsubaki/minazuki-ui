import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import Radio from '@/components/controls/Radio.vue';

describe('Radio', () => {
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(Radio);
        expect(wrapper.find('.component-radio').exists()).toBe(true);
    });

    it('label が表示される', () => {
        const wrapper = mount(Radio, { props: { label: 'テストラベル' } });
        expect(wrapper.find('.label-placeholder').text()).toBe('テストラベル');
    });

    it('disabled が true のとき is-disabled クラスが付く', () => {
        const wrapper = mount(Radio, { props: { disabled: true } });
        expect(wrapper.find('.component-radio').classes()).toContain('is-disabled');
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Radio, { props: { variant: 'danger' } });
        expect(wrapper.find('.component-radio').classes()).toContain('danger');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Radio, { props: { size: 'large' } });
        expect(wrapper.find('.component-radio').classes()).toContain('large');
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Radio, { slots: { default: '選択肢A' } });
        expect(wrapper.find('.text').text()).toBe('選択肢A');
    });

    it('modelValue が value と等しいとき is-checked クラスが付く', () => {
        const wrapper = mount(Radio, {
            props: { modelValue: true, value: true }
        });
        expect(wrapper.find('.component-radio').classes()).toContain('is-checked');
    });

    it('modelValue が value と異なるとき is-checked クラスが付かない', () => {
        const wrapper = mount(Radio, {
            props: { modelValue: false, value: true }
        });
        expect(wrapper.find('.component-radio').classes()).not.toContain('is-checked');
    });

    it('required が true かつ label なしのとき .text に required クラスが付く', () => {
        const wrapper = mount(Radio, { props: { required: true }, slots: { default: '選択肢' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('required が true のとき .label-placeholder が表示される', () => {
        const wrapper = mount(Radio, { props: { required: true } });
        expect(wrapper.find('.label-placeholder').exists()).toBe(true);
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

    it('value が string のとき modelValue と一致すると is-checked になる', () => {
        const wrapper = mount(Radio, { props: { value: 'apple', modelValue: 'apple' } });
        expect(wrapper.find('.component-radio').classes()).toContain('is-checked');
    });

    it('value が number のとき modelValue と一致すると is-checked になる', () => {
        const wrapper = mount(Radio, { props: { value: 42, modelValue: 42 } });
        expect(wrapper.find('.component-radio').classes()).toContain('is-checked');
    });

    it('input に trigger("change") すると onChange が呼ばれる (未選択→選択)', async () => {
        const wrapper = mount(Radio, { props: { value: 'apple' } });
        const input = wrapper.find('input[type="radio"]');
        (input.element as HTMLInputElement).checked = true;
        await input.trigger('change');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('input に trigger("change") すると onChange が呼ばれる', async () => {
        const wrapper = mount(Radio, { props: { value: 'apple', modelValue: 'apple' } });
        const input = wrapper.find('input[type="radio"]');
        await input.trigger('change');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('フォームコンテキストからエラーが設定されると error div がレンダリングされる', async () => {
        const fieldName = `radio-err-${Math.random()}`;
        const TestParent = defineComponent({
            setup() {
                const { setFieldError } = useForm();
                onMounted(() => {
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
