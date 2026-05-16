# CLAUDE.md

このファイルは、リポジトリ内のコードを操作する際に Claude Code (claude.ai/code) へ提供するガイダンスです。

## プロジェクト概要

Vue 3 / Nuxt 3 向けの UI コンポーネントライブラリ。npm パッケージとして公開されており、ESM / UMD の両形式にビルドされる。

## コマンド

```bash
pnpm dev              # 開発サーバー起動
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
├── plugins/
├── stores/
├── stories/                # Storybook ストーリー（components/ と同じカテゴリ構成）
└── test/                   # ユニットテスト（components/ composables/ と同じカテゴリ構成）
```

### テーマシステム

`useTheme` コンポーザブルと CSS 変数で構成。`lodash.merge` による深いマージでカスタムテーマを適用する。プラグインインストール時に `options.themes` を渡して複数テーマを登録できる。

### ビルド出力

Vite + vite-plugin-dts で `dist/` に出力。`index.js`（ESM・ツリーシェイカブル）と `index.umd.cjs`（UMD）の 2 形式 + 型定義ファイル。

### ピア依存関係

vue, vee-validate, zod, pinia, vue-router, lucide-vue-next, dayjs, i18next 等は peerDependencies として扱い、ライブラリ自身はバンドルしない。

## テスト規約

### カバレッジ要件

- **テスト作成時はカバレッジ 100% を厳守する**
  - 行・分岐・関数・ステートメント全てで 100% を目指す
  - 検証は `pnpm test:coverage` で実施する
  - 到達困難なコードがある場合は安易に除外せず、まずテスト可能になるようリファクタを検討する

### Flaky Test を防ぐルール

- **タイマー依存のテストは必ず `vi.useFakeTimers()` を使う**
  - `setTimeout` / `setInterval` / `Date.now()` の実時間に依存するテストは CI 環境の負荷でブレる
  - テスト終了後は `vi.useRealTimers()` で必ず戻す（`afterEach` 推奨）
  - タイマーの進行は `vi.advanceTimersByTime(ms)` で明示的に制御する
- **テスト間で共有するミュータブルな状態は `beforeEach` でリセットする**
  - モジュールレベルのシングルトン（Pinia ストア、コンポーザブルのグローバル `ref` など）は各テスト前に初期化する
- **`Math.random()` や `Date.now()` を直接テストの期待値に使わない**
  - 非決定的な値を `expect()` に渡すと結果が毎回変わる
- **`isVisible()` は `<Transition>` 内の `v-show` では使わない**
  - happy-dom は CSS トランジションを実行しないため `display` スタイルが反映されないことがある
  - 代わりに `(el as HTMLElement).style.display` を直接検査する

## プロジェクト固有の指示

ライブラリやAPIのドキュメント参照、コード生成、セットアップや設定手順が必要な場合は、
常にContext7 MCPを使用してください。明示的に依頼しなくても自動的に使用してください。

## 禁止事項

下記の項目は使用禁止

- `develop` `main`ブランチでの作業は禁止
- claude code関連のファイルを自動的にコミットしないでください
  - 当該ファイルはユーザーが手動でコミットしてください
- .gitignoreを変更しないでください
  - 当該ファイルを変更する場合はユーザーが手動で行ってください（コミットも同様）
- 作業が終わっても自動でコミットはしないでください。ユーザーが頼んだときだけコミットしてください
- issueを参考に対応をするときは、記載されている事象が現在も発生しているか、改善案の記載がある場合はそれが妥当なものか確認してから実施してください
