<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, type Component } from 'vue';
import TeleportRoot from '@/components/inner-parts/TeleportRoot.vue';
import Button from '@/components/basic/Button.vue';
import { getTransitionDuration } from '@/assets/ts/transition';
import { X as IconX } from 'lucide-vue-next';

const flg = defineModel<boolean>({ default: false });
const props = withDefaults(
    defineProps<{
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large' | 'full';
        /**
         * SP時フルサイズにするか
         */
        isFullSizeBySp?: boolean;
        /**
         * 形状
         */
        shape?: 'normal' | 'no-radius';
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
         * フレーム装飾用コンポーネント
         */
        frameComponent?: Component | string;
    }>(),
    {
        size: 'medium',
        isFullSizeBySp: false,
        shape: 'normal',
        transitionFrom: 'opacity',
        title: '',
        center: false,
        persistent: false,
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
const modalPanelEl = ref<HTMLElement | null>(null);
let closeTimeoutId: number | undefined;

const finishClose = () => {
    closeTimeoutId = undefined;
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
        dialogEl.value?.showModal();
    }

    document.documentElement.style.overflow = 'hidden';

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            if (transitionState.value === 'is-opening') {
                transitionState.value = '';
            }
        });
    });
};

const startClose = () => {
    transitionState.value = 'is-closing';
    const duration = getTransitionDuration(modalPanelEl.value);
    // 0ms(reduced-motion等)でもopen()からclearTimeoutでキャンセルできるよう、常に非同期でスケジュールする
    closeTimeoutId = window.setTimeout(finishClose, duration === 0 ? 0 : duration + 50);
};

const onClose = () => {
    flg.value = false;
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
    if (e.target === dialogEl.value && !props.persistent) {
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
</script>

<template>
    <TeleportRoot>
        <dialog
            ref="dialogEl"
            class="component-modal"
            :class="[transitionState, transitionFromClass]"
            @click="onBackdropClick"
            @cancel.prevent="onCancel"
        >
            <div ref="modalPanelEl" class="modal-panel" @click.stop>
                <component :is="frameComponent" class="modal-frame">
                    <div
                        class="modal"
                        :class="[size, shape, { 'is-center': center, 'is-full-size-by-sp': isFullSizeBySp }]"
                    >
                        <Button size="large" shape="skeleton" class="closeable-box" :prefix-icon="IconX" aria-label="閉じる" @click="onClose" />
                        <div class="inner">
                            <div class="box">
                                <div v-if="title" class="title">{{ title }}</div>
                                <div class="slot">
                                    <slot />
                                </div>
                            </div>
                        </div>
                    </div>
                </component>
            </div>
        </dialog>
    </TeleportRoot>
</template>

<style scoped>
.component-modal {
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
        transition: opacity var(--duration-fast) ease-in-out;
    }
    &.is-opening::backdrop,
    &.is-closing::backdrop {
        opacity: 0;
    }
}

.modal-panel {
    position: fixed;
    inset: 0;
    width: fit-content;
    height: fit-content;
    margin: auto;
    opacity: 1;
    transform: translate(0, 0);
    transition:
        opacity var(--duration-fast) ease-in-out,
        transform var(--duration-fast) ease-in-out;
}

/* ▼ transition ▼ */

.is-opening .modal-panel,
.is-closing .modal-panel {
    opacity: 0;
}

.is-opening.from-top .modal-panel,
.is-closing.from-top .modal-panel {
    opacity: 0;
    transform: translateY(-100%);
}

.is-opening.from-right .modal-panel,
.is-closing.from-right .modal-panel {
    opacity: 0;
    transform: translateX(100%);
}

.is-opening.from-bottom .modal-panel,
.is-closing.from-bottom .modal-panel {
    opacity: 0;
    transform: translateY(100%);
}

.is-opening.from-left .modal-panel,
.is-closing.from-left .modal-panel {
    opacity: 0;
    transform: translateX(-100vw);
}

/* ▲ transition ▲ */

.modal {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--space-sm);
    width: var(--c-modal-width);
    max-width: 80vw;
    height: 100%;
    min-height: var(--c-modal-min-height);
    max-height: var(--c-modal-max-height);
    padding: var(--space-sm) 0;
    margin: auto;
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    border: 1px solid;
    border-color: var(--color-border);
    border-radius: var(--c-modal-border-radius);
    transition:
        border-color var(--duration-fast),
        opacity var(--duration-fast);
    .closeable-box {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        padding: var(--space-sm);
        :deep(.button-icon) {
            width: var(--font-size-large);
            height: var(--font-size-large);
        }
    }
    .inner {
        display: flex;
        flex-grow: 1;
        gap: var(--space-sm);
        min-height: 0;
        overflow: hidden;
    }
    .box {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        gap: var(--space-sm);
        width: 100%;
        min-height: 0;
        .title {
            padding: 0 var(--space-sm);
            font-size: calc(var(--font-size-medium) * 1.2);
            font-weight: bold;
        }
        .slot {
            flex-grow: 1;
            min-height: 0;
            padding: 0 var(--space-sm);
            overflow-y: auto;
        }
    }
    &.is-center {
        .title {
            justify-content: center;
            text-align: center;
        }
    }
}

/* ▼ size ▼ */

.full {
    max-width: initial;
    max-height: initial;
    border: 0;
    border-radius: var(--radius-none);

    --c-modal-width: 100vw;
    --c-modal-max-height: 100vh;
    --c-modal-min-height: 100vh;
}

.large {
    --c-modal-width: 1024px;
    --c-modal-max-height: 60vh;
    --c-modal-min-height: 40px;
}

.medium {
    --c-modal-width: 720px;
    --c-modal-max-height: 50vh;
    --c-modal-min-height: 32px;
}

.small {
    --c-modal-width: 320px;
    --c-modal-max-height: 40vh;
    --c-modal-min-height: 24px;
}

.is-full-size-by-sp {
    @media (600px > width) {
        max-width: initial;
        max-height: initial;
        border: 0;
        border-radius: var(--radius-none);

        --c-modal-width: 100vw;
        --c-modal-max-height: 100vh;
        --c-modal-min-height: 100vh;
    }
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.normal {
    --c-modal-border-radius: var(--radius-sm);
}

.no-radius {
    --c-modal-border-radius: var(--radius-none);
}

/* ▲ shape ▲ */
</style>
