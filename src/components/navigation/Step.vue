<script setup lang="ts">
import { type Component, ref, computed, useSlots, markRaw } from 'vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';
import Button from '@/components/basic/Button.vue';
import { Check as IconCheck } from '@lucide/vue';

const currentStep = defineModel<string>();
const currentStepIndex = computed(() => {
    return props.steps.findIndex((step) => step.id === currentStep.value);
});
const props = withDefaults(
    defineProps<{
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * タブ配置
         */
        position?: 'top' | 'right' | 'bottom' | 'left';
        /**
         * transition
         */
        transition?: 'translate' | 'opacity';
        /**
         * タブとslotの間のセパレータが不要か
         */
        noSeparator?: boolean;
        /**
         * タブ
         */
        steps: { id: string; label: string; icon?: Component }[];
    }>(),
    {
        size: 'medium',
        position: 'top',
        transition: 'translate',
        noSeparator: false
    }
);
const emit = defineEmits<{
    prev: [prevId: string];
    next: [nextId: string];
}>();

// transition状態
const TransitionComponent = markRaw(
    props.transition === 'opacity' ? OpacityTransition : TranslateTransition
);
const transitionFrom = ref('right');

const onChangeTab = (id: string) => {
    if (id === currentStep.value) return;
    const currentIndex = props.steps.findIndex((step) => step.id === currentStep.value);
    const newIndex = props.steps.findIndex((step) => step.id === id);
    const isPrev = currentIndex > newIndex;
    const transitionFromX = isPrev ? 'left' : 'right';
    const transitionFromY = isPrev ? 'top' : 'bottom';
    transitionFrom.value = ['top', 'bottom'].includes(props.position)
        ? transitionFromX
        : transitionFromY;
    currentStep.value = id;

    if (isPrev) {
        emit('prev', id);
    } else {
        emit('next', id);
    }
};
const onPrev = () => {
    const currentIndex = props.steps.findIndex((step) => step.id === currentStep.value);
    const newIndex = currentIndex - 1;
    const newStepId = props.steps[newIndex].id;
    onChangeTab(newStepId);
};
const onNext = () => {
    const currentIndex = props.steps.findIndex((step) => step.id === currentStep.value);
    const newIndex = currentIndex + 1;
    const newStepId = props.steps[newIndex].id;
    onChangeTab(newStepId);
};

const slots = useSlots();
const hasSlot = (name: string) => {
    return slots[name] ? !!(slots[name] as () => [])()?.length : false;
};
</script>

<template>
    <div class="component-step" :class="[size, position]">
        <div class="step-header" :class="{ 'no-separator': noSeparator }">
            <template v-for="(step, i) in steps" :key="step.id">
                <button
                    type="button"
                    :disabled="currentStepIndex < i"
                    class="step-button"
                    :class="{
                        'is-success': currentStepIndex > i,
                        'is-current': currentStepIndex === i,
                        'is-readonly': currentStep === step.id
                    }"
                    @click="onChangeTab(step.id)"
                >
                    <div class="icon">
                        <component :is="currentStepIndex > i ? IconCheck : step.icon ?? 'div'">
                            <template v-if="!step.icon">{{ i + 1 }} </template>
                        </component>
                    </div>
                    <div class="text">{{ step.label }}</div>
                </button>
                <div
                    class="step-separator"
                    :class="{
                        'is-success': currentStepIndex > i
                    }"
                    v-if="steps.length !== i + 1"
                />
            </template>
        </div>
        <div class="step-content">
            <component :is="TransitionComponent" :from="transitionFrom">
                <div class="step-slot" :key="currentStep">
                    <template v-for="step in steps" :key="step.id">
                        <slot v-if="currentStep === step.id" :name="step.id" />
                    </template>
                </div>
            </component>
            <div
                v-if="hasSlot(steps[0].id)"
                class="step-footer"
                :class="{ 'no-separator': noSeparator }"
            >
                <Button :size="size" :disabled="currentStepIndex === 0" label="Prev" @click="onPrev" />
                <Button
                    variant="success"
                    :size="size"
                    :disabled="currentStepIndex + 1 === steps.length"
                    label="Next"
                    @click="onNext"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.component-step {
    display: flex;
    .step-header {
        position: relative;
        display: flex;
        flex-shrink: 0;
        gap: var(--space-sm);
        align-items: flex-start;
        justify-content: space-between;
        overflow: scroll;
        :deep(.component-button) {
            flex-shrink: 0;
            padding: 0 1em;
        }
        .step-button {
            display: flex;
            flex-direction: column;
            gap: 0;
            align-items: center;
            width: var(--c-step-button-height);
            padding: 0;
            font-size: var(--c-step-font-size, var(--font-size-medium));
            color: inherit;
            cursor: pointer;
            background: transparent;
            border: 0;
            transition:
                opacity var(--duration-fast),
                color var(--duration-fast);
            &:disabled,
            &.is-readonly {
                cursor: not-allowed;
                opacity: 0.5;
            }
            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: var(--c-step-icon-size);
                height: var(--c-step-icon-size);
                padding: var(--space-xs);
                color: var(--color-bg-secondary);
                background-color: var(--color-text-secondary);
                border-radius: var(--radius-circle);
                transition: background-color var(--duration-fast);
            }
            .text {
                width: 100px;
                text-align: center;
                word-break: break-all;
                transform: scale(0.8);
                transition: transform var(--duration-fast);
            }
            &.is-current {
                /* Buttonコンポーネント自身がこの変数でcolorを確定するため、継承ではなく直接上書きする */
                --c-button-color: var(--color-brand);
                .icon {
                    background-color: var(--color-brand);
                }
                .text {
                    transform: scale(1);
                }
            }
            &.is-success {
                color: var(--color-success);
                .icon {
                    background-color: var(--color-success);
                }
            }
        }
        .step-separator {
            position: relative;
            background-color: var(--color-border);
            &::before {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                margin: auto;
                content: '';
                background-color: var(--color-success);
                transform: scale(0);
                transition: transform var(--duration-fast);
            }
        }
    }
    .step-content {
        display: flex;
        flex-direction: column;
        min-height: 0;
    }
    .step-slot {
        flex-grow: 1;
        min-height: 0;
        overflow-y: auto;
    }
    .step-footer {
        display: flex;
        flex-shrink: 0;
        justify-content: space-between;
        margin-top: var(--space-sm);
        &:not(.no-separator) {
            padding-top: var(--space-sm);
            border-top: 1px solid var(--color-border);
        }
    }
}

