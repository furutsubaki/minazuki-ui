<script setup lang="ts">
import { ref, useSlots } from 'vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';
import { computed } from 'vue';
import { sleep } from '@/assets/ts';
import {
    Info as IconInfo,
    CheckCircle2 as IconCheckCircle2,
    AlertTriangle as IconAlertTriangle,
    XOctagon as IconXOctagon
} from 'lucide-vue-next';
import useOutsideClick from '@/directives/useOutsideClick';

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
         * 枠外クリック除外要素
         */
        outsideClickIgnore?: (Element | string)[];
    }>(),
    {
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        position: 'center',
        transitionFrom: 'opacity',
        title: '',
        scroll: false,
        center: false,
        persistent: false,
        seamless: false,
        outsideClickIgnore: () => ['button', 'dialog']
    }
);
const emit = defineEmits<{
    /**
     * 閉じた
     */
    closed: [];
}>();

// transition状態
const TransitionComponent =
    props.transitionFrom === 'opacity' ? OpacityTransition : TranslateTransition;
const transitioning = ref(false);
const isShowing = computed(() => {
    if (flg.value) {
        return true;
    } else {
        return transitioning.value;
    }
});
const transitionFrom = computed(() => {
    if (props.transitionFrom === 'top') {
        return 'top-rebound';
    } else if (props.transitionFrom === 'right') {
        return 'right-rebound';
    } else if (props.transitionFrom === 'bottom') {
        return 'bottom-rebound';
    } else if (props.transitionFrom === 'left') {
        return 'left-rebound';
    } else {
        return undefined;
    }
});

// Accordion枠外制御
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
const { vOutsideClick } = useOutsideClick();
const onOutsideClick = computed(() => ({
    handler: onClose,
    isActive: flg.value && !props.persistent && !props.seamless,
    ignore: props.outsideClickIgnore
}));

const slots = useSlots();
const hasSlot = (name: string) => {
    return slots[name] ? !!(slots[name] as () => [])()?.length : false;
};
</script>

<template>
    <OpacityTransition
        @transition-start="transitioning = true"
        @transition-end="transitioning = false"
    >
        <div v-show="flg" class="component-dialog" :class="{ 'is-seamless': seamless }">
            <component
                :is="TransitionComponent"
                :from="transitionFrom"
                @transition-start="transitioning = true"
                @transition-end="transitioning = false"
            >
                <dialog
                    v-show="flg"
                    :open="flg"
                    class="dialog"
                    :class="[variant, size, shape, position, { 'is-center': center }]"
                    v-outside-click="onOutsideClick"
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
                </dialog>
            </component>
        </div>
    </OpacityTransition>
</template>

<style scoped>
.component-dialog {
    position: fixed;
    inset: 0;
    pointer-events: none;
    &:not(.is-seamless) {
        &::before {
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: initial;
            content: '';
            background-color: var(--color-theme-shadow);
        }
    }
}

.dialog {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: var(--c-dialog-width);
    max-width: 80vw;
    height: 100%;
    min-height: var(--c-dialog-height);
    max-height: 80vh;
    padding: 8px;
    margin: auto;
    color: var(--color-theme-text-primary);
    pointer-events: initial;
    background-color: var(--color-theme-bg-primary);
    border: 1px solid;
    border-color: var(--c-dialog-border-color);
    border-radius: var(--c-dialog-border-radius);
    transition:
        border-color 0.2s,
        opacity 0.2s;
    .inner {
        display: flex;
        flex-grow: 1;
        gap: 8px;
        align-items: flex-start;
        overflow: hidden;
    }
    .icon {
        flex-shrink: 0;
        width: calc(var(--font-size-medium) * 1.8);
        height: calc(var(--font-size-medium) * 1.8);
        color: var(--color-theme-bg-primary);
        fill: var(--c-dialog-icon-color);
    }
    .box {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        .title {
            font-size: calc(var(--font-size-medium) * 1.2);
            font-weight: bold;
        }
        .slot {
            flex-grow: 1;
            height: 100%;
            overflow-y: auto;
        }
    }
    .footer {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
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
    --c-dialog-icon-color: var(--color-status-brand);
    --c-dialog-border-color: var(--color-status-brand);
}

.secondary {
    --c-dialog-icon-color: transparent;
    --c-dialog-border-color: var(--color-theme-border);
}

.info {
    --c-dialog-icon-color: var(--color-status-info);
    --c-dialog-border-color: var(--color-status-info);
}

.success {
    --c-dialog-icon-color: var(--color-status-success);
    --c-dialog-border-color: var(--color-status-success);
}

.warning {
    --c-dialog-icon-color: var(--color-status-warning);
    --c-dialog-border-color: var(--color-status-warning);
}

.danger {
    --c-dialog-icon-color: var(--color-status-danger);
    --c-dialog-border-color: var(--color-status-danger);
}

/* ▲ variant ▲ */

/* ▼ size ▼ */

.full {
    max-width: initial;
    max-height: initial;
    border: 0;
    border-radius: 0;

    --c-dialog-width: 100vw;
    --c-dialog-height: 100vh;
}

.large {
    --c-dialog-width: 1024px;
    --c-dialog-height: 40px;
}

.medium {
    --c-dialog-width: 720px;
    --c-dialog-height: 32px;
}

.small {
    --c-dialog-width: 320px;
    --c-dialog-height: 24px;
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.normal {
    --c-dialog-border-radius: 4px;
}

.no-radius {
    --c-dialog-border-radius: 0;
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
    border-top: 0;
    border-radius: 0 0 var(--c-dialog-border-radius) var(--c-dialog-border-radius);
}

.right {
    inset: 0;
    left: auto;
    border-right: 0;
    border-radius: var(--c-dialog-border-radius) 0 0 var(--c-dialog-border-radius);
}

.bottom {
    inset: 0;
    top: auto;
    border-bottom: 0;
    border-radius: var(--c-dialog-border-radius) var(--c-dialog-border-radius) 0 0;
}

.left {
    inset: 0;
    right: auto;
    border-left: 0;
    border-radius: 0 var(--c-dialog-border-radius) var(--c-dialog-border-radius) 0;
}

/* ▲ position ▲ */
</style>
