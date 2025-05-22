<script setup lang="ts">
import { ref, computed, useSlots, watch } from 'vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';
import Button from '@/components/basic/Button.vue';
import { sleep } from '@/assets/ts';
import { X as IconX } from 'lucide-vue-next';
import useOutsideClick from '@/directives/useOutsideClick';

const flg = defineModel<boolean>({ default: false });
const props = withDefaults(
    defineProps<{
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * 位置
         */
        position: 'top' | 'right' | 'bottom' | 'left';
        /**
         * slotをスクロールさせるか
         */
        scroll?: boolean;
        /**
         * センタリング
         */
        center?: boolean;
        /**
         * 閉じるボタン
         */
        closeable?: boolean;
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
        size: 'medium',
        shape: 'no-radius',
        scroll: true,
        center: false,
        closeable: false,
        persistent: false,
        seamless: false,
        outsideClickIgnore: () => ['button']
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
const transitionFrom = computed(() => {
    if (props.position === 'top') {
        return 'top-rebound';
    } else if (props.position === 'right') {
        return 'right-rebound';
    } else if (props.position === 'bottom') {
        return 'bottom-rebound';
    } else if (props.position === 'left') {
        return 'left-rebound';
    } else {
        return undefined;
    }
});

watch(()=>flg.value, (newFlg) => {
    if(newFlg && !props.seamless) {
    document.documentElement.style.overflow = 'hidden';
    }else {
    document.documentElement.style.overflow = '';
    }
})

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
        <div v-show="flg" class="component-drawer" :class="{ 'is-seamless': seamless }">
            <TranslateTransition
                :from="transitionFrom"
                @transition-start="transitioning = true"
                @transition-end="transitioning = false"
            >
                <div
                    v-show="flg"
                    class="drawer"
                    :class="[size, position, { 'is-center': center }]"
                    v-outside-click="onOutsideClick"
                >
                    <Button
                        v-if="closeable"
                        size="large"
                        shape="skeleton"
                        class="closeable-box"
                        @click="onClose"
                    >
                        <IconX class="closeable-icon" />
                    </Button>
                    <div
                        v-if="hasSlot('header')"
                        class="header"
                        :class="{ 'is-closeable': closeable }"
                    >
                        <slot name="header" />
                    </div>
                    <div class="box" :class="{ 'is-scroll': scroll }">
                        <slot />
                    </div>
                    <div v-if="hasSlot('footer')" class="footer">
                        <slot name="footer" />
                    </div>
                </div>
            </TranslateTransition>
        </div>
    </OpacityTransition>
</template>

<style scoped>
.component-drawer {
    position: fixed;
    inset: 0;
    z-index: 10;
    pointer-events: none;
    &:not(.is-seamless) {
        &::before {
            position: fixed;
            inset: 0;
            z-index: -1;
            pointer-events: initial;
            content: '';
            background-color: var(--color-theme-shadow-alpha);
        }
    }
}

.drawer {
    position: fixed;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: var(--c-drawer-width);
    padding: 8px;
    margin: auto;
    pointer-events: initial;
    background-color: var(--color-theme-bg-primary);
    border: 1px solid;
    border-color: var(--color-theme-border);
    border-radius: 0;
    transition:
        border-color 0.2s,
        opacity 0.2s;
    .closeable-box {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
        padding: 8px;
        .closeable-icon {
            width: var(--font-size-large);
            height: var(--font-size-large);
        }
    }
    .header {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
        &.is-closeable {
            margin-right: 32px;
        }
    }
    .box {
        position: relative;
        flex-grow: 1;
        &.is-scroll {
            overflow-y: auto;
        }
    }
    .footer {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }
    &.is-center {
        .header,
        .footer {
            justify-content: center;
            text-align: center;
        }
    }
}

/* ▼ size ▼ */

.large {
    --c-drawer-min-width: 320px;
    --c-drawer-min-height: 320px;
    --c-drawer-width: 40vw;
    --c-drawer-height: 40vh;
}

.medium {
    --c-drawer-min-width: 240px;
    --c-drawer-min-height: 240px;
    --c-drawer-width: 32vw;
    --c-drawer-height: 32vh;
}

.small {
    --c-drawer-min-width: 200px;
    --c-drawer-min-height: 200px;
    --c-drawer-width: 24vw;
    --c-drawer-height: 24vh;
}

/* ▲ size ▲ */

/* ▼ position ▼ */

.top {
    inset: 0;
    bottom: auto;
    width: 100vw;
    height: var(--c-drawer-height);
    min-height: min(var(--c-drawer-min-height), 80vh);
    max-height: 80vh;
    border-top: 0;
    border-right: 0;
    border-left: 0;
}

.right {
    inset: 0;
    left: auto;
    width: var(--c-drawer-width);
    min-width: min(var(--c-drawer-min-width), 80vw);
    max-width: 80vw;
    height: 100vh;
    border-top: 0;
    border-right: 0;
    border-bottom: 0;
}

.bottom {
    inset: 0;
    top: auto;
    width: 100vw;
    height: var(--c-drawer-height);
    min-height: min(var(--c-drawer-min-height), 80vh);
    max-height: 80vh;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
}

.left {
    inset: 0;
    right: auto;
    width: var(--c-drawer-width);
    min-width: min(var(--c-drawer-min-width), 80vw);
    max-width: 80vw;
    height: 100vh;
    border-top: 0;
    border-bottom: 0;
    border-left: 0;
}

/* ▲ position ▲ */
</style>
