import { describe, it, expect } from 'vitest';
import { oklchToHex, oklchToHexAlpha } from '@/assets/ts/color';

describe('oklchToHex', () => {
    it('彩度0（無彩色）は明度に応じたグレーになる', () => {
        expect(oklchToHex(0.65, 0, 0)).toBe('#8f8f8f');
    });

    it('明度0は黒になる', () => {
        expect(oklchToHex(0, 0, 0)).toBe('#000000');
    });

    it('明度1は白になる', () => {
        expect(oklchToHex(1, 0, 0)).toBe('#ffffff');
    });

    it('色相0・彩度ありは赤系になる', () => {
        const hex = oklchToHex(0.65, 0.15, 25);
        expect(hex).toMatch(/^#[0-9a-f]{6}$/);
        // 赤chromaが効いてR成分が最大になる
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        expect(r).toBeGreaterThan(g);
        expect(r).toBeGreaterThan(b);
    });

    it('sRGBガモット外の値は0-1にクランプされる', () => {
        const hex = oklchToHex(0.65, 1, 250);
        expect(hex).toMatch(/^#[0-9a-f]{6}$/);
    });
});

describe('oklchToHexAlpha', () => {
    it('alpha=0.8 は cc サフィックスを付与する', () => {
        expect(oklchToHexAlpha(0.65, 0, 0, 0.8)).toBe('#8f8f8fcc');
    });

    it('alpha=1 は ff サフィックスを付与する', () => {
        expect(oklchToHexAlpha(0.65, 0, 0, 1)).toBe('#8f8f8fff');
    });

    it('alpha=0 は 00 サフィックスを付与する', () => {
        expect(oklchToHexAlpha(0.65, 0, 0, 0)).toBe('#8f8f8f00');
    });

    it('範囲外の alpha は 0-1 にクランプされる', () => {
        expect(oklchToHexAlpha(0.65, 0, 0, 1.5)).toBe('#8f8f8fff');
        expect(oklchToHexAlpha(0.65, 0, 0, -0.5)).toBe('#8f8f8f00');
    });
});
