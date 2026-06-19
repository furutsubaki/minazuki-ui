import { describe, it, expect, beforeAll } from 'vitest';
import { z } from 'zod';
import initValidate, { jaErrorMap } from '@/plugins/init-validate';

function msg(schema: z.ZodTypeAny, input: unknown): string {
    const result = schema.safeParse(input);
    if (result.success) throw new Error('Expected validation to fail');
    return result.error.errors[0].message;
}

describe('init-validate', () => {
    beforeAll(() => {
        initValidate();
    });

    it('再呼び出しでもエラーにならない', () => {
        expect(() => initValidate()).not.toThrow();
        expect(msg(z.string().min(1), '')).toBe('この項目は必須項目です');
    });

    describe('invalid_type', () => {
        it.each([
            [z.string(), null, 'この項目は必須項目です'],
            [z.string(), undefined, 'この項目は必須項目です'],
            [z.number(), '', 'この項目は必須項目です'],
            [z.string(), 123, '文字列での入力を期待していますが、数値が入力されました']
        ])('schema=%o, input=%o → %s', (schema, input, expected) => {
            expect(msg(schema, input)).toBe(expected);
        });
    });

    describe('invalid_literal', () => {
        it.each([
            [z.literal(true), false, 'チェックしてください'],
            [z.literal(true), 1, '無効なリテラル値です。trueを入力してください']
        ])('schema=%o, input=%o → %s', (schema, input, expected) => {
            expect(msg(schema, input)).toBe(expected);
        });
    });

    describe('unrecognized_keys', () => {
        it('余分なキーを検出する', () => {
            const schema = z.object({}).strict();
            expect(msg(schema, { a: 1 })).toBe("オブジェクトのキー'a'が識別できません");
        });
    });

    describe('invalid_union', () => {
        it('union 不一致', () => {
            const schema = z.union([z.string(), z.number()]);
            expect(msg(schema, true)).toBe('入力形式が間違っています');
        });
    });

    describe('invalid_union_discriminator', () => {
        it('discriminated union 不一致', () => {
            const schema = z.discriminatedUnion('type', [
                z.object({ type: z.literal('a'), v: z.string() }),
                z.object({ type: z.literal('b'), v: z.number() })
            ]);
            expect(msg(schema, { type: 'c' })).toBe("無効な識別子です。'a', 'b'で入力してください");
        });
    });

    describe('invalid_enum_value', () => {
        it('enum 不一致', () => {
            const schema = z.enum(['x', 'y']);
            expect(msg(schema, 'z')).toBe("'z'は無効な値です。'x', 'y'で入力してください");
        });
    });

    describe('invalid_date', () => {
        it('不正な日時', () => {
            const schema = z.date();
            expect(msg(schema, new Date('invalid'))).toBe('間違った日時データです');
        });
    });

    describe('invalid_string', () => {
        it.each([
            [z.string().email(), 'bad', 'メールアドレスの形式で入力してください'],
            [z.string().url(), 'bad', 'URLの形式で入力してください'],
            [z.string().uuid(), 'bad', 'UUIDの形式で入力してください'],
            [z.string().cuid(), 'bad', 'CUIDの形式で入力してください'],
            [z.string().datetime(), 'bad', '日時の形式で入力してください'],
            [z.string().regex(/^\d+$/), 'abc', '入力形式が間違っています'],
            [z.string().includes('foo'), 'bar', '"foo"を含む文字列である必要があります'],
            [z.string().startsWith('foo'), 'bar', '"foo"で始まる文字列である必要があります'],
            [z.string().endsWith('foo'), 'bar', '"foo"で終わる文字列である必要があります']
        ])('schema=%o, input=%s → %s', (schema, input, expected) => {
            expect(msg(schema, input)).toBe(expected);
        });
    });

    describe('too_small', () => {
        it.each([
            [z.string().min(1), '', 'この項目は必須項目です'],
            [z.string().min(3), 'ab', '3文字以上の文字列である必要があります'],
            [z.string().length(5), 'ab', '5文字の文字列である必要があります'],
            [z.number().gte(5), 3, '5以上の数値である必要があります'],
            [z.number().gt(5), 5, '5より大きな数値である必要があります'],
            [z.bigint().min(5n), 3n, '5以上の数値である必要があります'],
            [z.array(z.string()).min(2), ['a'], '2個以上の要素が必要です'],
            [z.array(z.string()).length(3), ['a'], '3個の要素が必要です'],
            [z.set(z.string()).min(2), new Set(['a']), '入力形式が間違っています']
        ])('schema=%o, input=%o → %s', (schema, input, expected) => {
            expect(msg(schema, input)).toBe(expected);
        });

        it('number exact', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_small, minimum: 5, inclusive: true, exact: true, type: 'number', path: [], message: '' },
                { data: 3, defaultError: '' }
            );
            expect(result.message).toBe('5の数値である必要があります');
        });

        it('array not_inclusive', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_small, minimum: 2, inclusive: false, type: 'array', path: [], message: '' },
                { data: [1], defaultError: '' }
            );
            expect(result.message).toBe('2個より多くの要素が必要です');
        });

        it('date inclusive', () => {
            const minDate = new Date('2024-01-01T00:00:00Z');
            const schema = z.date().min(minDate);
            expect(msg(schema, new Date('2023-01-01'))).toMatch(/以降の日時である必要があります$/);
        });

        it('date exact', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_small, minimum: new Date('2024-01-01').getTime(), inclusive: true, exact: true, type: 'date', path: [], message: '' },
                { data: null, defaultError: '' }
            );
            expect(result.message).toMatch(/の日時である必要があります$/);
        });

        it('date not_inclusive', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_small, minimum: new Date('2024-01-01').getTime(), inclusive: false, type: 'date', path: [], message: '' },
                { data: null, defaultError: '' }
            );
            expect(result.message).toMatch(/よりも後の日時である必要があります$/);
        });

        it('string not_inclusive', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_small, minimum: 3, inclusive: false, type: 'string', path: [], message: '' },
                { data: 'ab', defaultError: '' }
            );
            expect(result.message).toBe('3文字より長い文字列である必要があります');
        });

        it('bigint exact', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_small, minimum: 5, inclusive: true, exact: true, type: 'bigint', path: [], message: '' },
                { data: 3n, defaultError: '' }
            );
            expect(result.message).toBe('5の数値である必要があります');
        });

        it('bigint not_inclusive', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_small, minimum: 5, inclusive: false, type: 'bigint', path: [], message: '' },
                { data: 3n, defaultError: '' }
            );
            expect(result.message).toBe('5より大きな数値である必要があります');
        });
    });

    describe('too_big', () => {
        it.each([
            [z.string().max(2), 'abcd', '2文字以下の文字列である必要があります'],
            [z.string().length(2), 'abcd', '2文字の文字列である必要があります'],
            [z.number().lte(5), 10, '5以下の数値である必要があります'],
            [z.number().lt(5), 5, '5より小さな数値である必要があります'],
            [z.bigint().max(5n), 10n, '5以下の数値である必要があります'],
            [z.array(z.string()).max(1), ['a', 'b'], '1個以下の要素である必要があります'],
            [z.array(z.string()).length(1), ['a', 'b'], '1個の要素である必要があります'],
            [z.set(z.string()).max(1), new Set(['a', 'b']), '入力形式が間違っています']
        ])('schema=%o, input=%o → %s', (schema, input, expected) => {
            expect(msg(schema, input)).toBe(expected);
        });

        it('string not_inclusive', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_big, maximum: 3, inclusive: false, type: 'string', path: [], message: '' },
                { data: 'abcd', defaultError: '' }
            );
            expect(result.message).toBe('3文字より短い文字列である必要があります');
        });

        it('number exact', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_big, maximum: 5, inclusive: true, exact: true, type: 'number', path: [], message: '' },
                { data: 10, defaultError: '' }
            );
            expect(result.message).toBe('5の数値である必要があります');
        });

        it('array not_inclusive', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_big, maximum: 2, inclusive: false, type: 'array', path: [], message: '' },
                { data: [1, 2, 3], defaultError: '' }
            );
            expect(result.message).toBe('2個より少ない要素である必要があります');
        });

        it('date inclusive', () => {
            const maxDate = new Date('2024-01-01T00:00:00Z');
            const schema = z.date().max(maxDate);
            expect(msg(schema, new Date('2025-01-01'))).toMatch(/以前の日時である必要があります$/);
        });

        it('date exact', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_big, maximum: new Date('2024-01-01').getTime(), inclusive: true, exact: true, type: 'date', path: [], message: '' },
                { data: null, defaultError: '' }
            );
            expect(result.message).toMatch(/の日時である必要があります$/);
        });

        it('date not_inclusive', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_big, maximum: new Date('2024-01-01').getTime(), inclusive: false, type: 'date', path: [], message: '' },
                { data: null, defaultError: '' }
            );
            expect(result.message).toMatch(/よりも前の日時である必要があります$/);
        });

        it('bigint exact', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_big, maximum: 5, inclusive: true, exact: true, type: 'bigint', path: [], message: '' },
                { data: 10n, defaultError: '' }
            );
            expect(result.message).toBe('5の数値である必要があります');
        });

        it('bigint not_inclusive', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.too_big, maximum: 5, inclusive: false, type: 'bigint', path: [], message: '' },
                { data: 10n, defaultError: '' }
            );
            expect(result.message).toBe('5より小さな数値である必要があります');
        });
    });

    describe('custom', () => {
        it('refine 失敗', () => {
            const schema = z.string().refine(() => false);
            expect(msg(schema, 'hello')).toBe('入力形式が間違っています');
        });
    });

    describe('not_multiple_of', () => {
        it('倍数チェック', () => {
            const schema = z.number().multipleOf(3);
            expect(msg(schema, 7)).toBe('3の倍数である必要があります');
        });
    });

    describe('not_finite', () => {
        it('有限数チェック', () => {
            const schema = z.number().finite();
            expect(msg(schema, Infinity)).toBe('有限数である必要があります');
        });
    });

    describe('jaErrorMap 直接呼び出し', () => {
        it('invalid_arguments', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.invalid_arguments, argumentsError: new z.ZodError([]), path: [], message: '' },
                { data: null, defaultError: '' }
            );
            expect(result.message).toBe('引数が間違っています');
        });

        it('invalid_return_type', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.invalid_return_type, returnTypeError: new z.ZodError([]), path: [], message: '' },
                { data: null, defaultError: '' }
            );
            expect(result.message).toBe('返値の型が間違っています');
        });

        it('invalid_intersection_types', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.invalid_intersection_types, path: [], message: '' },
                { data: null, defaultError: '' }
            );
            expect(result.message).toBe('交差型のマージができませんでした');
        });

        it('invalid_type で未知の型ラベルはそのまま出力される', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.invalid_type, expected: 'custom_type' as z.ZodParsedType, received: 'custom_received' as z.ZodParsedType, path: [], message: '' },
                { data: 42, defaultError: '' }
            );
            expect(result.message).toBe('custom_typeでの入力を期待していますが、custom_receivedが入力されました');
        });

        it('invalid_string で未知のオブジェクト validation はフォールバック', () => {
            const result = jaErrorMap(
                { code: z.ZodIssueCode.invalid_string, validation: { unknown: true } as never, path: [], message: '' },
                { data: 'test', defaultError: '' }
            );
            expect(result.message).toBe('入力形式が間違っています');
        });

        it('未知のコードは defaultError を返す', () => {
            const result = jaErrorMap(
                { code: 'unknown_code', path: [], message: '' } as unknown as z.ZodIssueOptionalMessage,
                { data: null, defaultError: 'fallback' }
            );
            expect(result.message).toBe('fallback');
        });
    });
});
