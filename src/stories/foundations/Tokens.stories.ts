import { defineComponent } from 'vue';
import type { Meta, StoryObj } from '@storybook/vue3-vite';

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

// 全色相プリミティブ（docs/DESIGN.md 2.1 と同じ並び）。role を持つ色相は role 名を付記する
const BASE_COLORS = [
    { key: 'red', label: 'Red', role: 'Danger' },
    { key: 'orange', label: 'Orange', role: 'Link' },
    { key: 'yellow', label: 'Yellow', role: 'Warning' },
    { key: 'lime', label: 'Lime', role: 'Info' },
    { key: 'green', label: 'Green', role: null },
    { key: 'teal', label: 'Teal', role: 'Brand' },
    { key: 'cyan', label: 'Cyan', role: null },
    { key: 'blue', label: 'Blue', role: 'Success' },
    { key: 'indigo', label: 'Indigo', role: null },
    { key: 'purple', label: 'Purple', role: null },
    { key: 'pink', label: 'Pink', role: null }
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

const TokensPage = defineComponent({
    setup() {
        return {
            LADDER_USAGE,
            BASE_ALPHA_LADDER,
            ROLES,
            BASE_COLORS,
            NEUTRALS,
            BASE_PALETTE,
            BACKWARD_COMPAT_ALIASES,
            varName
        };
    },
    template: `
        <div style="font-family: var(--font-sans); font-size: var(--font-size-medium); line-height: 1.5em;">
            <section style="margin-bottom: 40px;">
                <h2 style="padding-bottom: 8px; margin-bottom: 16px; font-size: var(--font-size-large); font-weight: bold; border-bottom: 1px solid var(--color-border);">Tokens</h2>
                <p style="margin-bottom: 16px; font-size: var(--font-size-medium);">
                    minazuki-ui が提供する CSS 変数の一覧とサンプルです。Storybook 上部のテーマ切り替えで Light / Dark
                    双方の見た目を確認できます。詳細な命名規則・override 方法は <code style="padding: 2px 6px; font-size: var(--font-size-small); background-color: var(--color-bg-secondary); border-radius: 4px;">docs/DESIGN.md</code> を参照してください。
                </p>
            </section>

            <section style="margin-bottom: 40px;">
                <h3 style="margin-bottom: 8px; font-size: var(--font-size-medium); font-weight: bold;">ロール色（明度ラダーの使い分け）</h3>
                <p style="margin-bottom: 16px; font-size: var(--font-size-medium);">
                    各ロール（Brand / Info / Success / Warning / Danger / Link）は hue・chroma を持ち、明度ラダーで
                    7 段階（Surface〜Alpha）に展開されます。役割は共通です。
                </p>
                <table style="width: 100%; margin-bottom: 24px; font-size: var(--font-size-medium); border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 6px 12px; text-align: left; border: 1px solid var(--color-border); background-color: var(--color-bg-secondary);">段階</th>
                            <th style="padding: 6px 12px; text-align: left; border: 1px solid var(--color-border); background-color: var(--color-bg-secondary);">用途</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="step in LADDER_USAGE" :key="step.suffix">
                            <td style="padding: 6px 12px; border: 1px solid var(--color-border);">{{ step.label }}</td>
                            <td style="padding: 6px 12px; border: 1px solid var(--color-border);">{{ step.usage }}</td>
                        </tr>
                    </tbody>
                </table>

                <div v-for="role in ROLES" :key="role.key" style="margin-bottom: 24px;">
                    <h3 style="margin-bottom: 8px; font-size: var(--font-size-medium); font-weight: bold;">{{ role.label }}</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
                        <div v-for="step in LADDER_USAGE" :key="step.suffix" style="width: 120px;">
                            <div
                                style="height: 56px; border: 1px solid var(--color-border); border-radius: 4px;"
                                :style="{ backgroundColor: \`var(\${varName(role.key, step.suffix)})\` }"
                            />
                            <div style="margin-top: 4px; font-family: monospace; font-size: var(--font-size-small); color: var(--color-text-secondary); overflow-wrap: anywhere;">
                                {{ step.label }}<br>
                                {{ varName(role.key, step.suffix) }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style="margin-bottom: 40px;">
                <h3 style="margin-bottom: 8px; font-size: var(--font-size-medium); font-weight: bold;">ベース色（全色相プリミティブ）</h3>
                <p style="margin-bottom: 16px; font-size: var(--font-size-medium);">
                    ロール色は role を経由して hue/chroma を間接参照しますが、ベース色は role の有無に関わらず全 11 色相の
                    プリミティブ（hue/chroma）をそのまま公開したものです。明度ラダーは展開されず Base / Alpha のみです。
                    role が紐付く色相（Teal / Lime / Blue / Yellow / Red / Orange）は対応する role の Base 値と基本的に
                    同一になりますが、Warning（Yellow）のみ <code style="padding: 2px 6px; font-size: var(--font-size-small); background-color: var(--color-bg-secondary); border-radius: 4px;">lightnessOffset</code> の分だけ見た目が異なります。
                </p>
                <div v-for="color in BASE_COLORS" :key="color.key" style="margin-bottom: 24px;">
                    <h3 style="margin-bottom: 8px; font-size: var(--font-size-medium); font-weight: bold;">
                        {{ color.label }}
                        <span v-if="color.role" style="font-weight: normal; font-size: var(--font-size-small); color: var(--color-text-secondary);">（Role: {{ color.role }}）</span>
                    </h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
                        <div v-for="step in BASE_ALPHA_LADDER" :key="step.suffix" style="width: 120px;">
                            <div
                                style="height: 56px; border: 1px solid var(--color-border); border-radius: 4px;"
                                :style="{ backgroundColor: \`var(\${varName(color.key, step.suffix)})\` }"
                            />
                            <div style="margin-top: 4px; font-family: monospace; font-size: var(--font-size-small); color: var(--color-text-secondary); overflow-wrap: anywhere;">
                                {{ step.label }}<br>
                                {{ varName(color.key, step.suffix) }}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section style="margin-bottom: 40px;">
                <h3 style="margin-bottom: 8px; font-size: var(--font-size-medium); font-weight: bold;">Neutrals（テーマ依存無彩色）</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
                    <template v-for="neutral in NEUTRALS" :key="neutral.key">
                        <div v-for="step in BASE_ALPHA_LADDER" :key="step.suffix" style="width: 120px;">
                            <div
                                style="height: 56px; border: 1px solid var(--color-border); border-radius: 4px;"
                                :style="{ backgroundColor: \`var(\${varName(neutral.key, step.suffix)})\` }"
                            />
                            <div style="margin-top: 4px; font-family: monospace; font-size: var(--font-size-small); color: var(--color-text-secondary); overflow-wrap: anywhere;">
                                {{ neutral.label }} {{ step.label }}<br>
                                {{ varName(neutral.key, step.suffix) }}
                            </div>
                        </div>
                    </template>
                </div>
            </section>

            <section style="margin-bottom: 40px;">
                <h3 style="margin-bottom: 8px; font-size: var(--font-size-medium); font-weight: bold;">Base Palette（テーマ不変無彩色）</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
                    <template v-for="base in BASE_PALETTE" :key="base.key">
                        <div v-for="step in BASE_ALPHA_LADDER" :key="step.suffix" style="width: 120px;">
                            <div
                                style="height: 56px; border: 1px solid var(--color-border); border-radius: 4px;"
                                :style="{ backgroundColor: \`var(\${varName(\`base-\${base.key}\`, step.suffix)})\` }"
                            />
                            <div style="margin-top: 4px; font-family: monospace; font-size: var(--font-size-small); color: var(--color-text-secondary); overflow-wrap: anywhere;">
                                {{ base.label }} {{ step.label }}<br>
                                {{ varName(\`base-\${base.key}\`, step.suffix) }}
                            </div>
                        </div>
                    </template>
                </div>
            </section>

            <section style="margin-bottom: 40px;">
                <h3 style="margin-bottom: 8px; font-size: var(--font-size-medium); font-weight: bold;">後方互換エイリアス</h3>
                <p style="margin-bottom: 16px; font-size: var(--font-size-medium);">
                    旧バージョン（1層構造）のトークン名です。<code style="padding: 2px 6px; font-size: var(--font-size-small); background-color: var(--color-bg-secondary); border-radius: 4px;">var()</code> 経由で新トークンを参照するため、見た目は対応する新トークンと同一になります。
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
                    <template v-for="alias in BACKWARD_COMPAT_ALIASES" :key="alias.key">
                        <div v-for="step in BASE_ALPHA_LADDER" :key="step.suffix" style="width: 120px;">
                            <div
                                style="height: 56px; border: 1px solid var(--color-border); border-radius: 4px;"
                                :style="{ backgroundColor: \`var(\${varName(alias.key, step.suffix)})\` }"
                            />
                            <div style="margin-top: 4px; font-family: monospace; font-size: var(--font-size-small); color: var(--color-text-secondary); overflow-wrap: anywhere;">
                                {{ alias.label }} {{ step.label }}<br>
                                {{ varName(alias.key, step.suffix) }}
                            </div>
                        </div>
                    </template>
                </div>
            </section>

            <section>
                <h3 style="margin-bottom: 8px; font-size: var(--font-size-medium); font-weight: bold;">Typography</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 12px;">
                    <div style="padding: 12px; background-color: var(--color-bg-secondary); border-radius: 4px; font-size: var(--font-size-large);">
                        <div style="margin-top: 4px; font-family: monospace; font-size: var(--font-size-small); color: var(--color-text-secondary);">--font-size-large</div>
                        あいうえお 0123456789
                    </div>
                    <div style="padding: 12px; background-color: var(--color-bg-secondary); border-radius: 4px; font-size: var(--font-size-medium);">
                        <div style="margin-top: 4px; font-family: monospace; font-size: var(--font-size-small); color: var(--color-text-secondary);">--font-size-medium</div>
                        あいうえお 0123456789
                    </div>
                    <div style="padding: 12px; background-color: var(--color-bg-secondary); border-radius: 4px; font-size: var(--font-size-small);">
                        <div style="margin-top: 4px; font-family: monospace; font-size: var(--font-size-small); color: var(--color-text-secondary);">--font-size-small</div>
                        あいうえお 0123456789
                    </div>
                </div>
            </section>
        </div>
    `
});

const meta: Meta<typeof TokensPage> = {
    component: TokensPage
};

export default meta;
type Story = StoryObj<typeof TokensPage>;

export const Default: Story = {};
