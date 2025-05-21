<script setup lang="ts">
import { type Component, getCurrentInstance } from 'vue';
import type { Router } from 'vue-router';
import Button from '@/components/basic/Button.vue';
import Frame from '@/components/frame/Frame.vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';

export interface MiBottomNavItem {
    label: string;
    icon: Component;
    to: string;
    isCurrent?: boolean;
}
withDefaults(
    defineProps<{
        /**
         * アイテム
         */
        items: MiBottomNavItem[];
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * 形状
         */
        shape?: 'normal' | 'picture-frame';
        /**
         * 影なしか
         */
        noShadow?: boolean;
        /**
         * 形状
         */
        center?: boolean;
    }>(),
    {
        size: 'medium',
        shape: 'normal',
        noShadow: false,
        center: false
    }
);

const instance = getCurrentInstance()!;
const router = instance.appContext.config.globalProperties.$router as Router;
const onClick = (item: MiBottomNavItem) => {
    if (!item.to) return;

    if (!item.to || !router) {
        // 通常の遷移
        location.href = item.to;
    } else {
        // routerによる遷移
        router.push(item.to);
    }
};
</script>

<template>
    <component
        :is="shape === 'picture-frame' ? PictureFrame : Frame"
        class="component-bottom-nav"
        :class="[size]"
        layout="pf-top"
        :noShadow="noShadow"
    >
        <div class="component-bottom-nav-inner" :class="{ 'is-center': center }">
            <Button
                v-for="(item, i) in items"
                :key="item.to"
                class="item"
                :class="{ 'is-current': item.isCurrent }"
                :size="size"
                shape="skeleton"
            >
                <component :is="item.icon" class="icon" />
                <span
                    class="label"
                    :class="{ 'is-disabled': items.length === i + 1 }"
                    @click="onClick(item)"
                    >{{ item.label }}</span
                >
            </Button>
        </div>
    </component>
</template>

<style scoped>
.component-bottom-nav {
    width: 100%;
    height: var(--c-bottom-nav-height);
}

.component-bottom-nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    overflow: hidden;
    word-break: keep-all;
    &.is-center {
        justify-content: center;
        .item {
            width: auto;
            min-width: 100px;
            max-width: 150px;
        }
    }
    .item {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: 0;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
        height: var(--c-bottom-nav-height);
        .icon {
            width: calc(var(--c-bottom-nav-font-size) * 2);
            height: 100%;
            transition:
                width 0.2s,
                height 0.2s;
        }
        .label {
            position: absolute;
            bottom: -1.5em;
            font-size: var(--font-size-small);
            line-height: 1;
            transition: bottom 0.2s;
        }
        &.is-current {
            color: var(--color-theme-text-primary);
            pointer-events: none;
            .icon {
                width: calc(var(--c-bottom-nav-font-size) * 1.5);
                height: calc(var(--c-bottom-nav-font-size) * 2.2);
            }
            .label {
                bottom: calc(var(--c-bottom-nav-font-size) * 0.25);
            }
        }

        /* hover */
        @media (hover: hover) {
            &:hover {
                .icon {
                    width: calc(var(--c-bottom-nav-font-size) * 1.5);
                    height: calc(var(--c-bottom-nav-font-size) * 2.2);
                }
                .label {
                    bottom: calc(var(--c-bottom-nav-font-size) * 0.25);
                }
            }
        }

        @media (hover: none) {
            &:active {
                .icon {
                    width: calc(var(--c-bottom-nav-font-size) * 1.5);
                    height: calc(var(--c-bottom-nav-font-size) * 2.2);
                }
                .label {
                    bottom: calc(var(--c-bottom-nav-font-size) * 0.25);
                }
            }
        }
    }
}

/* ▼ size ▼ */

.large {
    --c-bottom-nav-height: 56px;
    --c-bottom-nav-font-size: var(--font-size-large);
}

.medium {
    --c-bottom-nav-height: 48px;
    --c-bottom-nav-font-size: var(--font-size-medium);
}

.small {
    --c-bottom-nav-height: 40px;
    --c-bottom-nav-font-size: var(--font-size-small);
}

/* ▲ size ▲ */
</style>
