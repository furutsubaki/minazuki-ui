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

- `src/index.ts` — ライブラリのルート。Vue プラグインとして `install()` を提供し、全コンポーネントを `Mi{ComponentName}` の形でグローバル登録する。コンポーザブル・ディレクティブも個別エクスポートされる。
- `src/nuxt/module.ts` — Nuxt Module のエントリーポイント。`minazuki-ui/nuxt` として配布される。auto-import・CSS 注入・テーマ設定・SSR フラッシュ防止を自動で設定する。

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
│   ├── nuxt-map.ts         # Nuxt Module の auto-import 用コンポーネントマップ（直接編集禁止）
│   ├── basic/
│   ├── controls/
│   ├── feedback/
│   ├── frame/
│   ├── inner-parts/
│   └── navigation/
├── composables/            # useFormData / useNotification / useTheme
├── directives/             # useOutsideClick など
├── nuxt/                   # Nuxt Module 実装（minazuki-ui/nuxt エントリーポイント）
│   ├── module.ts           # defineNuxtModule 本体（auto-import / CSS / テーマ設定）
│   ├── composable-map.ts   # Nuxt auto-import 対象のコンポーザブル一覧
│   ├── env.d.ts            # Nuxt ランタイム型補完
│   └── runtime/
│       └── plugin.ts       # Nuxt runtime plugin（SSR フラッシュ防止・テーマ初期化）
├── plugins/                # init-validate など
├── stores/
├── utils/                  # formatter / url / const など汎用ユーティリティ
├── stories/                # Storybook ストーリー（components/ と同じカテゴリ構成）
└── test/                   # ユニットテスト（components/ composables/ directives/ utils/ と同じカテゴリ構成）

playground/
├── README.md               # 概要・使い方
├── shared/                 # 3 環境共通のページ本文・CSS・validate（単一ソース）
│   ├── pages/              # ページコンポーネント（HomePage / FormsPage / FeedbackPage / NavigationPage）
│   ├── styles/
│   │   └── playground.css  # playground 共通スタイル
│   └── validate.ts         # vee-validate 初期化（setupValidate）
├── vue/                    # Vite + Vue 3 動作確認環境
│   ├── src/
│   │   ├── App.vue
│   │   └── main.ts
│   └── dist/               # ビルド出力（lint 除外対象）
├── nuxt3/                  # Nuxt 3 動作確認環境（SSR 対応確認用）
│   ├── pages/              # shared/pages/ への薄いラッパー（直接編集禁止）
│   ├── plugins/
│   ├── .nuxt/              # 開発ビルドキャッシュ（lint 除外対象）
│   └── .output/            # SSR ビルド出力（lint 除外対象）
└── nuxt4/                  # Nuxt 4 動作確認環境（SSR 対応確認用）
    ├── app/
    │   ├── pages/          # shared/pages/ への薄いラッパー（直接編集禁止）
    │   └── plugins/
    ├── .nuxt/              # 開発ビルドキャッシュ（lint 除外対象）
    └── .output/            # SSR ビルド出力（lint 除外対象）
```

`playground/` は npm 配布物に含まれない（`files` フィールドで除外済み）。各環境は `workspace:*` で本ライブラリを参照。`playground/shared` も同様に workspace パッケージとして管理される。

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
もし3環境をすべて確認する必要がある場合は、並列で確認を進めてください。
また完了したらplaygroundのサーバーは落としてください。

| 環境 | 起動コマンド | 用途 |
| --- | --- | --- |
| Vite + Vue 3 | `cd playground/vue && pnpm dev` | CSR 動作確認 |
| Nuxt 3 | `cd playground/nuxt3 && pnpm dev` | SSR / Nuxt 3 動作確認 |
| Nuxt 4 | `cd playground/nuxt4 && pnpm dev` | SSR / Nuxt 4 動作確認 |

#### ページ本文の編集先

ページのサンプルコード（4 種: Home / Forms / Feedback / Navigation）は **`playground/shared/pages/`** に集約されています。
各環境の `pages/` は `shared/pages/` への薄いラッパーなので**直接編集しないこと**。

| ファイル | 対応ページ |
| --- | --- |
| `playground/shared/pages/HomePage.vue` | Home（`/`） |
| `playground/shared/pages/FormsPage.vue` | Forms（`/forms`） |
| `playground/shared/pages/FeedbackPage.vue` | Feedback（`/feedback`） |
| `playground/shared/pages/NavigationPage.vue` | Navigation（`/navigation`） |

playground 共通スタイルは `playground/shared/styles/playground.css`、vee-validate 初期化は `playground/shared/validate.ts` を編集する。

#### 対応ルール

- 新規コンポーネントを追加した場合: `playground/shared/pages/` の対応ページに使用例を追加する（1 ファイルの修正で 3 環境に反映）
- 既存コンポーネントの Props・emit・動作を変更した場合: `playground/shared/pages/` の対応ファイルを更新する
- playground に該当コンポーネントのサンプルがまだ存在しない場合は `shared/pages/` に追加する
- Nuxt 3 / Nuxt 4 固有の問題（SSR フラッシュ・ハイドレーションエラー等）が確認できた場合は対処する

## 禁止事項

下記の項目は使用禁止

- `develop` `main`ブランチでの作業は禁止
- claude code関連のファイル（CLAUDE.md等）を暗黙的・自動的にコミットしないでください
  - ユーザーが明示的にコミットを依頼した場合は対象に含めて構いません
- .gitignoreを変更する場合はユーザーへ確認してください
- 作業が終わっても自動でコミットはしないでください。ユーザーが頼んだときだけコミットしてください
- issueを参考に対応をするときは、記載されている事象が現在も発生しているか、改善案の記載がある場合はそれが妥当なものか確認してから実施してください
