import { describe, it, expect } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { useForm } from 'vee-validate';
import { useCheckableField } from '@/composables/useCheckableField';

function createHarness<T>(fieldName: string, type: 'checkbox' | 'radio', checkedValue: T, uncheckedValue: T) {
    let result: ReturnType<typeof useCheckableField<T>> | undefined;
    mount(
        defineComponent({
            setup() {
                useForm();
                result = useCheckableField(fieldName, type, checkedValue, uncheckedValue) as ReturnType<
                    typeof useCheckableField<T>
                >;
                return () => h('div');
            }
        })
    );
    return result!;
}

describe('useCheckableField', () => {
    it('value / checked / errors / meta / onFieldChange が返される', () => {
        const result = createHarness('field', 'checkbox', true, false);
        expect(result.value).toBeDefined();
        expect(result.checked).toBeDefined();
        expect(result.errors).toBeDefined();
        expect(result.meta).toBeDefined();
        expect(result.onFieldChange).toBeTypeOf('function');
    });

    it('初期状態では meta.touched が false', () => {
        const result = createHarness('field-touched-init', 'checkbox', true, false);
        expect(result.meta.touched).toBe(false);
    });

    it('onFieldChange を呼ぶと meta.touched が true になる', async () => {
        const result = createHarness('field-touched', 'checkbox', true, false);
        result.onFieldChange(true);
        await nextTick();
        expect(result.meta.touched).toBe(true);
    });

    it('onFieldChange(checkedValue) を呼ぶと value が checkedValue になる', async () => {
        const result = createHarness('field-val', 'checkbox', 'apple', '');
        result.onFieldChange('apple');
        await nextTick();
        expect(result.value.value).toBe('apple');
    });

    it('onFieldChange(uncheckedValue) を呼ぶと value が uncheckedValue になる', async () => {
        const result = createHarness('field-uncheck', 'checkbox', 'apple', '');
        result.onFieldChange('apple');
        await nextTick();
        result.onFieldChange('');
        await nextTick();
        expect(result.value.value).toBe('');
    });

    it('type: radio でも正しく動作する', async () => {
        const result = createHarness('field-radio', 'radio', 'yes', '');
        result.onFieldChange('yes');
        await nextTick();
        expect(result.meta.touched).toBe(true);
        expect(result.value.value).toBe('yes');
    });
});
