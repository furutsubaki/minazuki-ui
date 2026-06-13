import type { ZodTypeAny } from 'zod';

export interface ResolvedStringCheck {
    kind: string;
    value?: number;
    message?: string;
}

/**
 * 任意の Zod スキーマから ZodString の checks 配列を取り出す。
 * ZodOptional / ZodNullable / ZodDefault などのラッパーや ZodUnion の選択肢、
 * ZodPipeline / ZodEffects を再帰的に解いて最初に見つかった ZodString の checks を返す。
 */
export const resolveStringChecks = (schema?: ZodTypeAny): ResolvedStringCheck[] | undefined => {
    const def = schema?._def as
        | {
              typeName?: string;
              checks?: ResolvedStringCheck[];
              innerType?: ZodTypeAny;
              options?: ZodTypeAny[];
              in?: ZodTypeAny;
              schema?: ZodTypeAny;
          }
        | undefined;
    if (!def) return undefined;
    // ZodString 本体（typeName で確認）
    if (def.typeName === 'ZodString' && def.checks) return def.checks;
    // ZodOptional / ZodNullable / ZodDefault など innerType を持つラッパー
    if (def.innerType) return resolveStringChecks(def.innerType);
    // ZodPipeline（.pipe()）: 入力スキーマ側の checks を採用
    if (def.in) return resolveStringChecks(def.in);
    // ZodEffects（.refine() / .superRefine() / .transform()）: ラップ元スキーマを解決
    if (def.schema) return resolveStringChecks(def.schema);
    // ZodUnion: 最初に checks を持つ選択肢を採用
    if (def.options) {
        for (const opt of def.options) {
            const checks = resolveStringChecks(opt);
            if (checks) return checks;
        }
    }
    return undefined;
};
