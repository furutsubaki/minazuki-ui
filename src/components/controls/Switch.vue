<script setup lang="ts">
import { type Ref, computed, useId, watch } from 'vue';
import { ZodNullable, ZodBoolean, ZodLiteral } from 'zod';
import { useCheckableField } from '@/composables/useCheckableField';

const model = defineModel<boolean>();
const props = withDefaults(
    defineProps<{
        /**
         * 項目値
         */
        value?: boolean;
        /**
         * フィールド名
         */
        name?: string;
        /**
         * zodスキーマ
         */
        schema?: ZodLiteral<boolean> | ZodBoolean | ZodNullable<ZodBoolean>;
        /**
         * 見出し
         */
        label?: string;
        /**
         * 必須か
         */
        required?: boolean;
        /**
         * 無効か
         */
        disabled?: boolean;
        /**
         * 表示種類
         */
        variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * エラーメッセージを表示するか
         */
        isErrorMessage?: boolean;
    }>(),
    {
        value: true,
        name: '',
        schema: undefined,
        label: '',
        required: false,
        disabled: false,
        variant: 'secondary',
        size: 'medium',
        isErrorMessage: true
    }
);

const generatedId = useId();
const fieldName = computed(() => props.name || generatedId);
const { value: fieldVal, checked, errors, meta, onFieldChange } =
    useCheckableField<boolean>(fieldName, 'checkbox', props.value, false);

const isRequired = computed(() =>
    props.schema ? props.schema?._def.typeName === 'ZodLiteral' : props.required
);

const onChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const val = input.checked ? (JSON.parse(input.value.toLowerCase()) as boolean) : false;
    onFieldChange(val);
};

watch(checked as Ref<boolean>, (flg) => {
    model.value = flg ? props.value : false;
});

if (fieldVal.value == null && model.value != null) {
    fieldVal.value = model.value;
}
</script>

<template>
    <div
        class="component-switch"
        :class="[variant, size, { 'is-disabled': disabled, 'is-checked': checked }]"
    >
        <div v-if="label || isRequired" class="label-placeholder" :class="{ required: isRequired }">
            {{ label }}
        </div>
        <div class="item-label">
            <label class="input">
                <input
                    class="checkbox"
                    type="checkbox"
                    :value="value"
                    :disabled="disabled"
                    :checked="checked"
                    @change="onChange"
                />
                <div class="switch">
                    <div class="switch-icon">
                        <span v-if="$slots.switchIconTrue && checked" class="switch-icon-true">
                            <slot name="switchIconTrue" />
                        </span>
                        <span v-if="$slots.switchIconFalse && !checked" class="switch-icon-false">
                            <slot name="switchIconFalse" />
                        </span>
                    </div>
                </div>
                <div class="text" :class="{ required: !label && isRequired }">
                    <slot />
                </div>
            </label>
        </div>
        <template v-if="isErrorMessage && meta.touched">
            <div v-for="error in errors" :key="error" class="error">{{ error }}</div>
        </template>
    </div>
</template>

