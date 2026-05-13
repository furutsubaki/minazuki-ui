import { describe, it, expect } from 'vitest';
import { formatLocaleString, parseLocaleString, toKebabCase, toSnakeCase } from '@/assets/ts/formatter';

describe('formatLocaleString', () => {
    it('数値文字列をカンマ区切りにする', () => {
        expect(formatLocaleString('1234567')).toBe('1,234,567');
    });

    it('カンマ付き文字列もカンマ区切りで返す', () => {
        expect(formatLocaleString('1,234')).toBe('1,234');
    });

    it('数値でない場合は空文字を返す', () => {
        expect(formatLocaleString('abc')).toBe('');
    });

    it('空文字の場合は空文字を返す', () => {
        expect(formatLocaleString('')).toBe('');
    });
});

describe('parseLocaleString', () => {
    it('カンマ区切り数値を数値文字列に変換する', () => {
        expect(parseLocaleString('1,234,567')).toBe('1234567');
    });

    it('数値文字列はそのまま返す', () => {
        expect(parseLocaleString('100')).toBe('100');
    });

    it('数値でない場合は空文字を返す', () => {
        expect(parseLocaleString('abc')).toBe('');
    });
});

describe('toKebabCase', () => {
    it('キャメルケースをケバブケースに変換する', () => {
        expect(toKebabCase('textPrimary')).toBe('text-primary');
    });

    it('複数の大文字も変換する', () => {
        expect(toKebabCase('bgSelectColor')).toBe('bg-select-color');
    });

    it('すでに小文字のみの場合はそのまま', () => {
        expect(toKebabCase('text')).toBe('text');
    });
});

describe('toSnakeCase', () => {
    it('キャメルケースをスネークケースに変換する', () => {
        expect(toSnakeCase('textPrimary')).toBe('text_primary');
    });

    it('複数の大文字も変換する', () => {
        expect(toSnakeCase('bgSelectColor')).toBe('bg_select_color');
    });

    it('すでに小文字のみの場合はそのまま', () => {
        expect(toSnakeCase('text')).toBe('text');
    });
});
