<script setup lang="ts">
import { ref, type Component } from 'vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import Button from '@/components/basic/Button.vue';
import {
    X as IconX,
    Info as IconInfo,
    CheckCircle2 as IconCheckCircle2,
    AlertTriangle as IconAlertTriangle,
    XOctagon as IconXOctagon
} from 'lucide-vue-next';
import { computed } from 'vue';
import { sleep } from '@/assets/ts';

const flg = defineModel<boolean>({ default: true });
withDefaults(
    defineProps<{
        /**
         * 表示色
         */
        variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
        /**
         * 形状
         */
        shape?: 'normal' | 'no-radius';
        /**
         * アイコン（コンポーネント）
         */
        icon?: Component;
        /**
         * タイトル
         */
        title?: string;
        /**
         * 内容
         */
        text: string;
        /**
         * 閉じるボタン
         */
        closeable?: boolean;
    }>(),
    {
        variant: 'secondary',
        shape: 'normal',
        closeable: false
    }
);
const emit = defineEmits<{
    /**
     * 閉じた
     */
    closed: [];
}>();

// transition状態
const transitioning = ref(false);
const isShowing = computed(() => {
    if (flg.value) {
        return true;
    } else {
        return transitioning.value;
    }
});

const onClose = async () => {
    flg.value = false;
    await onClosed();
};
const onClosed = async () => {
    if (isShowing.value) {
        await sleep(100);
        onClosed();
    } else {
        emit('closed');
    }
};
</script>

<template>
    <OpacityTransition
        @transition-start="transitioning = true"
        @transition-end="transitioning = false"
    >
        <div class="component-alert" :class="[variant, shape]" v-show="flg">
            <icon v-if="icon" class="icon" />
            <IconInfo v-else-if="variant === 'info'" class="icon" />
            <IconCheckCircle2 v-else-if="variant === 'success'" class="icon" />
            <IconAlertTriangle v-else-if="variant === 'warning'" class="icon" />
            <IconXOctagon v-else-if="variant === 'danger'" class="icon" />
            <div class="box">
                <div v-if="title" class="title">{{ title }}</div>
                <div>{{ text }}</div>
            </div>
            <Button v-if="closeable" shape="skeleton" class="closeable-box" @click="onClose">
                <IconX />
            </Button>
        </div>
    </OpacityTransition>
</template>

<style scoped>
.component-alert {
    display: flex;
    gap: 8px;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    min-width: 100px;
    min-height: 32px;
    padding: 8px;
    color: var(--c-alert-color);
    word-break: keep-all;
    background-color: var(--c-alert-background-color);
    border: 1px solid;
    border-color: var(--c-alert-border-color);
    border-radius: var(--c-alert-border-radius);
    transition:
        color 0.2s,
        background-color 0.2s,
        border-color 0.2s,
        opacity 0.2s;
    .icon {
        flex-shrink: 0;
        width: calc(var(--font-size-medium) * 1.8);
        height: calc(var(--font-size-medium) * 1.8);
        padding: 2px;
        color: var(--c-alert-color);
    }
    .box {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: 8px;
        .title {
            font-size: calc(var(--font-size-medium) * 1.2);
            font-weight: bold;
        }
    }
    .closeable-box {
        flex-shrink: 0;
    }
}

.primary {
    --c-alert-color: var(--color-base-white);
    --c-alert-background-color: var(--color-status-brand);
    --c-alert-border-color: var(--color-status-brand);
}

.secondary {
    --c-alert-color: var(--color-theme-text-primary);
    --c-alert-background-color: transparent;
    --c-alert-border-color: var(--color-theme-border);
}

.info {
    --c-alert-color: var(--color-theme-text-primary);
    --c-alert-background-color: var(--color-status-info);
    --c-alert-border-color: var(--color-status-info);
}

.success {
    --c-alert-color: var(--color-base-white);
    --c-alert-background-color: var(--color-status-success);
    --c-alert-border-color: var(--color-status-success);
}

.warning {
    --c-alert-color: var(--color-base-black);
    --c-alert-background-color: var(--color-status-warning);
    --c-alert-border-color: var(--color-status-warning);
}

.danger {
    --c-alert-color: var(--color-base-white);
    --c-alert-background-color: var(--color-status-danger);
    --c-alert-border-color: var(--color-status-danger);
}

/* ▼ shape ▼ */

.normal {
    --c-alert-border-radius: 4px;
}

.no-radius {
    --c-alert-border-radius: 0;
}

/* ▲ shape ▲ */
</style>
