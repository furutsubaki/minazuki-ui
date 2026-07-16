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
                <MiButton v-if="!showAlert" size="small" label="アラートを再表示" @click="showAlert = true" />
            </div>
        </section>

        <section class="pg-section">
            <h2>Notifications（通知）</h2>
            <div class="pg-row">
                <MiButton label="通知（Secondary）" @click="sendNotification('secondary')" />
                <MiButton variant="info" label="通知（Info）" @click="sendNotification('info')" />
                <MiButton variant="success" label="通知（Success）" @click="sendNotification('success')" />
                <MiButton variant="warning" label="通知（Warning）" @click="sendNotification('warning')" />
                <MiButton variant="danger" label="通知（Danger）" @click="sendNotification('danger')" />
            </div>
        </section>

        <section class="pg-section">
            <h2>Dialog</h2>
            <MiButton label="ダイアログを開く" @click="showDialog = true" />
            <MiDialog v-model="showDialog" title="確認ダイアログ" variant="warning">
                <template #default>
                    <p>この操作を実行してよろしいですか？</p>
                </template>
                <template #footer>
                    <MiButton label="キャンセル" @click="showDialog = false" />
                    <MiButton variant="danger" label="実行" @click="showDialog = false" />
                </template>
            </MiDialog>
        </section>

        <section class="pg-section">
            <h2>Modal</h2>
            <MiButton variant="primary" label="モーダルを開く" @click="showModal = true" />
            <MiModal v-model="showModal" title="モーダルタイトル" size="medium">
                <p>モーダルの本文です。ここにコンテンツが入ります。</p>
                <p style="margin-top: 8px;">2行目のコンテンツです。</p>
            </MiModal>
        </section>

        <section class="pg-section">
            <h2>Drawer</h2>
            <MiButton label="ドロワーを開く" @click="showDrawer = true" />
            <MiDrawer v-model="showDrawer" title="ドロワーメニュー" position="left">
                <div style="display: flex; flex-direction: column; gap: 8px; padding: 16px;">
                    <MiButton shape="link" label="メニュー 1" />
                    <MiButton shape="link" label="メニュー 2" />
                    <MiButton shape="link" label="メニュー 3" />
                </div>
            </MiDrawer>
        </section>
    </div>
</template>
