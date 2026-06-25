<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Button from '@/components/basic/Button.vue';
import { Star as IconStar } from 'lucide-vue-next';

const model = defineModel<number>({ default: 0 });
const props = withDefaults(
    defineProps<{
        /**
         * 表示色
         */
        variant?: 'dynamic' | 'flat';
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * 表示個数
         */
        length?: number;
        /**
         * 0.5刻みにするか
         */
        half?: boolean;
        /**
         * 削除ボタン
         */
        clearable?: boolean;
        /**
         * 読み込み専用
         */
        readonly?: boolean;
    }>(),
    {
        variant: 'dynamic',
        size: 'medium',
        length: 5,
        half: false,
        clearable: false,
        readonly: false
    }
);

const HALF_STEP = 0.5;
const ratings = computed(() =>
    [...Array(props.length).keys()].map((i) => {
        const button = [
            {
                value: i + 1,
                classes: 'integer'
            }
        ];
        if (props.half) {
            button.push({
                value: i + 1 - HALF_STEP,
                classes: 'half'
            });
        }
        return button;
    })
);
const dynamicColors = computed(() => {
    const ratingLength = ratings.value.length;
    const MAX = 100;
    const MIN = 50;
    return [...Array(ratings.value.length).keys()].map((i) => {
        const step = (MAX - MIN) / ratingLength;
        return step * (i + 1) + MIN + '%';
    });
});
const hoverValue = ref(model.value);
const onHover = (value: number) => {
    hoverValue.value = value;
};
const onLeave = () => {
    hoverValue.value = model.value;
};
const onClick = (value: number) => {
    if (props.readonly) {
        return;
    }

    if (props.clearable && model.value === value) {
        model.value = 0;
    } else {
        model.value = value;
    }
};
watch(model, (v) => {
    hoverValue.value = v;
});
</script>

<template>
    <div class="component-rating" :class="[variant, size]">
        <div class="rate" v-for="(rate, i) in ratings" :key="i">
            <Button
                class="button"
                :class="[
                    r.classes,
                    {
                        'is-over':
                            (model >= r.value && hoverValue >= r.value) || hoverValue >= r.value
                    }
                ]"
                :size="size"
                shape="link"
                :readonly="readonly"
                :style="`opacity: ${variant === 'dynamic' ? dynamicColors[i] : '100%'}`"
                @mouseover="onHover(r.value)"
                @mouseleave="onLeave"
                @click="onClick(r.value)"
                v-for="r in rate"
                :key="r.value"
            >
                <IconStar class="icon" />
            </Button>
        </div>
    </div>
</template>

<style scoped>
.component-rating {
    display: flex;
    gap: 8px;
    justify-content: center;
    min-width: 100px;
    min-height: var(--c-rating-height);
    font-size: var(--c-rating-font-size);
    color: var(--c-rating-color);
    transition:
        color 0.2s,
        background-color 0.2s;
    .rate {
        position: relative;
        display: flex;
        .button {
            .icon {
                width: var(--c-rating-height);
                height: var(--c-rating-height);
                color: var(--c-rating-color);
                fill: transparent;
                transition:
                    color 0.2s,
                    fill 0.2s;
            }
            &.is-over {
                background-color: transparent;
                .icon {
                    fill: var(--c-rating-background-color);
                }
            }
            &.half {
                position: absolute;
                left: 0;
                width: calc(var(--c-rating-height) / 2);
                height: var(--c-rating-height);
                overflow: hidden;
                .icon {
                    position: absolute;
                    top: 0;
                    left: 0;
                    max-inline-size: initial;
                }
            }
        }
    }
}

.dynamic {
    :deep(.icon) {
        --c-rating-color: var(--color-base-orange) !important;
        --c-rating-background-color: var(--color-base-orange) !important;
    }
}

.flat {
    :deep(.icon) {
        --c-rating-color: var(--color-base-orange) !important;
        --c-rating-background-color: var(--color-base-orange) !important;
    }
}

/* ▼ size ▼ */

.large {
    --c-rating-height: 32px;
    --c-rating-font-size: var(--font-size-large);
}

.medium {
    --c-rating-height: 24px;
    --c-rating-font-size: var(--font-size-medium);
}

.small {
    --c-rating-height: 16px;
    --c-rating-font-size: var(--font-size-small);
}

/* ▲ size ▲ */
</style>
