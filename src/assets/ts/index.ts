import { KANA_MAP_FULL_2_HALF, KANA_MAP_HALF_2_FULL } from './const';

export const hira2Kata = (str: string) => {
    // ひら→カタ
    return str.replace(/[ぁ-ゖ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
};

export const kata2Hira = (str: string) => {
    // カタ→ひら
    return str.replace(/[ァ-ヺ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
};

const KATA_FULL2HALF_REG = new RegExp('(' + Object.keys(KANA_MAP_FULL_2_HALF).join('|') + ')', 'g');

export const kataFull2Half = (str: string) => {
    // 全角カタ→半角ｶﾀ
    return str
        .replace(KATA_FULL2HALF_REG, function (s) {
            return KANA_MAP_FULL_2_HALF[s];
        })
        .replace(/゛/g, 'ﾞ')
        .replace(/゜/g, 'ﾟ');
};

const KANA_HALF2FULL_REG = new RegExp('(' + Object.keys(KANA_MAP_HALF_2_FULL).join('|') + ')', 'g');

export const kanaHalf2Full = (str: string) => {
    // 半角ｶﾀ→全角カタ
    return str
        .replace(KANA_HALF2FULL_REG, function (match) {
            return KANA_MAP_HALF_2_FULL[match];
        })
        .replace(/ﾞ/g, '゛')
        .replace(/ﾟ/g, '゜');
};

export const alphanumericFull2Half = (str: string) => {
    // 全角英数字→半角英数字
    str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) - 0xfee0);
    });
    return str;
};
export const alphanumericHalf2Full = (str: string) => {
    // 半角英数字→全角英数字
    str = str.replace(/[A-Za-z0-9]/g, function (s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xfee0);
    });
    return str;
};

export const sleep = (waitTime: number) => new Promise((resolve) => setTimeout(resolve, waitTime));

type PlainObject = Record<string, unknown>;

const isPlainObject = (val: unknown): val is PlainObject =>
    typeof val === 'object' && val !== null && !Array.isArray(val);

const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export const deepMerge = <T>(target: T, ...sources: (Partial<T> | null | undefined)[]): T => {
    if (!isPlainObject(target)) return target;
    for (const source of sources) {
        if (!isPlainObject(source)) continue;
        for (const key of Object.keys(source)) {
            if (DANGEROUS_KEYS.has(key)) continue;
            const s = (source as PlainObject)[key];
            const t = (target as PlainObject)[key];
            if (isPlainObject(s) && isPlainObject(t)) {
                deepMerge(t, s as Partial<typeof t>);
            } else if (s !== undefined) {
                (target as PlainObject)[key] = s;
            }
        }
    }
    return target;
};
