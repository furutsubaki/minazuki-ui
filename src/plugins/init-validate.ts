import { z } from 'zod';

const TYPE_LABELS: Record<string, string> = {
    function: '関数',
    number: '数値',
    string: '文字列',
    nan: 'NaN',
    integer: '整数',
    float: '浮動小数点数',
    boolean: '真偽値',
    date: '日時',
    bigint: 'Bigint',
    undefined: 'undefined',
    symbol: 'シンボル',
    null: 'NULL',
    array: '配列',
    object: 'オブジェクト',
    unknown: 'unknown',
    promise: 'Promise',
    void: 'void',
    never: 'never',
    map: 'マップ',
    set: 'セット'
};

const VALIDATION_LABELS: Record<string, string> = {
    email: 'メールアドレス',
    url: 'URL',
    uuid: 'UUID',
    cuid: 'CUID',
    datetime: '日時'
};

let initialized = false;

function invalidStringMessage(issue: z.ZodInvalidStringIssue): string {
    const v = issue.validation;
    if (typeof v === 'object') {
        if ('includes' in v) return `"${v.includes}"を含む文字列である必要があります`;
        if ('startsWith' in v) return `"${v.startsWith}"で始まる文字列である必要があります`;
        if ('endsWith' in v) return `"${v.endsWith}"で終わる文字列である必要があります`;
        return '入力形式が間違っています';
    }
    const label = VALIDATION_LABELS[v];
    if (label) return `${label}の形式で入力してください`;
    return '入力形式が間違っています';
}

function tooSmallMessage(issue: z.ZodTooSmallIssue): string {
    const v = String(issue.minimum);
    switch (issue.type) {
        case 'string':
            if (issue.exact) return `${v}文字の文字列である必要があります`;
            if (issue.inclusive) return `${v}文字以上の文字列である必要があります`;
            return `${v}文字より長い文字列である必要があります`;
        case 'number':
        case 'bigint':
            if (issue.exact) return `${v}の数値である必要があります`;
            if (issue.inclusive) return `${v}以上の数値である必要があります`;
            return `${v}より大きな数値である必要があります`;
        case 'array':
            if (issue.exact) return `${v}個の要素が必要です`;
            if (issue.inclusive) return `${v}個以上の要素が必要です`;
            return `${v}個より多くの要素が必要です`;
        case 'date': {
            const d = new Date(Number(issue.minimum)).toLocaleDateString('ja-JP');
            if (issue.exact) return `${d}の日時である必要があります`;
            if (issue.inclusive) return `${d}以降の日時である必要があります`;
            return `${d}よりも後の日時である必要があります`;
        }
        default:
            return '入力形式が間違っています';
    }
}

function tooBigMessage(issue: z.ZodTooBigIssue): string {
    const v = String(issue.maximum);
    switch (issue.type) {
        case 'string':
            if (issue.exact) return `${v}文字の文字列である必要があります`;
            if (issue.inclusive) return `${v}文字以下の文字列である必要があります`;
            return `${v}文字より短い文字列である必要があります`;
        case 'number':
        case 'bigint':
            if (issue.exact) return `${v}の数値である必要があります`;
            if (issue.inclusive) return `${v}以下の数値である必要があります`;
            return `${v}より小さな数値である必要があります`;
        case 'array':
            if (issue.exact) return `${v}個の要素である必要があります`;
            if (issue.inclusive) return `${v}個以下の要素である必要があります`;
            return `${v}個より少ない要素である必要があります`;
        case 'date': {
            const d = new Date(Number(issue.maximum)).toLocaleDateString('ja-JP');
            if (issue.exact) return `${d}の日時である必要があります`;
            if (issue.inclusive) return `${d}以前の日時である必要があります`;
            return `${d}よりも前の日時である必要があります`;
        }
        default:
            return '入力形式が間違っています';
    }
}

export const jaErrorMap: z.ZodErrorMap = (issue, ctx) => {
    switch (issue.code) {
        case z.ZodIssueCode.invalid_type:
            if ([null, undefined, ''].includes(ctx.data)) {
                return { message: 'この項目は必須項目です' };
            }
            return {
                message: `${TYPE_LABELS[issue.expected] ?? issue.expected}での入力を期待していますが、${TYPE_LABELS[issue.received] ?? issue.received}が入力されました`
            };

        case z.ZodIssueCode.invalid_literal:
            if (issue.expected && !issue.received) {
                return { message: 'チェックしてください' };
            }
            return { message: `無効なリテラル値です。${String(issue.expected)}を入力してください` };

        case z.ZodIssueCode.unrecognized_keys:
            return { message: `オブジェクトのキー${issue.keys.map(k => `'${k}'`).join(', ')}が識別できません` };

        case z.ZodIssueCode.invalid_union:
            return { message: '入力形式が間違っています' };

        case z.ZodIssueCode.invalid_union_discriminator:
            return { message: `無効な識別子です。${issue.options.map(o => `'${String(o)}'`).join(', ')}で入力してください` };

        case z.ZodIssueCode.invalid_enum_value:
            return { message: `'${issue.received}'は無効な値です。${issue.options.map(o => `'${String(o)}'`).join(', ')}で入力してください` };

        case z.ZodIssueCode.invalid_arguments:
            return { message: '引数が間違っています' };

        case z.ZodIssueCode.invalid_return_type:
            return { message: '返値の型が間違っています' };

        case z.ZodIssueCode.invalid_date:
            return { message: '間違った日時データです' };

        case z.ZodIssueCode.invalid_string:
            return { message: invalidStringMessage(issue) };

        case z.ZodIssueCode.too_small:
            if (issue.minimum === 1) {
                return { message: 'この項目は必須項目です' };
            }
            return { message: tooSmallMessage(issue) };

        case z.ZodIssueCode.too_big:
            return { message: tooBigMessage(issue) };

        case z.ZodIssueCode.custom:
            return { message: '入力形式が間違っています' };

        case z.ZodIssueCode.invalid_intersection_types:
            return { message: '交差型のマージができませんでした' };

        case z.ZodIssueCode.not_multiple_of:
            return { message: `${issue.multipleOf}の倍数である必要があります` };

        case z.ZodIssueCode.not_finite:
            return { message: '有限数である必要があります' };
    }

    return { message: ctx.defaultError };
};

export default () => {
    if (initialized) return;
    initialized = true;
    z.setErrorMap(jaErrorMap);
};
