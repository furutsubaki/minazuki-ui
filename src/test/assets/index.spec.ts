import { describe, it, expect, vi, afterEach } from 'vitest';
import {
    hira2Kata,
    kata2Hira,
    kataFull2Half,
    kanaHalf2Full,
    alphanumericFull2Half,
    alphanumericHalf2Full,
    sleep,
    deepMerge
} from '@/assets/ts';

describe('hira2Kata / kata2Hira', () => {
    it('あいうえお ↔ アイウエオ の双方向変換', () => {
        expect(hira2Kata('あいうえお')).toBe('アイウエオ');
        expect(kata2Hira('アイウエオ')).toBe('あいうえお');
    });

    it('hira2Kata はひらがなのみ変換し既存カタカナは据え置く', () => {
        expect(hira2Kata('あアい')).toBe('アアイ');
    });

    it('kata2Hira はカタカナのみ変換し既存ひらがなは据え置く', () => {
        expect(kata2Hira('アあイ')).toBe('ああい');
    });

    it('hira2Kata は非ひらがなをそのまま通す', () => {
        expect(hira2Kata('アイウエオ')).toBe('アイウエオ');
    });

    it('kata2Hira は非カタカナをそのまま通す', () => {
        expect(kata2Hira('あいうえお')).toBe('あいうえお');
    });

    it('空文字列はそのまま', () => {
        expect(hira2Kata('')).toBe('');
        expect(kata2Hira('')).toBe('');
    });
});

describe('kataFull2Half / kanaHalf2Full', () => {
    it.each([
        ['アイウエオ', 'ｱｲｳｴｵ'],
        ['ガギグゲゴ', 'ｶﾞｷﾞｸﾞｹﾞｺﾞ'],
        ['パピプペポ', 'ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ'],
        ['ヴ', 'ｳﾞ'],
        ['゛', 'ﾞ'],
        ['゜', 'ﾟ'],
        ['。、「」・ー', '｡､｢｣･ｰ']
    ])('全角="%s" ↔ 半角="%s"', (full, half) => {
        expect(kataFull2Half(full)).toBe(half);
        expect(kanaHalf2Full(half)).toBe(full);
    });

    it('kataFull2Half は半角カタカナをそのまま通す', () => {
        expect(kataFull2Half('ｱｲｳ')).toBe('ｱｲｳ');
    });

    it('kataFull2Half は全角スペースを半角スペースに変換する', () => {
        expect(kataFull2Half('　')).toBe(' ');
    });

    it('kanaHalf2Full は全角カタカナをそのまま通す', () => {
        expect(kanaHalf2Full('アイウ')).toBe('アイウ');
    });

    it('空文字列はそのまま', () => {
        expect(kataFull2Half('')).toBe('');
        expect(kanaHalf2Full('')).toBe('');
    });
});

describe('alphanumericFull2Half / alphanumericHalf2Full', () => {
    it.each([
        ['ＡＢＣ１２３', 'ABC123'],
        ['ＡＺａｚ０９', 'AZaz09'],
        ['Ａ漢字Ｂ', 'A漢字B']
    ])('全角="%s" ↔ 半角="%s"', (full, half) => {
        expect(alphanumericFull2Half(full)).toBe(half);
        expect(alphanumericHalf2Full(half)).toBe(full);
    });

    it('alphanumericFull2Half は半角英数字をそのまま通す', () => {
        expect(alphanumericFull2Half('ABC123')).toBe('ABC123');
    });

    it('alphanumericHalf2Full は全角英数字をそのまま通す', () => {
        expect(alphanumericHalf2Full('ＡＢＣ')).toBe('ＡＢＣ');
    });

    it('空文字列はそのまま', () => {
        expect(alphanumericFull2Half('')).toBe('');
        expect(alphanumericHalf2Full('')).toBe('');
    });
});

describe('sleep', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('指定時間が経過する前は解決しない', async () => {
        vi.useFakeTimers();
        let resolved = false;
        sleep(50).then(() => {
            resolved = true;
        });
        vi.advanceTimersByTime(49);
        await Promise.resolve();
        expect(resolved).toBe(false);
    });

    it('指定時間（ms）後に解決する', async () => {
        vi.useFakeTimers();
        let resolved = false;
        const promise = sleep(50).then(() => {
            resolved = true;
        });
        vi.advanceTimersByTime(50);
        await promise;
        expect(resolved).toBe(true);
    });

    it('waitTime=0 は即時解決する', async () => {
        vi.useFakeTimers();
        let resolved = false;
        const promise = sleep(0).then(() => {
            resolved = true;
        });
        vi.advanceTimersByTime(0);
        await promise;
        expect(resolved).toBe(true);
    });
});

describe('deepMerge', () => {
    it('target が plain object でない場合はそのまま返す', () => {
        expect(deepMerge(null as never, { a: 1 } as never)).toBeNull();
        expect(deepMerge([1, 2] as never, { a: 1 } as never)).toEqual([1, 2]);
        expect(deepMerge('str' as never, { a: 1 } as never)).toBe('str');
    });

    it('source が null/undefined/配列の場合はスキップする', () => {
        const target = { a: 1 };
        expect(deepMerge(target, null, undefined, [] as never)).toEqual({ a: 1 });
    });

    it('ネストされた plain object 同士を再帰的にマージする', () => {
        const target: Record<string, unknown> = { a: { x: 1, y: 2 }, b: 0 };
        const source = { a: { y: 20, z: 30 } };
        expect(deepMerge(target, source)).toEqual({ a: { x: 1, y: 20, z: 30 }, b: 0 });
    });

    it('source の値が undefined の場合は target の値を保持する', () => {
        expect(deepMerge({ a: 1 }, { a: undefined } as never)).toEqual({ a: 1 });
    });

    it('プリミティブ値は上書きされる', () => {
        expect(deepMerge({ a: 1, b: 'x' }, { a: 99, b: 'y' })).toEqual({ a: 99, b: 'y' });
    });

    it('配列値はマージされず上書きされる', () => {
        expect(deepMerge({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3] });
    });

    it('null 値は上書きされる', () => {
        expect(deepMerge({ a: 1 }, { a: null } as never)).toEqual({ a: null });
    });

    it('複数の source を後勝ちで順次適用する', () => {
        expect(deepMerge({ a: 1 }, { a: 2 }, { a: 3 })).toEqual({ a: 3 });
    });

    it('target に存在しないキーが追加される', () => {
        expect(deepMerge({ a: 1 } as Record<string, number>, { b: 2 })).toEqual({ a: 1, b: 2 });
    });

    it('target を mutate して同一参照を返す', () => {
        const target = { a: 1 };
        const result = deepMerge(target, { b: 2 } as never);
        expect(result).toBe(target);
    });

    it('target がオブジェクトで source の同 key がプリミティブの場合は上書きされる', () => {
        expect(deepMerge({ a: { x: 1 } } as Record<string, unknown>, { a: 'str' })).toEqual({ a: 'str' });
    });
});
