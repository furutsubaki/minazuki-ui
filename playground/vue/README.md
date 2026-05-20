# playground/vue

Vite + Vue 3 環境で `minazuki-ui` をライブラリとして組み込んだ動作確認用アプリです。

## 起動手順

```bash
# 1. リポジトリルートで依存関係をインストール
pnpm install

# 2. ライブラリをビルド（dist/ が必要）
pnpm build-only

# 3. playground を起動
pnpm play:vue
# → http://localhost:5174
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
| `pnpm play:vue:build` が型エラーなしで完了すること | - |

## 構成

```text
src/
├── main.ts           # 全peerDeps初期化 + app.use(MinazukiUi)
├── App.vue           # レイアウト + テーマ切替 + RouterView
├── style.css         # playground専用レイアウトCSS
├── router/
│   └── index.ts
└── views/
    ├── HomeView.vue        # basic / frame / feedback（視覚系）
    ├── FormsView.vue       # controls（入力系）
    ├── FeedbackView.vue    # feedback（通知・オーバーレイ系）
    └── NavigationView.vue  # navigation
```

## 注意事項

- このディレクトリは npm 配布物に含まれません（ルート `package.json` の `files` フィールドで除外済み）
- `minazuki-ui` は `workspace:*` 経由でローカルビルド成果物を参照します
- **起動前に必ず `pnpm build-only` でライブラリをビルドしてください**
