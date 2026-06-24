---
description: 'Nuxt 4 playground を起動し、minazuki-ui の SSR 含む動作を全ページ Playwright で確認するスキル。手動呼び出し専用: /run-nuxt4'
---
# run-nuxt4

**役割**: `playground/nuxt4/` の動作確認環境を起動し、4 ページ全てを Playwright でバックグラウンド確認する。SSR・Hydration の健全性も検証する。

## 前提条件

- `dist/` が存在しない場合はビルドを先に実行する
- dev server は port **5176** で起動する

---

## 手順

### Step 1: ライブラリビルド確認

```bash
# dist/ の存在を確認
ls dist/index.umd.cjs 2>/dev/null && echo "OK" || echo "MISSING"
```

`MISSING` の場合は以下を実行してからStep 2へ：

```bash
pnpm build-only
```

### Step 2: dev server 起動

`dangerouslyDisableSandbox: true` を付けてバックグラウンドで起動し、`http://localhost:5176` が応答するまで待つ（最大 60 秒 — Nuxt は Vue より起動が遅い）：

```bash
pnpm --filter playground-nuxt4 exec nuxt dev --port 5176
```

HTTP 200 が返れば起動完了：

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5176
```

### Step 3: SSR 確認（ページソース検査）

ブラウザアクセス前に `curl` でページソースを取得し、サーバー描画 HTML を確認する：

```bash
curl -s http://localhost:5176/ | grep -c 'data-v-\|<mi-\|class="mi-'
```

0 より大きければ SSR でコンポーネントが描画されている。

### Step 4: Playwright 確認をバックグラウンド Agent に委譲

dev server 応答確認後、以下の Agent を `run_in_background: true` で起動する：

**Agent prompt（そのまま渡す）:**

```
Nuxt 4 playground の Playwright 確認を担当してほしい。dev server は http://localhost:5176 で既に起動済み。

Playwright MCP ツール（mcp__playwright__browser_navigate 等）を使って以下を順番に実行し、最後に結果レポートを返すこと。

## 確認手順

### Home ページ (/)
1. browser_navigate で http://localhost:5176/ にアクセス
2. browser_take_screenshot でスクリーンショット取得（filename: .playwright-mcp/nuxt4-home.png）
3. browser_console_messages (level: warning) でエラー・警告を収集
4. 確認: Mi* コンポーネントが描画されている、Hydration エラーがない

### Forms ページ (/forms)
1. browser_navigate で http://localhost:5176/forms にアクセス
2. browser_take_screenshot（filename: .playwright-mcp/nuxt4-forms.png）
3. browser_console_messages (level: warning) で収集
4. 確認: MiField が表示されている、Hydration エラーがない

### Feedback ページ (/feedback)
1. browser_navigate で http://localhost:5176/feedback にアクセス
2. browser_take_screenshot（filename: .playwright-mcp/nuxt4-feedback.png）
3. browser_console_messages (level: warning) で収集
4. 確認: MiAlert が表示されている

### Navigation ページ (/navigation)
1. browser_navigate で http://localhost:5176/navigation にアクセス
2. browser_take_screenshot（filename: .playwright-mcp/nuxt4-navigation.png）
3. browser_console_messages (level: warning) で収集
4. 確認: MiTab, MiPagination が表示されている

## 既知の制約（FAIL にしない）
- MiProgress / MiTab の Hydration style mismatch（check-only、同値のため実害なし）

## 後処理
確認完了後、`rm -rf .playwright-mcp` で一時ファイルを削除すること。

## 返却フォーマット
以下の形式で結果を返す：

## Nuxt 4 Playwright 確認結果

| ページ | 描画 | Hydration エラー | コンソールエラー |
|--------|------|-----------------|----------------|
| Home (/) | ✅/❌ | 件数（既知除く） | 件数 |
| Forms (/forms) | ✅/❌ | 件数（既知除く） | 件数 |
| Feedback (/feedback) | ✅/❌ | 件数（既知除く） | 件数 |
| Navigation (/navigation) | ✅/❌ | 件数（既知除く） | 件数 |

### 既知の制約（FAIL 対象外）
- （あれば記載）

### エラー詳細
（エラーがあれば列挙）

### 総合判定: ✅ PASS / ❌ FAIL
```

Agent 起動後は完了通知を待ち、返ってきた結果レポートをユーザーに報告する。

### Step 5: SSR 確認結果と合算してユーザーに最終報告

Step 3 の SSR 確認結果と Step 4 の Agent 結果を合わせて、以下の形式で報告する：

```
## Nuxt 4 Playground 動作確認結果

### SSR 確認
- サーバー描画 HTML にコンポーネントマークアップ: ✅/❌ (N 箇所)

（Agent からのレポートをそのまま続ける）
```

---

## 注意事項

- dev server 起動には `dangerouslyDisableSandbox: true` が必要（ポートバインド制限のため）
- dev server の起動に失敗した場合は、ユーザーに `pnpm play:nuxt4` を別ターミナルで実行してもらう
- Nuxt は cold start が 30〜60 秒かかることがある
- ビルド確認に使うのは `dist/index.umd.cjs`（UMD 形式）
