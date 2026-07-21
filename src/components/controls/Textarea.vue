<script setup lang="ts">
import { computed, useId, watch, ref, onMounted } from 'vue';
import { useField } from 'vee-validate';
import type { ZodTypeAny } from 'zod';
import { resolveStringChecks } from '@/assets/ts/schema';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import { XCircle as IconXCircle } from 'lucide-vue-next';

const model = defineModel<string>();
const props = withDefaults(
    defineProps<{
        /**
         * フィールド名
         */
        name?: string;
        /**
         * zodスキーマ
         */
        schema?: ZodTypeAny;
        /**
         * 見出し
         */
        label?: string;
        /**
         * 削除ボタン
         */
        clearable?: boolean;
        /**
         * 見本
         */
        placeholder?: string;
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
         * デフォルト行数
         */
        line?: number;
        /**
         * 最小行数
         */
        minLine?: number | null;
        /**
         * 最大行数
         */
        maxLine?: number | null;
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
        placeholder: '',
        required: false,
        disabled: false,
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        line: 3,
        isErrorMessage: true
    }
);

const generatedId = useId();
const fieldName = computed(() => props.name || generatedId);
const { value, errors } = useField<string>(fieldName);
const schemaChunks = computed(() => resolveStringChecks(props.schema));
const isRequired = computed(
    () =>
        schemaChunks.value?.some((check) => check.kind === 'min' && check.value === 1) ??
        props.required
);
const max = computed(
    () =>
        (
            schemaChunks.value?.find((check) => check.kind === 'max') as {
                kind: 'max';
                value: number;
                message?: string;
            }
        )?.value || null
);

const cssMinLine = computed(() => `calc(${props.minLine ?? props.line}lh + 0.5em)`);
const cssMaxLine = computed(() => (props.maxLine ? `calc(${props.maxLine}lh + 0.5em)` : null));
const inputFrameRef = ref();
const textareaRef = ref();

watch(value, (v) => {
    model.value = v;
});

// NOTE: 曖昧一致により、nullとundefinedを判定し、0は判定外とする
if (value.value == null && model.value != null) {
    value.value = model.value;
}

const setLines = (value: string) => {
    const lines = (value + '\n').split('\n').length - 1;
    inputFrameRef.value.frameRef.style.height = `calc(${lines}lh + 0.5em)`;
    textareaRef.value.style.height = `calc(${lines}lh + 0.5em)`;
};

watch(value, (value) => {
    setLines(value);
});

const isFocus = ref(false);
const onDelete = () => {
    value.value = '';
};

onMounted(() => {
    setLines(value.value);
});
</script>

<template>
    <div class="component-textarea" :class="[variant, size, shape, { 'is-focus': isFocus }]">
        <FieldFrame
            ref="inputFrameRef"
            class="component-input-frame"
            :label="label"
            :placeholder="placeholder"
            :required="isRequired"
            :disabled="disabled"
            :variant="variant"
            :size="size"
            :shape="shape"
            :is-focus="isFocus"
            :maxLength="max"
            :value="value"
            :isErrorMessage="isErrorMessage"
            :errors="errors"
            :input-id="generatedId"
        >
            <textarea
                :id="generatedId"
                ref="textareaRef"
                v-model="value"
                class="textarea"
                :required="isRequired"
                :disabled="disabled"
                @focus="isFocus = true"
                @blur="isFocus = false"
            />
            <div class="clearable-box" v-if="clearable">
                <OpacityTransition>
                    <IconXCircle v-show="value != null && value !== ''" @click.prevent="onDelete" />
                </OpacityTransition>
            </div>
        </FieldFrame>
    </div>
</template>

<style scoped>
.component-textarea {
    width: 100%;
    min-height: var(--c-textarea-height);
    font-size: var(--c-textarea-font-size);
    :deep(.component-input-frame) {
        .frame-box {
            min-height: v-bind(cssMinLine);
            max-height: v-bind(cssMaxLine);
        }
        .frame-body {
            align-items: flex-start;
        }
    }
    :where(.textarea) {
        width: 100%;
        min-width: 100px;
        min-height: v-bind(cssMinLine);
        max-height: v-bind(cssMaxLine);
        padding: var(--space-xs) 0;
        line-height: 1.5em;
        vertical-align: text-top;

        /* field-sizing: content; 後に登場予定。まだ未実装 */
        resize: none;
        background-color: transparent;
        border: 0;
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
        width: var(--c-textarea-font-size);
        padding-top: var(--space-sm);
        margin-bottom: auto;
        .lucide {
            opacity: 0;
            transition: opacity var(--duration-fast);
        }
    }
}

/* ▼ size ▼ */

.large {
    --c-textarea-height: 40px;
    --c-textarea-font-size: var(--font-size-medium);
}

.medium {
    --c-textarea-height: 32px;
    --c-textarea-font-size: var(--font-size-medium);
}

.small {
    --c-textarea-height: 24px;
    --c-textarea-font-size: var(--font-size-small);
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.rounded {
    border-radius: var(--radius-pill);
}

/* ▲ shape ▲ */
</style>
