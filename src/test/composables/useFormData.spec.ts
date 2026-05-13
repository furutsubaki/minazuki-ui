import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { z } from 'zod';
import useFormData from '@/composables/useFormData';

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email()
});

type FormData = z.infer<typeof schema>;

describe('useFormData', () => {
    it('values が初期値を反映する', () => {
        let result: ReturnType<typeof useFormData<FormData>> | undefined;
        const TestComponent = defineComponent({
            setup() {
                result = useFormData<FormData>(schema, { name: 'テスト', email: 'test@example.com' });
                return () => h('div');
            }
        });
        mount(TestComponent);
        expect(result!.values.name).toBe('テスト');
        expect(result!.values.email).toBe('test@example.com');
    });

    it('setFieldValue でフィールド値が更新される', async () => {
        let result: ReturnType<typeof useFormData<FormData>> | undefined;
        const TestComponent = defineComponent({
            setup() {
                result = useFormData<FormData>(schema, { name: '', email: '' });
                return () => h('div');
            }
        });
        mount(TestComponent);
        await result!.setFieldValue('name', '更新後');
        expect(result!.values.name).toBe('更新後');
    });

    it('handleSubmit が関数として返される', () => {
        let result: ReturnType<typeof useFormData<FormData>> | undefined;
        const TestComponent = defineComponent({
            setup() {
                result = useFormData<FormData>(schema, {});
                return () => h('div');
            }
        });
        mount(TestComponent);
        expect(typeof result!.handleSubmit).toBe('function');
    });

    it('resetForm が関数として返される', () => {
        let result: ReturnType<typeof useFormData<FormData>> | undefined;
        const TestComponent = defineComponent({
            setup() {
                result = useFormData<FormData>(schema, {});
                return () => h('div');
            }
        });
        mount(TestComponent);
        expect(typeof result!.resetForm).toBe('function');
    });

    it('setValues でまとめてフィールド値が更新される', async () => {
        let result: ReturnType<typeof useFormData<FormData>> | undefined;
        const TestComponent = defineComponent({
            setup() {
                result = useFormData<FormData>(schema, { name: '', email: '' });
                return () => h('div');
            }
        });
        mount(TestComponent);
        await result!.setValues({ name: 'Alice', email: 'alice@example.com' });
        expect(result!.values.name).toBe('Alice');
        expect(result!.values.email).toBe('alice@example.com');
    });

    it('initialValues が null のとき initialValues なしで動作する', () => {
        let result: ReturnType<typeof useFormData<FormData>> | undefined;
        const TestComponent = defineComponent({
            setup() {
                result = useFormData<FormData>(schema, null as any);
                return () => h('div');
            }
        });
        mount(TestComponent);
        expect(typeof result!.handleSubmit).toBe('function');
    });

    it('canSubmit が computed として返され boolean を返す', () => {
        let result: ReturnType<typeof useFormData<FormData>> | undefined;
        const TestComponent = defineComponent({
            setup() {
                result = useFormData<FormData>(schema, { name: 'テスト', email: 'test@example.com' });
                return () => h('div');
            }
        });
        mount(TestComponent);
        expect(typeof result!.canSubmit.value).toBe('boolean');
    });
});
