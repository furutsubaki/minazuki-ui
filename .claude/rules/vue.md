---
paths:
  - "src/**/*.vue"
---

# vueファイルコーディング規約

基本的にはtypescript.mdのコーディング規約を参照

- propsはdefineProps()のGenericsで定義し必要に応じてwithDefaults()で初期値を設定
- styleタグは`scoped`を必ず設定
- setup構文を使用すること
- 各ディレクティブの記述順は下記とする
  - ```
  <script setup lang="ts"></script>
  <template></template>
  <style scoped></style>
  ```

## 命名規則

## 禁止事項
