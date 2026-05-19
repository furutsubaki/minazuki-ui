#!/usr/bin/env bash
# .claude/hooks/guard-bash.sh
COMMAND="$CLAUDE_TOOL_INPUT"

# コマンド文字列を実体ベースで検査
if echo "$COMMAND" | grep -qE '\.env|credentials\.json|\.aws/credentials'; then
  echo "BLOCK: secret file access detected" >&2
  exit 2   # 2 = block、stderr の文言が LLM にフィードバックされる
fi

exit 0     # 0 = allow
