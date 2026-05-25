# playground/nuxt4

Nuxt 4（SSR）環境で `minazuki-ui` をライブラリとして組み込んだ動作確認用アプリです。

## 起動手順

```bash
# 1. リポジトリルートで依存関係をインストール
pnpm install

# 2. ライブラリをビルド（dist/ が必要）
pnpm build-only

# 3. playground を起動
pnpm play:nuxt4
# → http://localhost:5176
```

## 確認観点

| 観点 | ページ |
| --- | --- |
| `app.use(MinazukiUi)` でグローバル `Mi*` コンポーネントが描画されること | 全ページ |
| テーマ切替でCSS変数が切り替わり、見た目が変わること | ヘッダーのボタン |
| `MiField` + zod バリデーションが日本語で表示されること | `/forms` |
| `useNotification().addNotification()` でトースト通知が表示されること | `/feedback` |
| `MiDialog` / `MiModal` / `MiDrawer` が開閉できること | `/feedback` |
| `MiTab` / `MiStep` がクリックで切り替わること | `/navigation` |
| `MiPagination` がクリックでページ変更できること | `/navigation` |
| DevTools コンソールにエラー・Vue warning が出ないこと | 全ページ |
| ページソースに SSR レンダリング結果が含まれること | 全ページ |
| `pnpm play:nuxt4:build` が型エラーなしで完了すること | - |

## 構成

```text
playground/nuxt4/
├── nuxt.config.ts         # css / transpile / devServer
├── package.json
├── tsconfig.json
└── app/                   # Nuxt 4 デフォルトの srcDir
    ├── app.vue            # ヘッダー + NuxtPage + MiNotifications
    ├── plugins/
    │   └── minazuki-ui.ts # vee-validate / i18next / app.use(MinazukiUi)
    ├── assets/
    │   └── css/
    │       └── playground.css
    └── pages/
        ├── index.vue      # basic / frame / feedback（視覚系）
        ├── forms.vue      # controls（入力系）
        ├── feedback.vue   # feedback（通知・オーバーレイ系）
        └── navigation.vue # navigation
```

## 既知の制約

- `useTheme` は SSR サーバー側で常に `'light'` を初期値として使用し、クライアント側で `localStorage` から復元します。初回アクセス時に `data-theme` 属性のハイドレーション差分が出る可能性があります。

## 注意事項

- このディレクトリは npm 配布物に含まれません（ルート `package.json` の `files` フィールドで除外済み）
- `minazuki-ui` は `workspace:*` 経由でローカルビルド成果物を参照します
- **起動前に必ず `pnpm build-only` でライブラリをビルドしてください**
