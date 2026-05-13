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

describe('toKebabCase / toSnakeCase', () => {
    it.each([
        ['textPrimary', 'text-primary', 'text_primary'],
        ['bgSelectColor', 'bg-select-color', 'bg_select_color'],
        ['text', 'text', 'text']
    ])('%s をケバブ/スネークに変換する', (input, kebab, snake) => {
        expect(toKebabCase(input)).toBe(kebab);
        expect(toSnakeCase(input)).toBe(snake);
    });
});
