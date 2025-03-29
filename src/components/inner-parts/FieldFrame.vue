<script setup lang="ts">
import { ref, useSlots } from 'vue';
import InputTextCounter from '@/components/inner-parts/InputTextCounter.vue';
withDefaults(
    defineProps<{
        /**
         * 見出し
         */
        label?: string;
        /**
         * 見本
         */
        placeholder?: string;
        /**
         * 無効か
         */
        disabled?: boolean;
        /**
         * 必須か
         */
        required?: boolean;
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
         * フォーカス中か
         */
        isFocus?: boolean;
        /**
         * 強制入力状態
         */
        forceInputed?: boolean;
        /**
         * 最大文字数
         */
        maxLength?: number | null;
        /**
         * 値
         */
        value?: string | number | boolean;
        /**
         * エラーメッセージを表示するか
         */
        isErrorMessage?: boolean;
        /**
         * エラーメッセージ配列
         */
        errors?: string[];
        /**
         * タグ
         */
        bodyTag?: string;
    }>(),
    {
        label: '',
        placeholder: '',
        disabled: false,
        required: false,
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        isFocus: false,
        forceInputed: false,
        line: 1,
        maxLength: null,
        value: '',
        isErrorMessage: true,
        errors: () => [],
        bodyTag: 'label'
    }
);

const slots = useSlots();
const hasSlot = (name: string) => {
    return slots[name] ? !!(slots[name] as () => [])()?.length : false;
};

const frameRef = ref();

defineExpose({ frameRef });
</script>

<template>
    <div
        class="component-input-frame"
        :class="[
            variant,
            size,
            shape,
            {
                'is-focus': isFocus,
                'is-required': required,
                'is-inputed': forceInputed || (value != null && value !== ''),
                'is-disabled': disabled
            }
        ]"
    >
        <div class="frame">
            <div ref="frameRef" class="frame-box">
                <div class="frame-start" />
                <div class="frame-label">
                    <div class="label-box">
                        <span v-if="label || required" class="label">{{ label }}</span
                        ><span v-if="placeholder" class="placeholder"
                            >（例：{{ placeholder }}）</span
                        >
                    </div>
                </div>
                <div class="frame-grow" />
                <div class="frame-counter">
                    <InputTextCounter
                        v-if="maxLength"
                        class="counter"
                        :text="value as string"
                        :max="maxLength"
                    />
                </div>
                <div class="frame-end" />
            </div>
            <component :is="bodyTag" class="frame-body">
                <template v-if="hasSlot('default')">
                    <slot />
                </template>
                <template v-else>
                    <div class="dummy-slot" />
                </template>
            </component>
        </div>
        <template v-if="isErrorMessage">
            <div v-for="error in errors" :key="error" class="error">{{ error }}</div>
        </template>
    </div>
</template>

