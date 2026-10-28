# MIGRATION.md — v1 → v2

v2 では OKLCH ベースの 2 層カラートークンシステムへの移行に伴い、テーマ設定オプションの名称・型を変更しました。
自動での互換は行っていないため、以下の対応表に従って設定を書き換えてください。

## テーマ設定オプションの変更

| 用途 | v1 | v2 |
|---|---|---|
| デフォルトテーマ ID | `theme?: string` | `themeId?: string` |
| テーマ上書き定義 | `themes?: Record<string, unknown>` | `theme?: Record<string, unknown>`（`MiThemeOverride` 形式） |

`theme` という同じキー名が v1/v2 で異なる意味（テーマ名の文字列 → 上書き定義のオブジェクト）を持つため、
v1 の設定をそのまま残すと **エラーなく無視される**（テーマ ID が反映されない、上書き定義が読まれない）点に注意してください。

## Nuxt Module (`minazuki-ui/nuxt`) の場合

```diff
 export default defineNuxtConfig({
   modules: ['minazuki-ui/nuxt'],
   minazukiUi: {
-    theme: 'dark',
-    themes: {
+    themeId: 'dark',
+    theme: {
       statuses: { brand: { hue: 'blue', chroma: 'blue' } }
     }
   }
 });
```

## 手動 Plugin (`app.use(MinazukiUi, options)`) の場合

```diff
 nuxtApp.vueApp.use(MinazukiUi, {
-  theme: 'dark',
-  themes: {
+  themeId: 'dark',
+  theme: {
     statuses: { brand: { hue: 'blue', chroma: 'blue' } }
   }
 });
```

## カラートークン名の変更

Semantic トークンの旧名（`--color-status-*` / `--color-theme-*`）は後方互換エイリアスとして残っていますが、
新規コードでは新トークン（`--color-*`）を使用してください。詳細は [DESIGN.md §2.3 後方互換エイリアス](./DESIGN.md#23-後方互換エイリアス) を参照してください。

## v3 → v4（zod 4 への移行）

zod 3 系の脆弱性（GHSA-mrhx-c7xc-m3w5）は zod 4.6.6 以降でしか修正されないため、zod 4 必須に切り替えました。

### peerDependencies

| パッケージ | v3 | v4 |
| --- | --- | --- |
| `zod` | `>=3.20.0 <4.0.0` | `^4.6.6` |
| `vee-validate` | `>=4.9.0` | `>=4.15.1 <5` |
| `@vee-validate/rules` | `>=4.9.0` | `>=4.15.1 <5` |
| `@vee-validate/zod` | `>=4.9.0`（optional） | 不要（削除） |

`@vee-validate/zod` は zod 3 専用のため、zod と vee-validate の接続は `useFormData` が内部で行います。`useForm` を直接使い `toTypedSchema` で繋いでいた場合は、`useFormData` へ置き換えてください。

### `useFormData` の型引数

型引数の意味が「フォーム値の型」から「スキーマの型」へ変わりました。通常は型引数を省略すれば推論されます。

```ts
// v3
useFormData<FormValues>(schema, initialValues);

// v4（型引数は省略する）
useFormData(schema, initialValues);
```

`handleSubmit` のコールバックには、`.transform()` などを通したスキーマの出力値が渡ります。

### バリデーションの日本語化

`zod-i18n-map` を使った日本語化の手順は zod 3 専用のため廃止しました。`initValidate()` を呼んでください（README の「バリデーションの日本語化」）。`initValidate()` は呼ぶたびに設定を適用し直すため、他から上書きされた場合も呼び直せば戻ります。

### スキーマの書き方

zod 4 の変更点は [zod の移行ガイド](https://zod.dev/v4/changelog) を参照してください。minazuki-ui のコンポーネントに関わる点は次のとおりです。

- `object().required()` は各フィールドを `nonoptional` で包みます。`schema.shape.xxx` をそのまま `:schema` に渡せます
