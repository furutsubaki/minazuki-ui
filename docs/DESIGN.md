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

<!-- OKLCH 2層トークン設計。colors.ts / useTheme.ts の Primitives / Semantic 定義に基づく -->

カラートークンは **Primitive → Semantic** の2層構造になっている。

```
Layer 1: Primitive（テーマ不変の基礎パレット）
  --mi-{hue}-{step}        色相付きカラー（10色相 × 7段階）
  --mi-neutral-{step}      無彩色（10段階）
  --mi-hue-{name}          色相角度（overrideTheme 用）
  --mi-chroma-{name}       ベース彩度（overrideTheme 用）

Layer 2: Semantic（意味トークン）
  Status: --color-{status}[-suffix]   ステータスカラー（5種 × 7段階）
  UI:     --color-{token}             テーマ依存UIカラー（light-dark() 使用）
```

テーマ切り替えは CSS `light-dark()` 関数と `color-scheme` プロパティで実現する。

```css
:root { color-scheme: light; }
[data-theme="dark"] { color-scheme: dark; }
```

### 2.1 Layer 1: Primitive パレット

#### 色相カラー（10色相 × 7明度ステップ）

| Name | Hue (deg) | Chroma | 用途 |
|------|-----------|--------|------|
| Red | 20 | 0.22 | Danger（lightnessOffset 適用） |
| Orange | 50 | 0.16 | ベース色 |
| Yellow | 85 | 0.17 | Warning（lightnessOffset 適用） |
| Lime | 135 | 0.15 | ベース色 |
| Green | 155 | 0.14 | Success |
| Teal | 180 | 0.10 | Brand |
| Blue | 250 | 0.15 | Info, Link |
| Indigo | 270 | 0.12 | ベース色 |
| Purple | 310 | 0.13 | ベース色 |
| Pink | 357 | 0.16 | ベース色 |

CSS 変数名: `--mi-{name}-{step}`（例: `--mi-teal-400`）。`--mi-{name}` は `--mi-{name}-400` のエイリアス。

#### 明度スケール（Lightness Scale）

| Step | L 値 | Chroma Scale | 用途 |
|------|------|-------------|------|
| 100 | 0.96 | × 0.15 | 薄い着色背景（Alert 背景、Badge secondary 等） |
| 200 | 0.88 | × 0.40 | 控えめな背景・ボーダー |
| 300 | 0.76 | × 0.78 | 抑えたテキスト、補助表示 |
| 400 | 0.70 | × 1.00 | 基本色（ボタン、アイコン、ステータス表示） |
| 500 | 0.55 | × 0.78 | ホバー・フォーカス時 |
| 600 | 0.45 | × 0.40 | プレス（押下）状態、強調テキスト |
| 700 | 0.35 | × 0.15 | 最も暗い段階 |

Chroma Scale は各色相の `chroma` に対する倍率。400 が最大彩度で、端に向かって彩度が下がる。

#### 無彩色（Neutral, 10段階）

| Step | L 値 | 用途 |
|------|------|------|
| 50 | 0.985 | 最も明るい白。カード等の浮き要素の背景 |
| 100 | 0.95 | ページ全体の背景（Light） |
| 200 | 0.90 | セカンダリ背景（Light） |
| 300 | 0.82 | ボーダー（Light）、入れ子背景（Dark） |
| 400 | 0.70 | プレースホルダー |
| 500 | 0.55 | 無効テキスト |
| 600 | 0.40 | セカンダリテキスト（Light）、ボーダー（Dark） |
| 700 | 0.30 | 通常テキスト（Light）、セカンダリ背景（Dark） |
| 800 | 0.22 | 強調テキスト、ページ背景（Dark） |
| 900 | 0.15 | 最も暗い。浮き要素背景（Dark） |

CSS 変数名: `--mi-neutral-{step}`（例: `--mi-neutral-700`）。Chroma は 0（完全無彩色）。

### 2.2 Layer 2: Semantic トークン

#### Status トークン

