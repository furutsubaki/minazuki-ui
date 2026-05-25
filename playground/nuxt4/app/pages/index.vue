<script setup lang="ts">
import { ref } from 'vue';

const progress = ref(60);
const rating = ref(3);
const showBadge = ref(true);
</script>

<template>
    <div>
        <section class="pg-section">
            <h2>Button</h2>
            <div class="pg-row">
                <MiButton variant="primary">Primary</MiButton>
                <MiButton variant="secondary">Secondary</MiButton>
                <MiButton variant="info">Info</MiButton>
                <MiButton variant="success">Success</MiButton>
                <MiButton variant="warning">Warning</MiButton>
                <MiButton variant="danger">Danger</MiButton>
                <MiButton variant="primary" shape="rounded">Rounded</MiButton>
                <MiButton variant="primary" disabled>Disabled</MiButton>
                <MiButton variant="primary" shape="link">Link</MiButton>
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
                    <MiButton variant="secondary" @click="showBadge = !showBadge">
                        {{ showBadge ? 'バッジ非表示' : 'バッジ表示' }}
                    </MiButton>
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
                <MiProgress v-model="progress" variant="info" shape="circle" />
                <div class="pg-row">
                    <MiButton size="small" @click="progress = Math.max(0, progress - 10)">-10</MiButton>
                    <span>{{ progress }}%</span>
                    <MiButton size="small" variant="primary" @click="progress = Math.min(100, progress + 10)">+10</MiButton>
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
