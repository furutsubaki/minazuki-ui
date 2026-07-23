<script setup lang="ts">
import { ref } from 'vue';
import { Home, Search, Bell, User } from '@lucide/vue';

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
            <div class="pg-section-heading">
                <h2>Breadcrumb</h2>
                <p>現在位置を示す基本的なパンくずリストです。</p>
            </div>
            <MiBreadcrumb :items="breadcrumbItems" />
        </section>

        <section class="pg-section">
            <div class="pg-section-heading">
                <h2>Tab</h2>
                <p>同じ文脈内で表示内容を切り替えます。</p>
            </div>
            <MiTab v-model="currentTab" :tabs="tabs" class="pg-navigation-tab">
                <template #tab1>
                    <div class="pg-navigation-panel">タブ 1 のコンテンツ</div>
                </template>
                <template #tab2>
                    <div class="pg-navigation-panel">タブ 2 のコンテンツ</div>
                </template>
                <template #tab3>
                    <div class="pg-navigation-panel">タブ 3 のコンテンツ</div>
                </template>
            </MiTab>
        </section>

        <section class="pg-section">
            <div class="pg-section-heading">
                <h2>Step</h2>
                <p>入力、確認、完了のような順序付きフローを進めます。</p>
            </div>
            <MiStep v-model="currentStep" :steps="steps">
                <template #step1>
                    <div class="pg-navigation-panel">ステップ 1: 情報を入力してください</div>
                </template>
                <template #step2>
                    <div class="pg-navigation-panel">ステップ 2: 内容を確認してください</div>
                </template>
                <template #step3>
                    <div class="pg-navigation-panel">ステップ 3: 完了しました！</div>
                </template>
            </MiStep>
        </section>

        <section class="pg-section">
            <div class="pg-section-heading">
                <h2>Pagination</h2>
                <p>ページングが必要な一覧で現在ページを切り替えます。</p>
            </div>
            <div class="pg-row pg-row-column">
                <MiPagination v-model="currentPage" :total="20" />
                <span class="pg-muted">現在のページ: {{ currentPage }}</span>
            </div>
        </section>

        <section class="pg-section">
            <div class="pg-section-heading">
                <h2>BottomNav</h2>
                <p>通常は画面下部に固定表示されます。ここでは no-shadow で表示しています。</p>
            </div>
            <MiBottomNav :items="bottomNavItems" no-shadow />
        </section>
    </div>
</template>
