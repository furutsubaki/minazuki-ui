import { describe, it, expect, vi, afterEach } from 'vitest';
import { parseCssTime, parseCssTimeList, getTransitionDuration } from '@/assets/ts/transition';

describe('parseCssTime', () => {
    it.each([
        ['空文字列', '', 0],
        ['不正な文字列', 'abc', 0],
        ['単位なしの数値', '300', 0],
        ['ms 単位の整数', '300ms', 300],
        ['s 単位を ms に変換', '0.3s', 300],
        ['小数点始まりの s 単位', '.5s', 500],
        ['負の値', '-100ms', -100],
        ['0ms', '0ms', 0],
        ['0s', '0s', 0],
        ['大文字の単位', '300MS', 300],
        ['前後の空白をトリム', '  200ms  ', 200]
    ])('%s → %s = %d', (_label, input, expected) => {
        expect(parseCssTime(input)).toBe(expected);
    });

    it('極端に長い桁数で Infinity になる場合は 0 を返す', () => {
        expect(parseCssTime('9'.repeat(400) + 'ms')).toBe(0);
    });
});

describe('parseCssTimeList', () => {
    it('単一値をパースする', () => {
        expect(parseCssTimeList('300ms')).toEqual([300]);
    });

    it('カンマ区切りの複数値をパースする', () => {
        expect(parseCssTimeList('300ms, 100ms')).toEqual([300, 100]);
    });

    it('異なる単位の混合をパースする', () => {
        expect(parseCssTimeList('0.3s, 200ms')).toEqual([300, 200]);
    });
});

describe('getTransitionDuration', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('null を渡すと 200 を返す', () => {
        expect(getTransitionDuration(null)).toBe(200);
    });

    it('undefined を渡すと 200 を返す', () => {
        expect(getTransitionDuration(undefined)).toBe(200);
    });

    it('document が undefined のとき 200 を返す (SSR)', () => {
        const el = document.createElement('div');
        vi.stubGlobal('document', undefined);
        expect(getTransitionDuration(el)).toBe(200);
    });

    it('transition 未設定の要素は 0 を返す', () => {
        const el = document.createElement('div');
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            transitionDuration: '',
            transitionDelay: ''
        } as unknown as CSSStyleDeclaration);
        expect(getTransitionDuration(el)).toBe(0);
    });

    it('duration と delay を合算する', () => {
        const el = document.createElement('div');
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            transitionDuration: '300ms',
            transitionDelay: '100ms'
        } as unknown as CSSStyleDeclaration);
        expect(getTransitionDuration(el)).toBe(400);
    });

    it('s 単位を正しく変換して合算する', () => {
        const el = document.createElement('div');
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            transitionDuration: '0.3s',
            transitionDelay: '0s'
        } as unknown as CSSStyleDeclaration);
        expect(getTransitionDuration(el)).toBe(300);
    });

    it('複数値の中から最大の合計を返す', () => {
        const el = document.createElement('div');
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            transitionDuration: '300ms, 200ms',
            transitionDelay: '50ms, 100ms'
        } as unknown as CSSStyleDeclaration);
        expect(getTransitionDuration(el)).toBe(350);
    });
});
