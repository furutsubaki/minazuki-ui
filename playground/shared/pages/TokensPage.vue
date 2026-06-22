<script setup lang="ts">
const LADDER_USAGE = [
    { suffix: 'surface', label: 'Surface', usage: '薄い着色背景（Alertの背景、Badge secondaryの背景など）' },
    { suffix: 'subtle', label: 'Subtle', usage: '控えめな背景・ボーダー' },
    { suffix: 'muted', label: 'Muted', usage: '抑えたテキスト、補助表示' },
    { suffix: '', label: 'Base', usage: '基本色（ボタン、アイコン、ステータス表示）' },
    { suffix: 'emphasis', label: 'Emphasis', usage: 'ホバー・フォーカス時' },
    { suffix: 'strong', label: 'Strong', usage: 'プレス（押下）状態、強調テキスト' },
    { suffix: 'alpha', label: 'Alpha', usage: '80% 透過版（オーバーレイ等）' }
];

const BASE_ALPHA_LADDER = [
    { suffix: '', label: 'Base' },
    { suffix: 'alpha', label: 'Alpha' }
];

const ROLES = [
    { key: 'brand', label: 'Brand' },
    { key: 'info', label: 'Info' },
    { key: 'success', label: 'Success' },
    { key: 'warning', label: 'Warning' },
    { key: 'danger', label: 'Danger' },
    { key: 'link', label: 'Link' }
];

const BASE_COLORS = [
    { key: 'green', label: 'Green' },
    { key: 'cyan', label: 'Cyan' },
    { key: 'indigo', label: 'Indigo' },
    { key: 'purple', label: 'Purple' },
    { key: 'pink', label: 'Pink' }
];

const NEUTRALS = [
    { key: 'text-primary', label: 'Text Primary' },
    { key: 'text-secondary', label: 'Text Secondary' },
    { key: 'placeholder', label: 'Placeholder' },
    { key: 'bg-primary', label: 'Bg Primary' },
    { key: 'bg-secondary', label: 'Bg Secondary' },
    { key: 'bg-select', label: 'Bg Select' },
    { key: 'border', label: 'Border' },
    { key: 'shadow', label: 'Shadow' }
];

const BASE_PALETTE = [
    { key: 'white-true', label: 'White True' },
    { key: 'white', label: 'White' },
    { key: 'white-dark', label: 'White Dark' },
    { key: 'gray-light', label: 'Gray Light' },
    { key: 'gray', label: 'Gray' },
    { key: 'gray-dark', label: 'Gray Dark' },
    { key: 'black-light', label: 'Black Light' },
    { key: 'black', label: 'Black' },
    { key: 'black-true', label: 'Black True' }
];

// 旧トークン名 -> 新トークン名（src/composables/useTheme.ts の BACKWARD_COMPAT_ALIASES と同期）
const BACKWARD_COMPAT_ALIASES = [
    { key: 'status-brand', label: 'Status Brand' },
    { key: 'status-info', label: 'Status Info' },
    { key: 'status-success', label: 'Status Success' },
    { key: 'status-warning', label: 'Status Warning' },
    { key: 'status-danger', label: 'Status Danger' },
    { key: 'theme-text-primary', label: 'Theme Text Primary' },
    { key: 'theme-text-secondary', label: 'Theme Text Secondary' },
    { key: 'theme-placeholder', label: 'Theme Placeholder' },
    { key: 'theme-bg-primary', label: 'Theme Bg Primary' },
    { key: 'theme-bg-secondary', label: 'Theme Bg Secondary' },
    { key: 'theme-bg-select', label: 'Theme Bg Select' },
    { key: 'theme-border', label: 'Theme Border' },
    { key: 'theme-shadow', label: 'Theme Shadow' },
    { key: 'theme-link', label: 'Theme Link' },
    { key: 'theme-link-hover', label: 'Theme Link Hover' },
    { key: 'base-red', label: 'Base Red' },
    { key: 'base-orange', label: 'Base Orange' },
    { key: 'base-yellow', label: 'Base Yellow' },
    { key: 'base-lime', label: 'Base Lime' },
    { key: 'base-blue', label: 'Base Blue' },
    { key: 'base-green', label: 'Base Green' },
    { key: 'base-cyan', label: 'Base Cyan' },
    { key: 'base-indigo', label: 'Base Indigo' },
    { key: 'base-purple', label: 'Base Purple' },
    { key: 'base-pink', label: 'Base Pink' }
];

const varName = (name: string, suffix: string) => (suffix ? `--color-${name}-${suffix}` : `--color-${name}`);
</script>

