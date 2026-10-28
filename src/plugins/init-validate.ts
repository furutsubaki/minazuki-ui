import { z } from 'zod';

type RawIssue = z.core.$ZodRawIssue;
type TooSmallIssue = z.core.$ZodRawIssue<z.core.$ZodIssueTooSmall>;
type TooBigIssue = z.core.$ZodRawIssue<z.core.$ZodIssueTooBig>;
type FormatIssue = z.core.$ZodRawIssue<z.core.$ZodIssueInvalidStringFormat>;

const TYPE_LABELS: Record<string, string> = {
    function: '関数',
    number: '数値',
    string: '文字列',
    nan: 'NaN',
    int: '整数',
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

const quoteList = (values: readonly unknown[]) => values.map((v) => `'${String(v)}'`).join(', ');

function receivedType(issue: RawIssue): string {
    // zod 4 は NaN / Infinity / Invalid Date のときだけ received を付ける
    if (issue.received === 'NaN') return 'nan';
    if (typeof issue.received === 'string') return issue.received;
    const input = issue.input;
    if (Array.isArray(input)) return 'array';
    if (input instanceof Date) return 'date';
    if (input instanceof Map) return 'map';
    if (input instanceof Set) return 'set';
    return typeof input;
}

function invalidFormatMessage(issue: FormatIssue): string {
    switch (issue.format) {
        case 'includes':
            return `"${String(issue.includes)}"を含む文字列である必要があります`;
        case 'starts_with':
            return `"${String(issue.prefix)}"で始まる文字列である必要があります`;
        case 'ends_with':
            return `"${String(issue.suffix)}"で終わる文字列である必要があります`;
    }
    const label = VALIDATION_LABELS[issue.format];
    if (label) return `${label}の形式で入力してください`;
    return '入力形式が間違っています';
}

function tooSmallMessage(issue: TooSmallIssue): string {
    const v = String(issue.minimum);
    switch (issue.origin) {
        case 'string':
            if (issue.exact) return `${v}文字の文字列である必要があります`;
            if (issue.inclusive) return `${v}文字以上の文字列である必要があります`;
            return `${v}文字より長い文字列である必要があります`;
        case 'number':
        case 'int':
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

function tooBigMessage(issue: TooBigIssue): string {
    const v = String(issue.maximum);
    switch (issue.origin) {
        case 'string':
            if (issue.exact) return `${v}文字の文字列である必要があります`;
            if (issue.inclusive) return `${v}文字以下の文字列である必要があります`;
            return `${v}文字より短い文字列である必要があります`;
        case 'number':
        case 'int':
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

export const jaErrorMap: z.core.$ZodErrorMap = (issue) => {
    switch (issue.code) {
        case 'invalid_type':
            if ([null, undefined, ''].includes(issue.input as never)) return 'この項目は必須項目です';
            if (issue.received === 'Infinity') return '有限数である必要があります';
            if (issue.expected === 'date' && issue.input instanceof Date) return '間違った日時データです';
            return `${TYPE_LABELS[issue.expected] ?? issue.expected}での入力を期待していますが、${TYPE_LABELS[receivedType(issue)] ?? receivedType(issue)}が入力されました`;

        case 'invalid_value':
            if ((issue.inst?._zod.def as { type?: string } | undefined)?.type === 'literal') {
                if (issue.values.some(Boolean) && !issue.input) return 'チェックしてください';
                return `無効なリテラル値です。${issue.values.map(String).join(', ')}を入力してください`;
            }
            return `'${String(issue.input)}'は無効な値です。${quoteList(issue.values)}で入力してください`;

        case 'unrecognized_keys':
            return `オブジェクトのキー${quoteList(issue.keys)}が識別できません`;

        case 'invalid_union':
            if (issue.discriminator && Array.isArray(issue.options)) {
                return `無効な識別子です。${quoteList(issue.options)}で入力してください`;
            }
            return '入力形式が間違っています';

        case 'invalid_key':
        case 'invalid_element': {
            // 内側の issue は customError を通らず英語のまま確定しているため、ここで訳し直す
            const inner = issue.issues[0];
            const message = inner && jaErrorMap({ ...inner, input: issue.input } as RawIssue);
            return typeof message === 'string' ? message : '入力形式が間違っています';
        }

        case 'invalid_format':
            return invalidFormatMessage(issue);

        case 'too_small':
            if (issue.minimum === 1) return 'この項目は必須項目です';
            return tooSmallMessage(issue);

        case 'too_big':
            return tooBigMessage(issue);

        case 'custom':
            return '入力形式が間違っています';

        case 'not_multiple_of':
            return `${issue.divisor}の倍数である必要があります`;
    }

    return undefined;
};

export default () => {
    // zod の設定はプロセス全体で共有されるため、他から上書きされても呼び直せば戻せるよう毎回適用する
    z.config({ customError: jaErrorMap });
};
