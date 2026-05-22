# CLAUDE.md

このファイルは、リポジトリ内のコードを操作する際に Claude Code (claude.ai/code) へ提供するガイダンスです。

## プロジェクト概要

Vue 3 / Nuxt 3 以上向けの UI コンポーネントライブラリ。npm パッケージとして公開されており、ESM / UMD の両形式にビルドされる。

## コマンド

```bash
pnpm build            # フルビルド（型チェック + Vite ビルド）
pnpm build-only       # Vite ビルドのみ
pnpm type-check       # vue-tsc による型チェック
pnpm lint             # ESLint + Stylelint
pnpm lint:fix         # ESLint + Stylelint 自動修正
pnpm sb               # Storybook 開発サーバー（port 6006）
pnpm sb:test          # Storybook ビジュアルテスト
pnpm test             # Vitest ウォッチモード（TDD用）
pnpm test:run         # Vitest 単発実行
pnpm test:coverage    # カバレッジレポート生成
pnpm create-component-d  # src/components/index.ts を自動生成
```

## アーキテクチャ

### エントリーポイント

`src/index.ts` がライブラリのルート。Vue プラグインとして `install()` を提供し、全コンポーネントを `Mi{ComponentName}` の形でグローバル登録する。コンポーザブル・ディレクティブも個別エクスポートされる。

### ディレクトリ構成

```text
src/
├── assets/
│   ├── css/
│   │   ├── variables.css   # CSS 変数・テーマ定義
│   │   ├── style.css       # ベーススタイル
│   │   └── override.css
│   └── ts/
├── components/
│   ├── index.ts            # 自動生成ファイル（直接編集禁止。pnpm create-component-d で再生成）
│   ├── basic/
│   ├── controls/
│   ├── feedback/
│   ├── frame/
│   ├── inner-parts/
│   └── navigation/
├── composables/            # useFormData / useNotification / useTheme
├── directives/             # useOutsideClick など
├── plugins/                # init-validate など
├── stores/
├── utils/                  # formatter / url / const など汎用ユーティリティ
├── stories/                # Storybook ストーリー（components/ と同じカテゴリ構成）
└── test/                   # ユニットテスト（components/ composables/ directives/ utils/ と同じカテゴリ構成）

playground/
├── README.md               # 概要・使い方
├── vue/                    # Vite + Vue 3 動作確認環境
│   ├── src/
│   │   ├── views/          # カテゴリ別サンプルページ
│   │   ├── App.vue
│   │   └── main.ts
│   └── dist/               # ビルド出力（lint 除外対象）
├── nuxt3/                  # Nuxt 3 動作確認環境（SSR 対応確認用）
│   ├── pages/              # カテゴリ別サンプルページ
│   ├── plugins/
│   ├── .nuxt/              # 開発ビルドキャッシュ（lint 除外対象）
│   └── .output/            # SSR ビルド出力（lint 除外対象）
└── nuxt4/                  # Nuxt 4 動作確認環境（SSR 対応確認用）
    ├── app/
    │   ├── pages/          # カテゴリ別サンプルページ
    │   └── plugins/
    ├── .nuxt/              # 開発ビルドキャッシュ（lint 除外対象）
    └── .output/            # SSR ビルド出力（lint 除外対象）
```

`playground/` は npm 配布物に含まれない（`files` フィールドで除外済み）。各環境は `workspace:*` で本ライブラリを参照。

### テーマシステム

`useTheme` コンポーザブルと CSS 変数で構成。`lodash.merge` による深いマージでカスタムテーマを適用する。プラグインインストール時に `options.themes` を渡して複数テーマを登録できる。

### ビルド出力

Vite + vite-plugin-dts で `dist/` に出力。`index.js`（ESM・ツリーシェイカブル）と `index.umd.cjs`（UMD）の 2 形式 + 型定義ファイル。

### ピア依存関係

vue, vee-validate, zod, vue-router, lucide-vue-next, dayjs, i18next 等は peerDependencies として扱い、ライブラリ自身はバンドルしない。

## プロジェクト固有の指示

ライブラリやAPIのドキュメント参照、コード生成、セットアップや設定手順が必要な場合は、
常にContext7 MCPを使用してください。明示的に依頼しなくても自動的に使用してください。

### playground の整備

コンポーネントを追加・修正した場合は、必要に応じて `playground/` も整備してください。

playground は 3 環境あります。基本的に 3 環境すべてのサンプルを揃えてください。

| 環境 | パス | 用途 | 起動コマンド |
| --- | --- | --- | --- |
| Vite + Vue 3 | `playground/vue/src/views/` | CSR 動作確認 | `cd playground/vue && pnpm dev` |
| Nuxt 3 | `playground/nuxt3/pages/` | SSR / Nuxt 3 動作確認 | `cd playground/nuxt3 && pnpm dev` |
| Nuxt 4 | `playground/nuxt4/app/pages/` | SSR / Nuxt 4 動作確認 | `cd playground/nuxt4 && pnpm dev` |

#### 対応ルール

- 新規コンポーネントを追加した場合: 3 環境すべてのカテゴリ対応ページに使用例を追加する
- 既存コンポーネントの Props・emit・動作を変更した場合: 3 環境すべての対応するサンプルコードも更新する
- playground に該当コンポーネントのサンプルがまだ存在しない場合は新規作成する
- Nuxt 3 / Nuxt 4 固有の問題（SSR フラッシュ・ハイドレーションエラー等）が確認できた場合は対処する

## 禁止事項

下記の項目は使用禁止

- `develop` `main`ブランチでの作業は禁止
- claude code関連のファイル（CLAUDE.md等）を暗黙的・自動的にコミットしないでください
  - ユーザーが明示的にコミットを依頼した場合は対象に含めて構いません
- .gitignoreを変更する場合はユーザーへ確認してください
- 作業が終わっても自動でコミットはしないでください。ユーザーが頼んだときだけコミットしてください
- issueを参考に対応をするときは、記載されている事象が現在も発生しているか、改善案の記載がある場合はそれが妥当なものか確認してから実施してください
