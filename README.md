# minazuki-ui

vue/nuxt用のUIコンポーネントライブラリ

※nuxt ^3
※vue ^3.5

v1 からのアップグレードでテーマ設定オプションが変更されています。詳細は [docs/MIGRATION.md](./docs/MIGRATION.md) を参照してください。

v3 からのアップグレードで zod 4 必須になり、`@vee-validate/zod` が不要になりました。詳細は [docs/MIGRATION.md](./docs/MIGRATION.md#v3--v4zod-4-への移行) を参照してください。

## リソース

reset cssとして[@acab/reset.css](https://github.com/mayank99/reset.css)を導入しています。
そのため、本ライブラリ読み込みにおいて、上記のreset cssが読み込まれます。

また、各種色やサイズはCSS変数にて管理されています。
詳細は[こちら](https://github.com/furutsubaki/minazuki-ui/blob/develop/src/assets/css/variables.css)を参照してください。

バリデーションに関しては[zod(v4)](https://zod.dev/)のスキーマを用いて[vee-validate(v4)](https://vee-validate.logaretm.com/v4/)にて行っています。
zod と vee-validate の接続は `useFormData` が内部で行うため、`@vee-validate/zod` は不要です。

## スタイルの基本方針

幅や余白はレスポンシブに準じつつ、8pxの倍数ルールを用いています。

## use

```shell
pnpm i -D minazuki-ui zod@^4.6.6
```

### Nuxt（推奨: Nuxt Module）

`nuxt.config.ts` に追加するだけで、コンポーネント・コンポーザブルの auto-import、CSS 自動注入、SSR フラッシュ防止が自動で設定されます。

```ts
export default defineNuxtConfig({
    modules: ['minazuki-ui/nuxt'],
    minazukiUi: {
        // デフォルトテーマ ID（省略可。default: 'light'）
        themeId: 'light',
        // テーマ上書き（省略可）
        theme: {
            // Brand を Blue に変更する例
            statuses: { brand: { hue: 'blue', chroma: 'blue' } }
        }
    }
});
```

#### Nuxt Module オプション

| オプション | 型 | デフォルト | 説明 |
|---|---|---|---|
| `autoImport` | `boolean` | `true` | コンポーネント・コンポーザブルの auto-import |
| `css` | `boolean` | `true` | `minazuki-ui/dist/style.css` の自動注入 |
| `themeId` | `string` | `'light'` | デフォルトテーマ ID（`'light'` or `'dark'`） |
| `theme` | `Record<string, unknown>` | `{}` | テーマ上書き定義（`MiThemeOverride` 形式） |
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

- zod スキーマを vee-validate へ渡す経路は `useFormData` だけです。`useForm` を直接使う場合に `@vee-validate/zod` の `toTypedSchema` で繋ぐ方法は zod 4 では使えません
- `handleSubmit` のコールバックには、`.transform()` などを通したスキーマの出力値が渡ります
- キー名に `[` や `]` を含む場合と、ネストしたオブジェクトのキー名に `.` を含む場合は、vee-validate 4 の path 記法で表せないため、値の読み書きとエラーの表示先が正しく決まりません。トップレベルのキー名に `.` を含む場合は、`name="[a.b]"` の形で扱えます

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

`initValidate()` を呼ぶと、zod のエラーメッセージが日本語になります（`z.config({ customError })` を設定します）。

`plugins/zod-validate.ts`

```ts
import { initValidate } from 'minazuki-ui';

export default defineNuxtPlugin(() => {
    initValidate();
});
```

zod の設定はアプリ全体で共有されます。後から別のライブラリ等がエラーマップを上書きした場合は、もう一度 `initValidate()` を呼べば日本語へ戻ります。

## テーマ設定

Nuxt Module を使う場合は `nuxt.config.ts` の `minazukiUi.theme` に設定します（上記参照）。

手動 Plugin の場合は `app.use()` の第2引数に `MiThemeOverride` を渡します。

`plugins/minazuki-ui.ts`

```ts
import MinazukiUi from 'minazuki-ui';
import 'minazuki-ui/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(MinazukiUi, {
        themeId: 'light',
        theme: {
            // Primitive: 色相角度やベース彩度を変更すると全段階に影響
            primitives: {
                hues: { teal: 200 },
                chromas: { teal: 0.12 }
            },
            // Status: 役割の紐付け先を変更
            statuses: {
                brand: { hue: 'blue', chroma: 'blue' }
            },
            // UI: 個別トークンを上書き（文字列で light/dark 共通、ペアで個別指定）
            ui: {
                link: { light: '#cc3300', dark: '#ff6644' }
            }
        }
    });
});
```

## SSRでのダークモード初期フラッシュ対策

**Nuxt Module を使う場合はクッキー管理が自動で行われます**（追加設定不要）。

手動 Plugin を使う場合は、SSR 側が localStorage を参照できないため、クッキーを使って明示的に対処してください。

`plugins/minazuki-ui.ts`

```ts
import MinazukiUi, { useTheme } from 'minazuki-ui';
import type { ThemeId } from 'minazuki-ui';
import { watch } from 'vue';
import 'minazuki-ui/dist/style.css';

export default defineNuxtPlugin((nuxtApp) => {
    const themeCookie = useCookie<ThemeId>('themeId', { default: () => 'light' });
    const { currentTheme } = useTheme();

    // app.use の前に設定することで install 内の setTheme がクッキー値を使って SSR を描画する
    currentTheme.value = themeCookie.value === 'dark' ? 'dark' : 'light';

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
