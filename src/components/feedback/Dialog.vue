<script setup lang="ts">
import { ref, computed, useSlots, watch, onMounted, onBeforeUnmount, type Component } from 'vue';
import TeleportRoot from '@/components/inner-parts/TeleportRoot.vue';
import {
    Info as IconInfo,
    CheckCircle2 as IconCheckCircle2,
    AlertTriangle as IconAlertTriangle,
    XOctagon as IconXOctagon
} from 'lucide-vue-next';

const flg = defineModel<boolean>({ default: false });
const props = withDefaults(
    defineProps<{
        /**
         * 表示色
         */
        variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large' | 'full';
        /**
         * 形状
         */
        shape?: 'normal' | 'no-radius';
        /**
         * 位置
         */
        position?: 'center' | 'top' | 'right' | 'bottom' | 'left';
        /**
         * 表示元
         */
        transitionFrom?: 'opacity' | 'top' | 'right' | 'bottom' | 'left';
        /**
         * タイトル
         */
        title?: string;
        /**
         * センタリング
         */
        center?: boolean;
        /**
         * 暗黙Cancel禁止
         */
        persistent?: boolean;
        /**
         * シームレス
         */
        seamless?: boolean;
        /**
         * フレーム装飾用コンポーネント
         */
        frameComponent?: Component | string;
    }>(),
    {
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        position: 'center',
        transitionFrom: 'opacity',
        title: '',
        center: false,
        persistent: false,
        seamless: false,
        frameComponent: 'div'
    }
);
const emit = defineEmits<{
    /**
     * 閉じた
     */
    closed: [];
}>();

const transitionState = ref<'is-opening' | 'is-closing' | ''>('');
const transitionFromClass = computed(() => {
    if (props.transitionFrom === 'top') return 'from-top';
    if (props.transitionFrom === 'right') return 'from-right';
    if (props.transitionFrom === 'bottom') return 'from-bottom';
    if (props.transitionFrom === 'left') return 'from-left';
    return '';
});

const dialogEl = ref<HTMLDialogElement | null>(null);
let closeTimeoutId: number | undefined;

const finishClose = () => {
    if (closeTimeoutId !== undefined) {
        window.clearTimeout(closeTimeoutId);
        closeTimeoutId = undefined;
    }
    transitionState.value = '';
    dialogEl.value?.close();
    document.documentElement.style.overflow = '';
    emit('closed');
};

const open = () => {
    if (closeTimeoutId !== undefined) {
        window.clearTimeout(closeTimeoutId);
        closeTimeoutId = undefined;
    }

    transitionState.value = 'is-opening';

    if (!dialogEl.value?.open) {
        if (props.seamless) {
            dialogEl.value?.show();
        } else {
            dialogEl.value?.showModal();
        }
    }

    if (!props.seamless) {
        document.documentElement.style.overflow = 'hidden';
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (transitionState.value === 'is-opening') {
                transitionState.value = '';
            }
        });
    });
};

const startClose = () => {
    if (transitionState.value === 'is-closing') return;
    transitionState.value = 'is-closing';
    closeTimeoutId = window.setTimeout(finishClose, 250);
};

onMounted(() => {
    if (flg.value) {
        open();
    }
});

watch(
    () => flg.value,
    (newFlg) => {
        if (newFlg) {
            open();
        } else {
            startClose();
        }
    }
);

const onCancel = () => {
    if (!props.persistent) {
        flg.value = false;
    }
};

const onBackdropClick = (e: MouseEvent) => {
    if (e.target === dialogEl.value && !props.persistent && !props.seamless) {
        flg.value = false;
    }
};

onBeforeUnmount(() => {
    if (closeTimeoutId !== undefined) {
        window.clearTimeout(closeTimeoutId);
    }
    if (dialogEl.value?.open) {
        dialogEl.value.close();
    }
    document.documentElement.style.overflow = '';
});

const slots = useSlots();
const hasSlot = (name: string) => {
    return slots[name] ? !!(slots[name] as () => [])()?.length : false;
};
</script>

<template>
    <TeleportRoot>
        <dialog
            ref="dialogEl"
            class="component-dialog"
            :class="[transitionState, transitionFromClass, { 'is-seamless': seamless }]"
            @click="onBackdropClick"
            @cancel.prevent="onCancel"
        >
            <div class="dialog-panel" :class="[position]" @click.stop>
                <component :is="frameComponent" class="dialog-frame">
                    <div
                        class="dialog"
                        :class="[variant, size, shape, { 'is-center': center }]"
                    >
                        <div class="inner">
                            <IconInfo v-if="variant === 'info'" class="icon" />
                            <IconCheckCircle2 v-else-if="variant === 'success'" class="icon" />
                            <IconAlertTriangle v-else-if="variant === 'warning'" class="icon" />
                            <IconXOctagon v-else-if="variant === 'danger'" class="icon" />
                            <div class="box">
                                <div v-if="title" class="title">{{ title }}</div>
                                <div class="slot">
                                    <slot />
                                </div>
                            </div>
                        </div>
                        <div v-if="hasSlot('footer')" class="footer">
                            <slot name="footer" />
                        </div>
                    </div>
                </component>
            </div>
        </dialog>
    </TeleportRoot>
</template>

<style scoped>
.component-dialog {
    position: fixed;
    inset: 0;
    width: 100%;
    max-width: none;
    height: 100%;
    max-height: none;
    padding: 0;
    margin: 0;
    overflow: visible;
    color: inherit;
    outline: none;
    background: transparent;
    border: none;
    &::backdrop {
        background-color: var(--color-shadow-alpha);
        opacity: 1;
        transition: opacity 0.2s ease-in-out;
    }
    &.is-opening::backdrop,
    &.is-closing::backdrop {
        opacity: 0;
    }
    &.is-seamless {
        z-index: 10;
        pointer-events: none;
    }
}

