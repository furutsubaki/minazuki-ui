<script setup lang="ts">
import { computed, useId, watch, ref } from 'vue';
import { useField } from 'vee-validate';
import { ZodNumber, ZodString, ZodBoolean } from 'zod';
import { resolveStringChecks } from '@/assets/ts/schema';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import FieldAccordionList from '@/components/inner-parts/FieldAccordionList.vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import { ChevronDown as IconChevronDown, XCircle as IconXCircle } from 'lucide-vue-next';

export interface MiSelectItem {
    label: string;
    value: string | number | boolean;
    disabled?: boolean;
}

const model = defineModel<string | number | boolean>();
const props = withDefaults(
    defineProps<{
        /**
         * 項目
         */
        items: MiSelectItem[];
        /**
         * フィールド名
         */
        name?: string;
        /**
         * zodスキーマ
         */
        schema?: ZodBoolean | ZodString | ZodNumber;
        /**
         * 見出し
         */
        label?: string;
        /**
         * 削除ボタン
         */
        clearable?: boolean;
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
         * 形状
         */
        shape?: 'normal' | 'rounded' | 'no-radius';
        /**
         * ポジション
         */
        position?: 'top' | 'bottom';
        /**
         * エラーメッセージを表示するか
         */
        isErrorMessage?: boolean;
    }>(),
    {
        name: '',
        schema: undefined,
        label: '',
        clearable: false,
        required: false,
        disabled: false,
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        position: 'bottom',
        isErrorMessage: true
    }
);

const generatedId = useId();
const fieldName = computed(() => props.name || generatedId);
const { value, errors } = useField<string | number | boolean>(fieldName);
if (value.value == null && model.value != null) {
    value.value = model.value;
}
const schemaChunks = computed(() => resolveStringChecks(props.schema));
const isRequired = computed(
    () =>
        schemaChunks.value?.some((check) => check.kind === 'min' && check.value === 1) ??
        props.required
);

watch(value, (v) => {
    model.value = v;
});

const selectRef = ref();
const isOpen = ref(false);
const selectedItem = computed(
    () => props.items.find((item) => item.value === value.value) ?? { label: '', value: null }
);

const onChange = (event: string | number | boolean) => {
    value.value = event;
};

const onDelete = () => {
    value.value = '';
    isOpen.value = false;
};
</script>

<template>
    <div
        ref="selectRef"
        class="component-select-group"
        :class="[variant, size, shape, position, { 'is-focus': isOpen }]"
    >
        <FieldFrame
            :label="label"
            :required="isRequired"
            :disabled="disabled"
            :variant="variant"
            :size="size"
            :shape="shape"
            :is-focus="isOpen"
            :value="value"
            :isErrorMessage="isErrorMessage"
            :errors="errors"
        >
            <div
                class="select"
                :class="{ 'is-focus': isOpen }"
                :disabled="disabled"
                @click="isOpen = !isOpen"
            >
                <span class="selected-label">{{ selectedItem.label }}</span>
                <IconChevronDown class="select-icon" />
            </div>
            <div class="clearable-box" v-if="clearable">
                <OpacityTransition>
                    <IconXCircle v-show="value != null && value !== ''" @click.prevent="onDelete" />
                </OpacityTransition>
            </div>
        </FieldFrame>
        <FieldAccordionList
            v-model="isOpen"
            :items="items"
            :value="value"
            :variant="variant"
            :size="size"
            :position="position"
            :outsideClickIgnore="[selectRef]"
            @change="onChange"
        />
    </div>
</template>

<style scoped>
.component-select-group {
    position: relative;
    width: 100%;
    min-height: var(--c-select-height);
    font-size: var(--c-select-font-size);
    :where(.select) {
        display: flex;
        gap: var(--space-md);
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-width: 100px;
        height: var(--c-select-height);
        padding: 0;
        line-height: 1.5em;
        cursor: pointer;
        background-color: transparent;
        border: 0;
        .selected-label {
            flex-grow: 1;
            height: 2em;
            line-height: 2em;
        }
        .select-icon {
            font-size: var(--font-size-small);
            transition: transform var(--duration-fast);
        }
        &.is-focus .select-icon {
            transform: rotateZ(180deg);
        }
    }

    @media (hover: hover) {
        /* PC */
        &.is-focus,
        &:hover {
            .clearable-box {
                .lucide {
                    opacity: 1;
                }
            }
        }
    }

    @media (hover: none) {
        /* mobile */
        &.is-focus,
        &:active {
            .clearable-box {
                .lucide {
                    opacity: 1;
                }
            }
        }
    }
    .clearable-box {
        width: var(--c-select-font-size);
        .lucide {
            opacity: 0;
            transition: opacity var(--duration-fast);
        }
    }
}

/* ▼ size ▼ */

.large {
    --c-select-height: 40px;
    --c-select-font-size: var(--font-size-medium);
}

.medium {
    --c-select-height: 32px;
    --c-select-font-size: var(--font-size-medium);
}

.small {
    --c-select-height: 24px;
    --c-select-font-size: var(--font-size-small);
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.rounded {
    border-radius: var(--radius-pill);
}

/* ▲ shape ▲ */
</style>