/* ▼ size ▼ */

.large {
    --c-step-button-height: 40px;
    --c-step-icon-size: 24px;
}

.medium {
    --c-step-button-height: 32px;
    --c-step-icon-size: 20px;
}

.small {
    --c-step-button-height: 24px;
    --c-step-icon-size: 16px;
}

/* ▲ size ▲ */

/* ▼ position ▼ */

.top {
    flex-direction: column;
    width: 100%;
    .step-header {
        padding: var(--space-sm) var(--space-lg);
        &:not(.no-separator) {
            margin-bottom: var(--space-sm);
            border-bottom: 1px solid var(--color-border);
        }
        .step-separator {
            top: calc(var(--c-step-icon-size) / 2);
            width: 100%;
            height: 2px;
            &::before {
                transform-origin: left;
            }
            &.is-success {
                &::before {
                    transform: scaleX(1);
                }
            }
        }
    }
}

.right {
    flex-direction: row-reverse;
    height: 100%;
    .step-header {
        flex-direction: column;
        padding: var(--space-lg) var(--space-sm);
        &:not(.no-separator) {
            margin-left: var(--space-sm);
            border-left: 1px solid var(--color-border);
        }
        .step-separator {
            width: 2px;
            height: 100%;
            margin: 0 auto;
            &::before {
                transform-origin: top;
            }
            &.is-success {
                &::before {
                    transform: scaleY(1);
                }
            }
        }
    }
}

.bottom {
    flex-direction: column-reverse;
    width: 100%;
    .step-header {
        padding: var(--space-sm) var(--space-lg);
        &:not(.no-separator) {
            margin-top: var(--space-sm);
            border-top: 1px solid var(--color-border);
        }
        .step-separator {
            top: calc(var(--c-step-icon-size) / 2);
            width: 100%;
            height: 2px;
            &::before {
                transform-origin: left;
            }
            &.is-success {
                &::before {
                    transform: scaleX(1);
                }
            }
        }
    }
}

.left {
    flex-direction: row;
    height: 100%;
    .step-header {
        flex-direction: column;
        padding: var(--space-lg) var(--space-sm);
        &:not(.no-separator) {
            margin-right: var(--space-sm);
            border-right: 1px solid var(--color-border);
        }
        .step-separator {
            width: 2px;
            height: 100%;
            margin: 0 auto;
            &::before {
                transform-origin: top;
            }
            &.is-success {
                &::before {
                    transform: scaleY(1);
                }
            }
        }
    }
}

/* ▲ position ▲ */
</style>