.dialog-panel {
    position: fixed;
    inset: 0;
    width: fit-content;
    height: fit-content;
    margin: auto;
    pointer-events: auto;
    opacity: 1;
    transform: translate(0, 0);
    transition:
        opacity 0.2s ease-in-out,
        transform 0.2s ease-in-out;
}

/* ▼ transition ▼ */

.is-opening .dialog-panel,
.is-closing .dialog-panel {
    opacity: 0;
}

.is-opening.from-top .dialog-panel,
.is-closing.from-top .dialog-panel {
    opacity: 0;
    transform: translateY(-100%);
}

.is-opening.from-right .dialog-panel,
.is-closing.from-right .dialog-panel {
    opacity: 0;
    transform: translateX(100%);
}

.is-opening.from-bottom .dialog-panel,
.is-closing.from-bottom .dialog-panel {
    opacity: 0;
    transform: translateY(100%);
}

.is-opening.from-left .dialog-panel,
.is-closing.from-left .dialog-panel {
    opacity: 0;
    transform: translateX(-100vw);
}

/* ▲ transition ▲ */

.dialog {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    width: var(--c-dialog-width);
    max-width: 80vw;
    min-height: var(--c-dialog-min-height);
    max-height: var(--c-dialog-max-height);
    padding: var(--space-sm) 0;
    margin: auto;
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    border: 1px solid;
    border-color: var(--c-dialog-border-color);
    border-radius: var(--c-dialog-border-radius);
    transition:
        border-color 0.2s,
        opacity 0.2s;
    .inner {
        display: flex;
        flex-grow: 1;
        align-items: flex-start;
        overflow: hidden;
    }
    .icon {
        flex-shrink: 0;
        width: calc(var(--font-size-medium) * 1.8);
        height: calc(var(--font-size-medium) * 1.8);
        margin: 0 var(--space-sm);
        margin-right: 0;
        color: var(--color-bg-primary);
        fill: var(--c-dialog-icon-color);
    }
    .box {
        display: flex;
        flex-direction: column;
        gap: var(--space-sm);
        width: 100%;
        height: 100%;
        .title {
            padding: 0 var(--space-sm);
            font-size: calc(var(--font-size-medium) * 1.2);
            font-weight: bold;
        }
        .slot {
            flex-grow: 1;
            height: 100%;
            padding: 0 var(--space-sm);
            overflow-y: auto;
        }
    }
    .footer {
        display: flex;
        flex-shrink: 0;
        gap: var(--space-sm);
        justify-content: flex-end;
        padding: 0 var(--space-sm);
    }
    &.is-center {
        .title,
        .footer {
            justify-content: center;
            text-align: center;
        }
    }
}

/* ▼ variant ▼ */

.primary {
    --c-dialog-icon-color: var(--color-brand);
    --c-dialog-border-color: var(--color-brand);
}

.secondary {
    --c-dialog-icon-color: transparent;
    --c-dialog-border-color: var(--color-border);
}

.info {
    --c-dialog-icon-color: var(--color-info);
    --c-dialog-border-color: var(--color-info);
}

.success {
    --c-dialog-icon-color: var(--color-success);
    --c-dialog-border-color: var(--color-success);
}

.warning {
    --c-dialog-icon-color: var(--color-warning);
    --c-dialog-border-color: var(--color-warning);
}

.danger {
    --c-dialog-icon-color: var(--color-danger);
    --c-dialog-border-color: var(--color-danger);
}

/* ▲ variant ▲ */

/* ▼ size ▼ */

.full {
    max-width: initial;
    max-height: initial;
    border: 0;
    border-radius: var(--radius-none);

    --c-dialog-width: 100vw;
    --c-dialog-max-height: 100vh;
    --c-dialog-min-height: 100vh;
}

.large {
    --c-dialog-width: 1024px;
    --c-dialog-max-height: 60vh;
    --c-dialog-min-height: 40px;
}

.medium {
    --c-dialog-width: 720px;
    --c-dialog-max-height: 50vh;
    --c-dialog-min-height: 32px;
}

.small {
    --c-dialog-width: 320px;
    --c-dialog-max-height: 250px;
    --c-dialog-min-height: 24px;
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.normal {
    --c-dialog-border-radius: var(--radius-sm);
}

.no-radius {
    --c-dialog-border-radius: var(--radius-none);
}

/* ▲ shape ▲ */

/* ▼ position ▼ */

.center {
    inset: 0;
    margin: auto;
}

.top {
    inset: 0;
    bottom: auto;
    .dialog {
        border-top: 0;
        border-radius: 0 0 var(--c-dialog-border-radius) var(--c-dialog-border-radius);
    }
}

.right {
    inset: 0;
    left: auto;
    .dialog {
        border-right: 0;
        border-radius: var(--c-dialog-border-radius) 0 0 var(--c-dialog-border-radius);
    }
}

.bottom {
    inset: 0;
    top: auto;
    .dialog {
        border-bottom: 0;
        border-radius: var(--c-dialog-border-radius) var(--c-dialog-border-radius) 0 0;
    }
}

.left {
    inset: 0;
    right: auto;
    .dialog {
        border-left: 0;
        border-radius: 0 var(--c-dialog-border-radius) var(--c-dialog-border-radius) 0;
    }
}

/* ▲ position ▲ */
</style>
