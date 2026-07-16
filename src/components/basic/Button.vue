<script setup lang="ts">
import { type Component, computed, markRaw, ref } from 'vue';
import {
    Info as IconInfo,
    CheckCircle2 as IconCheckCircle2,
    AlertTriangle as IconAlertTriangle,
    XOctagon as IconXOctagon
} from 'lucide-vue-next';

type Variant = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';

const STATUS_ICON_MAP: Partial<Record<Variant, Component>> = {
    info: markRaw(IconInfo),
    success: markRaw(IconCheckCircle2),
    warning: markRaw(IconAlertTriangle),
    danger: markRaw(IconXOctagon)
};

const props = withDefaults(
    defineProps<{
        /**
         * 表示色
         */
        variant?: Variant;
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * 形状
         */
        shape?: 'normal' | 'rounded' | 'circle' | 'square' | 'skeleton' | 'link';
        /**
         * 読み取り専用
         */
        readonly?: boolean;
        /**
         * 無効か
         */
        disabled?: boolean;
        /**
         * テキスト前アイコン
         */
        prefixIcon?: Component;
        /**
         * テキスト後アイコン
         */
        suffixIcon?: Component;
        /**
         * ボタンラベル
         */
        label?: string;
    }>(),
    {
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        readonly: false,
        disabled: false,
        prefixIcon: undefined,
        suffixIcon: undefined,
        label: undefined
    }
);
const emit = defineEmits<{
    /**
     * test
     */
    click: [];
}>();

const onClick = () => {
    if (props.readonly) {
        return false;
    }
    emit('click');
};

const resolvedPrefixIcon = computed(() => {
    if (props.prefixIcon) return markRaw(props.prefixIcon);
    return STATUS_ICON_MAP[props.variant] ?? null;
});

const resolvedSuffixIcon = computed(() => {
    if (props.suffixIcon) return markRaw(props.suffixIcon);
    return null;
});

const buttonRef = ref();
defineExpose({ buttonRef });
</script>

<template>
    <button
        ref="buttonRef"
        type="button"
        class="component-button"
        :disabled="disabled"
        :class="[variant, size, shape, { 'is-readonly': readonly }]"
        @click="onClick"
    >
        <component v-if="resolvedPrefixIcon" :is="resolvedPrefixIcon" class="button-icon" />
        <span v-if="label" class="button-label">{{ label }}</span>
        <component v-if="resolvedSuffixIcon" :is="resolvedSuffixIcon" class="button-icon" />
    </button>
</template>

<style scoped>
.component-button {
    display: flex;
    gap: var(--space-sm);
    align-items: center;
    justify-content: center;
    min-width: 100px;
    min-height: var(--c-button-height);
    padding: 0 var(--space-sm);
    font-size: var(--c-button-font-size);
    color: var(--c-button-color);
    word-break: keep-all;
    background-color: var(--c-button-background-color);
    border: 1px solid;
    border-color: var(--c-button-border-color);
    border-radius: var(--radius-sm);
    transition:
        color var(--duration-fast),
        background-color var(--duration-fast),
        border-color var(--duration-fast);

    @media (hover: hover) {
        &:hover:not(:disabled, .is-readonly) {
            color: var(--c-button-hover-color);
            background-color: var(--c-button-hover-background-color);
            border-color: var(--c-button-hover-border-color);
        }
    }

    @media (hover: none) {
        &:active:not(:disabled, .is-readonly) {
            color: var(--c-button-hover-color);
            background-color: var(--c-button-hover-background-color);
            border-color: var(--c-button-hover-border-color);
        }
    }
    &:disabled,
    &.is-readonly {
        cursor: not-allowed;
        opacity: 0.5;
    }
}

.button-icon {
    flex-shrink: 0;
    width: 1em;
    height: 1em;
}

/* ▼ variable ▼ */