| Status | 参照色相 | lightnessOffset | 用途 |
|--------|---------|-----------------|------|
| brand | Teal | 0 | CTA・主要アクション |
| info | Blue | 0 | 情報通知 |
| success | Green | 0 | 成功・完了 |
| warning | Yellow | +0.15 | 警告・注意喚起 |
| danger | Red | 0 | エラー・破壊的操作 |

各 status は以下の8段階トークンを持つ:

| Suffix | 参照 Step | 用途 |
|--------|----------|------|
| `-surface` | 100 | 薄い着色背景 |
| `-subtle` | 200 | 控えめな背景・ボーダー |
| `-muted` | 300 | 抑えたテキスト、補助表示 |
| (なし) | 400 | 基本色（ボタン、アイコン） |
| `-emphasis` | 500 | ホバー・フォーカス時 |
| `-strong` | 600 | プレス状態、強調テキスト |
| `-alpha` | 400 + 80% 透過 | オーバーレイ等 |
| `-surface-alpha` | 100 + 50% 透過 | 半透明カード背景 |

CSS 変数名: `--color-{status}[-suffix]`（例: `--color-brand`, `--color-danger-emphasis`）

#### Suffix の使い分けガイド

コンポーネントの「状態」に対してどの suffix を使うかの対応表:

| 状態 | 背景色 | テキスト色 | ボーダー色 |
|------|--------|-----------|-----------|
| Default（通常） | `-surface` or `(base)` | `(base)` | `(base)` or `-emphasis` |
| Hover | `-alpha` | `(base)` | `-emphasis` |
| Active / Press | `-emphasis` | `neutral-50` | `-strong` |
| Focus | — | — | `-emphasis`（ring） |
| Disabled | `-surface` | `-muted` | `-subtle` |
| Selected | `-alpha` | `(base)` | `(base)` |
| 半透明背景 | `-surface-alpha` | `(base)` | `(base)` |

> **Note**: ここでの `(base)` は suffix なし（`--color-{status}`）を指す。上記は推奨の組み合わせであり、コンポーネントの文脈に応じて調整して構わない。Button の塗りつぶし系バリアント（primary/info/success/warning/danger）は背景に `(base)` 不透明色、ボーダーに `-emphasis`（明度を下げた色）を使う。status バリアント（info/success/warning/danger）にはデフォルトでアイコンが自動付与され、brand カラーの上書きによってステータス間の色が衝突した場合でもアイコンの形状差で視覚的に区別できるようにしている

`lightnessOffset` が 0 の status は `var(--mi-{hue}-{step})` への参照で実装される（Primitive 変更に自動追従）。Warning のみ offset 適用後の hex 値を直接出力する。

**lightnessOffset について**: 一部の色相は OKLCH の特性上、標準明度では期待通りの色に見えない。Yellow は L=0.70 付近では金色〜オリーブになるため Primitive に `lightnessOffset: +0.14` を設定し全ステップの明度を底上げする。Red は L=0.70 ではピンク寄りになるため `-0.10` で深みを持たせる。offset は step 400 を基準に比例スケーリングされ、暗いステップほど効果が弱まる。Warning ステータスは `lightnessOffset: 0.15` で同様にスケーリングされる。

#### UI トークン（テーマ依存）

`light-dark()` 関数でライト・ダークの値を1箇所で定義:

| Token | Light | Dark | 用途 |
|-------|-------|------|------|
| `--color-text-primary` | `--mi-neutral-700` | `--mi-neutral-50` | 本文テキスト |
| `--color-text-secondary` | `--mi-neutral-600` | `--mi-neutral-300` | 補足テキスト、ラベル |
| `--color-text-disabled` | `--mi-neutral-400` | `--mi-neutral-500` | 無効状態テキスト |
| `--color-placeholder` | `--mi-neutral-400` | `--mi-neutral-500` | プレースホルダー |
| `--color-bg-surface` | `--mi-neutral-50` | `--mi-neutral-900` | カード等の浮き要素 |
| `--color-bg-primary` | `--mi-neutral-100` | `--mi-neutral-800` | ページ背景 |
| `--color-bg-secondary` | `--mi-neutral-200` | `--mi-neutral-700` | セクション背景 |
| `--color-bg-tertiary` | `--mi-neutral-300` | `--mi-neutral-600` | 入れ子の背景 |
| `--color-bg-select` | `--color-brand-alpha` | `--color-brand-alpha` | 選択ハイライト |
| `--color-overlay` | `#00000066` | `#000000b3` | モーダル/ダイアログのオーバーレイ |
| `--color-border` | `--mi-neutral-300` | `--mi-neutral-600` | 区切り線、入力欄の枠 |
| `--color-border-strong` | `--mi-neutral-400` | `--mi-neutral-500` | 強調ボーダー |
| `--color-shadow` | `--mi-neutral-800` | `--mi-neutral-900` | シャドウカラー |
| `--color-link` | `--mi-blue-400` | `--mi-blue-300` | リンク色 |
| `--color-link-hover` | `--mi-blue-500` | `--mi-blue-200` | リンクホバー色 |

追加の alpha トークン:

| Token | 用途 |
|-------|------|
| `--color-link-alpha` | リンク色 80% 透過 |
| `--color-shadow-alpha` | シャドウ色 30% 透過 |

### 2.3 後方互換エイリアス

旧バージョンのトークン名は `var()` 経由で新トークンを参照するエイリアスとして引き続き使用できる:

| 旧トークン | 新トークンへのエイリアス |
|---|---|
| `--color-status-brand` | `var(--color-brand)` |
| `--color-status-info` | `var(--color-info)` |
| `--color-status-success` | `var(--color-success)` |
| `--color-status-warning` | `var(--color-warning)` |
| `--color-status-danger` | `var(--color-danger)` |
| `--color-base-{hue}` | `var(--mi-{hue})` |
| `--color-base-white` | `var(--mi-neutral-100)` |
| `--color-base-black` | `var(--mi-neutral-800)` |
| `--color-theme-text-primary` | `var(--color-text-primary)` |
| `--color-theme-bg-primary` | `var(--color-bg-primary)` |
| `--color-theme-border` | `var(--color-border)` |
| `--color-theme-link` | `var(--color-link)` |

（各 alpha 版も同様に対応するエイリアスを持つ）

### 2.4 テーマの上書き（`overrideTheme`）

2層構造のため、上書きの粒度を選べる:

```ts
// Primitive 単位: hue/chroma を変えると全段階に影響
overrideTheme({ primitives: { hues: { teal: 200 } } });
overrideTheme({ primitives: { chromas: { teal: 0.12 } } });

// Status 単位: 役割の紐付け先を変更
overrideTheme({ statuses: { brand: { hue: 'blue', chroma: 'blue' } } });

// UI 単位: 個別トークンを上書き（文字列で light/dark 共通、ペアで個別指定）
overrideTheme({ ui: { textPrimary: '#333333' } });
overrideTheme({ ui: { textPrimary: { light: '#111', dark: '#eee' } } });
```

### 2.5 CSS Custom Data（エディター補完）

ビルド時に `dist/minazuki-ui.css-data.json`（VS Code Custom Data Format）が自動生成される。消費者は `.vscode/settings.json` に以下を追加することで CSS 変数の補完が有効になる:

```json
{
  "css.customData": ["./node_modules/minazuki-ui/dist/minazuki-ui.css-data.json"]
}
```

---

## 3. Typography Rules

<!-- 日本語タイポグラフィの核心セクション。variables.css / style.css に基づいて記述 -->

### 3.1 font-family 方針

<!-- ライブラリは font-family を指定しない。消費者側のCSSに委ねる -->

minazuki-ui は `font-family` を指定しない。Webフォントの読み込みコストや、消費者ごとに異なるフォント戦略を尊重するため、`--font-sans` / `--font-serif` / `--font-accent` のようなフォントファミリー変数は提供せず、`body` にも `font-family` を宣言しない。

フォント指定は消費者側のグローバルCSSで行う。

```css
/* 消費者側で任意に指定 */
body {
    font-family: 'Noto Sans JP', sans-serif;
}
```

