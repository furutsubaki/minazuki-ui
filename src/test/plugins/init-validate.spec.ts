import { describe, it, expect, beforeAll } from 'vitest';
import { z } from 'zod';
import initValidate from '@/plugins/init-validate';

describe('init-validate', () => {
    beforeAll(() => {
        initValidate();
    });

    it.each([
        [z.literal(true), false, 'チェックしてください。', true],
        [z.string().min(1), '', 'この項目は必須項目です。', true],
        [z.string(), null, 'この項目は必須項目です。', true],
        [z.literal(true), 1, 'チェックしてください。', false],
        [z.string().min(2), 'a', 'この項目は必須項目です。', false],
        [z.string(), 123, 'この項目は必須項目です。', false]
    ])('schema=%o, input=%o のとき message が期待通り', (schema, input, expectedMessage, shouldMatch) => {
        const result = (schema as z.ZodTypeAny).safeParse(input);
        expect(result.success).toBe(false);
        if (!result.success) {
            if (shouldMatch) {
                expect(result.error.errors[0].message).toBe(expectedMessage);
            } else {
                expect(result.error.errors[0].message).not.toBe(expectedMessage);
            }
        }
    });
});
