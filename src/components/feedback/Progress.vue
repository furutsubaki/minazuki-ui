<script setup lang="ts">
import { computed, useSlots, ref } from 'vue';

const model = defineModel<number>({ default: 0 });
const props = withDefaults(
    defineProps<{
        /**
         * 表示色
         */
        variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * 形状
         */
        shape?: 'line' | 'slim-line' | 'circle';
        /**
         * 最大値
         */
        max?: number;
        /**
         * テキストを表示しない
         */
        noText?: boolean;
    }>(),
    {
        variant: 'secondary',
        size: 'medium',
        shape: 'line',
        max: 100,
        noText: false
    }
);

const slots = useSlots();
const hasSlot = (name: string) => {
    return slots[name] ? !!(slots[name] as () => [])()?.length : false;
};

const circleRef = ref();

const progressFullRatio = computed(() => {
    const calc = Math.round((model.value / props.max) * 100);
    return props.max > calc ? calc : props.max;
});
const circumference = computed(() => Math.PI * (20 * 2)); //円周
const strokeDashoffset = computed(
    () => ((100 - progressFullRatio.value) / 100) * circumference.value
);
</script>

<template>
    <div class="component-progress" :class="[variant, size, shape]">
        <div class="progress-bar" v-if="['line', 'slim-line'].includes(shape)" />
        <svg
            v-if="shape === 'circle'"
            ref="circleRef"
            class="progress-circle"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 45.714285714285715 45.714285714285715"
            style="transform: rotate(calc(-90deg));"
        >
            <circle
                class="circle-underlay"
                fill="transparent"
                cx="50%"
                cy="50%"
                r="20"
                stroke="currentColor"
                :stroke-dasharray="circumference"
                stroke-dashoffset="0"
            />
            <circle
                class="circle-overlay"
                fill="transparent"
                cx="50%"
                cy="50%"
                r="20"
                stroke="currentColor"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="strokeDashoffset"
            />
        </svg>
        <slot v-if="hasSlot('default')" />
        <div class="ratio" v-else-if="!noText && shape !== 'slim-line'">
            {{ progressFullRatio }}%
        </div>
    </div>
</template>

<style scoped>
.component-progress {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: var(--c-progress-font-size);
    font-size: var(--c-progress-font-size);
    word-break: keep-all;
    pointer-events: none;
}

.primary {
    --c-progress-background-color: var(--color-status-brand);
}

.secondary {
    --c-progress-background-color: var(--color-theme-text-secondary);
}

.info {
    --c-progress-background-color: var(--color-status-info);
}

.success {
    --c-progress-background-color: var(--color-status-success);
}

.warning {
    --c-progress-background-color: var(--color-status-warning);
}

.danger {
    --c-progress-background-color: var(--color-status-danger);
}

/* ▼ size ▼ */

.large {
    --c-progress-circle-size: 160px;
    --c-progress-font-size: var(--font-size-medium);
    --c-progress-border-stroke-width: calc(var(--font-size-large) / 3);
    .progress-circle {
        .circle-underlay,
        .circle-overlay {
            stroke-width: calc(var(--c-progress-border-stroke-width) / 3);
        }
    }
}

.medium {
    --c-progress-circle-size: 80px;
    --c-progress-font-size: var(--font-size-medium);
    --c-progress-border-stroke-width: calc(var(--font-size-medium) / 3);
    .progress-circle {
        .circle-underlay,
        .circle-overlay {
            stroke-width: calc(var(--c-progress-border-stroke-width) / 2);
        }
    }
}

.small {
    --c-progress-circle-size: 40px;
    --c-progress-font-size: var(--font-size-small);
    --c-progress-border-stroke-width: calc(var(--font-size-small) / 3);
    .progress-circle {
        .circle-underlay,
        .circle-overlay {
            stroke-width: calc(var(--c-progress-border-stroke-width) / 1);
        }
    }
}

/* ▲ size ▲ */

/* ▼ shape ▼ */

.line,
.slim-line {
    min-width: 100px;
    .progress-bar {
        position: relative;
        display: flex;
        width: 100%;
        height: var(--c-progress-border-stroke-width);
        background-color: var(--color-theme-border);
        border-radius: 1em;
        &::before {
            width: v-bind(progressFullRatio + '%');
            height: 100%;
            content: '';
            background-color: var(--c-progress-background-color);
            border-radius: 1em;
            transition: width 0.2s;
        }
    }
    .ratio {
        flex-shrink: 0;
        width: 3em;
        text-align: right;
    }
}

.slim-line {
    height: auto;
}

.circle {
    width: var(--c-progress-circle-size);
    min-width: 50px;
    height: var(--c-progress-circle-size);
    .ratio {
        position: absolute;
        margin: auto;
        text-align: center;
    }
    .progress-circle {
        width: 100%;
        height: 100%;
        .circle-underlay {
            color: var(--color-theme-border);
        }
        .circle-overlay {
            color: var(--c-progress-background-color);
            transition: stroke-dashoffset 0.2s;
        }
    }
}

/* ▲ shape ▲ */
</style>
