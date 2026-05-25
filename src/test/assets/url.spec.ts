import { describe, it, expect } from 'vitest';
import { isSafeNavigationUrl } from '@/assets/ts/url';

describe('isSafeNavigationUrl', () => {
    it('空文字列は false を返す', () => {
        expect(isSafeNavigationUrl('')).toBe(false);
    });

    it('https: スキーマは true を返す', () => {
        expect(isSafeNavigationUrl('https://example.com')).toBe(true);
    });

    it('http: スキーマは true を返す', () => {
        expect(isSafeNavigationUrl('http://example.com')).toBe(true);
    });

    it('/ から始まる相対パスは true を返す', () => {
        expect(isSafeNavigationUrl('/path/to/page')).toBe(true);
    });

    it('./ から始まる相対パスは true を返す', () => {
        expect(isSafeNavigationUrl('./relative')).toBe(true);
    });

    it('../ から始まる相対パスは true を返す', () => {
        expect(isSafeNavigationUrl('../parent')).toBe(true);
    });

    it('# から始まるアンカーは true を返す', () => {
        expect(isSafeNavigationUrl('#section')).toBe(true);
    });

    it('mailto: スキーマは true を返す', () => {
        expect(isSafeNavigationUrl('mailto:user@example.com')).toBe(true);
    });

    it('tel: スキーマは true を返す', () => {
        expect(isSafeNavigationUrl('tel:+819012345678')).toBe(true);
    });

    it('javascript: スキーマは false を返す', () => {
        expect(isSafeNavigationUrl('javascript:alert(1)')).toBe(false);
    });

    it('javascript: スキーマの大文字混在は false を返す', () => {
        expect(isSafeNavigationUrl('JavaScript:alert(1)')).toBe(false);
    });

    it('data: スキーマは false を返す', () => {
        expect(isSafeNavigationUrl('data:text/html,<h1>XSS</h1>')).toBe(false);
    });

    it('vbscript: スキーマは false を返す', () => {
        expect(isSafeNavigationUrl('vbscript:MsgBox(1)')).toBe(false);
    });

    it('前後の空白をトリムしてから判定する', () => {
        expect(isSafeNavigationUrl('  https://example.com  ')).toBe(true);
        expect(isSafeNavigationUrl('  javascript:alert(1)  ')).toBe(false);
    });
});
