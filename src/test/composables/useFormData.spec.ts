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

function createFormHarness(initialValues: Partial<FormData>) {
    let result: ReturnType<typeof useFormData<FormData>> | undefined;
    mount(defineComponent({
        setup() {
            result = useFormData<FormData>(schema, initialValues as FormData);
            return () => h('div');
        }
    }));
    return result!;
}

describe('useFormData', () => {
    it('values が初期値を反映する', () => {
        const result = createFormHarness({ name: 'テスト', email: 'test@example.com' });
        expect(result.values.name).toBe('テスト');
        expect(result.values.email).toBe('test@example.com');
    });

    it('setFieldValue でフィールド値が更新される', async () => {
        const result = createFormHarness({ name: '', email: '' });
        await result.setFieldValue('name', '更新後');
        expect(result.values.name).toBe('更新後');
    });

    it('setValues でまとめてフィールド値が更新される', async () => {
        const result = createFormHarness({ name: '', email: '' });
        await result.setValues({ name: 'Alice', email: 'alice@example.com' });
        expect(result.values.name).toBe('Alice');
        expect(result.values.email).toBe('alice@example.com');
    });
});
