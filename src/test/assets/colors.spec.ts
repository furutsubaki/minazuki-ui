import { describe, it, expect } from 'vitest';
import {
    oklchToHex,
    oklchToOklchString,
    computePrimitiveColor,
    computeNeutralColor,
    computeStatusColor,
    DEFAULT_HUES,
    DEFAULT_STATUSES,
    LIGHTNESS_SCALE,
    CHROMA_SCALE
} from '@/assets/ts/colors';

describe('oklchToHex', () => {
    it('L=0, C=0 は黒 (#000000) を返す', () => {
        expect(oklchToHex(0, 0, 0)).toBe('#000000');
    });

    it('L=1, C=0 は白 (#ffffff) を返す', () => {
        expect(oklchToHex(1, 0, 0)).toBe('#ffffff');
    });

    it('中間グレー (L≈0.6) は #808080 付近を返す', () => {
        const hex = oklchToHex(0.6, 0, 0);
        const r = parseInt(hex.slice(1, 3), 16);
        expect(r).toBeGreaterThanOrEqual(125);
        expect(r).toBeLessThanOrEqual(131);
    });

    it('有効な 7 文字 hex を返す', () => {
        expect(oklchToHex(0.7, 0.15, 250)).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('sRGB ガモット外の高彩度値でもクランプされて有効な hex を返す', () => {
        const hex = oklchToHex(0.5, 0.4, 150);
        expect(hex).toMatch(/^#[0-9a-f]{6}$/);
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        expect(r).toBeGreaterThanOrEqual(0);
        expect(r).toBeLessThanOrEqual(255);
        expect(g).toBeGreaterThanOrEqual(0);
        expect(g).toBeLessThanOrEqual(255);
        expect(b).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThanOrEqual(255);
    });

    it('Hue 360 と Hue 0 は同じ結果を返す', () => {
        expect(oklchToHex(0.7, 0.15, 360)).toBe(oklchToHex(0.7, 0.15, 0));
    });
});

describe('oklchToOklchString', () => {
    it('alpha なしで oklch(L C H) を返す', () => {
        expect(oklchToOklchString(0.7, 0.15, 250)).toBe('oklch(0.7 0.15 250)');
    });

    it('alpha=1 の場合は alpha 表記なし', () => {
        expect(oklchToOklchString(0.7, 0.15, 250, 1)).toBe('oklch(0.7 0.15 250)');
    });

    it('alpha<1 の場合は % 表記を含む', () => {
        expect(oklchToOklchString(0.7, 0.15, 250, 0.8)).toBe('oklch(0.7 0.15 250 / 80%)');
    });
});

describe('computePrimitiveColor', () => {
    it('offset なしの hue は LIGHTNESS_SCALE をそのまま使う', () => {
        const result = computePrimitiveColor(DEFAULT_HUES.blue, 400);
        expect(result.L).toBe(LIGHTNESS_SCALE[400]);
        expect(result.C).toBe(DEFAULT_HUES.blue.chroma * CHROMA_SCALE[400]);
        expect(result.H).toBe(DEFAULT_HUES.blue.hue);
    });

    it('正の lightnessOffset が step 400 で正しく適用される', () => {
        const result = computePrimitiveColor(DEFAULT_HUES.yellow, 400);
        const expected = LIGHTNESS_SCALE[400] + DEFAULT_HUES.yellow.lightnessOffset!;
        expect(result.L).toBeCloseTo(expected, 10);
    });

    it('負の lightnessOffset が step 400 で正しく適用される', () => {
        const result = computePrimitiveColor(DEFAULT_HUES.red, 400);
        const expected = LIGHTNESS_SCALE[400] + DEFAULT_HUES.red.lightnessOffset!;
        expect(result.L).toBeCloseTo(expected, 10);
    });

    it('lightnessOffset は step に比例してスケーリングされる', () => {
        const r400 = computePrimitiveColor(DEFAULT_HUES.yellow, 400);
        const r700 = computePrimitiveColor(DEFAULT_HUES.yellow, 700);
        const offset400 = r400.L - LIGHTNESS_SCALE[400];
        const offset700 = r700.L - LIGHTNESS_SCALE[700];
        expect(offset700).toBeLessThan(offset400);
        expect(offset700 / offset400).toBeCloseTo(LIGHTNESS_SCALE[700] / LIGHTNESS_SCALE[400], 5);
    });

    it('L は 0 以下にクランプされる', () => {
        const extreme: import('@/assets/ts/colors').HueDefinition = { hue: 0, chroma: 0.1, lightnessOffset: -2.0 };
        const result = computePrimitiveColor(extreme, 700);
        expect(result.L).toBe(0);
    });

    it('L は 1 以上にクランプされる', () => {
        const extreme: import('@/assets/ts/colors').HueDefinition = { hue: 0, chroma: 0.1, lightnessOffset: 2.0 };
        const result = computePrimitiveColor(extreme, 100);
        expect(result.L).toBe(1);
    });

    it('有効な hex を返す', () => {
        const result = computePrimitiveColor(DEFAULT_HUES.teal, 300);
        expect(result.hex).toMatch(/^#[0-9a-f]{6}$/);
    });
});

describe('computeNeutralColor', () => {
    it('achromatic（C=0）の hex を返す', () => {
        const result = computeNeutralColor(50);
        expect(result.L).toBe(0.99);
        const r = parseInt(result.hex.slice(1, 3), 16);
        const g = parseInt(result.hex.slice(3, 5), 16);
        const b = parseInt(result.hex.slice(5, 7), 16);
        expect(r).toBe(g);
        expect(g).toBe(b);
    });

    it('neutralHue を指定しても C=0 なので結果は同じ', () => {
        const a = computeNeutralColor(400);
        const b = computeNeutralColor(400, 210);
        expect(a.hex).toBe(b.hex);
    });

    it('step 900 は暗い色を返す', () => {
        const result = computeNeutralColor(900);
        const r = parseInt(result.hex.slice(1, 3), 16);
        expect(r).toBeLessThan(50);
    });
});

describe('computeStatusColor', () => {
    it('offset=0 の status は参照先 hue と同じ結果を返す', () => {
        const status = computeStatusColor(DEFAULT_STATUSES.brand, DEFAULT_HUES, 400);
        const primitive = computePrimitiveColor(DEFAULT_HUES.teal, 400);
        expect(status.hex).toBe(primitive.hex);
    });

    it('Warning offset が比例スケーリングされる', () => {
        const s400 = computeStatusColor(DEFAULT_STATUSES.warning, DEFAULT_HUES, 400);
        const s700 = computeStatusColor(DEFAULT_STATUSES.warning, DEFAULT_HUES, 700);
        const offset400 = s400.L - LIGHTNESS_SCALE[400];
        const offset700 = s700.L - LIGHTNESS_SCALE[700];
        expect(offset700).toBeLessThan(offset400);
    });

    it('Warning surface (step 100) はクランプされるが有効な hex を返す', () => {
        const result = computeStatusColor(DEFAULT_STATUSES.warning, DEFAULT_HUES, 100);
        expect(result.L).toBe(1);
        expect(result.hex).toMatch(/^#[0-9a-f]{6}$/);
    });

    it('Danger は Red の hue/chroma を参照する', () => {
        const result = computeStatusColor(DEFAULT_STATUSES.danger, DEFAULT_HUES, 400);
        expect(result.H).toBe(DEFAULT_HUES.red.hue);
    });
});
