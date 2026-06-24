---
description: 'Vue playground (Vite + Vue 3) を起動し、minazuki-ui の動作を全ページ Playwright で確認するスキル。手動呼び出し専用: /run-vue'
---
# run-vue

**役割**: `playground/vue/` の動作確認環境を起動し、4 ページ全てを Playwright でバックグラウンド確認する。

## 前提条件

- `dist/` が存在しない場合はビルドを先に実行する
- dev server は port **5174** で起動する

---

## 手順

### Step 1: ライブラリビルド確認

```bash
# dist/ の存在を確認
ls dist/index.js 2>/dev/null && echo "OK" || echo "MISSING"
```

`MISSING` の場合は以下を実行してからStep 2へ：

```bash
pnpm build-only
```

### Step 2: dev server 起動

`dangerouslyDisableSandbox: true` を付けてバックグラウンドで起動し、`http://localhost:5174` が応答するまで待つ（最大 30 秒）：

```bash
pnpm play:vue
```

HTTP 200 が返れば起動完了：

```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:5174
```

### Step 3: Playwright 確認をバックグラウンド Agent に委譲

dev server 応答確認後、以下の Agent を `run_in_background: true` で起動する：

**Agent prompt（そのまま渡す）:**

```
Vue playground の Playwright 確認を担当してほしい。dev server は http://localhost:5174 で既に起動済み。

Playwright MCP ツール（mcp__playwright__browser_navigate 等）を使って以下を順番に実行し、最後に結果レポートを返すこと。

## 確認手順

### Home ページ (/)
1. browser_navigate で http://localhost:5174/ にアクセス
2. browser_take_screenshot でスクリーンショット取得（filename: .playwright-mcp/vue-home.png）
3. browser_console_messages (level: warning) でエラーを収集
4. 確認: Mi* コンポーネントが描画されている、Vue warning がない

### Forms ページ (/forms)
1. browser_navigate で http://localhost:5174/forms にアクセス
2. browser_take_screenshot（filename: .playwright-mcp/vue-forms.png）
3. browser_console_messages (level: warning) で収集
4. 確認: MiField が表示されている

### Feedback ページ (/feedback)
1. browser_navigate で http://localhost:5174/feedback にアクセス
2. browser_take_screenshot（filename: .playwright-mcp/vue-feedback.png）
3. browser_console_messages (level: warning) で収集
4. 確認: MiAlert が表示されている

### Navigation ページ (/navigation)
1. browser_navigate で http://localhost:5174/navigation にアクセス
2. browser_take_screenshot（filename: .playwright-mcp/vue-navigation.png）
3. browser_console_messages (level: warning) で収集
4. 確認: MiTab, MiPagination が表示されている

## 後処理
確認完了後、`rm -rf .playwright-mcp` で一時ファイルを削除すること。

## 返却フォーマット
以下の形式で結果を返す：

## Vue Playwright 確認結果

| ページ | 描画 | コンソールエラー |
|--------|------|----------------|
| Home (/) | ✅/❌ | 件数 |
| Forms (/forms) | ✅/❌ | 件数 |
| Feedback (/feedback) | ✅/❌ | 件数 |
| Navigation (/navigation) | ✅/❌ | 件数 |

### エラー詳細
（エラーがあれば列挙）

### 総合判定: ✅ PASS / ❌ FAIL
```

Agent 起動後は完了通知を待ち、返ってきた結果レポートをユーザーに報告する。

---

## 注意事項

- dev server 起動には `dangerouslyDisableSandbox: true` が必要（ポートバインド制限のため）
- dev server の起動に失敗した場合は、ユーザーに `pnpm play:vue` を別ターミナルで実行してもらう
