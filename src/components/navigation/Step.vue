<script setup lang="ts">
import { type Component, ref, computed, useSlots } from 'vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';
import Button from '@/components/basic/Button.vue';
import { Check as IconCheck } from 'lucide-vue-next';

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
const TransitionComponent =
    props.transition === 'opacity' ? OpacityTransition : TranslateTransition;
const transitionFrom = ref('right');

const onChangeTab = (id: string) => {
    const currentIndex = props.steps.findIndex((step) => step.id === currentStep.value);
    const newIndex = props.steps.findIndex((step) => step.id === id);
    const isPrev = currentIndex > newIndex;
    const transitionFromX = isPrev ? 'left' : 'right';
    const transitionFromY = isPrev ? 'top' : 'bottom';
    transitionFrom.value = ['top', 'bottom'].includes(props.position)
        ? transitionFromX
        : transitionFromY;

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
                <Button
                    :size="size"
                    shape="skeleton"
                    :readonly="currentStep === step.id"
                    :disabled="currentStepIndex < i"
                    class="step-button"
                    :class="{
                        'is-success': currentStepIndex > i,
                        'is-current': currentStepIndex === i
                    }"
                    @click="onChangeTab(step.id)"
                >
                    <div class="icon">
                        <component :is="currentStepIndex > i ? IconCheck : step.icon ?? 'div'">
                            <template v-if="!step.icon">{{ i + 1 }} </template>
                        </component>
                    </div>
                    <div class="text">{{ step.label }}</div>
                </Button>
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
                <Button :size="size" :disabled="currentStepIndex === 0" @click="onPrev"
                    >Prev</Button
                >
                <Button
                    variant="success"
                    :size="size"
                    :disabled="currentStepIndex + 1 === steps.length"
                    @click="onNext"
                    >Next</Button
                >
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
        gap: 8px;
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
            width: var(--c-step-button-height);
            padding: 0;
            transition:
                opacity 0.2s,
                color 0.2s;
            .icon {
                display: flex;
                align-items: center;
                justify-content: center;
                width: var(--c-step-icon-size);
                height: var(--c-step-icon-size);
                padding: 4px;
                color: var(--color-theme-bg-secondary);
                background-color: var(--color-theme-text-secondary);
                border-radius: 50%;
                transition: background-color 0.2s;
            }
            .text {
                width: 100px;
                text-align: center;
                word-break: break-word;
                transform: scale(0.8);
                transition: transform 0.2s;
            }
            &.is-current {
                .text {
                    transform: scale(1);
                }
            }
            &.is-success {
                color: var(--color-status-success);
                .icon {
                    background-color: var(--color-status-success);
                }
            }
        }
        .step-separator {
            position: relative;
            background-color: var(--color-theme-border);
            &::before {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                margin: auto;
                content: '';
                background-color: var(--color-status-success);
                transform: scale(0);
                transition: transform 0.2s;
            }
        }
    }
    .step-content {
        display: flex;
        flex-direction: column;
    }
    .step-slot {
        flex-grow: 1;
        height: 100%;
        overflow-y: auto;
    }
    .step-footer {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        &:not(.no-separator) {
            padding-top: 8px;
            border-top: 1px solid var(--color-theme-border);
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
        padding: 8px 24px;
        &:not(.no-separator) {
            margin-bottom: 8px;
            border-bottom: 1px solid var(--color-theme-border);
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
        padding: 24px 8px;
        &:not(.no-separator) {
            margin-left: 8px;
            border-left: 1px solid var(--color-theme-border);
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
        padding: 8px 24px;
        &:not(.no-separator) {
            margin-top: 8px;
            border-top: 1px solid var(--color-theme-border);
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
        padding: 24px 8px;
        &:not(.no-separator) {
            margin-right: 8px;
            border-right: 1px solid var(--color-theme-border);
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
