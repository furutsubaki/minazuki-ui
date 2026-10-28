import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { z } from 'zod';
import { useField } from 'vee-validate';
import useFormData from '@/composables/useFormData';

const schema = z.object({
    name: z.string().min(1),
    email: z.string().email()
});

type FormData = z.infer<typeof schema>;

function mountForm<R>(setup: () => R): R {
    let result: R | undefined;
    mount(defineComponent({
        setup() {
            result = setup();
            return () => h('div');
        }
    }));
    return result!;
}

function createFormHarness(initialValues?: Partial<FormData>) {
    return mountForm(() => useFormData(schema, initialValues as FormData));
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

    it('handleSubmit の成功値は transform 後の出力になる', async () => {
        const transformed = z.object({ name: z.string() }).transform((v) => ({ ...v, upper: v.name.toUpperCase() }));
        const result = mountForm(() => useFormData(transformed, { name: 'abc' }));
        const cb = vi.fn((values: { name: string; upper: string }) => values);
        await result.handleSubmit(cb)();
        expect(cb.mock.calls[0][0]).toEqual({ name: 'abc', upper: 'ABC' });
    });

    it('ルートの z.preprocess() も受け取れる', async () => {
        const preprocessed = z.preprocess((v) => v, z.object({ name: z.string().min(1) }));
        const result = mountForm(() => useFormData(preprocessed, { name: 'a' }));
        const cb = vi.fn();
        await result.handleSubmit(cb)();
        expect(cb).toHaveBeenCalled();
    });

    it('非同期 refine を含むスキーマでも初期化と resetForm ができる', async () => {
        const asyncSchema = z.object({ name: z.string().min(1) }).refine(async () => true);
        const result = mountForm(() => useFormData(asyncSchema, { name: '' }));
        await result.setFieldValue('name', 'x');
        result.resetForm();
        expect(result.values.name).toBe('');
    });

    it('部分的な initialValues にネストした .default() が補われる', () => {
        const defaulted = z.object({
            name: z.string().min(1),
            settings: z.object({ lang: z.string().default('ja') })
        });
        const result = mountForm(() => useFormData(defaulted, { name: '' }));
        expect(result.values).toEqual({ name: '', settings: { lang: 'ja' } });
    });

    it('__proto__ を含む初期値でも初期化で Object.prototype を汚染しない', () => {
        const initial = JSON.parse('{"name":"","__proto__":{"polluted":"yes"}}');
        mountForm(() => useFormData(schema, initial));
        expect(({} as Record<string, unknown>).polluted).toBeUndefined();
    });

    it('トップレベルの . を含むキーは [a.b] の name で読み書き・検証・送信できる', async () => {
        const dotted = z.object({ 'a.b': z.string().min(1) });
        let field: ReturnType<typeof useField<string>> | undefined;
        const form = mountForm(() => {
            const f = useFormData(dotted, { 'a.b': '' });
            field = useField<string>('[a.b]');
            return f;
        });
        const cb = vi.fn();
        await form.handleSubmit(cb)();
        expect(cb).not.toHaveBeenCalled();
        expect(field!.errorMessage.value).toBeTruthy();
        field!.value.value = 'x';
        await form.handleSubmit(cb)();
        expect(cb.mock.calls[0][0]).toEqual({ 'a.b': 'x' });
    });

    it('型の変わる transform でも未編集のまま送信でき、resetForm 後も送信できる', async () => {
        const numeric = z.object({ n: z.string().transform(Number) });
        const form = mountForm(() => useFormData(numeric, { n: '1' }));
        expect(form.values.n).toBe('1');
        const cb = vi.fn();
        await form.handleSubmit(cb)();
        expect(cb.mock.calls[0][0]).toEqual({ n: 1 });
        form.resetForm();
        expect(form.values.n).toBe('1');
        await form.handleSubmit(cb)();
        expect(cb).toHaveBeenCalledTimes(2);
    });

    it('ルートの z.preprocess() でも既定値が初期値と resetForm に入る', () => {
        const preprocessed = z.preprocess((v) => v, z.object({ name: z.string().min(1), lang: z.string().default('ja') }));
        const form = mountForm(() => useFormData(preprocessed, { name: '' }));
        expect(form.values).toEqual({ name: '', lang: 'ja' });
        form.resetForm();
        expect(form.values).toEqual({ name: '', lang: 'ja' });
    });
});
