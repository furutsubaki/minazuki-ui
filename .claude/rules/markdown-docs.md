---
paths:
  - "**/*.md"
---

# Markdown ドキュメント

## ドキュメント基準

- ファイルは目的を絞って簡潔に保つ — 1 ファイル 1 トピック
- ドキュメント間のリンクは相対パスを使用（例: `../best-practice/claude-memory.md`）。GitHub の絶対 URL は使わない
- best-practice / report ドキュメントは先頭に戻りリンクを設置する（既存ファイルのパターンを参照）
- 新しいコンセプトやレポートを追加した際は、README.md の対応する表（CONCEPTS または REPORTS）を更新する

## 構成ルール

- ベストプラクティスは `best-practice/` に配置
- 実装ドキュメントは `implementation/` に配置
- レポートは `reports/` に配置
- Tips は `tips/` に配置
- 変更履歴は `changelog/<category>/` に配置

## フォーマット

- 構造化された比較には表を使用（README の CONCEPTS 表を参照）
- best-practice / implementation ドキュメントへリンクする際は、視覚的統一のため `!/tags/` のバッジ画像を使用
- 見出しは階層を守る — レベルを飛ばさない（例: `##` から `####` へ飛ばさない）
- 見出しの直後は空行を追加する