<template>
    <div>
        <section class="pg-section">
            <h2>Tokens</h2>
            <p class="pg-override-desc">
                minazuki-ui が提供する CSS 変数の一覧とサンプルです。テーマ切り替えボタンで Light /
                Dark 双方の見た目を確認できます。詳細な命名規則・override 方法は
                <code>docs/DESIGN.md</code> を参照してください。
            </p>
        </section>

        <section class="pg-section">
            <h3>ロール色（明度ラダーの使い分け）</h3>
            <p class="pg-override-desc">
                各ロール（Brand / Info / Success / Warning / Danger / Link）は hue・chroma を持ち、明度ラダーで
                7 段階（Surface〜Alpha）に展開されます。役割は共通です。
            </p>
            <table class="pg-token-table">
                <thead>
                    <tr>
                        <th>段階</th>
                        <th>用途</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="step in LADDER_USAGE" :key="step.suffix">
                        <td>{{ step.label }}</td>
                        <td>{{ step.usage }}</td>
                    </tr>
                </tbody>
            </table>

            <div v-for="role in ROLES" :key="role.key" class="pg-color-group">
                <h3>{{ role.label }}</h3>
                <div class="pg-color-row">
                    <div v-for="step in LADDER_USAGE" :key="step.suffix" class="pg-color-card">
                        <div
                            class="pg-color-swatch"
                            :style="{ backgroundColor: `var(${varName(role.key, step.suffix)})` }"
                        />
                        <div class="pg-color-name">
                            {{ step.label }}<br>
                            {{ varName(role.key, step.suffix) }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="pg-section">
            <h3>ベース色（role に紐付かない拡張色）</h3>
            <p class="pg-override-desc">
                ロール色は role を経由して hue/chroma を間接参照しますが、ベース色は role を経由せず
                プリミティブ（hue/chroma）をそのまま公開したものです。明度ラダーは展開されず Base / Alpha のみです。
            </p>
            <div v-for="color in BASE_COLORS" :key="color.key" class="pg-color-group">
                <h3>{{ color.label }}</h3>
                <div class="pg-color-row">
                    <div v-for="step in BASE_ALPHA_LADDER" :key="step.suffix" class="pg-color-card">
                        <div
                            class="pg-color-swatch"
                            :style="{ backgroundColor: `var(${varName(color.key, step.suffix)})` }"
                        />
                        <div class="pg-color-name">
                            {{ step.label }}<br>
                            {{ varName(color.key, step.suffix) }}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="pg-section">
            <h3>Neutrals（テーマ依存無彩色）</h3>
            <div class="pg-color-row">
                <template v-for="neutral in NEUTRALS" :key="neutral.key">
                    <div v-for="step in BASE_ALPHA_LADDER" :key="step.suffix" class="pg-color-card">
                        <div
                            class="pg-color-swatch"
                            :style="{ backgroundColor: `var(${varName(neutral.key, step.suffix)})` }"
                        />
                        <div class="pg-color-name">
                            {{ neutral.label }} {{ step.label }}<br>
                            {{ varName(neutral.key, step.suffix) }}
                        </div>
                    </div>
                </template>
            </div>
        </section>

        <section class="pg-section">
            <h3>Base Palette（テーマ不変無彩色）</h3>
            <div class="pg-color-row">
                <template v-for="base in BASE_PALETTE" :key="base.key">
                    <div v-for="step in BASE_ALPHA_LADDER" :key="step.suffix" class="pg-color-card">
                        <div
                            class="pg-color-swatch"
                            :style="{ backgroundColor: `var(${varName(`base-${base.key}`, step.suffix)})` }"
                        />
                        <div class="pg-color-name">
                            {{ base.label }} {{ step.label }}<br>
                            {{ varName(`base-${base.key}`, step.suffix) }}
                        </div>
                    </div>
                </template>
            </div>
        </section>

        <section class="pg-section">
            <h3>後方互換エイリアス</h3>
            <p class="pg-override-desc">
                旧バージョン（1層構造）のトークン名です。<code>var()</code> 経由で新トークンを参照するため、見た目は対応する新トークンと同一になります。
            </p>
            <div class="pg-color-row">
                <template v-for="alias in BACKWARD_COMPAT_ALIASES" :key="alias.key">
                    <div v-for="step in BASE_ALPHA_LADDER" :key="step.suffix" class="pg-color-card">
                        <div
                            class="pg-color-swatch"
                            :style="{ backgroundColor: `var(${varName(alias.key, step.suffix)})` }"
                        />
                        <div class="pg-color-name">
                            {{ alias.label }} {{ step.label }}<br>
                            {{ varName(alias.key, step.suffix) }}
                        </div>
                    </div>
                </template>
            </div>
        </section>

        <section class="pg-section">
            <h3>Typography</h3>
            <div class="pg-token-sample-row">
                <div class="pg-token-sample" style="font-family: var(--font-sans);">
                    <div class="pg-color-name">--font-sans</div>
                    あいうえお ABCDEFG 0123456789
                </div>
                <div class="pg-token-sample" style="font-family: var(--font-serif);">
                    <div class="pg-color-name">--font-serif</div>
                    あいうえお ABCDEFG 0123456789
                </div>
                <div class="pg-token-sample" style="font-family: var(--font-accent);">
                    <div class="pg-color-name">--font-accent</div>
                    あいうえお ABCDEFG 0123456789
                </div>
            </div>
            <div class="pg-token-sample-row">
                <div class="pg-token-sample" style="font-size: var(--font-size-large);">
                    <div class="pg-color-name">--font-size-large</div>
                    あいうえお 0123456789
                </div>
                <div class="pg-token-sample" style="font-size: var(--font-size-medium);">
                    <div class="pg-color-name">--font-size-medium</div>
                    あいうえお 0123456789
                </div>
                <div class="pg-token-sample" style="font-size: var(--font-size-small);">
                    <div class="pg-color-name">--font-size-small</div>
                    あいうえお 0123456789
                </div>
            </div>
        </section>
    </div>
</template>
