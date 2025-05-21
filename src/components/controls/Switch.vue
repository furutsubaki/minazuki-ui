<script setup lang="ts">
import { type Ref, computed, watch } from 'vue';
import { useField } from 'vee-validate';
import { ZodNullable, ZodBoolean, ZodLiteral } from 'zod';

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
        name: Math.random().toString(),
        schema: undefined,
        label: '',
        required: false,
        disabled: false,
        variant: 'secondary',
        size: 'medium',
        isErrorMessage: true
    }
);

const {
    value: fieldVal,
    checked,
    errors,
    handleChange
} = useField<boolean>(props.name, undefined, {
    type: 'checkbox',
    checkedValue: props.value,
    uncheckedValue: false
});

const isRequired = computed(() =>
    props.schema ? props.schema?._def.typeName === 'ZodLiteral' : props.required
);

const onChange = (event: Event) => {
    let val = JSON.parse((event.target as HTMLInputElement).value.toLowerCase());

    if (!(event.target as HTMLInputElement).checked) {
        val = false;
    }
    handleChange(val);
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
        <template v-if="isErrorMessage">
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
        display: none;
    }
    :where(.switch) {
        position: relative;
        width: calc(var(--c-switch-font-size) * 2);
        height: var(--c-switch-font-size);
        background-color: var(--color-theme-border);
        border-radius: 1em;
        transition: background-color 0.2s;
        .switch-icon {
            position: absolute;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: var(--c-switch-font-size);
            height: var(--c-switch-font-size);
            background-color: var(--color-theme-text-secondary);
            border-radius: 1em;
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
                color: var(--color-theme-text-secondary);
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
        color: var(--color-status-danger);
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
    color: var(--color-theme-text-primary);
    pointer-events: none;
    transition: 0.2s;
    &.required {
        &::after {
            left: -0.5em;
            color: var(--color-status-danger);
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
        gap: 8px;
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
    color: var(--color-status-danger);
}

/* ▼ variant ▼ */

.primary {
    --c-switch-hover-color: var(--color-status-brand);
    --c-switch-switch-icon-true-color: var(--color-status-brand);
    --c-switch-switch-background-color: var(--color-status-brand-alpha);
    --c-switch-switch-icon-background-color: var(--color-status-brand);
}

.secondary {
    --c-switch-hover-color: var(--color-theme-text-primary);
    --c-switch-switch-icon-true-color: var(--color-theme-text-primary);
    --c-switch-switch-background-color: var(--color-theme-border);
    --c-switch-switch-icon-background-color: var(--color-theme-text-primary);
}

.info {
    --c-switch-hover-color: var(--color-status-info);
    --c-switch-switch-icon-true-color: var(--color-status-info);
    --c-switch-switch-background-color: var(--color-status-info-alpha);
    --c-switch-switch-icon-background-color: var(--color-status-info);
}

.success {
    --c-switch-hover-color: var(--color-status-success);
    --c-switch-switch-icon-true-color: var(--color-status-success);
    --c-switch-switch-background-color: var(--color-status-success-alpha);
    --c-switch-switch-icon-background-color: var(--color-status-success);
}

.warning {
    --c-switch-hover-color: var(--color-status-warning);
    --c-switch-switch-icon-true-color: var(--color-status-warning);
    --c-switch-switch-background-color: var(--color-status-warning-alpha);
    --c-switch-switch-icon-background-color: var(--color-status-warning);
}

.danger {
    --c-switch-hover-color: var(--color-status-danger);
    --c-switch-switch-icon-true-color: var(--color-status-danger);
    --c-switch-switch-background-color: var(--color-status-danger-alpha);
    --c-switch-switch-icon-background-color: var(--color-status-danger);
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
