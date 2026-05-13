<script setup lang="ts">
import { computed, watch, ref, onUnmounted } from 'vue';
import { useField } from 'vee-validate';
import { ZodString } from 'zod';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import FieldAccordionList from '@/components/inner-parts/FieldAccordionList.vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import { XCircle as IconXCircle } from 'lucide-vue-next';
import {
    hira2Kata,
    kata2Hira,
    kanaHalf2Full,
    kataFull2Half,
    alphanumericFull2Half,
    alphanumericHalf2Full
} from '@/assets/ts';

export interface MiAutocompleteItem {
    label: string;
    value: string;
    ruby?: string;
    disabled?: boolean;
}

const model = defineModel<string>();
const props = withDefaults(
    defineProps<{
        /**
         * 項目
         */
        items: MiAutocompleteItem[];
        /**
         * match用関数
         */
        match?: (item: MiAutocompleteItem, value: string) => boolean;
        /**
         * フィールド名
         */
        name?: string;
        /**
         * zodスキーマ
         */
        schema?: ZodString;
        /**
         * 見出し
         */
        label?: string;
        /**
         * prefix
         */
        prefix?: string;
        /**
         * suffix
         */
        suffix?: string;
        /**
         * 削除ボタン
         */
        clearable?: boolean;
        /**
         * 見本
         */
        placeholder?: string;
        /**
         * 必須か（schema使用時にはそちらが優先される）
         */
        required?: boolean;
        /**
         * 無効か
         */
        disabled?: boolean;
        /**
         * 種類
         */
        type?: 'text' | 'email' | 'password';
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
        match: undefined,
        name: Math.random().toString(),
        schema: undefined,
        label: '',
        prefix: '',
        suffix: '',
        clearable: false,
        placeholder: '',
        required: false,
        disabled: false,
        type: 'text',
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        position: 'bottom',
        isErrorMessage: true
    }
);

const { value, errors } = useField<string>(props.name);
if (value.value == null && model.value != null) {
    value.value = model.value;
}
const schemaChunks = computed(() => props.schema?._def.checks);
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

const debouncedSearchValue = ref(value.value ?? '');
let debounceTimer: ReturnType<typeof setTimeout>;

watch(value, (v) => {
    model.value = v;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        debouncedSearchValue.value = v ?? '';
    }, 150);
});

onUnmounted(() => clearTimeout(debounceTimer));

const inputRef = ref();
const isFocus = ref(false);

// items 変更時のみ変換処理を実行し、キーストローク毎の再計算を回避する
const formattedItemsCache = computed(() =>
    props.items.map((item) => {
        const val = item.value.toString();
        const ruby = item.ruby;
        return {
            item,
            variants: Array.from(
                new Set([
                    hira2Kata(item.label),
                    kata2Hira(item.label),
                    kanaHalf2Full(hira2Kata(item.label)),
                    kataFull2Half(hira2Kata(item.label)),
                    alphanumericFull2Half(item.label),
                    alphanumericHalf2Full(item.label),
                    hira2Kata(val),
                    kata2Hira(val),
                    kanaHalf2Full(hira2Kata(val)),
                    kataFull2Half(hira2Kata(val)),
                    alphanumericFull2Half(val),
                    alphanumericHalf2Full(val),
                    ...(ruby
                        ? [
                              hira2Kata(ruby),
                              kata2Hira(ruby),
                              kanaHalf2Full(hira2Kata(ruby)),
                              kataFull2Half(hira2Kata(ruby)),
                              alphanumericFull2Half(ruby),
                              alphanumericHalf2Full(ruby)
                          ]
                        : [])
                ])
            )
        };
    })
);

const matchItems = computed(() => {
    if (!debouncedSearchValue.value) {
        return props.items;
    }
    const searchLower = debouncedSearchValue.value.toLocaleLowerCase();
    return formattedItemsCache.value
        .filter(({ item, variants }) => {
            if (
                item.label.includes(debouncedSearchValue.value) ||
                item.value.toString().includes(debouncedSearchValue.value) ||
                item.ruby?.includes(debouncedSearchValue.value)
            ) {
                return true;
            }

            if (variants.some((str) => str.toLocaleLowerCase().includes(searchLower))) {
                return true;
            }

            if (typeof props.match === 'function') {
                return props.match(item, debouncedSearchValue.value);
            }
            return false;
        })
        .map(({ item }) => item);
});

// NOTE: 初期値がリスト外の場合は初期化する
if (!matchItems.value.length) {
    value.value = '';
}

const onChange = (v: string | number | boolean) => {
    value.value = v as string;
};

const onDelete = () => {
    value.value = '';
};

const onFocus = () => {
    isFocus.value = true;
};

const onBlur = (event: Event) => {
    if (inputRef.value.contains(event.target as Node)) {
        return;
    }

    if (props.items.findIndex((item) => item.value === value.value) === -1) {
        value.value = '';
    }
    isFocus.value = false;
};

defineExpose({ onBlur, debouncedSearchValue, value });
</script>

<template>
    <div
        ref="inputRef"
        class="component-input"
        :class="[
            variant,
            size,
            shape,
            { 'is-focus': isFocus, 'is-value': value != null && value !== '' }
        ]"
    >
        <FieldFrame
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
        >
            <slot name="prefix" />
            <div v-if="prefix" class="prefix-suffix">{{ prefix }}</div>
            <input
                v-model.trim="value"
                class="input"
                :type="type"
                :required="isRequired"
                :disabled="disabled"
                @focus="onFocus"
                @blur="onBlur"
            />
            <div v-if="suffix" class="prefix-suffix">{{ suffix }}</div>
            <slot name="suffix" />
            <div class="clearable-box" v-if="clearable">
                <OpacityTransition>
                    <IconXCircle v-show="value != null && value !== ''" @click.prevent="onDelete" />
                </OpacityTransition>
            </div>
        </FieldFrame>
        <FieldAccordionList
            v-model="isFocus"
            :items="matchItems"
            :value="value"
            :variant="variant"
            :size="size"
            :position="position"
            :outsideClickIgnore="[inputRef]"
            @change="onChange"
        />
    </div>
</template>

<style scoped>
.component-input {
    position: relative;
    width: 100%;
    min-height: var(--c-autocomplete-height);
    font-size: var(--c-autocomplete-font-size);
    :where(.input) {
        width: 100%;
        min-width: 100px;
        height: var(--c-autocomplete-height);
        padding: 0;
        line-height: 1.5em;
        color: var(--color-theme-text-primary);
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
    .prefix-suffix {
        flex-shrink: 0;
        color: transparent;
    }
    &.is-focus,
    &.is-value {
        .prefix-suffix {
            color: var(--color-theme-text-primary);
        }
    }
    .clearable-box {
        width: var(--c-autocomplete-font-size);
        .lucide {
            opacity: 0;
            transition: opacity 0.2s;
        }
    }
}

/* ▼ size ▼ */

.large {
    --c-autocomplete-height: 40px;
    --c-autocomplete-font-size: var(--font-size-medium);
}

.medium {
    --c-autocomplete-height: 32px;
    --c-autocomplete-font-size: var(--font-size-medium);
}

.small {
    --c-autocomplete-height: 24px;
    --c-autocomplete-font-size: var(--font-size-small);
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.rounded {
    border-radius: 2em;
}

/* ▲ shape ▲ */
</style>
