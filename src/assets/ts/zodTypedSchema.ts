/*
 * ==================================================
 * File Name    assets/ts/zodTypedSchema.ts
 * Description  zod 4 スキーマを vee-validate 4 の TypedSchema へ変換する
 * ==================================================
 */

// @vee-validate/zod 4.15.1 の toTypedSchema を zod 4 向けに移植したもの。
// vee-validate 5 は Standard Schema で zod 4 を直接扱えるため、移行したら削除できる。

import { toRaw } from 'vue';
import { cleanupNonNestedPath, isNotNestedPath, type TypedSchema, type TypedSchemaError } from 'vee-validate';
import type { z } from 'zod';

interface SchemaDef {
    type: string;
    shape?: Record<string, z.ZodType>;
    element?: z.ZodType;
    defaultValue?: unknown;
    in?: z.ZodType;
    out?: z.ZodType;
}

const defOf = (schema: z.ZodType) => schema._zod.def as SchemaDef;

/**
 * pipe（.transform() / z.preprocess()）を変換を実行せずに辿り、object スキーマを探す。
 * 入力側を優先し、z.preprocess() のように入力側が transform なら出力側を見る
 */
const findObject = (schema: z.ZodType): z.ZodType | undefined => {
    const def = defOf(schema);
    if (def.type === 'object') return schema;
    if (def.type !== 'pipe') return undefined;
    return findObject(def.in as z.ZodType) ?? findObject(def.out as z.ZodType);
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

/** shape から自前のフィールドだけを引く（`toString` などプロトタイプのメンバーを拾わない） */
const fieldOf = (object: z.ZodType, key: string): z.ZodType | null => {
    const shape = defOf(object).shape as Record<string, z.ZodType>;
    return Object.prototype.hasOwnProperty.call(shape, key) ? shape[key] : null;
};

const isExactPlainObject = (value: unknown): value is Record<string, unknown> =>
    isPlainObject(value) && Object.getPrototypeOf(value) === Object.prototype;

const hasOwn = (object: object, key: string) => Object.prototype.hasOwnProperty.call(object, key);

// `__proto__` などの名前でもプロトタイプの setter を通さず、自前のプロパティとして作る
const defineField = (object: Record<string, unknown>, key: string, value: unknown) =>
    Object.defineProperty(object, key, { value, writable: true, enumerable: true, configurable: true });

/**
 * 既定値をフォーム値として渡す前に、プレーンなオブジェクトと配列を辿って複製する。
 * zod 4 の defaultValue は1段目しかコピーされず、入れ子はスキーマが持つ既定値と同じ参照になるため、
 * 複製しないとフォーム側の編集がスキーマへ伝わり、SSR では別のリクエストへ漏れる。
 * Date やクラスのインスタンスは zod 自身も同じ参照を返すため、そのまま渡す
 */
const cloneDefault = (value: unknown, seen = new WeakMap<object, unknown>()): unknown => {
    if (!Array.isArray(value) && !isExactPlainObject(value)) return value;
    // 循環や共有された参照は、複製先でも同じ形を保つ
    if (seen.has(value)) return seen.get(value);
    if (Array.isArray(value)) {
        const cloned: unknown[] = [];
        seen.set(value, cloned);
        for (const item of value) cloned.push(cloneDefault(item, seen));
        return cloned;
    }
    const cloned: Record<string, unknown> = {};
    seen.set(value, cloned);
    for (const key of Object.keys(value)) defineField(cloned, key, cloneDefault(value[key], seen));
    return cloned;
};

/**
 * 既定値へ入力を重ねた新しい値を返す。どちらも書き換えない。
 * 入り込むのは両方がプレーンなオブジェクトのときだけで、Date やクラスのインスタンスは入力で丸ごと差し替える
 */
const mergeDefaults = (defaults: unknown, values: unknown, seen = new WeakMap<object, unknown>()): unknown => {
    if (values === undefined) return cloneDefault(defaults);
    if (!isExactPlainObject(defaults) || !isExactPlainObject(values)) return values;
    // 入力側が循環していても、一度重ねた枝は同じ結果を指す
    if (seen.has(values)) return seen.get(values);
    const merged: Record<string, unknown> = {};
    seen.set(values, merged);
    for (const key of new Set([...Object.keys(defaults), ...Object.keys(values)])) {
        const fallback = hasOwn(defaults, key) ? defaults[key] : undefined;
        defineField(merged, key, mergeDefaults(fallback, hasOwn(values, key) ? values[key] : undefined, seen));
    }
    return merged;
};

/**
 * zod の path を vee-validate の path 記法（`a[0].b`、トップレベルの `[a.b]`）へ変換する。
 * vee-validate は `[...]` の中の角括弧を取り除くため、角括弧を含むキー名は表せない（README に制限として記載）
 */
const toFormPath = (path: readonly PropertyKey[]): string => {
    if (path.length === 1 && typeof path[0] !== 'number') {
        const name = String(path[0]);
        return name.includes('.') && !/[[\]]/.test(name) ? `[${name}]` : name;
    }
    return path.reduce<string>((acc, key) => {
        if (typeof key === 'number') return `${acc}[${key}]`;
        return acc ? `${acc}.${String(key)}` : String(key);
    }, '');
};

const processIssues = (
    issues: readonly z.core.$ZodIssue[],
    errors: Map<string, TypedSchemaError>,
    parentPath: readonly PropertyKey[] = []
) => {
    for (const issue of issues) {
        // zod 4 の子 issue の path は親からの相対パス
        const fullPath = [...parentPath, ...issue.path];
        const path = toFormPath(fullPath);
        if (issue.code === 'invalid_union') {
            processIssues(issue.errors.flat(), errors, fullPath);
            if (!path) continue;
        }
        const entry = errors.get(path) ?? { path, errors: [] };
        entry.errors.push(issue.message);
        errors.set(path, entry);
    }
};

const getDefaults = (schema: z.ZodType): Record<string, unknown> | undefined => {
    const object = findObject(schema);
    if (!object) return undefined;
    return Object.fromEntries(
        Object.entries(defOf(object).shape as Record<string, z.ZodType>).map(([key, value]) => {
            if (defOf(value).type === 'default') return [key, defOf(value).defaultValue];
            return [key, getDefaults(value)];
        })
    );
};

const getSchemaForPath = (path: string, schema: z.ZodType): z.ZodType | null => {
    const root = findObject(schema);
    if (!root) return null;
    if (isNotNestedPath(path)) return fieldOf(root, cleanupNonNestedPath(path));
    const paths = path.split(/\.|\[(\d+)\]/).filter(Boolean);
    let current: z.ZodType | null = root;
    for (const p of paths) {
        if (!current) return null;
        const object = findObject(current);
        const def = defOf(current);
        if (object) {
            current = fieldOf(object, p);
        } else if (def.type === 'array' && Number(p) >= 0) {
            current = def.element as z.ZodType;
        } else {
            return null;
        }
    }
    return current;
};

export const toTypedSchema = <Output, Input>(reactiveSchema: z.ZodType<Output, Input>): TypedSchema<Input, Output> => {
    // zod 4 の _zod は書き換え不可のプロパティで、Vue のリアクティブプロキシ越しに読むと例外になる
    const schema = toRaw(reactiveSchema);
    return {
        __type: 'VVTypedSchema',
        async parse(values) {
            const result = await schema.safeParseAsync(values);
            if (result.success) {
                return { value: result.data, errors: [] };
            }
            const errors = new Map<string, TypedSchemaError>();
            processIssues(result.error.issues, errors);
            return { errors: [...errors.values()] };
        },
        cast(values) {
            // vee-validate は cast の結果をフォーム値として保持し、次の検証の入力に使う。
            // parse の出力（transform 後の値）を返すと入力型と食い違うため、既定値を入力へ重ねるだけにする
            const defaults = getDefaults(schema);
            if (isPlainObject(defaults) && isPlainObject(values)) {
                return mergeDefaults(defaults, values) as Input;
            }
            return values as Input;
        },
        describe(path) {
            if (!path) {
                return { required: !schema.isOptional(), exists: true };
            }
            const description = getSchemaForPath(path, schema);
            if (!description) {
                return { required: false, exists: false };
            }
            return { required: !description.isOptional(), exists: true };
        }
    };
};
