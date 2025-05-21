<script setup lang="ts">
import { ref } from 'vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';
import Button from '@/components/basic/Button.vue';
import { computed } from 'vue';
import { sleep } from '@/assets/ts';
import { X as IconX } from 'lucide-vue-next';
import useOutsideClick from '@/directives/useOutsideClick';

const flg = defineModel<boolean>({ default: false });
const props = withDefaults(
    defineProps<{
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large' | 'full';
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
         * 枠外クリック除外要素
         */
        outsideClickIgnore?: (Element | string)[];
    }>(),
    {
        size: 'medium',
        shape: 'normal',
        transitionFrom: 'opacity',
        title: '',
        scroll: false,
        center: false,
        persistent: false,
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
    isActive: flg.value && !props.persistent,
    ignore: props.outsideClickIgnore
}));
</script>

<template>
    <OpacityTransition
        @transition-start="transitioning = true"
        @transition-end="transitioning = false"
    >
        <div v-show="flg" class="component-modal">
            <component
                :is="TransitionComponent"
                :from="transitionFrom"
                @transition-start="transitioning = true"
                @transition-end="transitioning = false"
            >
                <dialog
                    v-show="flg"
                    :open="flg"
                    class="modal"
                    :class="[size, shape, { 'is-center': center }]"
                    v-outside-click="onOutsideClick"
                >
                    <Button size="large" shape="skeleton" class="closeable-box" @click="onClose">
                        <IconX class="closeable-icon" />
                    </Button>
                    <div class="inner">
                        <div class="box">
                            <div v-if="title" class="title">{{ title }}</div>
                            <div class="slot">
                                <slot />
                            </div>
                        </div>
                    </div>
                </dialog>
            </component>
        </div>
    </OpacityTransition>
</template>

<style scoped>
.component-modal {
    position: fixed;
    inset: 0;
    pointer-events: none;
    &::before {
        content: '';
        position: fixed;
        inset: 0;
        background-color: var(--color-theme-shadow);
        z-index: -1;
        pointer-events: initial;
    }
}

.modal {
    min-height: var(--c-modal-height);
    pointer-events: initial;
    position: fixed;
    inset: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: var(--c-modal-width);
    max-width: 80vw;
    max-height: 80vh;
    height: 100%;
    padding: 8px;
    border: 1px solid;
    border-radius: var(--c-modal-border-radius);
    border-color: var(--color-theme-border);
    background-color: var(--color-theme-bg-primary);
    color: var(--color-theme-text-primary);
    transition:
        border-color 0.2s,
        opacity 0.2s;

    .closeable-box {
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 1;
        padding: 8px;
        .closeable-icon {
            width: var(--font-size-large);
            height: var(--font-size-large);
        }
    }
    .inner {
        flex-grow: 1;
        display: flex;
        align-items: flex-start;
        gap: 8px;
        overflow: hidden;
    }

    .box {
        display: flex;
        flex-direction: column;
        gap: 8px;
        height: 100%;
        .title {
            font-weight: bold;
            font-size: calc(var(--font-size-medium) * 1.2);
        }
        .slot {
            overflow-y: auto;
            flex-grow: 1;
            height: 100%;
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
    border-radius: 0;
    border: 0;
    --c-modal-width: 100vw;
    --c-modal-height: 100vh;
}
.large {
    --c-modal-width: 1024px;
    --c-modal-height: 40px;
}
.medium {
    --c-modal-width: 720px;
    --c-modal-height: 32px;
}
.small {
    --c-modal-width: 320px;
    --c-modal-height: 24px;
}
/* ▲ size ▲ */

/* ▼ shape ▼ */
.normal {
    --c-modal-border-radius: 4px;
}
.no-radius {
    --c-modal-border-radius: 0;
}
/* ▲ shape ▲ */
</style>
