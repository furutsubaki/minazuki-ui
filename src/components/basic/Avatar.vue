<script setup lang="ts">
import { type Component, useSlots, computed, markRaw } from 'vue';
import { User as IconUser } from '@lucide/vue';

const props = withDefaults(
    defineProps<{
        /**
         * 表示色
         */
        color?: string | 'transparent';
        /**
         * アイコンコンポーネント
         */
        icon?: Component;
        /**
         * 画像パス
         */
        image?: string;
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * 形状
         */
        shape?: 'circle' | 'square' | 'no-radius' | 'skeleton';
    }>(),
    {
        color: 'var(--color-bg-secondary)',
        icon: undefined,
        image: undefined,
        size: 'medium',
        shape: 'circle'
    }
);

const color = computed(() => props.color);
const rawIcon = computed(() => (props.icon ? markRaw(props.icon as Component) : undefined));

const slots = useSlots();
const hasSlot = (name: string) => {
    return slots[name] ? !!(slots[name] as () => [])()?.length : false;
};

defineExpose({ color });
</script>

<template>
    <img v-if="image" :src="image" class="component-avatar" :class="[size, shape]" />
    <div v-else class="component-avatar" :class="[size, shape]">
        <component v-if="rawIcon" :is="rawIcon" class="icon" />
        <slot v-else-if="hasSlot('default')" />
        <IconUser v-else class="icon" />
    </div>
</template>

<style scoped>
.component-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--c-avatar-size);
    height: var(--c-avatar-size);
    overflow: hidden;
    font-size: var(--c-avatar-font-size);
    word-break: keep-all;
    outline: 2px solid transparent;
    object-fit: cover;
    background-color: v-bind(color);
    > .icon {
        width: 100%;
        height: 100%;
        margin: var(--space-sm);
    }
}

/* ▼ size ▼ */

.large {
    --c-avatar-size: 64px;
    --c-avatar-font-size: var(--font-size-medium);
}

.medium {
    --c-avatar-size: 48px;
    --c-avatar-font-size: var(--font-size-medium);
}

.small {
    --c-avatar-size: 32px;
    --c-avatar-font-size: var(--font-size-small);
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.circle {
    border-radius: var(--radius-circle);
}

.square {
    border-radius: var(--radius-sm);
}

.no-radius {
    border-radius: var(--radius-none);
}

.skeleton {
    background-color: transparent;
}

/* ▲ shape ▲ */
</style>
