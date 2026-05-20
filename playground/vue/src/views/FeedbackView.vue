<script setup lang="ts">
import { ref } from 'vue';
import { useNotification } from 'minazuki-ui';

const { addNotification } = useNotification();

const showAlert = ref(true);
const showDialog = ref(false);
const showModal = ref(false);
const showDrawer = ref(false);

const sendNotification = (variant: 'secondary' | 'success' | 'warning' | 'danger' | 'info') => {
    addNotification({
        variant,
        title: `通知 (${variant})`,
        message: 'これはテスト通知です。',
        autoRemove: true,
        position: 'top-right'
    });
};
</script>

<template>
    <div>
        <section class="pg-section">
            <h2>Alert</h2>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <MiAlert text="Info アラートです。" variant="info" title="情報" />
                <MiAlert text="Success アラートです。" variant="success" title="成功" />
                <MiAlert text="Warning アラートです。" variant="warning" title="警告" />
                <MiAlert text="Danger アラートです。" variant="danger" title="エラー" closeable v-model="showAlert" />
                <MiButton v-if="!showAlert" size="small" @click="showAlert = true">アラートを再表示</MiButton>
            </div>
        </section>

        <section class="pg-section">
            <h2>Notifications（通知）</h2>
            <div class="pg-row">
                <MiButton @click="sendNotification('secondary')">通知（Secondary）</MiButton>
                <MiButton variant="info" @click="sendNotification('info')">通知（Info）</MiButton>
                <MiButton variant="success" @click="sendNotification('success')">通知（Success）</MiButton>
                <MiButton variant="warning" @click="sendNotification('warning')">通知（Warning）</MiButton>
                <MiButton variant="danger" @click="sendNotification('danger')">通知（Danger）</MiButton>
            </div>
        </section>

        <section class="pg-section">
            <h2>Dialog</h2>
            <MiButton @click="showDialog = true">ダイアログを開く</MiButton>
            <MiDialog v-model="showDialog" title="確認ダイアログ" variant="warning">
                <template #default>
                    <p>この操作を実行してよろしいですか？</p>
                </template>
                <template #footer>
                    <MiButton @click="showDialog = false">キャンセル</MiButton>
                    <MiButton variant="danger" @click="showDialog = false">実行</MiButton>
                </template>
            </MiDialog>
        </section>

        <section class="pg-section">
            <h2>Modal</h2>
            <MiButton variant="primary" @click="showModal = true">モーダルを開く</MiButton>
            <MiModal v-model="showModal" title="モーダルタイトル" size="medium">
                <p>モーダルの本文です。ここにコンテンツが入ります。</p>
                <p style="margin-top: 8px;">2行目のコンテンツです。</p>
            </MiModal>
        </section>

        <section class="pg-section">
            <h2>Drawer</h2>
            <MiButton @click="showDrawer = true">ドロワーを開く</MiButton>
            <MiDrawer v-model="showDrawer" title="ドロワーメニュー">
                <div style="padding: 16px; display: flex; flex-direction: column; gap: 8px;">
                    <MiButton shape="link">メニュー 1</MiButton>
                    <MiButton shape="link">メニュー 2</MiButton>
                    <MiButton shape="link">メニュー 3</MiButton>
                </div>
            </MiDrawer>
        </section>
    </div>
</template>
