<script setup lang="ts">
import { computed, useId, watch, ref, onMounted, onBeforeUnmount } from 'vue';
import { useField } from 'vee-validate';
import type { ZodTypeAny } from 'zod';
import { resolveStringChecks } from '@/assets/ts/schema';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import DatePicker from '@/components/controls/DatePicker.vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import {
    XCircle as IconXCircle,
    CalendarDays as IconCalendarDays,
    Eye as IconEye,
    EyeOff as IconEyeOff,
    Search as IconSearch,
    Clock as IconClock
} from 'lucide-vue-next';
import { DATE_FORMAT } from '@/assets/ts/const';
import dayjs from 'dayjs';
import useOutsideClick from '@/directives/useOutsideClick';

export type MiDateFormat = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT];
export type MiFieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'time'
    | 'date'
    | 'number'
    | 'tel'
    | 'search'
    | 'url';
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
         * 表示フォーマット(type: dateのみ)
         */
        format?: MiDateFormat;
        /**
         * modelフォーマット(type: dateのみ)
         */
        dataFormat?: MiDateFormat;
        /**
         * フォーマッター（displayFormatter、displayParserとの併用不可）
         */
        formatter?: (v: string) => string;
        /**
         * 表示フォーマッター（displayParserとセット運用、formatterとの併用不可）
         */
        displayFormatter?: (v: string) => string;
        /**
         * 表示パーサー（displayFormatterとセット運用、formatterとの併用不可）
         */
        displayParser?: (v: string) => string;
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
        type?: MiFieldType;
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
         * エラーメッセージを表示するか
         */
        isErrorMessage?: boolean;
    }>(),
    {
        name: '',
        schema: undefined,
        label: '',
        prefix: '',
        suffix: '',
        format: DATE_FORMAT.YYYYMMDD_JA,
        dataFormat: DATE_FORMAT.YYYYMMDD,
        formatter: (v: string) => v,
        displayFormatter: (v: string) => v,
        displayParser: (v: string) => v,
        clearable: false,
        placeholder: '',
        required: false,
        disabled: false,
        type: 'text',
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        isErrorMessage: true
    }
);

defineEmits<{
    search: [value: string];
}>();

const generatedId = useId();
const fieldName = computed(() => props.name || generatedId);
const fieldType = ref(props.type === 'number' ? 'tel' : props.type);
// validateOnValueUpdate を無効化し、値の代入では自動バリデートを走らせない。
// これにより resetForm() / model 反映 / 表示⇔値の同期といったプログラム的な値変更で
// 誤って未入力バリデーションが走るのを防ぐ。バリデートはユーザー入力時に明示的に行う。
const { value, errors, validate } = useField<string>(fieldName, undefined, {
    validateOnValueUpdate: false
});
if (value.value == null && model.value != null) {
    value.value = model.value;
}
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

const formatValue = ref('');
watch(formatValue, (v) => {
    // フォーマット処理
    const formatedValue = props.formatter(v);
    const displayFormatedValue = props.displayFormatter(formatedValue);
    const nativeParsedValue = props.displayParser(formatedValue);

    if (formatValue.value !== displayFormatedValue) {
        formatValue.value = displayFormatedValue;
    }
    // value からの伝播（reset / model / DatePicker 等）による往復では同値が返るため、
    // 実際に値が変わったユーザー入力時のみ value を更新し、その場合だけライブバリデートする。
    if (value.value !== nativeParsedValue) {
        value.value = nativeParsedValue;
        validate();
    }
});
watch(value, (v) => {
    model.value = v;
    formatValue.value = v;
});

formatValue.value = value.value;

const inputRef = ref();
const isFocus = ref(false);
const onDelete = () => {
    formatValue.value = '';
    value.value = '';
    validate();
};

// --- ▼ type: Password時の処理 ▼ ---
const isShowPassword = ref(false);
const onShowPassword = () => {
    isShowPassword.value = true;
    fieldType.value = 'text';
};
const onHidePassword = () => {
    isShowPassword.value = false;
    fieldType.value = 'password';
};
// --- ▲ type: Password時の処理 ▲ ---

// --- ▼ type: Date時の処理 ▼ ---
const onDateButonClick = () => {
    if (datePickerScrollObserver.value) {
        datePickerScrollObserver.value!.observe(datepickerRef.value!.elementRef!);
    }
    isFocus.value = true;
};

