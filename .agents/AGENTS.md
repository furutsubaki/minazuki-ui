# AGENTS.md

このファイルは、リポジトリ内のコードを操作する際に AI へ提供するガイダンスです。

## アーキテクチャ

### エントリーポイント

- `src/index.ts` — ライブラリのルート。Vue プラグインとして `install()` を提供し、全コンポーネントを `Mi{ComponentName}` の形でグローバル登録する。コンポーザブル・ディレクティブも個別エクスポートされる。
- `src/nuxt/module.ts` — Nuxt Module のエントリーポイント。`minazuki-ui/nuxt` として配布される。auto-import・CSS 注入・テーマ設定・SSR フラッシュ防止を自動で設定する。

### デザインガイド

@docs/DESIGN.md を参照してください。

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

## CI / Dependabot

`.github/workflows/dependabot-auto-merge.yml` の自動マージ対象は以下に限定している。

- GitHub Actions の minor/patch 更新
- npm の **devDependencies** の minor/patch 更新

`dependencies` / `peerDependencies`（vue, zod, lucide-vue-next 等）は本ライブラリの利用側プロジェクトに直接影響するため、minor 更新であっても自動マージの対象外とし、手動レビューを必須とする。`update-type` だけで判定すると production 系の依存も自動マージされてしまうため、`dependabot/fetch-metadata` の `dependency-type` 出力（`direct:development` かどうか）と `package-ecosystem` 出力を併用して判定すること。

## 禁止事項

- `develop` `main`ブランチでの作業は禁止
- `src/components/index.ts` は自動生成ファイル — 直接編集禁止（`pnpm create-component-d` で再生成）
- `src/components/nuxt-map.ts` は Nuxt auto-import 用マップ — 直接編集禁止
