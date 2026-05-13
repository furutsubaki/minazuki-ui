import { describe, it, expect, beforeAll } from 'vitest';
import { z } from 'zod';
import initValidate from '@/plugins/init-validate';

describe('init-validate', () => {
    beforeAll(() => {
        initValidate();
    });

    it('invalid_literal で必須チェックエラーになる', () => {
        const schema = z.literal(true);
        const result = schema.safeParse(false);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('チェックしてください。');
        }
    });

    it('min(1) で必須エラーになる', () => {
        const schema = z.string().min(1);
        const result = schema.safeParse('');
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('この項目は必須項目です。');
        }
    });

    it('invalid_type で null を渡すと必須エラーになる', () => {
        const schema = z.string();
        const result = schema.safeParse(null);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('この項目は必須項目です。');
        }
    });

    it('通常のバリデーションエラーでも成功しない', () => {
        const schema = z.string().min(5);
        const result = schema.safeParse('ab');
        expect(result.success).toBe(false);
    });

    it('invalid_literal で received が truthy のとき zodI18nMap にフォールスルーする', () => {
        const schema = z.literal(true);
        const result = schema.safeParse(1);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).not.toBe('チェックしてください。');
        }
    });

    it('min(2) の場合は必須エラーではなく通常エラーになる', () => {
        const schema = z.string().min(2);
        const result = schema.safeParse('a');
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).not.toBe('この項目は必須項目です。');
        }
    });

    it('invalid_type で数値を渡すと zodI18nMap にフォールスルーする', () => {
        const schema = z.string();
        const result = schema.safeParse(123);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).not.toBe('この項目は必須項目です。');
        }
    });
});
