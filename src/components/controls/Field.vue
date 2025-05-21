<script setup lang="ts">
import { computed, watch, ref, onMounted, onBeforeUnmount } from 'vue';
import { useField } from 'vee-validate';
import { ZodString } from 'zod';
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
import { DATE_FORMAT } from '@/assets/ts/const ';
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
        schema?: ZodString;
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
        name: Math.random().toString(),
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

const fieldType = ref(props.type === 'number' ? 'tel' : props.type);
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

const formatValue = ref('');
watch(formatValue, (v) => {
    // フォーマット処理

    const formatedValue = props.formatter(v);
    const displayFormatedValue = props.displayFormatter(formatedValue);
    const nativeParsedValue = props.displayParser(formatedValue);

    formatValue.value = displayFormatedValue;
    value.value = nativeParsedValue;
});
watch(value, (v) => {
    model.value = v;
    formatValue.value = v;
});

// NOTE: 曖昧一致により、nullとundefinedを判定し、0は判定外とする
if (value.value == null && model.value != null) {
    value.value = model.value || '';
}
formatValue.value = value.value;

const inputRef = ref();
const isFocus = ref(false);
const onDelete = () => {
    formatValue.value = '';
    value.value = '';
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
                @update:model-value="onCloseDatePicker"
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
        background-color: transparent;
        border: 0;
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
            color: var(--color-theme-text-primary);
        }
        .prefix-suffix {
            color: var(--color-theme-text-primary);
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