- **等幅**: monospace（generic family のみ。コード表示等の一部コンポーネントで使用する場合がある）

### 3.2 文字サイズ・ウェイト階層

<!-- variables.css のフォントサイズ定義に基づく。html font-size: 62.5%（1rem = 10px） -->

| Token | CSS Variable | Mobile (< 600px) | Desktop (≥ 600px) | 用途 |
|-------|-------------|-------------------|--------------------|------|
| Large | `--font-size-large` | 2rem (20px) | 2rem (20px) | 見出し等 |
| Medium | `--font-size-medium` | 1.4rem (14px) | 1.6rem (16px) | 本文、ボタン（標準・大） |
| Small | `--font-size-small` | 1.2rem (12px) | 1.2rem (12px) | 補足、注釈、小ボタン |

**ベースサイズ**: `html { font-size: 62.5%; }` により `1rem = 10px` で計算

### 3.3 行間・字間

- **本文の行間 (line-height)**: 1.5em
- **見出しの行間**: 1.5em（本文と同一）
- **本文の字間 (letter-spacing)**: 0.05em
- **見出しの字間**: 0.05em（本文と同一）

**ガイドライン**:

- 日本語本文は `line-height: 1.5` 以上を推奨（1.7〜2.0が読みやすい）
- `letter-spacing` は全角文字の場合 `0.04em〜0.05em` 程度で可読性が向上する
- 欧文混じりの場合は `letter-spacing` が欧文に影響する点に注意

### 3.4 禁則処理・改行ルール

```css
/* 実際の設定（style.css） */
word-break: break-all;
overflow-wrap: break-word;     /* 長いURLや英単語の折り返し */
```

**禁則対象**:

- 行頭禁止: `）」』】〕〉》」】、。，．・：；？！`
- 行末禁止: `（「『【〔〈《「【`

### 3.5 OpenType 機能

```css
/* 実際の設定（style.css の body） */
font-feature-settings: 'palt';
```

- **palt**: 和文のプロポーショナル字詰め。body 全体に適用
- **kern**: 欧文のカーニング。和欧混植時に有効
- 本文には `palt` を適用しない方が可読性が高い場合がある

### 3.6 縦書き

該当なし（縦書きには非対応）

---

## 4. Layout Tokens

余白と角丸はコンポーネント個別の固定値ではなく、共通トークンとして定義する。
各コンポーネントは直接 `4px` / `8px` のような値を持たず、用途に合うトークンを参照する。

### Spacing Scale

> ⚠️ **注意**: 以下は現時点の実装値を共通トークンとして整理した設計上の基準です。コード側に対応する CSS 変数はまだ存在しないため、実装時は `--space-*` 系トークンの追加を優先する。

| Token | Value | 用途 |
|-------|-------|------|
| `--space-xs` | 4px | 密な UI 内の最小間隔 |
| `--space-sm` | 8px | ボタン内 padding、リスト gap |
| `--space-md` | 16px | フォーム部品の start/end padding、Frame のコンテンツ padding |
| `--space-lg` | 24px | セクション間の余白 |
| `--space-xl` | 32px | 大きなセクション間の余白 |
| `--space-2xl` | 40px | ページレベルの余白 |

### Radius Scale

> ⚠️ **注意**: 以下は現時点の実装値を共通トークンとして整理した設計上の基準です。コード側に対応する CSS 変数はまだ存在しないため、実装時は `--radius-*` 系トークンの追加を優先する。

| Token | Value | 用途 |
|-------|-------|------|
| `--radius-none` | 0 | 角丸なし |
| `--radius-sm` | 4px | 標準の角丸 |
| `--radius-pill` | 2em | ボタン・入力など横長要素の pill 形状 |
| `--radius-circle` | 50% | 正方形要素の円形表示 |

## 5. Component Stylings

<!-- 各コンポーネントは CSS 変数でサイズ・カラーをバリエーション化している -->

### Buttons (`MiButton`)

**共通**

