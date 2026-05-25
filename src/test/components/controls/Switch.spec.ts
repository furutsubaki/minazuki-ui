import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import Switch from '@/components/controls/Switch.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

describe('Switch', () => {
    it('label が label-placeholder に表示される', () => {
        const wrapper = mount(Switch, { props: { label: 'テストラベル' } });
        expect(wrapper.find('.label-placeholder').text()).toBe('テストラベル');
    });

    it('disabled が true のとき is-disabled クラスが付く', () => {
        const wrapper = mount(Switch, { props: { disabled: true } });
        expect(wrapper.find('.component-switch').classes()).toContain('is-disabled');
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Switch, { props: { [prop]: value } });
        expect(wrapper.find('.component-switch').classes()).toContain(value);
    });

    it.each([
        [true, true],
        [false, false]
    ])('modelValue=%s のとき is-checked が %s', (modelValue, shouldBeChecked) => {
        const wrapper = mount(Switch, { props: { modelValue, value: true } });
        const classes = wrapper.find('.component-switch').classes();
        if (shouldBeChecked) {
            expect(classes).toContain('is-checked');
        } else {
            expect(classes).not.toContain('is-checked');
        }
    });

    it('required が true かつ label なしのとき .text に required クラスが付く', () => {
        const wrapper = mount(Switch, { props: { required: true }, slots: { default: '設定' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('ZodLiteral schema が設定されると isRequired が true になる', () => {
        const schema = z.literal(true);
        const wrapper = mount(Switch, { props: { schema }, slots: { default: '設定' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('isErrorMessage が false のとき error コンテナがレンダリングされない', () => {
        const wrapper = mount(Switch, { props: { isErrorMessage: false } });
        expect(wrapper.find('.error').exists()).toBe(false);
    });

    it('checked 時に switchIconTrue slot が表示される', () => {
        const wrapper = mount(Switch, {
            props: { modelValue: true, value: true },
            slots: { switchIconTrue: '<span class="on-icon">ON</span>' }
        });
        expect(wrapper.find('.switch-icon-true').exists()).toBe(true);
    });

    it('unchecked 時に switchIconFalse slot が表示される', () => {
        const wrapper = mount(Switch, {
            props: { modelValue: false, value: true },
            slots: { switchIconFalse: '<span class="off-icon">OFF</span>' }
        });
        expect(wrapper.find('.switch-icon-false').exists()).toBe(true);
    });

    it.each([
        [true, { value: true }],
        [false, { value: true, modelValue: true }]
    ])('input に setValue(%s) すると update:modelValue が emit される', async (checked, props) => {
        const wrapper = mount(Switch, { props });
        await wrapper.find('input[type="checkbox"]').setValue(checked);
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('フォームコンテキストからエラーが設定されると error div がレンダリングされる', async () => {
        const fieldName = uniqueFieldName('switch-err');
        const TestParent = defineComponent({
            setup() {
                const { setFieldError } = useForm();
                onMounted(() => {
                    setFieldError(fieldName, 'エラーメッセージ');
                });
                return () => h(Switch, { name: fieldName });
            }
        });
        const wrapper = mount(TestParent);
        await nextTick();
        await nextTick();
        expect(wrapper.find('.error').exists()).toBe(true);
    });

    it('フォームが非 null 初期値を持つとき fieldVal 初期化がスキップされる', async () => {
        const fieldName = uniqueFieldName('switch-forminit');
        const TestParent = defineComponent({
            setup() {
                useForm({ initialValues: { [fieldName]: true } });
                return () => h(Switch, { name: fieldName, value: true });
            }
        });
        const wrapper = mount(TestParent);
        await nextTick();
        expect(wrapper.find('.component-switch').classes()).toContain('is-checked');
    });
});
