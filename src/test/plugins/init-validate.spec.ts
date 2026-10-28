import { describe, it, expect, beforeAll } from 'vitest';
import { z } from 'zod';
import initValidate, { jaErrorMap } from '@/plugins/init-validate';

function msg(schema: z.ZodType, input: unknown): string {
    const result = schema.safeParse(input);
    if (result.success) throw new Error('Expected validation to fail');
    return result.error.issues[0].message;
}

const call = (issue: Record<string, unknown>) => jaErrorMap(issue as unknown as z.core.$ZodRawIssue);

describe('init-validate', () => {
    beforeAll(() => {
        initValidate();
    });

    it('再呼び出しでもエラーにならない', () => {
        expect(() => initValidate()).not.toThrow();
        expect(msg(z.string().min(1), '')).toBe('この項目は必須項目です');
    });

    it('別の customError で上書きされても再度呼べば日本語に戻る', () => {
        z.config({ customError: () => 'overwritten' });
        expect(msg(z.string().min(1), '')).toBe('overwritten');
        initValidate();
        expect(msg(z.string().min(1), '')).toBe('この項目は必須項目です');
    });

    describe('invalid_type', () => {
        it.each([
            [z.string(), null, 'この項目は必須項目です'],
            [z.string(), undefined, 'この項目は必須項目です'],
            [z.number(), '', 'この項目は必須項目です'],
            [z.string(), 123, '文字列での入力を期待していますが、数値が入力されました'],
            [z.number(), NaN, '数値での入力を期待していますが、NaNが入力されました'],
            [z.number(), Infinity, '有限数である必要があります'],
            [z.number().int(), 1.5, '整数での入力を期待していますが、数値が入力されました'],
            [z.string(), [], '文字列での入力を期待していますが、配列が入力されました'],
            [z.string(), new Map(), '文字列での入力を期待していますが、マップが入力されました'],
            [z.string(), new Set(), '文字列での入力を期待していますが、セットが入力されました'],
            [z.string(), new Date('2024-01-01'), '文字列での入力を期待していますが、日時が入力されました'],
            [z.number(), {}, '数値での入力を期待していますが、オブジェクトが入力されました']
        ])('schema=%o, input=%o → %s', (schema, input, expected) => {
            expect(msg(schema, input)).toBe(expected);
        });

        it('不正な日時', () => {
            expect(msg(z.date(), new Date('invalid'))).toBe('間違った日時データです');
        });

        it('未知の型ラベルはそのまま出力される', () => {
            expect(call({ code: 'invalid_type', expected: 'custom_type', input: 42 })).toBe(
                'custom_typeでの入力を期待していますが、数値が入力されました'
            );
            expect(call({ code: 'invalid_type', expected: 'string', received: 'custom_received', input: 42 })).toBe(
                '文字列での入力を期待していますが、custom_receivedが入力されました'
            );
        });
    });

    describe('invalid_value', () => {
        it.each([
            [z.literal(true), false, 'チェックしてください'],
            [z.literal(true), 1, '無効なリテラル値です。trueを入力してください'],
            [z.enum(['x', 'y']), 'z', "'z'は無効な値です。'x', 'y'で入力してください"]
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

        it('discriminated union 不一致', () => {
            const schema = z.discriminatedUnion('type', [
                z.object({ type: z.literal('a'), v: z.string() }),
                z.object({ type: z.literal('b'), v: z.number() })
            ]);
            expect(msg(schema, { type: 'c' })).toBe("無効な識別子です。'a', 'b'で入力してください");
        });
    });

    describe('invalid_key / invalid_element', () => {
        it('record のキー不正は内側の issue を日本語化する', () => {
            const schema = z.record(z.string().min(2), z.number());
            expect(msg(schema, { a: 1 })).toBe('2文字以上の文字列である必要があります');
        });

        it('map のキー・値の不正', () => {
            expect(msg(z.map(z.string().min(2), z.number()), new Map([['a', 1]]))).toBe(
                '2文字以上の文字列である必要があります'
            );
            expect(msg(z.map(z.string(), z.number()), new Map([['k', 'v']]))).toBe(
                '数値での入力を期待していますが、文字列が入力されました'
            );
        });

        it('set の要素不正', () => {
            expect(msg(z.set(z.number()), new Set(['x']))).toBe('数値での入力を期待していますが、文字列が入力されました');
        });

        it('内側の issue が無い場合はフォールバック', () => {
            expect(call({ code: 'invalid_key', origin: 'record', issues: [], input: 'a' })).toBe('入力形式が間違っています');
            expect(call({ code: 'invalid_element', origin: 'map', key: 'a', issues: [{ code: 'unknown_code' }], input: 1 })).toBe(
                '入力形式が間違っています'
            );
        });
    });

    describe('invalid_format', () => {
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

        it('date inclusive', () => {
            const schema = z.date().min(new Date('2024-01-01T00:00:00Z'));
            expect(msg(schema, new Date('2023-01-01'))).toMatch(/以降の日時である必要があります$/);
        });

        it.each([
            [{ minimum: 5, inclusive: true, exact: true, origin: 'number' }, '5の数値である必要があります'],
            [{ minimum: 5, inclusive: true, exact: true, origin: 'int' }, '5の数値である必要があります'],
            [{ minimum: 2, inclusive: false, origin: 'array' }, '2個より多くの要素が必要です'],
            [{ minimum: 3, inclusive: false, origin: 'string' }, '3文字より長い文字列である必要があります'],
            [{ minimum: 5, inclusive: true, exact: true, origin: 'bigint' }, '5の数値である必要があります'],
            [{ minimum: 5, inclusive: false, origin: 'bigint' }, '5より大きな数値である必要があります']
        ])('%o → %s', (issue, expected) => {
            expect(call({ code: 'too_small', input: null, ...issue })).toBe(expected);
        });

        it.each([
            [true, /の日時である必要があります$/],
            [false, /よりも後の日時である必要があります$/]
        ])('date exact=%s', (exact, expected) => {
            const issue = { code: 'too_small', minimum: new Date('2024-01-01').getTime(), inclusive: !exact ? false : true, exact, origin: 'date', input: null };
            expect(call(issue)).toMatch(expected);
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

        it('date inclusive', () => {
            const schema = z.date().max(new Date('2024-01-01T00:00:00Z'));
            expect(msg(schema, new Date('2025-01-01'))).toMatch(/以前の日時である必要があります$/);
        });

        it.each([
            [{ maximum: 3, inclusive: false, origin: 'string' }, '3文字より短い文字列である必要があります'],
            [{ maximum: 5, inclusive: true, exact: true, origin: 'number' }, '5の数値である必要があります'],
            [{ maximum: 5, inclusive: true, origin: 'int' }, '5以下の数値である必要があります'],
            [{ maximum: 2, inclusive: false, origin: 'array' }, '2個より少ない要素である必要があります'],
            [{ maximum: 5, inclusive: true, exact: true, origin: 'bigint' }, '5の数値である必要があります'],
            [{ maximum: 5, inclusive: false, origin: 'bigint' }, '5より小さな数値である必要があります']
        ])('%o → %s', (issue, expected) => {
            expect(call({ code: 'too_big', input: null, ...issue })).toBe(expected);
        });

        it.each([
            [true, /の日時である必要があります$/],
            [false, /よりも前の日時である必要があります$/]
        ])('date exact=%s', (exact, expected) => {
            const issue = { code: 'too_big', maximum: new Date('2024-01-01').getTime(), inclusive: !exact ? false : true, exact, origin: 'date', input: null };
            expect(call(issue)).toMatch(expected);
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

    describe('網羅性', () => {
        // zod 4 の issue コードを全件並べ、どれも英語の既定文言へ落ちないことを表明する
        const ALL_CODES: Record<z.core.$ZodIssueCode, Record<string, unknown>> = {
            invalid_type: { expected: 'string', input: 1 },
            too_big: { maximum: 1, origin: 'string', input: 'ab' },
            too_small: { minimum: 2, origin: 'string', input: 'a' },
            invalid_format: { format: 'email', input: 'a' },
            not_multiple_of: { divisor: 2, input: 3 },
            unrecognized_keys: { keys: ['a'], input: {} },
            invalid_union: { errors: [], input: 1 },
            invalid_key: { origin: 'record', issues: [], input: 'a' },
            invalid_element: { origin: 'map', key: 'a', issues: [], input: 1 },
            invalid_value: { values: ['a'], input: 'b' },
            custom: { input: 1 }
        };

        it.each(Object.entries(ALL_CODES))('%s は日本語の文言を返す', (code, rest) => {
            const result = call({ code, ...rest });
            expect(typeof result).toBe('string');
            expect(result).toMatch(/[ぁ-んァ-ヶ一-龠]/);
        });

        it('未知のコードは undefined を返して zod の既定へ委ねる', () => {
            expect(call({ code: 'unknown_code', input: null })).toBeUndefined();
        });
    });
});
