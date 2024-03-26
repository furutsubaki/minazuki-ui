<script setup lang="ts">
import { computed } from 'vue';

export interface MiFieldAccordionListItem {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
}

const flg = defineModel<boolean>({ default: false });

const props = withDefaults(
    defineProps<{
        /**
         * 項目
         */
        items: MiFieldAccordionListItem[];
        /**
         * 項目値
         */
        value: string | number | boolean | undefined;
        /**
         * 親Node
         */
        parentRef: Element;
        /**
         * 表示種類
         */
        variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * 形状
         */
        shape?: 'normal' | 'no-radius';
        /**
         * ポジション
         */
        position?: 'top' | 'bottom';
    }>(),
    {
        variant: 'secondary',
        size: 'medium',
        position: 'bottom'
    }
);

const emit = defineEmits<{
    change: [value: string | number | boolean];
}>();

const selectedItem = computed(
    () => props.items.find((item) => item.value === props.value) ?? { label: '', value: null }
);
const onSelectItem = (item: MiFieldAccordionListItem) => {
    emit('change', item.value);
    onClose();
};

// Accordion枠外制御
const onClose = () => {
    flg.value = false;
};
const onOutside = computed(() => ({
    handler: onClose,
    isActive: flg.value
}));
</script>

<template>
    <div
        class="component-input-accordion-list"
        :class="[variant, size, shape, position, { 'is-open': flg && items.length }]"
        v-click-outside="onOutside"
    >
        <div class="list-body">
            <div
                class="list-item"
                :class="{
                    'is-selected': selectedItem.value === item.value,
                    'is-disabled': item.disabled
                }"
                v-for="item in items"
                :key="item.label"
                :value="item.value"
                @mouseup="onSelectItem(item)"
            >
                {{ item.label }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.component-input-accordion-list {
    cursor: pointer;
    position: absolute;
    width: 100%;
    min-width: 100px;
    line-height: 1.5em;
    border: 1px solid var(--c-field-accordion-border-color);
    border-radius: 4px;
    display: grid;
    grid-template-rows: 0fr;
    transition:
        background-color 0.2s,
        opacity 0.2s,
        grid-template-rows 0.2s ease,
        opacity 0s 0.2s;
    max-height: 50vh;
    background-color: var(--color-theme-bg-primary);
    z-index: 1;
    opacity: 0;
    font-size: var(--c-field-accordion-font-size);
    &.is-open {
        grid-template-rows: 1fr;
        opacity: 1;
        transition:
            color 0.2s,
            background-color 0.2s,
            opacity 0.2s,
            grid-template-rows 0.2s ease;
    }
    .list-body {
        overflow-x: hidden;
        overflow-y: auto;
        .list-item {
            display: flex;
            align-items: center;
            padding: 0 8px;
            min-height: var(--c-field-accordion-height);
            transition: background-color 0.2s;
            @media (hover: hover) {
                &:hover {
                    background-color: var(--color-theme-bg-secondary);
                }
            }

            @media (hover: none) {
                &:active {
                    background-color: var(--color-theme-bg-secondary);
                }
            }
            &.is-selected {
                background-color: var(--color-theme-bg-secondary);
            }
            &.is-disabled {
                pointer-events: none;
                opacity: 0.5;
            }
        }
    }

    @media (hover: hover) {
        &:hover {
            border-color: var(--c-field-accordion-hover-border-color);
        }
    }

    @media (hover: none) {
        &:active {
            border-color: var(--c-field-accordion-hover-border-color);
        }
    }
}

/* ▼ variant ▼ */
.primary {
    --c-field-accordion-hover-border-color: var(--color-status-brand);
    --c-field-accordion-border-color: var(--color-status-brand);
}
.secondary {
    --c-field-accordion-hover-border-color: var(--color-theme-border);
    --c-field-accordion-border-color: var(--color-theme-border);
}
.info {
    --c-field-accordion-hover-border-color: var(--color-status-info);
    --c-field-accordion-border-color: var(--color-status-info);
}
.success {
    --c-field-accordion-hover-border-color: var(--color-status-success);
    --c-field-accordion-border-color: var(--color-status-success);
}
.warning {
    --c-field-accordion-hover-border-color: var(--color-status-warning);
    --c-field-accordion-border-color: var(--color-status-warning);
}
.danger {
    --c-field-accordion-hover-border-color: var(--color-status-danger);
    --c-field-accordion-border-color: var(--color-status-danger);
}
/* ▲ variant ▲ */

/* ▼ size ▼ */
.large {
    --c-field-accordion-height: 40px;
    --c-field-accordion-font-size: var(--font-size-medium);
}
.medium {
    --c-field-accordion-height: 32px;
    --c-field-accordion-font-size: var(--font-size-medium);
}
.small {
    --c-field-accordion-height: 24px;
    --c-field-accordion-font-size: var(--font-size-small);
}
/* ▲ size ▲ */

/* ▼ position ▼ */
.bottom {
    top: var(--c-field-accordion-height);
}
.top {
    bottom: var(--c-field-accordion-height);
}
/* ▲ position ▲ */
</style>
