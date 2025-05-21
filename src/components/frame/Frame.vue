<script setup lang="ts">
withDefaults(
    defineProps<{
        /**
         * タグ
         */
        tag?: string;
        /**
         * 枠の配置
         */
        layout?:
            | 'pf-normal'
            | 'pf-width'
            | 'pf-height'
            | 'pf-top'
            | 'pf-right'
            | 'pf-bottom'
            | 'pf-left';
        /**
         * 形状
         */
        shape?: 'normal' | 'no-radius' | 'circle';
        /**
         * パディング
         */
        isPading?: boolean;
        /**
         * 影なしか
         */
        noShadow?: boolean;
    }>(),
    {
        tag: 'div',
        layout: 'pf-normal',
        shape: 'normal',
        isPading: false,
        noShadow: false
    }
);
</script>

<template>
    <div class="frame" :class="[layout, shape, { 'is-pading': isPading, 'no-shadow': noShadow }]">
        <component :is="tag" class="frame-inner">
            <slot />
        </component>
    </div>
</template>

<style scoped>
.frame {
    --c-frame-padding: 8px;

    position: relative;
    border-radius: var(--c-frame-border-radius);
    &::before,
    &::after {
        position: absolute;
        inset: 0;
        display: block;
        width: 100%;
        height: 100%;
        margin: auto;
        pointer-events: none;
        content: '';
        border-radius: var(--c-frame-border-radius);
    }
    &::before {
        background: rgb(0 0 0 / 2%);
        box-shadow: 0 0 var(--c-frame-padding) var(--color-theme-shadow);
    }
    &::after {
        padding: 0;
        border: solid var(--color-theme-border);
        border-width: 1px;
    }
    &.is-pading {
        .frame-inner {
            padding: calc(var(--c-frame-padding) * 2);
        }
    }
    &.no-shadow {
        &::before {
            display: none;
        }
    }
}

.frame-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    padding: 0;
    overflow: hidden;
    border-radius: var(--c-frame-border-radius);
}

/* ▼ layout ▼ */

.pf-width {
    overflow-y: clip;
    &::after {
        border-top-width: 0;
        border-bottom-width: 0;
    }
}

.pf-height {
    overflow-x: clip;
    &::after {
        border-right-width: 0;
        border-left-width: 0;
    }
}

.pf-top {
    overflow-x: clip;
    &::after {
        border-right-width: 0;
        border-bottom-width: 0;
        border-left-width: 0;
    }
}

.pf-right {
    overflow-y: clip;
    &::after {
        border-top-width: 0;
        border-bottom-width: 0;
        border-left-width: 0;
    }
}

.pf-bottom {
    overflow-x: clip;
    &::after {
        border-top-width: 0;
        border-right-width: 0;
        border-left-width: 0;
    }
}

.pf-left {
    overflow-y: clip;
    &::after {
        border-top-width: 0;
        border-right-width: 0;
        border-bottom-width: 0;
    }
}

/* ▲ layout ▲ */

/* ▼ shape ▼ */

.normal {
    --c-frame-border-radius: 4px;
}

.no-radius {
    --c-frame-border-radius: 0;
}

.circle {
    --c-frame-border-radius: 50%;
}

/* ▲ shape ▲ */
</style>
