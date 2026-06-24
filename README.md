# minazuki-ui

vue/nuxt用のUIコンポーネントライブラリ

※nuxt ^3
※vue ^3.5

## リソース

reset cssとして[@acab/reset.css](https://github.com/mayank99/reset.css)を導入しています。
そのため、本ライブラリ読み込みにおいて、上記のreset cssが読み込まれます。

また、各種色やサイズはCSS変数にて管理されています。
カラートークンの一覧・命名規則・テーマ override の詳細は[こちら](https://github.com/furutsubaki/minazuki-ui/blob/develop/docs/DESIGN.md)を参照してください。

バリデーションに関しては[zod](https://zod.dev/)のスキーマを用いて[vee-validate(v4)](https://vee-validate.logaretm.com/v4/)にて行っています。

## スタイルの基本方針

幅や余白はレスポンシブに準じつつ、8pxの倍数ルールを用いています。

## use

```shell
pnpm i -D minazuki-ui zod
```

### Nuxt（推奨: Nuxt Module）

`nuxt.config.ts` に追加するだけで、コンポーネント・コンポーザブルの auto-import、CSS 自動注入、SSR フラッシュ防止が自動で設定されます。

```ts
export default defineNuxtConfig({
    modules: ['minazuki-ui/nuxt'],
    minazukiUi: {
        // デフォルトテーマ（省略可。default: 'light'）
        theme: 'light',
        // テーマ上書き（省略可）
        themes: {
            light: {
                // brand の色相・彩度を red に変更（base/emphasis/alpha 等は自動で追従）
                roles: { brand: { hue: 'red', chroma: 'red' } }
            }
        }
    }
});
```

#### Nuxt Module オプション

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `autoImport` | `boolean` | `true` | コンポーネント・コンポーザブルの auto-import |
| `css` | `boolean` | `true` | `minazuki-ui/dist/style.css` の自動注入 |
| `theme` | `string` | `'light'` | デフォルトテーマ |
| `themes` | `Record<string, unknown>` | `{}` | テーマ上書き定義 |
| `cookieName` | `string` | `'themeId'` | テーマ保持用クッキー名 |
| `cookieMaxAge` | `number` | `31536000` | クッキーの有効期限（秒） |
| `install` | `boolean` | `false` | `app.use()` で全コンポーネントをグローバル登録（Tree Shaking 無効） |

### Nuxt（手動 Plugin）

Nuxt Module を使わない場合は手動で Plugin を設定します。

`plugins/minazuki-ui.ts`

```ts
import MinazukiUi from 'minazuki-ui';
import 'minazuki-ui/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(MinazukiUi);
});
```

## 基本入力モデル

### useFormを使用（推奨）

バリデーションなどをzodスキーマにて設定が可能。
各種フォーム入力欄を設定する場合に用いる。

```jsx
// script
import { useFormData } from 'minazuki-ui';
import { string, object } from 'zod';

const TEST_SCHEMA = object({
    test: string().max(50).min(1)
}).required();
const { canSubmit, resetForm, setValues, setFieldValue } = useFormData(TEST_SCHEMA, { test: '初期値' });
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

Nuxt Module を使う場合は `nuxt.config.ts` の `minazukiUi.themes` に設定します（上記参照）。

手動 Plugin の場合は `app.use()` の第2引数にテーマを渡します。

`plugins/minazuki-ui.ts`

```ts
import MinazukiUi from 'minazuki-ui';
import 'minazuki-ui/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(MinazukiUi, {
        themes: {
            light: {
                // 既存のライトテーマを一部上書き（brand / link の色相・彩度を red に変更）
                roles: {
                    brand: { hue: 'red', chroma: 'red' },
                    link: { hue: 'red', chroma: 'red' }
                }
            },
            dark: {
                // 既存のダークテーマを一部上書き
                roles: {
                    brand: { hue: 'red', chroma: 'red' },
                    link: { hue: 'red', chroma: 'red' }
                }
            },
            original: {
                // 新規テーマを追加した場合は、設定されていない項目はライトテーマが適用されます
                roles: {
                    brand: { hue: 'red', chroma: 'red' },
                    link: { hue: 'red', chroma: 'red' }
                }
            }
        }
    });
});
```

`hue` / `chroma` には Primitives（`red` / `orange` / `yellow` / `lime` / `green` / `teal` / `cyan` / `blue` / `indigo` / `purple` / `pink`）のキーを指定します。base/emphasis/muted/subtle/surface/alpha などの派生バリエーションは指定した hue・chroma から自動で計算されるため、個別に指定する必要はありません。

色相・彩度の数値自体を変えたい場合は `primitives` を上書きします。

```ts
nuxtApp.vueApp.use(MinazukiUi, {
    themes: {
        light: {
            primitives: { hues: { teal: 200 } } // brand が使う teal 色相そのものを変更
        }
    }
});
```

無彩色系（テキスト・背景・ボーダー等）を変える場合は `neutrals` を上書きします。

```ts
nuxtApp.vueApp.use(MinazukiUi, {
    themes: {
        light: {
            neutrals: { bgPrimary: '#ffffff' }
        }
    }
});
```

## SSRでのダークモード初期フラッシュ対策

**Nuxt Module を使う場合はクッキー管理が自動で行われます**（追加設定不要）。

手動 Plugin を使う場合は、SSR 側が localStorage を参照できないため、クッキーを使って明示的に対処してください。

`plugins/minazuki-ui.ts`

```ts
import MinazukiUi, { useTheme } from 'minazuki-ui';
import { watch } from 'vue';
import 'minazuki-ui/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    const themeCookie = useCookie<string>('themeId', { default: () => 'light' });
    const { currentTheme } = useTheme();

    // app.use の前に設定することで install 内の setTheme がクッキー値を使って SSR を描画する
    currentTheme.value = themeCookie.value;

    nuxtApp.vueApp.use(MinazukiUi);

    // テーマ変更をクッキーに同期（次回リクエスト時の SSR も正しいテーマで描画される）
    watch(currentTheme, (newTheme) => {
        themeCookie.value = newTheme;
    });
});
```

## コマンド

|コマンド|機能|
|---|---|
|pnpm dev|ホームページ起動|
|pnpm sb|storybookの起動|
