import { toRaw } from 'vue';
import type { z } from 'zod';

export interface ResolvedStringCheck {
    kind: string;
    value?: number;
    message?: string;
}

interface CheckDef {
    check: string;
    minimum?: number;
    maximum?: number;
    length?: number;
    format?: string;
}

interface SchemaDef {
    type: string;
    checks?: { _zod: { def: CheckDef } }[];
    innerType?: z.ZodType;
    options?: z.ZodType[];
    in?: z.ZodType;
    out?: z.ZodType;
}

// zod 4 の _zod は書き換え不可のプロパティで、Vue のリアクティブプロキシ越しに読むと例外になるため toRaw を通す
const defOf = (schema?: z.ZodType) => (schema ? (toRaw(schema)._zod.def as SchemaDef) : undefined);

const toResolvedCheck = (def: CheckDef): ResolvedStringCheck => {
    switch (def.check) {
        case 'min_length':
            return { kind: 'min', value: def.minimum };
        case 'max_length':
            return { kind: 'max', value: def.maximum };
        case 'length_equals':
            return { kind: 'length', value: def.length };
        default:
            return { kind: def.format ?? def.check };
    }
};

/**
 * 任意の Zod スキーマから string スキーマの checks を取り出す。
 * optional / nullable / default などのラッパー、union の選択肢、
 * pipe（.transform() / .pipe() / z.preprocess()）を再帰的に解いて最初に見つかった string の checks を返す。
 */
export const resolveStringChecks = (schema?: z.ZodType): ResolvedStringCheck[] | undefined => {
    const def = defOf(schema);
    if (!def) return undefined;
    if (def.type === 'string') return (def.checks ?? []).map((check) => toResolvedCheck(check._zod.def));
    if (def.innerType) return resolveStringChecks(def.innerType);
    // pipe: 入力側を優先し、z.preprocess() のように入力側が transform なら出力側を見る
    if (def.in || def.out) return resolveStringChecks(def.in) ?? resolveStringChecks(def.out);
    if (def.options) {
        for (const opt of def.options) {
            const checks = resolveStringChecks(opt);
            if (checks) return checks;
        }
    }
    return undefined;
};

/** zod 4 の object.required() は各フィールドを nonoptional で包むため、props で受けられるようにする */
export type MaybeNonOptional<T> = T extends z.ZodType ? T | z.ZodNonOptional<T> : never;

/** nonoptional の包みを外す（v3 の required() は包まなかったため、判定を v3 と揃える） */
export const unwrapNonOptional = (schema?: z.ZodType): z.ZodType | undefined => {
    const def = defOf(schema);
    return def?.type === 'nonoptional' ? unwrapNonOptional(def.innerType) : toRaw(schema);
};
