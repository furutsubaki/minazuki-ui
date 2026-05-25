<script setup lang="ts">
import { ref } from 'vue';
import { Home, Search, Bell, User } from 'lucide-vue-next';

const currentTab = ref('tab1');
const currentStep = ref('step1');
const currentPage = ref(1);

const tabs = [
    { id: 'tab1', label: 'タブ 1' },
    { id: 'tab2', label: 'タブ 2' },
    { id: 'tab3', label: 'タブ 3' }
];

const steps = [
    { id: 'step1', label: '入力' },
    { id: 'step2', label: '確認' },
    { id: 'step3', label: '完了' }
];

const breadcrumbItems = [
    { label: 'ホーム', to: '/' },
    { label: 'ナビゲーション', to: '/navigation' }
];

const bottomNavItems = [
    { label: 'ホーム', icon: Home, to: '/', isCurrent: true },
    { label: '検索', icon: Search, to: '/' },
    { label: '通知', icon: Bell, to: '/' },
    { label: 'プロフィール', icon: User, to: '/' }
];
</script>

<template>
    <div>
        <section class="pg-section">
            <h2>Breadcrumb</h2>
            <MiBreadcrumb :items="breadcrumbItems" />
        </section>

        <section class="pg-section">
            <h2>Tab</h2>
            <MiTab v-model="currentTab" :tabs="tabs" style="height: 160px;">
                <template #tab1>
                    <div style="padding: 16px;">タブ 1 のコンテンツ</div>
                </template>
                <template #tab2>
                    <div style="padding: 16px;">タブ 2 のコンテンツ</div>
                </template>
                <template #tab3>
                    <div style="padding: 16px;">タブ 3 のコンテンツ</div>
                </template>
            </MiTab>
        </section>

        <section class="pg-section">
            <h2>Step</h2>
            <MiStep v-model="currentStep" :steps="steps">
                <template #step1>
                    <div style="padding: 16px;">ステップ 1: 情報を入力してください</div>
                </template>
                <template #step2>
                    <div style="padding: 16px;">ステップ 2: 内容を確認してください</div>
                </template>
                <template #step3>
                    <div style="padding: 16px;">ステップ 3: 完了しました！</div>
                </template>
            </MiStep>
        </section>

        <section class="pg-section">
            <h2>Pagination</h2>
            <div class="pg-row" style="flex-direction: column;">
                <MiPagination v-model="currentPage" :total="20" />
                <span>現在のページ: {{ currentPage }}</span>
            </div>
        </section>

        <section class="pg-section">
            <h2>BottomNav（プレビュー）</h2>
            <p style="margin-bottom: 12px; font-size: 0.85rem; color: var(--color-theme-text-secondary);">
                ※ 通常は画面下部に固定表示されます。ここでは no-shadow で表示しています。
            </p>
            <MiBottomNav :items="bottomNavItems" no-shadow />
        </section>
    </div>
</template>
