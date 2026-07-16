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