- Padding: `0 var(--space-sm)`
- Border: `1px solid`
- Border Radius: `--radius-sm`（default） / `--radius-pill`（rounded） / `--radius-none`（no-radius） / `--radius-circle`（circle）
- Transition: `color 0.2s, background-color 0.2s, border-color 0.2s`
- Min Width: `100px`

**サイズ**

| Size | Height | Font Size |
|------|--------|-----------|
| Large | 40px | `--font-size-medium` |
| Medium | 32px | `--font-size-medium` |
| Small | 24px | `--font-size-small` |

**API**

- `label` prop: ボタンのテキストコンテンツ
- `prefixIcon` / `suffixIcon` prop: テキスト前後のアイコン（Vue コンポーネント）。status バリアント（info/success/warning/danger）では `prefixIcon` 未指定時にデフォルトアイコンが自動付与される
- icon-only ボタン（`label` なし）では `aria-label` 属性を必ず付与すること
- 記号的な `label`（`≪`、`≫` 等）を使用する場合も `aria-label` で目的を補足すること

**Status アイコン自動付与**

| Variant | デフォルトアイコン |
|---------|------------------|
| info | `Info` |
| success | `CheckCircle2` |
| warning | `AlertTriangle` |
| danger | `XOctagon` |

`prefixIcon` を明示指定した場合はデフォルトアイコンをオーバーライドする。primary / secondary にはデフォルトアイコンは付与されない。

brand カラーの上書き（`overrideTheme`）により任意の status 間で色が衝突し得るが、アイコンの形状差によって区別が維持される。

**Primary / Info / Success / Warning / Danger バリアント（塗りつぶし）**

- Background: `var(--color-{status})`（不透明）
- Text: `var(--mi-neutral-50)`（warning のみ `var(--mi-neutral-800)`）
- Border Color: `var(--color-{status}-emphasis)`（明度を下げた色）
- Hover: テキスト・ボーダーが `{status}` 色、背景が transparent に反転

**Secondary バリアント**

- Background: `transparent`
- Text: `var(--color-text-primary)`
- Border Color: `var(--color-border)`
- Hover: brand カラーの背景付きに反転

**Link / Skeleton シェイプ**

- `shape="link"` / `shape="skeleton"` は variant に関わらず背景・ボーダーが常に transparent
- `shape="link"` は variant に関わらずテキスト色が `var(--color-link)` 固定（hover は `var(--color-link-hover)`）。a タグ相当の見た目にするため

### Inputs (`MiField` / `FieldFrame`)

**共通**

- Background: `var(--color-bg-primary)`
- Border: `1px solid`（通常） / `2px solid`（フォーカス時）
- Border Color: バリアントに依存（secondary = `var(--color-border)`）
- Border Radius: `--radius-sm`（default） / `--radius-pill`（rounded）
- Start/End Padding: `--space-md`
- Line Height: `1.5em`

**サイズ**

| Size | Height | Font Size |
|------|--------|-----------|
| Large | 40px | `--font-size-medium` |
| Medium | 32px | `--font-size-medium` |
| Small | 24px | `--font-size-small` |

### Frame（カード相当: `MiFrame`）

- Background: `rgb(0 0 0 / 2%)`（疑似要素による薄い黒のオーバーレイ）
- Border: `1px solid var(--color-border)`
- Border Radius: `--radius-sm`（default） / `--radius-none`（no-radius） / `--radius-circle`（circle）
- Padding: `var(--space-md)`（is-pading 有効時）
- Shadow: `0 0 8px var(--color-shadow)`

---

## 6. Layout Principles

### Container

- Max Width: 利用側で定義（ライブラリ側では未指定）
- Padding (horizontal): 利用側で定義

### Grid

- Columns: 利用側で定義（ライブラリ側では未指定）
- Gutter: 利用側で定義

---

## 7. Depth & Elevation

| Level | Shadow | 用途 |
|-------|--------|------|
| 0 | none | フラットな要素、no-shadow 指定時 |
| 1 | `0 0 8px var(--color-shadow)` | Frame コンポーネント（カード） |

**備考**: 本ライブラリはフラットデザインを基調としており、影の段階は最小限。Frame コンポーネントのみが `box-shadow` を持ち、`noShadow` prop で無効化可能