<style scoped>
.component-switch {
    position: relative;
    display: block;
    min-height: var(--c-switch-height);
    font-size: var(--c-switch-font-size);
    text-align: left;
    :where(.checkbox) {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        white-space: nowrap;
        border: 0;
        clip-path: inset(50%);
    }
    :where(.checkbox:focus-visible ~ .switch) {
        outline: var(--focus-ring-width) solid var(--focus-ring-color);
        outline-offset: var(--focus-ring-offset);
    }
    :where(.switch) {
        position: relative;
        width: calc(var(--c-switch-font-size) * 2);
        height: var(--c-switch-font-size);
        background-color: var(--color-border);
        border-radius: var(--radius-pill);
        transition: background-color 0.2s;
        .switch-icon {
            position: absolute;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: var(--c-switch-font-size);
            height: var(--c-switch-font-size);
            background-color: var(--color-text-secondary);
            border-radius: var(--radius-circle);
            transform: scale(1.5);
            transition: background-color 0.2s;
            .switch-icon-true,
            .switch-icon-false {
                filter: invert(100%) grayscale(100%) contrast(100);
                transform: scale(0.75);
                transition: color 0.2s;
            }
            .switch-icon-true {
                color: var(--c-switch-switch-icon-true-color);
            }
            .switch-icon-false {
                color: var(--color-text-secondary);
            }
        }
    }
    &.is-checked {
        .switch {
            background-color: var(--c-switch-switch-background-color);
            .switch-icon {
                background-color: var(--c-switch-switch-icon-background-color);
                transform: translateX(100%) scale(1.5);
            }
        }
    }
    &.is-disabled {
        pointer-events: none;
        opacity: 0.5;
    }

    /* required(not label) */
    .text.required::after {
        left: -0.5em;
        color: var(--color-danger);
        content: '*';
    }

    /* hover */
    @media (hover: hover) {
        &:hover {
            color: var(--c-switch-hover-color);
        }
    }

    @media (hover: none) {
        &:active {
            color: var(--c-switch-hover-color);
        }
    }
}

.label-placeholder {
    position: absolute;
    top: -0.5em;
    left: 8px;
    display: flex;
    align-items: baseline;
    height: 1em;
    font-size: var(--font-size-small);
    line-height: 1em;
    color: var(--color-text-primary);
    pointer-events: none;
    transition: 0.2s;
    &.required {
        &::after {
            left: -0.5em;
            color: var(--color-danger);
            content: '*';
        }
    }
}

.item-label {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    text-align: left;
    white-space: nowrap;
    :where(.input) {
        display: flex;
        gap: var(--space-sm);
        align-items: center;
        justify-content: flex-start;
        min-height: var(--c-switch-height);
        line-height: 1.5em;
        transition:
            color 0.2s,
            background-color 0.2s,
            border-color 0.2s,
            opacity 0.2s;
    }
}

.error {
    font-size: var(--font-size-small);
    color: var(--color-danger);
}

/* ▼ variant ▼ */

.primary {
    --c-switch-hover-color: var(--color-brand);
    --c-switch-switch-icon-true-color: var(--color-brand);
    --c-switch-switch-background-color: var(--color-brand-alpha);
    --c-switch-switch-icon-background-color: var(--color-brand);
}

.secondary {
    --c-switch-hover-color: var(--color-text-primary);
    --c-switch-switch-icon-true-color: var(--color-text-primary);
    --c-switch-switch-background-color: var(--color-border);
    --c-switch-switch-icon-background-color: var(--color-text-primary);
}

.info {
    --c-switch-hover-color: var(--color-info);
    --c-switch-switch-icon-true-color: var(--color-info);
    --c-switch-switch-background-color: var(--color-info-alpha);
    --c-switch-switch-icon-background-color: var(--color-info);
}

.success {
    --c-switch-hover-color: var(--color-success);
    --c-switch-switch-icon-true-color: var(--color-success);
    --c-switch-switch-background-color: var(--color-success-alpha);
    --c-switch-switch-icon-background-color: var(--color-success);
}

.warning {
    --c-switch-hover-color: var(--color-warning);
    --c-switch-switch-icon-true-color: var(--color-warning);
    --c-switch-switch-background-color: var(--color-warning-alpha);
    --c-switch-switch-icon-background-color: var(--color-warning);
}

.danger {
    --c-switch-hover-color: var(--color-danger);
    --c-switch-switch-icon-true-color: var(--color-danger);
    --c-switch-switch-background-color: var(--color-danger-alpha);
    --c-switch-switch-icon-background-color: var(--color-danger);
}

/* ▲ variant ▲ */

/* ▼ size ▼ */

.large {
    --c-switch-height: 40px;
    --c-switch-font-size: var(--font-size-medium);
}

.medium {
    --c-switch-height: 32px;
    --c-switch-font-size: var(--font-size-medium);
}

.small {
    --c-switch-height: 24px;
    --c-switch-font-size: var(--font-size-small);
}

/* ▲ size ▲ */
</style>
