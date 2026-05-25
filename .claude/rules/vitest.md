---
paths:
  - "src/test/**/*.ts"
  - "src/test/**/*.spec.ts"
---

# テスト規約

## カバレッジ要件

- **テスト作成時はカバレッジ 100% を厳守する**
  - 行・分岐・関数・ステートメント全てで 100% を目指す
  - 検証は `pnpm test:coverage` で実施する
  - 到達困難なコードがある場合は安易に除外せず、まずテスト可能になるようリファクタを検討する

## Flaky Test を防ぐルール

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
