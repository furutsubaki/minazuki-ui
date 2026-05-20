# playground

`minazuki-ui` をライブラリとしてインストールした状態でのローカル動作確認用環境です。

## 目的

Storybook は個別コンポーネントの UI 確認向けです。  
この playground はライブラリとして「実際のアプリに組み込んだとき」の統合動作を確認することを目的としています。

- プラグイン経由のインストール（`app.use(MinazukiUi)`）
- `Mi*` グローバルコンポーネントの登録・描画
- SSR / Hydration の健全性（Nuxt 環境）
- テーマシステム（`useTheme`）の実環境での動作

## 構成

| ディレクトリ | 環境 | 状態 | 起動コマンド |
| --- | --- | --- | --- |
| `vue/` | Vite + Vue 3 | 構築済み | `pnpm play:vue` |
| `nuxt/` | Nuxt 3+ | 構築予定 | - |

## ライブラリの参照方法

各 playground は pnpm workspace の `workspace:*` 経由でローカルビルド成果物を参照します。

```json
// playground/vue/package.json or playground/nuxt/package.json
{
  "dependencies": {
    "minazuki-ui": "workspace:*"
  }
}
```

**起動前に必ずライブラリをビルドしてください:**

```bash
# リポジトリルートで実行
pnpm build-only
```

## 注意事項

- この playground ディレクトリは npm 配布物に含まれません（`package.json` の `files` フィールドで除外済み）
- 各環境の起動コマンドや確認項目は、Vue / Nuxt の実装後に各サブディレクトリの README に記載します
