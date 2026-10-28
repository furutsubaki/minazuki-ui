import { describe, it, expect } from 'vitest';
import { reactive } from 'vue';
import { z } from 'zod';
import { toTypedSchema } from '@/assets/ts/zodTypedSchema';

const errorsOf = async (schema: z.ZodType, values: unknown) => {
    const result = await toTypedSchema(schema).parse(values as never);
    return Object.fromEntries(result.errors.map((e) => [e.path, e.errors]));
};

describe('toTypedSchema', () => {
    describe('parse', () => {
        it('成功時は変換後の値を返す', async () => {
            const schema = z.object({ n: z.string().transform((v) => v.length) });
            expect(await toTypedSchema(schema).parse({ n: 'abc' })).toEqual({ value: { n: 3 }, errors: [] });
        });

        it('同じ path のエラーをまとめ、配列添字は [n] で表す', async () => {
            const schema = z.object({
                name: z.string().min(3).regex(/^\d+$/),
                list: z.array(z.object({ v: z.number() }))
            });
            expect(await errorsOf(schema, { name: 'a', list: [{ v: 1 }, { v: 'x' }] })).toEqual({
                name: [expect.any(String), expect.any(String)],
                'list[1].v': [expect.any(String)]
            });
        });

        it('ルートの union は候補ごとの issue を各フィールドへ展開し、空 path の汎用エラーは捨てる', async () => {
            const schema = z.union([z.object({ a: z.string() }), z.object({ b: z.number() })]);
            expect(Object.keys(await errorsOf(schema, {}))).toEqual(['a', 'b']);
        });

        it('ネストした union は親の path を付けて展開し、親自身のエラーも残す', async () => {
            const schema = z.object({ data: z.union([z.object({ name: z.string() }), z.object({ id: z.number() })]) });
            expect(Object.keys(await errorsOf(schema, { data: { name: 1 } })).sort()).toEqual(['data', 'data.id', 'data.name']);
        });

        it('配列内の union も添字付きの path で展開する', async () => {
            const schema = z.object({ items: z.array(z.union([z.object({ a: z.string() }), z.object({ b: z.string() })])) });
            expect(Object.keys(await errorsOf(schema, { items: [{}] })).sort()).toEqual(['items[0]', 'items[0].a', 'items[0].b']);
        });

        it('discriminated union の不一致は識別子のフィールドに出る', async () => {
            const schema = z.discriminatedUnion('type', [z.object({ type: z.literal('a') }), z.object({ type: z.literal('b') })]);
            expect(Object.keys(await errorsOf(schema, { type: 'c' }))).toEqual(['type']);
        });

        it('record のキー不正はそのキーの path に出る', async () => {
            const schema = z.object({ r: z.record(z.string().min(2), z.number()) });
            expect(Object.keys(await errorsOf(schema, { r: { a: 1 } }))).toEqual(['r.a']);
        });

        it('継承プロパティ名のフィールドでも壊れない', async () => {
            const schema = z.object({ constructor: z.string(), toString: z.string(), nested: z.object({ hasOwnProperty: z.string() }) });
            const values = { constructor: 1, toString: 1, nested: { hasOwnProperty: 1 } };
            expect(Object.keys(await errorsOf(schema, values)).sort()).toEqual(['constructor', 'nested.hasOwnProperty', 'toString']);
        });

        it('トップレベルの . を含むキーは [名前] で返し、角括弧を含むキーは包まない', async () => {
            const schema = z.object({ 'a.b': z.string(), 'c[0]': z.string() });
            expect(Object.keys(await errorsOf(schema, {})).sort()).toEqual(['[a.b]', 'c[0]']);
        });

        it('リアクティブプロキシ越しのスキーマでも動く', async () => {
            const state = reactive({ schema: z.object({ a: z.string() }) });
            expect(Object.keys(await errorsOf(state.schema, {}))).toEqual(['a']);
        });
    });

    describe('cast', () => {
        it('既定値を当てるが transform は適用しない（フォーム値は入力の形のまま保つ）', () => {
            const schema = z.object({ a: z.string().default('x'), n: z.string().transform(Number) });
            expect(toTypedSchema(schema).cast?.({ n: '1' })).toEqual({ a: 'x', n: '1' });
        });

        it('ネストを含む既定値を入力へ重ねる', () => {
            const schema = z.object({
                role: z.string().default('user'),
                required: z.string(),
                nested: z.object({ lang: z.string().default('ja'), other: z.string() })
            });
            expect(toTypedSchema(schema).cast?.({ nested: { other: 'o' } } as never)).toEqual({
                role: 'user',
                required: undefined,
                nested: { lang: 'ja', other: 'o' }
            });
        });

        it('非同期 refine を含むスキーマでも例外にならない', () => {
            const schema = z.object({ a: z.string().default('x') }).refine(async () => true);
            expect(() => toTypedSchema(schema).cast?.({} as never)).not.toThrow();
        });

        it.each([
            ['z.preprocess()', z.preprocess((v) => v, z.object({ lang: z.string().default('ja'), n: z.object({ x: z.number().default(1) }).transform((v) => v) }))],
            ['ルートの .transform()', z.object({ lang: z.string().default('ja'), n: z.object({ x: z.number().default(1) }) }).transform((v) => v)]
        ])('%s の内側の object からも既定値を取り出す', (_, schema) => {
            expect(toTypedSchema(schema).cast?.({} as never)).toEqual({ lang: 'ja', n: { x: 1 } });
        });

        it('object でないスキーマは入力をそのまま返す', () => {
            const schema = z.string().transform(Number);
            expect(toTypedSchema(schema).cast?.(1 as never)).toBe(1);
        });

        it('入れ子の既定値を持つスキーマ本体を書き換えない', () => {
            const created = new Date('2024-01-01');
            const schema = z.object({
                profile: z.object({ contact: z.object({ email: z.string() }), tags: z.array(z.string()), at: z.date() })
                    .default({ contact: { email: '' }, tags: ['a'], at: created })
            });
            const typed = toTypedSchema(schema);
            typed.cast?.({ profile: { contact: { email: 'alice@example.com' }, tags: ['b'] } } as never);
            expect(schema.parse({})).toEqual({ profile: { contact: { email: '' }, tags: ['a'], at: created } });
            expect(typed.cast?.({} as never)).toEqual({ profile: { contact: { email: '' }, tags: ['a'], at: created } });
        });

        it('Date やクラスのインスタンスの既定値には入り込まず、スキーマ本体を書き換えない', () => {
            class Settings {
                lang = 'ja';
            }
            const created = new Date('2024-01-01');
            const settings = new Settings();
            const schema = z.object({ at: z.date().default(created), settings: z.custom<Settings>().default(settings) });
            const typed = toTypedSchema(schema);
            const result = typed.cast?.({ at: { tenant: 'A' }, settings: { lang: 'en', tenant: 'A' } } as never);
            expect(result).toEqual({ at: { tenant: 'A' }, settings: { lang: 'en', tenant: 'A' } });
            expect(created).toEqual(new Date('2024-01-01'));
            expect(Object.keys(created)).toEqual([]);
            expect({ ...settings }).toEqual({ lang: 'ja' });
            expect(schema.parse({})).toEqual({ at: new Date('2024-01-01'), settings });
        });

        it('入力の無い枝のプレーンな既定値は複製して返し、結果を書き換えてもスキーマ本体へ伝わらない', () => {
            const schema = z.object({
                profile: z.object({ contact: z.object({ email: z.string() }), tags: z.array(z.string()) })
                    .default({ contact: { email: '' }, tags: ['a'] })
            });
            const typed = toTypedSchema(schema);
            const first = typed.cast?.({} as never) as unknown as z.output<typeof schema>;
            first.profile.contact.email = 'alice@example.com';
            first.profile.tags.push('b');
            const expected = { profile: { contact: { email: '' }, tags: ['a'] } };
            expect(schema.parse({})).toEqual(expected);
            expect(typed.cast?.({} as never)).toEqual(expected);
        });

        it('Date・Map・private フィールドを持つクラスの既定値は zod と同じく複製せずに渡し、使える状態を保つ', () => {
            class Counter {
                #count = 1;
                get count() {
                    return this.#count;
                }
            }
            const created = new Date('2024-01-01');
            const counter = new Counter();
            const schema = z.object({
                at: z.date().default(created),
                map: z.custom<Map<string, number>>().default(new Map([['a', 1]])),
                counter: z.custom<Counter>().default(counter)
            });
            const result = toTypedSchema(schema).cast?.({} as never) as unknown as z.output<typeof schema>;
            expect(result.at).toBe(created);
            expect(result.map.size).toBe(1);
            expect(result.counter.count).toBe(1);
        });

        it('循環した既定値・入力でも停止し、循環の形を保つ', () => {
            const cyclic: Record<string, unknown> = { name: 'a' };
            cyclic.self = cyclic;
            const list: unknown[] = [];
            list.push(list);
            const schema = z.object({ tree: z.custom<Record<string, unknown>>().default(cyclic), list: z.custom<unknown[]>().default(list) });
            const typed = toTypedSchema(schema);
            const omitted = typed.cast?.({} as never) as unknown as { tree: Record<string, unknown>; list: unknown[] };
            // zod の defaultValue は1段目だけ複製するため、複製の self は元の既定値を指す。そこから先を1つの循環として複製する
            const inner = omitted.tree.self as Record<string, unknown>;
            expect(inner).not.toBe(cyclic);
            expect(inner.self).toBe(inner);
            const innerList = omitted.list[0] as unknown[];
            expect(innerList).not.toBe(list);
            expect(innerList[0] === innerList).toBe(true);
            const input: Record<string, unknown> = { name: 'b' };
            input.self = input;
            const supplied = typed.cast?.({ tree: input } as never) as unknown as { tree: Record<string, unknown> };
            expect(supplied.tree.name).toBe('b');
            expect(supplied.tree.self).toBe(supplied.tree);
        });

        it('constructor・prototype・__proto__ という名前のフィールドも保ち、プロトタイプを汚染しない', () => {
            const schema = z.object({
                meta: z.record(z.string(), z.unknown()).default(JSON.parse('{"a":1,"__proto__":{"fromDefault":"yes"}}')),
                nested: z.object({ constructor: z.string(), prototype: z.string() })
            });
            const input = JSON.parse('{"constructor":"c","prototype":"p","__proto__":{"polluted":"yes"},"nested":{"constructor":"nc","prototype":"np"}}');
            const result = toTypedSchema(schema).cast?.(input) as unknown as Record<string, Record<string, unknown>>;
            expect(Object.keys(result.meta)).toEqual(['a', '__proto__']);
            expect(Object.getPrototypeOf(result.meta)).toBe(Object.prototype);
            expect(result.nested).toEqual({ constructor: 'nc', prototype: 'np' });
            expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(true);
            expect(result.constructor).toBe('c');
            expect(result.prototype).toBe('p');
            expect(({} as Record<string, unknown>).polluted).toBeUndefined();
            expect(({} as Record<string, unknown>).fromDefault).toBeUndefined();
        });

        it('__proto__ を持つ入力でも Object.prototype を汚染しない', () => {
            const schema = z.object({ a: z.string() });
            toTypedSchema(schema).cast?.(JSON.parse('{"a":1,"__proto__":{"polluted":"yes"}}'));
            expect(({} as Record<string, unknown>).polluted).toBeUndefined();
        });
    });

    describe('describe', () => {
        const schema = z.object({
            name: z.string(),
            nick: z.string().optional(),
            'a.b': z.string(),
            profile: z.object({ age: z.number().optional() }),
            tags: z.array(z.object({ label: z.string() }))
        });
        const describeOf = (path?: string) => toTypedSchema(schema).describe?.(path as never);

        it.each([
            [undefined, { required: true, exists: true }],
            ['name', { required: true, exists: true }],
            ['nick', { required: false, exists: true }],
            ['[a.b]', { required: true, exists: true }],
            ['profile.age', { required: false, exists: true }],
            ['tags[0].label', { required: true, exists: true }],
            ['missing', { required: false, exists: false }],
            ['[x.y]', { required: false, exists: false }],
            ['missing.child', { required: false, exists: false }],
            ['toString', { required: false, exists: false }],
            ['[constructor]', { required: false, exists: false }],
            ['profile.hasOwnProperty', { required: false, exists: false }],
            ['name.child', { required: false, exists: false }]
        ])('path=%s', (path, expected) => {
            expect(describeOf(path)).toEqual(expected);
        });

        it('pipe で包まれた object も辿る', () => {
            const piped = z.preprocess((v) => v, z.object({ a: z.object({ b: z.string().optional() }).transform((v) => v) }));
            expect(toTypedSchema(piped).describe?.('a.b' as never)).toEqual({ required: false, exists: true });
            expect(toTypedSchema(piped).describe?.('[a]' as never)).toEqual({ required: true, exists: true });
        });

        it('object でないスキーマの path は存在しない扱い', () => {
            expect(toTypedSchema(z.string()).describe?.('a' as never)).toEqual({ required: false, exists: false });
        });
    });
});