---

## 8. Do's and Don'ts

### Do（推奨）

- フォントは必ずフォールバックチェーンを指定する
- 日本語本文の line-height は 1.5 以上にする
- 色のコントラスト比は WCAG AA 以上を確保する
- コンポーネントの余白と角丸は Layout Tokens に従う
- カラーは CSS 変数（`--mi-*` / `--color-*`）経由で参照する
- テーマ切り替え対応のため、ハードコードされた色値の使用を避ける

### Don't（禁止）

- `font-family` に和文フォント1つだけを指定しない（環境依存になる）
- 日本語本文に `line-height: 1.2` 以下を使わない（可読性が著しく低下する）
- 全角・半角スペースを混在させない
- テキストの色に純粋な `#000000` を使わない（コントラストが強すぎる）。代わりに `var(--mi-neutral-800)` を使用
- テキストの背景に純粋な `#ffffff` を使わない。代わりに `var(--mi-neutral-50)` を使用
- 対角線にハイライトとシャドウを配置する立体感デザインを使わない
- `!important` を使わない（やむを得ない場合はユーザーに確認）

---

## 9. Responsive Behavior

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

## 10. Agent Prompt Guide

### クイックリファレンス

```
Brand Color: var(--color-brand) (Teal 系)
Text Color: var(--color-text-primary) (light-dark 自動切替)
Background: var(--color-bg-primary) (light-dark 自動切替)
Border: var(--color-border) (light-dark 自動切替)
Link: var(--color-link) (Blue 系)
Font: 'Roboto', 'Noto Sans JP', '游ゴシック Medium', ... , sans-serif
Body Size: 1.4rem (Mobile) / 1.6rem (Desktop)
Line Height: 1.5em
Letter Spacing: 0.05em
Spacing: --space-xs / --space-sm / --space-md / --space-lg / --space-xl / --space-2xl
Border Radius: --radius-none / --radius-sm / --radius-pill / --radius-circle
```

### CSS 変数の命名規則

```
# Layer 1: Primitive
--mi-{name}-{step}          色相付きカラー（step: 100-700）
--mi-{name}                 base 段階のエイリアス（= --mi-{name}-400）
--mi-neutral-{step}         無彩色（step: 50-900）
--mi-hue-{name}             色相角度（overrideTheme 用）
--mi-chroma-{name}          ベース彩度（overrideTheme 用）

# Layer 2: Semantic — Status
--color-{status}            ステータス base（brand/info/success/warning/danger）
--color-{status}-surface    薄い着色背景
--color-{status}-subtle     控えめな背景
--color-{status}-muted      抑えたテキスト
--color-{status}-emphasis   ホバー・フォーカス
--color-{status}-strong     プレス状態
--color-{status}-alpha      80% 透過版
--color-{status}-surface-alpha  50% 透過の薄い着色背景

# Layer 2: Semantic — UI（light-dark 自動切替）
--color-text-primary        本文テキスト
--color-text-secondary      補足テキスト
--color-bg-primary          ページ背景
--color-bg-secondary        セクション背景
--color-bg-surface          カード等の浮き要素
--color-border              区切り線
--color-link                リンク色

# フォント
# font-family は本ライブラリでは指定しない（消費者側のCSSに委ねる）
--font-size-large            大サイズ（2rem）
--font-size-medium           標準サイズ（1.4rem / 1.6rem）
--font-size-small            小サイズ（1.2rem）

# レイアウト
--space-{step}               余白スケール（xs/sm/md/lg/xl/2xl）
--radius-{step}              角丸スケール（none/sm/pill/circle）
```

### プロンプト例

```
このサービスのデザインシステムに従って、ユーザー一覧テーブルを作成してください。
- プライマリカラー: var(--color-brand)
- 行間: 本文は line-height: 1.5em を使用
- テーブルヘッダーの背景: var(--color-bg-secondary)
- ボーダー: var(--color-border)
- テキスト: var(--color-text-primary)
- Border Radius: var(--radius-sm)
```
