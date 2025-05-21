<script setup lang="ts">
import { computed, watch } from 'vue';
import { useField } from 'vee-validate';
import { ZodNumber, ZodString, ZodArray, ZodBoolean } from 'zod';
import Checkbox from '@/components/controls/Checkbox.vue';

export interface MiCheckboxItem {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
}

const model = defineModel<(string | number | boolean)[]>();
const props = withDefaults(
    defineProps<{
        /**
         * 項目
         */
        items: MiCheckboxItem[];
        /**
         * フィールド名
         */
        name?: string;
        /**
         * zodスキーマ
         */
        schema?: ZodArray<ZodBoolean> | ZodArray<ZodString> | ZodArray<ZodNumber>;
        /**
         * 見出し
         */
        label?: string;
        /**
         * 必須か（schema使用時にはそちらが優先される）
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

const { value, errors } = useField<(string | number | boolean)[]>(props.name);

const isRequired = computed(() =>
    props.schema
        ? (props.schema as ZodArray<ZodString>)?._def.minLength?.value === 1
        : props.required
);

watch(value, (v) => {
    model.value = v;
});

// NOTE: 曖昧一致により、nullとundefinedを判定し、0は判定外とする
if (value.value == null && model.value != null) {
    value.value = model.value;
}
</script>

<template>
    <div class="component-checkbox-group">
        <div v-if="label || isRequired" class="label-placeholder" :class="{ required: isRequired }">
            {{ label }}
        </div>
        <div class="items">
            <Checkbox
                v-for="item in items"
                :key="item.label"
                :value="item.value"
                :name="name"
                :disabled="disabled || item.disabled"
                :variant="item.variant || variant"
                :size="size"
                :isErrorMessage="false"
                >{{ item.label }}</Checkbox
            >
        </div>
        <template v-if="isErrorMessage">
            <div v-for="error in errors" :key="error" class="error">{{ error }}</div>
        </template>
    </div>
</template>

<style scoped>
.component-checkbox-group {
    position: relative;
    text-align: left;
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
    pointer-events: none;
    &.required {
        &::after {
            left: -0.5em;
            color: var(--color-status-danger);
            content: '*';
        }
    }
}

.items {
    display: flex;
    gap: 16px;
}

.error {
    font-size: var(--font-size-small);
    color: var(--color-status-danger);
}
</style>
