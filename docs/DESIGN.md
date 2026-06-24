# DESIGN.md — [minazuki-ui]

> このファイルはAIエージェントが正確な日本語UIを生成するためのデザイン仕様書です。
> セクションヘッダーは英語、値の説明は日本語で記述しています。

---

## 1. Visual Theme & Atmosphere

<!-- サービスの視覚的な印象、デザイン哲学を記述する -->

- **デザイン方針**: 汎用的などのサイトでも使えるデザイン。対角線にハイライトとシャドウを配置することによる立体感を出すデザインはNG。フラットな3DデザインはOK（フラットの重なり表現）
- **密度**: 中程度。業務UIほど詰め込まず、メディア型ほどゆったりでもない汎用的なバランス
- **キーワード**: Ghost UI, common

---

## 2. Color Palette & Roles

<!-- OKLCH 3層トークン設計。useTheme.ts の Primitives / Roles / Neutrals 定義に基づく -->

カラートークンは **Primitives → Roles → Semantic** の3層構造になっている。

```
Layer 1: Primitives（色相・彩度・明度スケール）
  --mi-hue-{name}, --mi-chroma-{name}, --mi-l-{step}, --mi-c-scale-{step}

Layer 2: Roles（意味づけ。role が参照する hue/chroma キーの間接参照）
  --mi-hue-{role}: var(--mi-hue-{hueKey});

Layer 3: Semantic（最終カラー。hex フォールバック + oklch() 合成）
  --color-{role}, --color-{role}-emphasis, ... 等
```

### 2.1 Layer 1: Hue / Chroma Primitives

| Name | Hue (deg) | Chroma | 用途 |
|------|-----------|--------|------|
| Red | 25 | 0.22 | Danger |
| Orange | 55 | 0.15 | Link |
| Yellow | 95 | 0.16 | Warning |
| Lime | 135 | 0.15 | Info |
| Green | 160 | 0.13 | ベース色 |
| Teal | 180 | 0.1 | Brand |
| Cyan | 200 | 0.10 | ベース色 |
| Blue | 250 | 0.15 | Success |
| Indigo | 270 | 0.15 | ベース色 |
| Purple | 310 | 0.15 | ベース色 |
| Pink | 340 | 0.15 | ベース色 |

Chroma は各色相が sRGB ガモット内で出せる最大彩度の90%（ガモット制限が厳しい色相はその上限値）。CSS 変数名は `--mi-hue-{name}` / `--mi-chroma-{name}`（例: `--mi-hue-teal`, `--mi-chroma-teal`）。