.primary {
    --c-button-hover-color: var(--color-brand);
    --c-button-hover-background-color: transparent;
    --c-button-hover-border-color: var(--color-brand);
    --c-button-color: var(--mi-neutral-50);
    --c-button-background-color: var(--color-brand);
    --c-button-border-color: var(--color-brand-emphasis);
}

.secondary {
    --c-button-hover-color: var(--mi-neutral-50);
    --c-button-hover-background-color: var(--color-brand-alpha);
    --c-button-hover-border-color: var(--color-brand);
    --c-button-color: var(--color-text-primary);
    --c-button-background-color: transparent;
    --c-button-border-color: var(--color-border);
}

.info {
    --c-button-hover-color: var(--color-info);
    --c-button-hover-background-color: transparent;
    --c-button-hover-border-color: var(--color-info);
    --c-button-color: var(--mi-neutral-50);
    --c-button-background-color: var(--color-info);
    --c-button-border-color: var(--color-info-emphasis);
}

.success {
    --c-button-hover-color: var(--color-success);
    --c-button-hover-background-color: transparent;
    --c-button-hover-border-color: var(--color-success);
    --c-button-color: var(--mi-neutral-50);
    --c-button-background-color: var(--color-success);
    --c-button-border-color: var(--color-success-emphasis);
}

.warning {
    --c-button-hover-color: var(--color-warning);
    --c-button-hover-background-color: transparent;
    --c-button-hover-border-color: var(--color-warning);
    --c-button-color: var(--mi-neutral-800);
    --c-button-background-color: var(--color-warning);
    --c-button-border-color: var(--color-warning-emphasis);
}

.danger {
    --c-button-hover-color: var(--color-danger);
    --c-button-hover-background-color: transparent;
    --c-button-hover-border-color: var(--color-danger);
    --c-button-color: var(--mi-neutral-50);
    --c-button-background-color: var(--color-danger);
    --c-button-border-color: var(--color-danger-emphasis);
}

/* ▲ variable ▲ */

/* ▼ size ▼ */

.large {
    --c-button-height: 40px;
    --c-button-font-size: var(--font-size-medium);
}

.medium {
    --c-button-height: 32px;
    --c-button-font-size: var(--font-size-medium);
}

.small {
    --c-button-height: 24px;
    --c-button-font-size: var(--font-size-small);
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.rounded {
    border-radius: var(--radius-pill);
}

.no-radius {
    border-radius: var(--radius-none);
}

.circle {
    display: flex;
    justify-content: center;
    width: var(--c-button-height);
    min-width: auto;
    word-break: keep-all;
    border-radius: var(--radius-circle);
    > .button-icon {
        width: 100%;
        height: 100%;
    }
}

.square {
    display: flex;
    justify-content: center;
    width: var(--c-button-height);
    min-width: auto;
    word-break: keep-all;
    > .button-icon {
        width: 100%;
        height: 100%;
    }
}

.skeleton {
    --c-button-background-color: transparent;
    --c-button-border-color: transparent;

    min-width: initial;
    min-height: initial;
    padding: 0;
    border: 0;

    @media (hover: hover) {
        &:hover {
            &.secondary {
                color: var(--color-link);
            }

            color: var(--c-button-color);
            background-color: transparent;
            border-color: transparent;
        }
    }

    @media (hover: none) {
        &:active {
            &.secondary {
                color: var(--color-link);
            }

            color: var(--c-button-color);
            background-color: transparent;
            border-color: transparent;
        }
    }
}

.link {
    --c-button-color: var(--color-link);
    --c-button-background-color: transparent;
    --c-button-border-color: transparent;
    --c-button-hover-color: var(--color-link-hover);
    --c-button-hover-background-color: transparent;
    --c-button-hover-border-color: transparent;

    display: inline-block;
    min-width: initial;
    min-height: initial;
    padding: 0;
    user-select: none;
    border: 0;
}

/* ▲ shape ▲ */
</style>
