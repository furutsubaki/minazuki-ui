import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick, onMounted } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { useForm } from 'vee-validate';
import Switch from '@/components/controls/Switch.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

describe('Switch', () => {
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(Switch);
        expect(wrapper.find('.component-switch').exists()).toBe(true);
    });

    it('label が label-placeholder に表示される', () => {
        const wrapper = mount(Switch, { props: { label: 'テストラベル' } });
        expect(wrapper.find('.label-placeholder').text()).toBe('テストラベル');
    });

    it('disabled が true のとき is-disabled クラスが付く', () => {
        const wrapper = mount(Switch, { props: { disabled: true } });
        expect(wrapper.find('.component-switch').classes()).toContain('is-disabled');
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Switch, { props: { variant: 'danger' } });
        expect(wrapper.find('.component-switch').classes()).toContain('danger');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Switch, { props: { size: 'large' } });
        expect(wrapper.find('.component-switch').classes()).toContain('large');
    });

    it('modelValue が true のとき is-checked クラスが付く', () => {
        const wrapper = mount(Switch, {
            props: { modelValue: true, value: true }
        });
        expect(wrapper.find('.component-switch').classes()).toContain('is-checked');
    });

    it('modelValue が false のとき is-checked クラスが付かない', () => {
        const wrapper = mount(Switch, {
            props: { modelValue: false, value: true }
        });
        expect(wrapper.find('.component-switch').classes()).not.toContain('is-checked');
    });

    it('required が true かつ label なしのとき .text に required クラスが付く', () => {
        const wrapper = mount(Switch, { props: { required: true }, slots: { default: '設定' } });
        expect(wrapper.find('.text.required').exists()).toBe(true);
    });

    it('required が true のとき .label-placeholder が表示される', () => {
        const wrapper = mount(Switch, { props: { required: true } });
        expect(wrapper.find('.label-placeholder').exists()).toBe(true);
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

    it('input に setChecked(true) すると onChange が呼ばれる', async () => {
        const wrapper = mount(Switch, { props: { value: true } });
        const input = wrapper.find('input[type="checkbox"]');
        await input.setChecked(true);
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('input に setChecked(false) すると onChange が false で呼ばれる', async () => {
        const wrapper = mount(Switch, { props: { value: true, modelValue: true } });
        const input = wrapper.find('input[type="checkbox"]');
        await input.setChecked(false);
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