**ロール色とベース色の違い**: 全 11 色相は role の有無に関わらず `--color-{name}`（base + alpha のみ。フルラダー展開はしない）として直接公開される。これが **ベース色**。「用途」が role 名（Danger / Link / Warning ...）になっているものは、[2.3](#23-layer-2-roles意味づけ) の Role が `--mi-hue-{role}:var(--mi-hue-{hueKey})` という間接参照で同じ hue/chroma を使い、明度ラダー（Surface〜Alpha の7段階）まで展開した **ロール色**でもある。ロール色の base 段階はベース色と基本的に同一の見た目になるが、Warning（Yellow）のみ `lightnessOffset` 分だけ異なる（ベース色の Yellow は offset 未適用の生の値）。ロール色は role の紐付けを変えるだけで意味（Danger 等）を保ったまま見た目を変更できるのに対し、ベース色は常にその hue 固有の色（teal は常に teal、green は常に緑）。

**Yellow の Hue/Chroma について**: sRGB ガモットの制約上、Yellow は明度（L）0.65 付近では彩度をどれだけ上げても金色〜オリーブにしかならず、鮮やかな黄色にはならない（黄色は知覚的に最も明るい色相であり、ガモット内の鮮やかな黄色は L=0.85〜0.95 付近にしか存在しないため）。これを Hue/Chroma だけで解決することはできないため、Warning ロールには [2.3](#23-layer-2-roles意味づけ) で後述する `lightnessOffset` を設定し、ラダー全体の明度を底上げしている。

### 2.2 Lightness Scale / Chroma Scale（明度・彩度スケール）

| Step | Light L | Dark L | Light Chroma Scale | Dark Chroma Scale | 用途 |
|------|---------|--------|---------------------|---------------------|------|
| Surface | 0.96 | 0.22 | × tint (0.15) | × tint (0.12) | 薄い着色背景（Alertの背景、Badge secondaryの背景など） |
| Subtle | 0.85 | 0.32 | × subtle (0.3) | × subtle (0.25) | 控えめな背景・ボーダー |
| Muted | 0.75 | 0.45 | × moderate (0.6) | × moderate (0.5) | 抑えたテキスト、補助表示 |
| Base | 0.65 | 0.60 | × full (1.0) | × full (0.85) | 基本色（ボタン、アイコン、ステータス表示） |
| Emphasis | 0.55 | 0.70 | × full (1.0) | × full (0.85) | ホバー・フォーカス時 |
| Strong | 0.45 | 0.78 | × full (1.0) | × full (0.85) | プレス（押下）状態、強調テキスト |
| Alpha | Base と同値 | Base と同値 | （chroma scale 適用なし） | （chroma scale 適用なし） | 80% 透過版（オーバーレイ等） |

CSS 変数名: `--mi-l-{step}`（例: `--mi-l-base`）、`--mi-c-scale-{step}`（例: `--mi-c-scale-tint`）。Light/Dark でスケール自体を反転させており、Base 以外の段階は明度が逆転する（Light の Surface は明るい背景、Dark の Surface は暗い背景になる）。

**Dark テーマの L/Chroma が Light と非対称な理由**: Base/Emphasis/Strong は単純な反転ではなく、Light より少し低めの L・低めの Chroma Scale（`full: 0.85`）にしている。これは同じ絶対 L・Chroma の色でも、暗い背景に置いた場合は同時対比効果（simultaneous contrast）により実際より明るく・鮮やかに見えるため。Light の値をそのまま Dark に流用すると、ロール色が必要以上にギラついて見える。

### 2.3 Layer 2: Roles（意味づけ）

| Role | Hue | Chroma | 用途 |
|------|-----|--------|------|
| Brand | Teal | Teal | メインのブランドカラー。CTAボタン等 |
| Info | Lime | Lime | 情報、通知 |
| Success | Blue | Blue | 成功、完了 |
| Warning | Yellow | Yellow | 警告、注意喚起 |
| Danger | Red | Red | エラー、削除、危険な操作 |
| Link | Orange | Orange | リンク |

role は `--mi-hue-{role}:var(--mi-hue-{hueKey})` という間接参照で実装されている。これにより `--mi-hue-brand` だけを CSS で上書きしても、Teal 自体（ベース色としての teal）には影響しない。

**`lightnessOffset`（Warning のみ）**: role 定義は `{ hue, chroma }` に加えて任意の `lightnessOffset` を持てる。Warning（Yellow）は [2.1](#21-layer-1-hue--chroma-primitives) で述べた sRGB ガモットの制約により、共通の明度ラダーをそのまま使うと金色〜オリーブにしかならないため、`lightnessOffset: 0.2` でラダー全体の明度を底上げしている（各段階の L に `+0.2` し、`[0.02, 0.98]` にクランプ）。他の role は `lightnessOffset` を持たず、共通ラダーをそのまま使う。

### 2.4 Layer 3: Semantic トークン（最終カラー）

各 role は明度スケールの6段階 + alpha のフルラダーを持つ。各段階の用途は以下の通り（[2.2](#22-lightness-scale--chroma-scale明度彩度スケール) と同じ表):

| Suffix | 段階 | 用途 |
|--------|------|------|
| `-surface` | Surface | 薄い着色背景（Alertの背景、Badge secondaryの背景など） |
| `-subtle` | Subtle | 控えめな背景・ボーダー |
| `-muted` | Muted | 抑えたテキスト、補助表示 |
| (なし) | Base | 基本色（ボタン、アイコン、ステータス表示） |
| `-emphasis` | Emphasis | ホバー・フォーカス時 |
| `-strong` | Strong | プレス（押下）状態、強調テキスト |
| `-alpha` | Alpha | 80%透過版（base固定、オーバーレイ等） |

例（Brand, Light）: `--color-brand-surface` = `#e8f5f2` / `--color-brand-subtle` = `#bad5ce` / `--color-brand-muted` = `#84bbaf` / `--color-brand`（Base） = `#38a391` / `--color-brand-emphasis` = `#008474` / `--color-brand-strong` = `#006757` / `--color-brand-alpha` = `#38a391cc`

ベース色は role の有無に関わらず全 11 色相について base + alpha のみ生成される（フルラダー展開はしない）。

**Semantic（Role）値一覧（base 段階）**:

| Token | Light Hex | Light OKLCH | Dark Hex | Dark OKLCH |
|-------|-----------|-------------|----------|------------|
| Brand | `#38a391` | `oklch(0.65 0.1 180)` | `#3c9182` | `oklch(0.6 0.085 180)` |
| Info | `#65a33c` | `oklch(0.65 0.15 135)` | `#5d913d` | `oklch(0.6 0.1275 135)` |
| Success | `#3a93e6` | `oklch(0.65 0.15 250)` | `#3c84c9` | `oklch(0.6 0.1275 250)` |
| Warning | `#efcc36` | `oklch(0.85 0.16 95)` | `#d9bc49` | `oklch(0.8 0.136 95)` |
| Danger | `#f94144` | `oklch(0.65 0.22 25)` | `#d94343` | `oklch(0.6 0.187 25)` |
| Link | `#d3721e` | `oklch(0.65 0.15 55)` | `#b96929` | `oklch(0.6 0.1275 55)` |

Warning の OKLCH L は `lightnessOffset`（+0.2）適用後の値（Light: 0.65+0.2=0.85 / Dark: 0.6+0.2=0.8）。

**ベース色（`--color-{name}`）値一覧（全 11 色相、base 段階）**:

| Hue | Light Hex | Light OKLCH | Dark Hex | Dark OKLCH | 対応する Role |
|-----|-----------|-------------|----------|------------|--------------|
| Red | `#f94144` | `oklch(0.65 0.22 25)` | `#d94343` | `oklch(0.6 0.187 25)` | Danger |
| Orange | `#d3721e` | `oklch(0.65 0.15 55)` | `#b96929` | `oklch(0.6 0.1275 55)` | Link |
| Yellow | `#ae8c00` | `oklch(0.65 0.16 95)` | `#9a7e00` | `oklch(0.6 0.136 95)` | — |
| Lime | `#65a33c` | `oklch(0.65 0.15 135)` | `#5d913d` | `oklch(0.6 0.1275 135)` | Info |
| Green | `#31a773` | `oklch(0.65 0.13 160)` | `#379469` | `oklch(0.6 0.1105 160)` | — |
| Teal | `#38a391` | `oklch(0.65 0.1 180)` | `#3c9182` | `oklch(0.6 0.085 180)` | Brand |
| Cyan | `#2ba1a7` | `oklch(0.65 0.1 200)` | `#348f94` | `oklch(0.6 0.085 200)` | — |
| Blue | `#3a93e6` | `oklch(0.65 0.15 250)` | `#3c84c9` | `oklch(0.6 0.1275 250)` | Success |
| Indigo | `#6c88ea` | `oklch(0.65 0.15 270)` | `#637bcc` | `oklch(0.6 0.1275 270)` | — |
| Purple | `#ab72d3` | `oklch(0.65 0.15 310)` | `#9769b9` | `oklch(0.6 0.1275 310)` | — |
| Pink | `#c967ac` | `oklch(0.65 0.15 340)` | `#b15f98` | `oklch(0.6 0.1275 340)` | — |

role が紐付く色相（Red/Orange/Lime/Teal/Blue）は、対応する role の base 値（上の表）と完全に一致する。Yellow のみ例外で、`--color-yellow`（`#ae8c00`、金〜オリーブ）は `lightnessOffset` を適用しない生の hue/chroma 値であり、Warning ロールの `#efcc36`（offset +0.2 適用後）とは見た目が異なる。これは [2.1](#21-layer-1-hue--chroma-primitives) で述べた Yellow の sRGB ガモット制約の説明と対応する。

**hex は何のためにあるか**: `--color-{role}` は常に2つの値を持つ。`:root` 直下に hex フォールバックが、`@supports (color: oklch(0 0 0))` ブロック内に `oklch(var(--mi-l-base) var(--mi-chroma-{role}) var(--mi-hue-{role}))` のような **primitive var() を合成した oklch()** が出力される。`oklch()` 非対応ブラウザは hex のみを描画し、対応ブラウザは primitive 変数の変更がリアルタイムに反映される。

### 2.5 Neutrals（無彩色テーマトークン）

OKLCH 合成の対象外。テーマごとに固定 hex を持つ:

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| Text Primary | `#2d2d2d` | `#f7f7f7` | 本文テキスト |
| Text Secondary | `#696e70` | `#cad0ce` | 補足テキスト、ラベル |
| Placeholder | `#696e70` | `#696e70` | プレースホルダー |
| Bg Primary | `#f7f7f7` | `#2d2d2d` | ページ背景 |
| Bg Secondary | `#cad0ce` | `#505050` | セカンダリ背景 |
| Bg Select | `#49f9aa` | `#49f9aa` | 選択状態の背景 |
| Border | `#b4c1c8` | `#696e70` | 区切り線、入力欄の枠 |
| Shadow | `#2d2d2d` | `#505050` | シャドウカラー |

CSS 変数名: `--color-{kebab}`（例: `--color-text-primary`, `--color-bg-primary`）。

無彩色の Base パレット（White / Gray / Black 系9色）はテーマ不変の静的トークンとして `--color-base-{kebab}` でも参照できる（`#ffffff` 〜 `#000000` の9段階）。

### 2.6 後方互換エイリアス

旧バージョン（1層構造）のトークン名は `var()` 経由で新トークンを参照するエイリアスとして引き続き使用できる:

| 旧トークン | 新トークンへのエイリアス |
|---|---|
| `--color-status-brand` | `var(--color-brand)` |
| `--color-status-danger` | `var(--color-danger)` |
| `--color-theme-text-primary` | `var(--color-text-primary)` |
| `--color-theme-bg-primary` | `var(--color-bg-primary)` |
| `--color-theme-border` | `var(--color-border)` |
| `--color-theme-link` | `var(--color-link)` |
| `--color-theme-link-hover` | `var(--color-link-emphasis)` |
| `--color-base-red` | `var(--color-danger)` |
| `--color-base-orange` | `var(--color-link)` |
| `--color-base-blue` | `var(--color-success)` |

（各 alpha 版も同様に対応するエイリアスを持つ）

### 2.7 テーマの上書き（`overrideTheme`）について

3層構造のため、上書きの粒度を選べる:

```ts
// Primitive 単位: hue/chroma/lightness を変えると影響範囲が広い
overrideTheme({ light: { primitives: { hues: { teal: 200 } } } });
overrideTheme({ light: { primitives: { lightness: { emphasis: 0.5 } } } });

// Role 単位: 役割の紐付け先を変える（brand を blue ベースにする等）
overrideTheme({ light: { roles: { brand: { hue: 'blue', chroma: 'blue' } } } });

// Role 単位: lightnessOffset で明度ラダー全体を底上げ/沈める（Warning と同じ仕組み）
overrideTheme({ light: { roles: { brand: { hue: 'teal', chroma: 'teal', lightnessOffset: 0.1 } } } });

// Neutral 単位: 無彩色は hex / oklch() / var() 等の自由形式で上書き可能
overrideTheme({ light: { neutrals: { bgPrimary: '#ffffff' } } });
```

- **hex 形式での上書きを推奨**: 全ブラウザで確実に動作する
- Primitive（hue/chroma/lightness）の上書きは JS の `overrideTheme()` 経由でも、CSS で直接 `--mi-hue-teal: 200;` のように上書きしても効く。後者は `oklch()` 対応ブラウザでのみ反映される（hex フォールバックは JS 側の計算結果が固定されているため変化しない）
- neutrals に `oklch()` を直接指定した場合、alpha 値（`/ 80%`）は自動生成されるが、`oklch()` 非対応ブラウザでは `var()` の解決に失敗し色が継承値/初期値になる点に注意

---

## 3. Typography Rules

<!-- 日本語タイポグラフィの核心セクション。variables.css / style.css に基づいて記述 -->

### 3.1 和文フォント

<!-- 使用している和文フォントを優先度順に列挙 -->

- **ゴシック体**: Roboto, Noto Sans JP, 游ゴシック, ヒラギノ角ゴ Pro
- **明朝体**: Roboto Slab, Noto Serif JP, 游明朝, ヒラギノ明朝 Pro
- **アクセント**: Kosugi

### 3.2 欧文フォント

<!-- 和文と組み合わせる欧文フォント -->

- **サンセリフ**: Roboto（和文ゴシック系の先頭に配置）
- **セリフ**: Roboto Slab（和文明朝系の先頭に配置）
- **等幅**: monospace（generic family のみ）

### 3.3 font-family 指定

<!-- 実際のCSS宣言をそのまま記述。フォールバックチェーンの順序が重要 -->

```css
/* 本文（--font-sans） */
font-family: 'Roboto', 'Noto Sans JP', '游ゴシック Medium', 'Yu Gothic Medium', '游ゴシック体', 'YuGothic', '游ゴシック', 'Yu Gothic', 'Hiragino Kaku Gothic Pro', 'ヒラギノ角ゴ Pro', meiryo, 'メイリオ', sans-serif;

/* 明朝（--font-serif） */
font-family: 'Roboto Slab', 'Noto Serif JP', '游明朝体', '游明朝', yumincho, 'Yu Mincho', 'Hiragino Mincho Pro', 'ヒラギノ明朝 Pro', serif;

/* アクセント（--font-accent） */
font-family: 'Kosugi', sans-serif;

/* 等幅 */
font-family: monospace;
```

**フォールバックの考え方**:

- 欧文フォント（Roboto / Roboto Slab）を先に指定し、和文グリフは後続の和文フォントで表示
- 和文フォントは複数のOS環境をカバーするようにフォールバック
- 最後に generic family（sans-serif / serif）を指定

### 3.4 文字サイズ・ウェイト階層

<!-- variables.css のフォントサイズ定義に基づく。html font-size: 62.5%（1rem = 10px） -->

| Token | CSS Variable | Mobile (< 600px) | Desktop (≥ 600px) | 用途 |
|-------|-------------|-------------------|--------------------|------|
| Large | `--font-size-large` | 2rem (20px) | 2rem (20px) | 見出し等 |
| Medium | `--font-size-medium` | 1.4rem (14px) | 1.6rem (16px) | 本文、ボタン（標準・大） |
| Small | `--font-size-small` | 1.2rem (12px) | 1.2rem (12px) | 補足、注釈、小ボタン |

**ベースサイズ**: `html { font-size: 62.5%; }` により `1rem = 10px` で計算

### 3.5 行間・字間

- **本文の行間 (line-height)**: 1.5em
- **見出しの行間**: 1.5em（本文と同一）
- **本文の字間 (letter-spacing)**: 0.05em
- **見出しの字間**: 0.05em（本文と同一）

**ガイドライン**:

- 日本語本文は `line-height: 1.5` 以上を推奨（1.7〜2.0が読みやすい）
- `letter-spacing` は全角文字の場合 `0.04em〜0.05em` 程度で可読性が向上する
- 欧文混じりの場合は `letter-spacing` が欧文に影響する点に注意

### 3.6 禁則処理・改行ルール

```css
/* 実際の設定（style.css） */
word-break: break-all;
overflow-wrap: break-word;     /* 長いURLや英単語の折り返し */
```

**禁則対象**:

- 行頭禁止: `）」』】〕〉》」】、。，．・：；？！`
- 行末禁止: `（「『【〔〈《「【`

### 3.7 OpenType 機能

```css
/* 実際の設定（style.css の body） */
font-feature-settings: 'palt';
```

- **palt**: 和文のプロポーショナル字詰め。body 全体に適用
- **kern**: 欧文のカーニング。和欧混植時に有効
- 本文には `palt` を適用しない方が可読性が高い場合がある

### 3.8 縦書き

該当なし（縦書きには非対応）

---

## 4. Component Stylings

<!-- 各コンポーネントは CSS 変数でサイズ・カラーをバリエーション化している -->

### Buttons (`MiButton`)

**共通**

- Padding: `0 8px`
- Border: `1px solid`
- Border Radius: `4px`（default） / `2em`（rounded） / `0`（no-radius） / `50%`（circle）
- Transition: `color 0.2s, background-color 0.2s, border-color 0.2s`
- Min Width: `100px`

**サイズ**

| Size | Height | Font Size |
|------|--------|-----------|
| Large | 40px | `--font-size-medium` |
| Medium | 32px | `--font-size-medium` |
| Small | 24px | `--font-size-small` |

**Primary バリアント**

- Background: `var(--color-status-brand-alpha)` → `#38a391cc`
- Text: `var(--color-base-white)` → `#f7f7f7`
- Border Color: `var(--color-status-brand)` → `#38a391`
- Hover: テキスト・ボーダーが brand、背景が transparent に反転

**Secondary バリアント**

- Background: `transparent`
- Text: `var(--color-theme-text-primary)` → `#2d2d2d`（Light）
- Border Color: `var(--color-theme-border)` → `#b4c1c8`（Light）
- Hover: brand カラーの背景付きに反転

### Inputs (`MiField` / `FieldFrame`)

**共通**

- Background: `var(--color-theme-bg-primary)` → `#f7f7f7`（Light）
- Border: `1px solid`（通常） / `2px solid`（フォーカス時）
- Border Color: バリアントに依存（secondary = `var(--color-theme-border)`）
- Border Radius: `4px`（default） / `2em`（rounded）
- Start/End Padding: `16px`
- Line Height: `1.5em`

**サイズ**

| Size | Height | Font Size |
|------|--------|-----------|
| Large | 40px | `--font-size-medium` |
| Medium | 32px | `--font-size-medium` |
| Small | 24px | `--font-size-small` |

### Frame（カード相当: `MiFrame`）

- Background: `rgb(0 0 0 / 2%)`（疑似要素による薄い黒のオーバーレイ）
- Border: `1px solid var(--color-theme-border)` → `#b4c1c8`（Light）
- Border Radius: `4px`（default） / `0`（no-radius） / `50%`（circle）
- Padding: `calc(8px * 2)` = `16px`（is-pading 有効時）
- Shadow: `0 0 8px var(--color-theme-shadow)`

---

## 5. Layout Principles

### Spacing Scale

> ⚠️ **注意**: 以下は `--spacing-*` 等の実装トークンではなく、既存コンポーネントの padding/gap 値から観測・推測した参考値です。コード側に対応する CSS 変数は存在しないため、コンポーネント間で値がズレる可能性があります。正式なトークン化は今後の対応課題（CLAUDE.md 参照）

| Token | Value | 用途 |
|-------|-------|------|
| XS | 4px | 最小の間隔 |
| S | 8px | ボタン内 padding、Frame の基準 padding、リスト gap |
| M | 16px | Frame のコンテンツ padding、FieldFrame の start/end padding |
| L | 24px | セクション間の余白 |
| XL | 32px | 大きなセクション間の余白 |
| XXL | 40px | ページレベルの余白 |

### Container

- Max Width: 利用側で定義（ライブラリ側では未指定）
- Padding (horizontal): 利用側で定義

### Grid

- Columns: 利用側で定義（ライブラリ側では未指定）
- Gutter: 利用側で定義

---

## 6. Depth & Elevation

| Level | Shadow | 用途 |
|-------|--------|------|
| 0 | none | フラットな要素、no-shadow 指定時 |
| 1 | `0 0 8px var(--color-theme-shadow)` | Frame コンポーネント（カード） |

**備考**: 本ライブラリはフラットデザインを基調としており、影の段階は最小限。Frame コンポーネントのみが `box-shadow` を持ち、`noShadow` prop で無効化可能

---

## 7. Do's and Don'ts

### Do（推奨）

- フォントは必ずフォールバックチェーンを指定する
- 日本語本文の line-height は 1.5 以上にする
- 色のコントラスト比は WCAG AA 以上を確保する
- コンポーネントの余白は Spacing Scale に従う
- カラーは CSS 変数（`--color-base-*` / `--color-status-*` / `--color-theme-*`）経由で参照する
- テーマ切り替え対応のため、ハードコードされた色値の使用を避ける

### Don't（禁止）

- `font-family` に和文フォント1つだけを指定しない（環境依存になる）
- 日本語本文に `line-height: 1.2` 以下を使わない（可読性が著しく低下する）
- 全角・半角スペースを混在させない
- テキストの色に純粋な `#000000` を使わない（コントラストが強すぎる）
- 対角線にハイライトとシャドウを配置する立体感デザインを使わない
- `!important` を使わない（やむを得ない場合はユーザーに確認）

---

## 8. Responsive Behavior

### Breakpoints

<!-- variables.css の @media クエリに基づく -->

| Name | Width | 説明 |
|------|-------|------|
| Mobile | < 600px | モバイルレイアウト（`--font-size-medium: 1.4rem`） |
| Desktop | ≥ 600px | デスクトップレイアウト（`--font-size-medium: 1.6rem`） |

**備考**: ブレークポイントは `600px` の1段階のみ。タブレット専用のブレークポイントは定義されていない

### タッチターゲット

- 最小サイズ: 44px × 44px（WCAG基準）
- Large サイズのボタン・入力欄: 40px（概ね基準に近い）

### フォントサイズの調整

- モバイル: `--font-size-medium` = 1.4rem (14px)
- デスクトップ: `--font-size-medium` = 1.6rem (16px)
- `--font-size-large` / `--font-size-small` はブレークポイントで変化しない

---

## 9. Agent Prompt Guide

### クイックリファレンス

```
Brand Color: #38a391 (oklch(0.65 0.1 180) 対応ブラウザ向け)
Text Color (Light): #2d2d2d
Text Color (Dark): #f7f7f7
Background (Light): #f7f7f7
Background (Dark): #2d2d2d
Border (Light): #b4c1c8
Border (Dark): #696e70
Font: 'Roboto', 'Noto Sans JP', '游ゴシック Medium', ... , sans-serif
Body Size: 1.4rem (Mobile) / 1.6rem (Desktop)
Line Height: 1.5em
Letter Spacing: 0.05em
Border Radius: 4px
```

### CSS 変数の命名規則

```
# Layer 1: Primitives
--mi-hue-{name}             色相（deg）。name は red/orange/.../teal 等
--mi-chroma-{name}          彩度
--mi-l-{step}               明度スケール（surface/subtle/muted/base/emphasis/strong）
--mi-c-scale-{step}         彩度スケール係数（full/moderate/subtle/tint）

# Layer 2: Roles（hue/chroma の間接参照。lightnessOffset は任意でラダー全体の明度を補正）
--mi-hue-{role}             role が参照する hue（brand/info/success/warning/danger/link）
--mi-chroma-{role}          role が参照する chroma

# Layer 3: Semantic（最終カラー）
--color-{role}              ロール色の base 段階
--color-{role}-{step}       ロール色の各明度段階（surface/subtle/muted/emphasis/strong）
--color-{role}-alpha        ロール色の80%透過版
--color-{hueName}           ベース色（全11色相 red/orange/yellow/lime/green/teal/cyan/blue/indigo/purple/pink。role を経由せず hue/chroma を直接公開）の base + alpha のみ
--color-{neutral}           無彩色テーマトークン（text-primary/bg-primary/border 等）
--color-base-{token}        無彩色ベースパレット（テーマ不変、white/gray/black 系）

# 後方互換エイリアス（旧バージョンからの移行用、var() 経由で新トークンを参照）
--color-status-{token}      旧セマンティックトークン名
--color-theme-{token}       旧テーマ依存トークン名

--font-sans                 ゴシック体フォントスタック
--font-serif                明朝体フォントスタック
--font-accent                アクセントフォント
--font-size-large            大サイズ（2rem）
--font-size-medium           標準サイズ（1.4rem / 1.6rem）
--font-size-small            小サイズ（1.2rem）
```

### プロンプト例

```
このサービスのデザインシステムに従って、ユーザー一覧テーブルを作成してください。
- プライマリカラー: #38a391
- フォント: var(--font-sans) を使用
- 行間: 本文は line-height: 1.5em を使用
- テーブルヘッダーの背景: var(--color-theme-bg-secondary)
- ボーダー: var(--color-theme-border)
- テキスト: var(--color-theme-text-primary)
- Border Radius: 4px
```
