<script setup lang="ts">
import { type Ref, computed, watch } from 'vue';
import { useField } from 'vee-validate';
import { ZodNumber, ZodString, ZodNullable, ZodBoolean, ZodLiteral } from 'zod';
import { CircleCheck as IconCircleCheck, Circle as IconCircle } from 'lucide-vue-next';

// TODO: ラジオボタンのチェック済みアイコンが適切ではないが、lucideにはまだないため、仮置き

const model = defineModel<string | number | boolean>();
const props = withDefaults(
    defineProps<{
        /**
         * 項目値
         */
        value?: string | number | boolean;
        /**
         * フィールド名
         */
        name?: string;
        /**
         * zodスキーマ
         */
        schema?:
            | ZodLiteral<string | number | boolean>
            | ZodBoolean
            | ZodNullable<ZodBoolean>
            | ZodString
            | ZodNullable<ZodString>
            | ZodNumber
            | ZodNullable<ZodNumber>;
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
const unCheckValue = computed(() => (typeof props.value === 'boolean' ? false : ''));

const {
    value: fieldVal,
    checked,
    errors,
    handleChange
} = useField<string | number | boolean>(props.name, undefined, {
    type: 'radio',
    checkedValue: props.value,
    uncheckedValue: unCheckValue.value
});

const schemaChunks = computed(() => (props.schema as ZodString | undefined)?._def.checks);
const isRequired = computed(
    () =>
        schemaChunks.value?.some((check) => check.kind === 'min' && check.value === 1) ??
        props.required
);

const onChange = (event: Event) => {
    let val = (event.target as HTMLInputElement).value as string | number | boolean;

    if (!(event.target as HTMLInputElement).checked) {
        val = unCheckValue.value;
    }
    handleChange(val);
};

watch(checked as Ref<boolean>, (flg) => {
    model.value = flg ? props.value : unCheckValue.value;
});

if (fieldVal.value == null && model.value != null) {
    fieldVal.value = model.value;
}
</script>

<template>
    <div
        class="component-radio"
        :class="[variant, size, { 'is-disabled': disabled, 'is-checked': checked }]"
    >
        <div v-if="label || isRequired" class="label-placeholder" :class="{ required: isRequired }">
            {{ label }}
        </div>
        <div class="item-label">
            <label class="input">
                <input
                    class="radio"
                    type="radio"
                    :value="value"
                    :disabled="disabled"
                    :checked="checked"
                    @change="onChange"
                />
                <IconCircleCheck v-show="checked" />
                <IconCircle v-show="!checked" />
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
.component-radio {
    position: relative;
    display: block;
    min-height: var(--c-radio-height);
    font-size: var(--c-radio-font-size);
    text-align: left;
    :where(.radio) {
        display: none;
    }
    &.is-disabled {
        pointer-events: none;
        opacity: 0.5;
    }
    &.is-checked {
        .lucide {
            color: var(--c-radio-is-checked-lucide-color);
        }
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
            color: var(--c-radio-hover-color);
        }
    }

    @media (hover: none) {
        &:active {
            color: var(--c-radio-hover-color);
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
        min-height: var(--c-radio-height);
        line-height: 1.5em;
    }
}

.error {
    font-size: var(--font-size-small);
    color: var(--color-status-danger);
}

/* ▼ variant ▼ */

.primary {
    --c-radio-hover-color: var(--color-status-brand);
    --c-radio-is-checked-lucide-color: var(--color-status-brand);
}

/* .secondary {
    --c-radio-hover-color: var(--color-status-brand);
    --c-radio-is-checked-lucide-color: var(--color-status-brand);
} */

.info {
    --c-radio-hover-color: var(--color-status-info);
    --c-radio-is-checked-lucide-color: var(--color-status-info);
}

.success {
    --c-radio-hover-color: var(--color-status-success);
    --c-radio-is-checked-lucide-color: var(--color-status-success);
}

.warning {
    --c-radio-hover-color: var(--color-status-warning);
    --c-radio-is-checked-lucide-color: var(--color-status-warning);
}

.danger {
    --c-radio-hover-color: var(--color-status-danger);
    --c-radio-is-checked-lucide-color: var(--color-status-danger);
}

/* ▲ variant ▲ */

/* ▼ size ▼ */

.large {
    --c-radio-height: 40px;
    --c-radio-font-size: var(--font-size-medium);
}

.medium {
    --c-radio-height: 32px;
    --c-radio-font-size: var(--font-size-medium);
}

.small {
    --c-radio-height: 24px;
    --c-radio-font-size: var(--font-size-small);
}

/* ▲ size ▲ */
</style>
