# minazuki-ui

vue/nuxt用のUIコンポーネントライブラリ

※nuxt ^3

## リソース

reset cssとして[@acab/reset.css](https://github.com/mayank99/reset.css)を導入しています。
そのため、本ライブラリ読み込みにおいて、上記のreset cssが読み込まれます。

また、各種色やサイズはCSS変数にて管理されています。
詳細は[こちら](https://github.com/furutsubaki/minazuki-ui/blob/develop/src/assets/css/variables.css)を参照してください。

バリデーションに関しては[zod](https://zod.dev/)のスキーマを用いて[vee-validate(v4)](https://vee-validate.logaretm.com/v4/)にて行っています。

## スタイルの基本方針

幅や余白はレスポンシブに準じつつ、8pxの倍数ルールを用いています。

## use

```shell
pnpm i -D minazuki-ui zod
```

### Nuxt

`plugins/minazuki-ui.ts`

```ts
import MinazukiUi, { useFormData, useNotification, useTheme } from 'minazuki-ui';
import 'minazuki-ui/dist/style.css';

declare module '#app' {
    interface NuxtApp {
        $useFormData: typeof useFormData;
        $useNotification: typeof useNotification;
        $useTheme: typeof useTheme;
    }
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(MinazukiUi);
    return {
        provide: {
            useFormData,
            useNotification,
            useTheme
        }
    };
});
```

## 基本入力モデル

### useFormを使用（推奨）

バリデーションなどをzodスキーマにて設定が可能。
各種フォーム入力欄を設定する場合に用いる。

```jsx
// script
import { string, object } from 'zod';

const { $useFormData } = useNuxtApp();
const TEST_SCHEMA = object({
    test: string().max(50).min(1)
}).required();
const { canSubmit, resetForm, setValues, setFieldValue } = $useFormData(TEST_SCHEMA, { test: '初期値' });
setValues({
    test: '親から複数の項目に対して、値をセット'
})
setFieldValue('test', '親から任意の項目に対して、値をセット')

// template
<MiField name="test" :schema="TEST_SCHEMA.shape.test" />
<MiButton :disabled="!canSubmit">投稿</MiButton>
```

### v-modelを使用

zod schemaによる細かいバリデーション制御を行わず、親コンポーネント側で独自に行うケースか、
バリデーションを使用せずに手軽に使いたい場合に用いることができる。

```jsx
// script
const model = ref<string>('初期値');

// template
<MiField v-model="model" />
```

## バリデーションの日本語化

必要に応じて各プロジェクトで実施してください

```shell
pnpm i -D zod-i18n-map i18next vee-validate
```

`plugins/zod-validate.ts`

```ts
import { init } from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import translation from 'zod-i18n-map/locales/ja/zod.json';

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    switch (issue.code) {
        case z.ZodIssueCode.invalid_literal:
            if (issue.expected && !issue.received) {
                return { message: 'チェックしてください。' };
            }
            break;
        case z.ZodIssueCode.too_small:
            if (issue.minimum === 1) {
                return { message: 'この項目は必須項目です。' };
            }
            break;
        case z.ZodIssueCode.invalid_type:
            if ([null, undefined, ''].includes(ctx.data)) {
                return { message: 'この項目は必須項目です。' };
            }
            break;
    }
    return zodI18nMap(issue, ctx);
};

export default defineNuxtPlugin(() => {
    // zod
    init({
        lng: 'ja',
        resources: {
            ja: { zod: translation }
        }
    });
    z.setErrorMap(customErrorMap);
});
```

## テーマ設定


`plugins/minazuki-ui.ts`

テーマカラーを上書きするにはpulginsでuseする際に、第2引数にテーマを設定します。

```ts
import MinazukiUi, { useFormData, useNotification, useTheme } from 'minazuki-ui';
import 'minazuki-ui/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(MinazukiUi, {
        themes: {
            light: {
                // 既存のライトテーマを一部上書き
                status: {
                    brand: '--color-base-red'
                },
                theme: {
                    link: '--color-base-red-alpha',
                    linkHover: '--color-base-red'
                }
            },
            dark: {
                // 既存のダークテーマを一部上書き
                status: {
                    brand: '--color-base-red'
                },
                theme: {
                    link: '--color-base-red-alpha',
                    linkHover: '--color-base-red'
                }
            },
            original: {
                // 新規テーマを追加した場合は、設定されていない項目はライトテーマが適用されます
                status: {
                    brand: '--color-base-red'
                },
                theme: {
                    link: '--color-base-red-alpha',
                    linkHover: '--color-base-red'
                }
            }
        }
    });

    return {
        provide: {
            useFormData,
            useNotification,
            useTheme
        }
    };
});
```

## コマンド

|コマンド|機能|
|---|---|
|pnpm dev|ホームページ起動|
|pnpm sb|storybookの起動|
