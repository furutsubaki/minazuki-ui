<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useField } from 'vee-validate';
import { ZodString } from 'zod';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import { DATE_FORMAT } from '@/assets/ts/const ';

export type MiDateFormat = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT];
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
         * 表示フォーマット
         */
        format?: MiDateFormat;
        /**
         * modelフォーマット
         */
        dataFormat?: MiDateFormat;
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
        format: DATE_FORMAT.YYYYMMDD_JA,
        dataFormat: DATE_FORMAT.YYYYMMDD,
        label: '',
        required: false,
        disabled: false,
        variant: 'secondary',
        shape: 'normal',
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

watch(value, (v) => {
    model.value = v;
});

if (value.value == null && model.value != null) {
    value.value = model.value;
}

const convertVueDatepickerFormat = (format: MiDateFormat) => {
    return format.replace(/(Y)/g, 'y').replace(/(D)/g, 'd');
};

const setDayClass = (date: string) => {
    const weekDay = new Date(date).getDay();
    if (weekDay == 6) {
        // 土曜日の場合、classに"saturday"を追加
        return 'saturday';
    }
    if (weekDay == 0) {
        // 日曜日の場合、classに"sunday"を追加
        return 'sunday';
    }
    return '';
};

const elementRef = ref<HTMLElement | null>(null);
defineExpose({ elementRef });
</script>

<template>
    <div
        ref="elementRef"
        class="component-datepicker"
        :class="[variant, shape, { 'is-disabled': disabled }]"
    >
        <FieldFrame
            :label="label"
            :required="isRequired"
            :disabled="disabled"
            :variant="variant"
            :shape="shape"
            :force-inputed="true"
            :value="value"
            :isErrorMessage="isErrorMessage"
            :errors="errors"
            bodyTag="div"
        >
            <VueDatePicker
                v-model="value"
                class="datepicker"
                :format="convertVueDatepickerFormat(format)"
                :model-type="convertVueDatepickerFormat(dataFormat)"
                inline
                locale="ja"
                week-start="0"
                :enable-time-picker="false"
                auto-apply
                :day-class="setDayClass"
                v-bind="$attrs"
            />
        </FieldFrame>
    </div>
</template>

<style scoped>
.component-datepicker {
    position: relative;
    display: block;
    width: fit-content;
    text-align: left;
    &.is-disabled {
        pointer-events: none;
        opacity: 0.5;
    }
    :where(.datepicker) {
        /* stylelint-disable-next-line selector-class-pattern */
        :deep(.dp__menu) {
            background-color: transparent;
            border: none;
            /* stylelint-disable-next-line selector-class-pattern */
            .dp__calendar_item {
                display: flex;
                justify-content: center;
            }
            .saturday {
                color: var(--color-base-blue);
            }
            .sunday {
                color: var(--color-base-red);
            }
        }
    }
}

/* ▼ shape ▼ */

.rounded {
    border-radius: 2em;
}

/* ▲ shape ▲ */
</style>
