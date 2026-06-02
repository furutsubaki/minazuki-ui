import type { ZodTypeAny } from 'zod';

export interface ResolvedStringCheck {
    kind: string;
    value?: number;
    message?: string;
}

/**
 * 任意の Zod スキーマから ZodString の checks 配列を取り出す。
 * ZodOptional / ZodNullable / ZodDefault などのラッパーや ZodUnion の選択肢を再帰的に解いて
 * 最初に見つかった ZodString の checks を返す。
 */
export const resolveStringChecks = (schema?: ZodTypeAny): ResolvedStringCheck[] | undefined => {
    const def = schema?._def as
        | {
              typeName?: string;
              checks?: ResolvedStringCheck[];
              innerType?: ZodTypeAny;
              options?: ZodTypeAny[];
          }
        | undefined;
    if (!def) return undefined;
    // ZodString 本体（typeName で確認）
    if (def.typeName === 'ZodString' && def.checks) return def.checks;
    // ZodOptional / ZodNullable / ZodDefault など innerType を持つラッパー
    if (def.innerType) return resolveStringChecks(def.innerType);
    // ZodUnion: 最初に checks を持つ選択肢を採用
    if (def.options) {
        for (const opt of def.options) {
            const checks = resolveStringChecks(opt);
            if (checks) return checks;
        }
    }
    return undefined;
};
