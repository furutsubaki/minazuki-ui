<script setup lang="ts">
import { ref } from 'vue';
import { useTheme } from 'minazuki-ui';

const progress = ref(60);
const rating = ref(3);
const showBadge = ref(true);

const { overrideTheme } = useTheme();
const isBrandOverridden = ref(false);

const applyBrandOverride = () => {
    overrideTheme({ statuses: { brand: { hue: 'purple', chroma: 'purple' } } });
    isBrandOverridden.value = true;
};
const resetBrandOverride = () => {
    overrideTheme({ statuses: { brand: { hue: 'teal', chroma: 'teal' } } });
    isBrandOverridden.value = false;
};
</script>

<template>
    <div>
        <section class="pg-section">
            <h2>Style Override（CSS Layer）</h2>
            <p class="pg-override-desc">
                minazuki-ui のベース CSS は <code>@layer minazuki</code>
                で囲まれているため、消費側アプリの無レイヤー CSS で常に上書きできます。
            </p>
            <div class="pg-override-grid">
                <div class="pg-override-card">
                    <h3>ライブラリ既定</h3>
                    <p class="pg-override-label">
                        <code>letter-spacing: 0.05em</code>
                    </p>
                    <p class="pg-override-sample" style="letter-spacing: 0.05em;">
                        あいうえおかきくけこ ABCDEFG 0123456789
                    </p>
                </div>
                <div class="pg-override-card pg-override-app">
                    <h3>アプリ上書き（実際の適用値）</h3>
                    <p class="pg-override-label">
                        <code>letter-spacing: 0</code>
                    </p>
                    <p class="pg-override-sample">
                        あいうえおかきくけこ ABCDEFG 0123456789
                    </p>
                </div>
            </div>
        </section>

        <section class="pg-section">
            <h2>Theme Override（useTheme 実行時 API）</h2>
            <p class="pg-override-desc">
                <code>overrideTheme()</code> で <code>brand</code> の参照色相を Teal から Purple
                に切り替えます。下の Primary ボタンの色が変われば、実行時オーバーライドが実際の DOM
                に反映されていることの確認になります。
            </p>
            <div class="pg-row">
                <MiButton variant="primary" :disabled="isBrandOverridden" label="Brand を Purple に上書き" @click="applyBrandOverride" />
                <MiButton variant="secondary" :disabled="!isBrandOverridden" label="デフォルト（Teal）に戻す" @click="resetBrandOverride" />
            </div>
            <p class="pg-override-desc">
                なお Vue 環境は <code>app.use(MinazukiUi, {'{'} theme {'}'})</code>（warning を Lime
                に上書き）、Nuxt3 環境は <code>nuxt.config.ts</code> の <code>minazukiUi.theme</code>
                オプション（info を Pink に上書き）、Nuxt4 環境は無上書きの既定値で、それぞれ別経路の
                オーバーライドが適用された状態で起動しています。Warning / Info ボタンの色が環境ごとに
                異なっていれば、各消費者環境での設定時オーバーライドも機能しています。
            </p>
        </section>

        <section class="pg-section">
            <h2>Button</h2>
            <div class="pg-row">
                <MiButton variant="primary" label="Primary" />
                <MiButton variant="secondary" label="Secondary" />
                <MiButton variant="info" label="Info" />
                <MiButton variant="success" label="Success" />
                <MiButton variant="warning" label="Warning" />
                <MiButton variant="danger" label="Danger" />
                <MiButton variant="primary" shape="rounded" label="Rounded" />
                <MiButton variant="primary" disabled label="Disabled" />
                <MiButton variant="primary" shape="link" label="Link" />
            </div>
        </section>

        <section class="pg-section">
            <h2>Avatar</h2>
            <div class="pg-row">
                <MiAvatar>TB</MiAvatar>
                <MiAvatar size="small">S</MiAvatar>
                <MiAvatar size="large" color="#2196f3">L</MiAvatar>
                <MiAvatar shape="square">SQ</MiAvatar>
            </div>
        </section>

        <section class="pg-section">
            <h2>Badge</h2>
            <div class="pg-row">
                <MiBadge content="3" variant="danger" :model-value="showBadge">
                    <MiButton variant="secondary" :label="showBadge ? 'バッジ非表示' : 'バッジ表示'" @click="showBadge = !showBadge" />
                </MiBadge>
                <MiBadge content="99" variant="primary" inline :model-value="true">
                    <span>インライン</span>
                </MiBadge>
            </div>
        </section>

        <section class="pg-section">
            <h2>Frame</h2>
            <div class="pg-row">
                <MiFrame is-pading>
                    <p style="padding: 8px;">フレームコンテンツ（pf-normal）</p>
                </MiFrame>
                <MiFrame layout="pf-top" is-pading>
                    <p style="padding: 8px;">上だけ枠（pf-top）</p>
                </MiFrame>
            </div>
        </section>

        <section class="pg-section">
            <h2>Progress</h2>
            <div class="pg-row" style="flex-direction: column; width: 100%;">
                <MiProgress v-model="progress" />
                <MiProgress v-model="progress" variant="success" shape="slim-line" />
                <MiProgress v-model="progress" variant="info" shape="circle" style="width: 80px;" />
                <div class="pg-row">
                    <MiButton size="small" label="-10" @click="progress = Math.max(0, progress - 10)" />
                    <span>{{ progress }}%</span>
                    <MiButton size="small" variant="primary" label="+10" @click="progress = Math.min(100, progress + 10)" />
                </div>
            </div>
        </section>

        <section class="pg-section">
            <h2>Rating</h2>
            <div class="pg-row">
                <MiRating v-model="rating" />
                <MiRating v-model="rating" half />
                <MiRating v-model="rating" variant="flat" clearable />
                <span>評価: {{ rating }}</span>
            </div>
        </section>
    </div>
</template>