<style scoped>
.component-input-frame {
    --c-field-frame-start-end-padding: 16px;
    --c-field-frame-border-width: 1px;
    position: relative;
    min-width: 100px;
    min-height: var(--c-field-frame-height);
    width: 100%;
    font-size: var(--c-field-frame-font-size);
    .frame {
        position: relative;
    }
    :where(.frame-box) {
        position: absolute;
        text-align: left;
        display: flex;
        justify-content: space-between;
        min-width: 100px;
        width: 100%;
        height: 100%;
        min-height: var(--c-field-frame-height);
        line-height: 1.5em;
        background-color: var(--color-theme-bg-primary);
        border-color: var(--c-field-frame-border-color);
        border-radius: 4px;
        transition:
            height 0.2s,
            background-color 0.2s;

        .frame-start,
        .frame-end {
            position: relative;
            width: var(--c-field-frame-start-end-padding);
            border-style: solid;
            border-color: inherit;
            border-width: var(--c-field-frame-border-width);
            flex-shrink: 0;
            &::before {
                content: '';
                position: absolute;
                top: -2px;
                height: calc(100% + 4px);
                width: calc(100% + 2px);
                border: solid 2px transparent;
            }
        }
        .frame-start {
            border-right: 0;
            border-radius: 4px 0 0 4px;
            &::before {
                left: -2px;
                border-radius: 4px 0 0 4px;
                border-right: 0;
            }
        }
        .frame-end {
            border-left: 0;
            border-radius: 0 4px 4px 0;
            &::before {
                right: -2px;
                border-radius: 0 4px 4px 0;
                border-left: 0;
            }
        }

        .frame-label,
        .frame-grow,
        .frame-counter {
            position: relative;
            border-style: solid;
            border-color: inherit;
            border-width: var(--c-field-frame-border-width);
            border-right: 0;
            border-left: 0;
            transition: border-width 0.2s;
            flex-shrink: 0;
            &::before {
                content: '';
                position: absolute;
                top: -2px;
                left: 0;
                height: calc(100% + 4px);
                width: 100%;
                border: solid 2px transparent;
                border-right: 0;
                border-left: 0;
            }
        }

        .frame-label {
            position: relative;
            display: flex;
            align-items: center;
            .label-box {
                display: flex;
                align-items: center;
                height: 100%;
                pointer-events: none;
                transform: translateY(calc(-50% + (var(--c-field-frame-height) / 2) - 1px));
                transition:
                    transform 0.2s,
                    font-size 0.2s;
                .label {
                    transition: color 0.2s;
                    color: var(--color-theme-text-secondary);
                    height: 1em;
                    line-height: 1em;
                    vertical-align: baseline;
                }

                .placeholder {
                    font-size: var(--font-size-small);
                    color: var(--color-theme-text-secondary);
                    height: 1em;
                    line-height: 1em;
                    vertical-align: baseline;
                }
            }
        }

        .frame-grow {
            flex-grow: 1;
        }

        .frame-counter {
            border-top-color: transparent !important;
            &::before {
                border-top-color: transparent !important;
            }
            .counter {
                pointer-events: none;
                transform: translateY(-50%);
                display: flex;
                align-items: center;
            }
        }
    }
    .frame-body {
        position: relative;
        padding-left: calc(var(--c-field-frame-start-end-padding) / 2);
        padding-right: calc(var(--c-field-frame-start-end-padding) / 2);
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;
        height: 100%;
    }

    /* required */
    &.is-required > .frame > .frame-box > .frame-label > .label-box > .label {
        &::after {
            left: -0.5em;
            color: var(--color-status-danger);
            content: '*';
        }
    }

    /* disabled */
    &.is-disabled {
        pointer-events: none;
        opacity: 0.5;
    }

    /* focus */
    &.is-focus {
        .frame-box {
            .frame-start,
            .frame-end,
            .frame-label,
            .frame-grow,
            .frame-counter {
                &::before {
                    border-color: var(--c-field-frame-border-color);
                }
            }
        }
    }
    &:is(.is-inputed, .is-focus) > .frame > .frame-box > .frame-label {
        border-top-color: transparent;
        &::before {
            border-top-color: transparent;
        }

        > .label-box {
            transform: translateY(-50%);
            font-size: var(--font-size-small);
            .label {
                color: var(--color-theme-text-primary);
            }
        }
    }

    /* hover */
    @media (hover: hover) {
        &:hover {
            .frame-box {
                .frame-start,
                .frame-end,
                .frame-label,
                .frame-grow,
                .frame-counter {
                    &::before {
                        border-color: var(--c-field-frame-border-color);
                    }
                }
            }
            &:is(.is-inputed, .is-focus) {
                .frame-box {
                    .frame-label {
                        &::before {
                            border-top-color: transparent;
                        }
                    }
                }
            }
        }
    }
    @media (hover: none) {
        &:active {
            .frame-box {
                .frame-start,
                .frame-end,
                .frame-label,
                .frame-grow,
                .frame-counter {
                    --c-field-frame-border-width: 2px;
                }
            }
            &:is(.is-inputed, .is-focus) {
                .frame-box {
                    .frame-label {
                        &::before {
                            border-top-color: transparent;
                        }
                    }
                }
            }
        }
    }
}

.dummy-slot {
    height: 1em;
}

.error {
    font-size: var(--font-size-small);
    color: var(--color-status-danger);
}

/* ▼ variant ▼ */
.primary {
    --c-field-frame-border-color: var(--color-status-brand);
}
.secondary {
    --c-field-frame-border-color: var(--color-theme-border);
}
.info {
    --c-field-frame-border-color: var(--color-status-info);
}
.success {
    --c-field-frame-border-color: var(--color-status-success);
}
.warning {
    --c-field-frame-border-color: var(--color-status-warning);
}
.danger {
    --c-field-frame-border-color: var(--color-status-danger);
}
/* ▲ variant ▲ */

/* ▼ size ▼ */
.large {
    --c-field-frame-height: 40px;
    --c-field-frame-font-size: var(--font-size-medium);
}
.medium {
    --c-field-frame-height: 32px;
    --c-field-frame-font-size: var(--font-size-medium);
}
.small {
    --c-field-frame-height: 24px;
    --c-field-frame-font-size: var(--font-size-small);
}
/* ▲ size ▲ */

/* ▼ shape ▼ */
.rounded {
    .frame-box {
        border-radius: var(--c-field-frame-start-end-padding);
        .frame-start,
        .frame-start::before {
            border-radius: calc(var(--c-field-frame-start-end-padding) * 4) 0 0
                calc(var(--c-field-frame-start-end-padding) * 4);
        }
        .frame-end,
        .frame-end::before {
            width: var(--c-field-frame-start-end-padding);
            border-radius: 0 calc(var(--c-field-frame-start-end-padding) * 4)
                calc(var(--c-field-frame-start-end-padding) * 4) 0;
        }
    }
}
.no-radius {
    .frame-box {
        border-radius: 0;
        .frame-start,
        .frame-end {
            border-radius: 0;
            &::before,
            &::after {
                border-radius: 0;
            }
        }
    }
}
/* ▲ shape ▲ */
</style>
