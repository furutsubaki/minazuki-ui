import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { z } from 'zod';
import useFormData from '@/composables/useFormData';

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email()
});

type FormData = z.infer<typeof schema>;

function createFormHarness(initialValues?: Partial<FormData>) {
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

    it('initialValues を渡さない場合も正常に動作する', () => {
        const result = createFormHarness();
        expect(result.values).toBeDefined();
    });

    it('canSubmit がバリデーション失敗後に false になる', async () => {
        const result = createFormHarness({ name: '', email: '' });
        await result.handleSubmit(vi.fn())();
        expect(result.canSubmit.value).toBe(false);
    });

    it('canSubmit が有効な値入力後に true になる', async () => {
        const result = createFormHarness({ name: '', email: '' });
        await result.setValues({ name: 'Alice', email: 'alice@example.com' });
        expect(result.canSubmit.value).toBe(true);
    });

    it('handleSubmit がバリデーション成功時にコールバックを呼ぶ', async () => {
        const result = createFormHarness({ name: 'Alice', email: 'alice@example.com' });
        const cb = vi.fn();
        await result.handleSubmit(cb)();
        expect(cb).toHaveBeenCalled();
    });

    it('handleSubmit がバリデーション失敗時にコールバックを呼ばない', async () => {
        const result = createFormHarness({ name: '', email: '' });
        const cb = vi.fn();
        await result.handleSubmit(cb)();
        expect(cb).not.toHaveBeenCalled();
    });

    it('resetForm でフィールドが初期値に戻る', async () => {
        const result = createFormHarness({ name: 'Alice', email: 'alice@example.com' });
        await result.setFieldValue('name', '変更後');
        expect(result.values.name).toBe('変更後');
        result.resetForm();
        expect(result.values.name).toBe('Alice');
    });
});
