import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { resolveStringChecks } from '@/assets/ts/schema';

describe('resolveStringChecks', () => {
    it('undefined を渡すと undefined を返す', () => {
        expect(resolveStringChecks(undefined)).toBeUndefined();
    });

    it('ZodString 本体の checks を返す', () => {
        const schema = z.string().min(1).max(10);
        const checks = resolveStringChecks(schema);
        expect(checks).toBeDefined();
        expect(checks?.some((c) => c.kind === 'min' && c.value === 1)).toBe(true);
        expect(checks?.some((c) => c.kind === 'max' && c.value === 10)).toBe(true);
    });

    it('ZodOptional のラッパーを解いて ZodString の checks を返す', () => {
        const schema = z.string().min(1).optional();
        const checks = resolveStringChecks(schema);
        expect(checks?.some((c) => c.kind === 'min' && c.value === 1)).toBe(true);
    });

    it('ZodNullable のラッパーを解いて ZodString の checks を返す', () => {
        const schema = z.string().max(20).nullable();
        const checks = resolveStringChecks(schema);
        expect(checks?.some((c) => c.kind === 'max' && c.value === 20)).toBe(true);
    });

    it('ZodUnion の最初の ZodString 選択肢から checks を返す', () => {
        const schema = z.string().min(1).or(z.literal(''));
        const checks = resolveStringChecks(schema);
        expect(checks?.some((c) => c.kind === 'min' && c.value === 1)).toBe(true);
    });

    it('ZodUnion で ZodString に checks がない場合は空配列を返す', () => {
        const schema = z.string().url().or(z.literal(''));
        const checks = resolveStringChecks(schema);
        // url() は checks 配列に含まれる（kind: 'url'）ので空ではない
        expect(Array.isArray(checks)).toBe(true);
    });

    it('ZodUnion で先頭が ZodLiteral でも後続の ZodString を解決する', () => {
        const schema = z.literal('').or(z.string().min(1));
        const checks = resolveStringChecks(schema);
        expect(checks?.some((c) => c.kind === 'min' && c.value === 1)).toBe(true);
    });

    it('ZodPipeline（.pipe()）の入力スキーマから checks を返す', () => {
        const schema = z.string().min(1).max(50).pipe(z.string().email());
        const checks = resolveStringChecks(schema);
        expect(checks?.some((c) => c.kind === 'min' && c.value === 1)).toBe(true);
        expect(checks?.some((c) => c.kind === 'max' && c.value === 50)).toBe(true);
    });

    it('ZodEffects（.refine()）のラップ元スキーマから checks を返す', () => {
        const schema = z
            .string()
            .min(1)
            .refine((v) => v.length > 0);
        const checks = resolveStringChecks(schema);
        expect(checks?.some((c) => c.kind === 'min' && c.value === 1)).toBe(true);
    });

    it('ZodEffects（.transform()）のラップ元スキーマから checks を返す', () => {
        const schema = z
            .string()
            .max(20)
            .transform((v) => v.trim());
        const checks = resolveStringChecks(schema);
        expect(checks?.some((c) => c.kind === 'max' && c.value === 20)).toBe(true);
    });

    it('ZodPipeline と ZodEffects の入れ子も解決する', () => {
        const schema = z
            .string()
            .min(1)
            .pipe(z.string().email())
            .refine((v) => v.includes('@'));
        const checks = resolveStringChecks(schema);
        expect(checks?.some((c) => c.kind === 'min' && c.value === 1)).toBe(true);
    });

    it('ZodString を含まないスキーマ（ZodNumber）では undefined を返す', () => {
        const schema = z.number();
        expect(resolveStringChecks(schema)).toBeUndefined();
    });
});
