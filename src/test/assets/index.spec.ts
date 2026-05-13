import { describe, it, expect, vi, afterEach } from 'vitest';
import {
    hira2Kata,
    kata2Hira,
    kataFull2Half,
    kanaHalf2Full,
    alphanumericFull2Half,
    alphanumericHalf2Full,
    sleep
} from '@/assets/ts';

describe('hira2Kata', () => {
    it('ひらがなをカタカナに変換する', () => {
        expect(hira2Kata('あいうえお')).toBe('アイウエオ');
    });

    it('カタカナはそのまま', () => {
        expect(hira2Kata('アイウエオ')).toBe('アイウエオ');
    });

    it('ひらがなとカタカナが混在する場合、ひらがなのみ変換', () => {
        expect(hira2Kata('あアい')).toBe('アアイ');
    });
});

describe('kata2Hira', () => {
    it('カタカナをひらがなに変換する', () => {
        expect(kata2Hira('アイウエオ')).toBe('あいうえお');
    });

    it('ひらがなはそのまま', () => {
        expect(kata2Hira('あいうえお')).toBe('あいうえお');
    });

    it('カタカナとひらがなが混在する場合、カタカナのみ変換', () => {
        expect(kata2Hira('アあイ')).toBe('ああい');
    });
});

describe('kataFull2Half', () => {
    it('全角カタカナを半角カタカナに変換する', () => {
        expect(kataFull2Half('アイウエオ')).toBe('ｱｲｳｴｵ');
    });

    it('半角カタカナはそのまま', () => {
        expect(kataFull2Half('ｱｲｳ')).toBe('ｱｲｳ');
    });
});

describe('kanaHalf2Full', () => {
    it('半角カタカナを全角カタカナに変換する', () => {
        expect(kanaHalf2Full('ｱｲｳｴｵ')).toBe('アイウエオ');
    });

    it('全角カタカナはそのまま', () => {
        expect(kanaHalf2Full('アイウ')).toBe('アイウ');
    });
});

describe('alphanumericFull2Half', () => {
    it('全角英数字を半角英数字に変換する', () => {
        expect(alphanumericFull2Half('ＡＢＣ１２３')).toBe('ABC123');
    });

    it('半角英数字はそのまま', () => {
        expect(alphanumericFull2Half('ABC123')).toBe('ABC123');
    });
});

describe('alphanumericHalf2Full', () => {
    it('半角英数字を全角英数字に変換する', () => {
        expect(alphanumericHalf2Full('ABC123')).toBe('ＡＢＣ１２３');
    });

    it('全角英数字はそのまま', () => {
        expect(alphanumericHalf2Full('ＡＢＣ')).toBe('ＡＢＣ');
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
});
