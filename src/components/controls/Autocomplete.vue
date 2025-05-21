<script setup lang="ts">
import { computed, watch, ref } from 'vue';
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

watch(value, (v) => {
    model.value = v;
});

// NOTE: 曖昧一致により、nullとundefinedを判定し、0は判定外とする
if (value.value == null && model.value != null) {
    value.value = model.value;
}

const inputRef = ref();
const isFocus = ref(false);

const matchItems = computed(() => {
    if (!value.value) {
        return props.items;
    }
    return props.items.filter((item) => {
        if (
            item.label.includes(value.value) ||
            item.value.toString().includes(value.value) ||
            item.ruby?.includes(value.value)
        ) {
            // 通常チェック
            return true;
        }

        // TODO: 処理コスト高そう……
        const formatStrs = Array.from(
            new Set([
                hira2Kata(item.label),
                kata2Hira(item.label),
                kanaHalf2Full(hira2Kata(item.label)),
                kataFull2Half(hira2Kata(item.label)),
                alphanumericFull2Half(item.label),
                alphanumericHalf2Full(item.label),
                hira2Kata(item.value.toString()),
                kata2Hira(item.value.toString()),
                kanaHalf2Full(hira2Kata(item.value.toString())),
                kataFull2Half(hira2Kata(item.value.toString())),
                alphanumericFull2Half(item.value.toString()),
                alphanumericHalf2Full(item.value.toString()),
                ...(item.ruby
                    ? [
                          hira2Kata(item.ruby),
                          kata2Hira(item.ruby),
                          kanaHalf2Full(hira2Kata(item.ruby)),
                          kataFull2Half(hira2Kata(item.ruby)),
                          alphanumericFull2Half(item.ruby),
                          alphanumericHalf2Full(item.ruby)
                      ]
                    : [])
            ])
        );

        if (
            formatStrs.findIndex((str) =>
                str.toLocaleLowerCase().includes(value.value.toLocaleLowerCase())
            ) !== -1
        ) {
            // 各種変換した文字でチェック
            return true;
        }

        if (typeof props.match == 'function') {
            // props.match関数チェック
            return props.match(item, value.value);
        }
        return false;
    });
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