// DatePicker枠外制御/表示位置制御
const datepickerRef = ref<InstanceType<typeof DatePicker> | null>(null);
const datePickerScrollObserver = ref<IntersectionObserver>();
const onCloseDatePicker = () => {
    if (!isFocus.value || props.type !== 'date') return;

    isFocus.value = false;
    if (datePickerScrollObserver.value) {
        datePickerScrollObserver.value.disconnect();
    }
};
// 日付選択はユーザー操作のため、選択確定時に明示的にバリデートする
// （value 経由の変更は watch では区別できずバリデートされないため）
const onDatePickerUpdate = () => {
    validate();
    onCloseDatePicker();
};
onMounted(() => {
    const intersect = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                const elementCenterY =
                    (entry.boundingClientRect.top + entry.boundingClientRect.bottom) / 2;
                const elementCenterX =
                    (entry.boundingClientRect.left + entry.boundingClientRect.right) / 2;
                const isTop = window.innerHeight / 2 > elementCenterY;
                const isBottom = window.innerHeight / 2 < elementCenterY;
                const isLeft = window.innerWidth / 2 > elementCenterX;
                const isRight = window.innerWidth / 2 < elementCenterX;
                if (isLeft) {
                    datepickerRef.value!.elementRef!.style.left = '0px';
                    datepickerRef.value!.elementRef!.style.right = '';
                } else if (isRight) {
                    datepickerRef.value!.elementRef!.style.left = '';
                    datepickerRef.value!.elementRef!.style.right = '0px';
                }
                if (isTop) {
                    datepickerRef.value!.elementRef!.style.top = '100%';
                    datepickerRef.value!.elementRef!.style.bottom = '';
                } else if (isBottom) {
                    datepickerRef.value!.elementRef!.style.top = '';
                    datepickerRef.value!.elementRef!.style.bottom = '100%';
                }
            }
        });
    };
    if (props.type === 'date') {
        const options = {
            root: null,
            rootMargin: '0%',
            threshold: 1
        };
        datePickerScrollObserver.value = new IntersectionObserver(intersect, options);
    }
});
onBeforeUnmount(() => {
    if (props.type === 'date') {
        if (datePickerScrollObserver.value) {
            datePickerScrollObserver.value.unobserve(datepickerRef.value!.elementRef!);
        }
    }
});
// --- ▲ type: Date時の処理 ▲ ---

// Accordion枠外制御
const { vOutsideClick } = useOutsideClick();
const onOutsideClick = computed(() => ({
    handler: onCloseDatePicker,
    isActive: isFocus.value && props.type === 'date',
    ignore: [inputRef.value]
}));

defineExpose({ onCloseDatePicker, isFocus, datePickerScrollObserver });
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
            <button v-if="type === 'date'" class="input" @click="onDateButonClick">
                <span>{{ value ? dayjs(value).format(format) : '' }}</span>
            </button>
            <input
                v-else
                v-model.trim="formatValue"
                class="input"
                :type="fieldType"
                :required="isRequired"
                :disabled="disabled"
                placeholder=" "
                @focus="isFocus = true"
                @blur="isFocus = false"
            />
            <div v-if="suffix" class="prefix-suffix">{{ suffix }}</div>
            <slot name="suffix" />
            <div class="icon-box" v-if="clearable">
                <OpacityTransition>
                    <IconXCircle v-show="value != null && value !== ''" @click.prevent="onDelete" />
                </OpacityTransition>
            </div>
            <div class="icon-box always-visible" v-if="type === 'time'">
                <IconClock />
            </div>
            <div class="icon-box always-visible" v-else-if="type === 'date'">
                <IconCalendarDays />
            </div>
            <div class="icon-box" v-else-if="type === 'password'">
                <OpacityTransition>
                    <div v-show="value != null && value !== ''">
                        <IconEye v-show="isShowPassword" @click.prevent="onHidePassword" />
                        <IconEyeOff v-show="!isShowPassword" @click.prevent="onShowPassword" />
                    </div>
                </OpacityTransition>
            </div>
            <div class="icon-box always-visible" v-else-if="type === 'search'">
                <OpacityTransition>
                    <IconSearch @click.prevent="$emit('search', value)" />
                </OpacityTransition>
            </div>
        </FieldFrame>

        <OpacityTransition v-if="type === 'date'">
            <DatePicker
                ref="datepickerRef"
                v-show="isFocus"
                v-model="value"
                class="datepicker"
                :format="format"
                :dataFormat="dataFormat"
                :variant:="variant"
                :shape="shape"
                @update:model-value="onDatePickerUpdate"
                v-outside-click="onOutsideClick"
            />
        </OpacityTransition>
    </div>
</template>

<style scoped>
.component-input {
    position: relative;
    width: 100%;
    min-height: var(--c-field-height);
    font-size: var(--c-field-font-size);
    :where(.input) {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        min-width: 100px;
        height: var(--c-field-height);
        padding: 0;
        line-height: 1.5em;
        outline: none;
        background-color: transparent;
        border: 0;
        box-shadow: none;
    }
    .input:focus,
    .input:focus-visible {
        outline: none;
        box-shadow: none;
    }
    [type='time'] {
        color: transparent;
        &::-webkit-calendar-picker-indicator {
            display: none;
        }
    }
    .prefix-suffix {
        flex-shrink: 0;
        color: transparent;
    }
    &.is-focus,
    &.is-value {
        [type='time'] {
            color: var(--color-text-primary);
        }
        .prefix-suffix {
            color: var(--color-text-primary);
        }
    }
    [type='search'] {
        &::-webkit-search-cancel-button {
            appearance: none;
        }
    }

    @media (hover: hover) {
        /* PC */
        &.is-focus,
        &:hover {
            .icon-box {
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
            .icon-box {
                .lucide {
                    opacity: 1;
                }
            }
        }
    }
    .icon-box {
        width: var(--c-field-font-size);
        &.always-visible {
            .lucide {
                opacity: 1;
            }
        }
        .lucide {
            opacity: 0;
            transition: opacity 0.2s;
        }
    }
    .datepicker {
        position: absolute;
        z-index: 1;
    }
}

/* ▼ size ▼ */

.large {
    --c-field-height: 40px;
    --c-field-font-size: var(--font-size-medium);
}

.medium {
    --c-field-height: 32px;
    --c-field-font-size: var(--font-size-medium);
}

.small {
    --c-field-height: 24px;
    --c-field-font-size: var(--font-size-small);
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.rounded {
    border-radius: 2em;
}

/* ▲ shape ▲ */
</style>
