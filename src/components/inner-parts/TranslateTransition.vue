<script setup lang="ts">
withDefaults(
    defineProps<{
        /**
         * 所要時間
         */
        from?:
            | 'top'
            | 'right'
            | 'bottom'
            | 'left'
            | 'top-rebound'
            | 'right-rebound'
            | 'bottom-rebound'
            | 'left-rebound';
        /**
         * 所要時間
         */
        duration?: string;
        /**
         * 待ち時間
         */
        delay?: string;
        /**
         * イージング関数
         */
        easeFunction?: string;
    }>(),
    {
        from: 'top',
        duration: '0.2s',
        delay: '0s',
        easeFunction: 'ease-in-out'
    }
);

const emit = defineEmits<{
    /**
     * トランジション開始
     */
    transitionStart: [];
    /**
     * トランジション終了
     */
    transitionEnd: [];
}>();

const onTransitionStart = () => {
    emit('transitionStart');
};
const onTransitionEnd = () => {
    emit('transitionEnd');
};
</script>

<template>
    <Transition
        mode="out-in"
        @before-enter="onTransitionStart"
        @after-leave="onTransitionEnd"
        :name="from"
    >
        <slot />
    </Transition>
</template>

<style scoped>
/* 共通 */

.top-rebound-enter-active,
.top-rebound-leave-active,
.right-rebound-enter-active,
.right-rebound-leave-active,
.bottom-rebound-enter-active,
.bottom-rebound-leave-active,
.left-rebound-enter-active,
.left-rebound-leave-active,
.top-enter-active,
.top-leave-active,
.right-enter-active,
.right-leave-active,
.bottom-enter-active,
.bottom-leave-active,
.left-enter-active,
.left-leave-active {
    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    transform: translate(0, 0);
    transition:
        transform v-bind(duration) v-bind(easeFunction) v-bind(delay),
        opacity v-bind(duration) v-bind(easeFunction) v-bind(delay) !important;
}

/* from top-rebound */

.top-rebound-enter-from,
.top-rebound-leave-to {
    opacity: 0 !important;

    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    transform: translateY(-100%);
}

/* from right-rebound */

.right-rebound-enter-from,
.right-rebound-leave-to {
    opacity: 0 !important;

    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    transform: translateX(100%);
}

/* from bottom-rebound */

.bottom-rebound-enter-from,
.bottom-rebound-leave-to {
    opacity: 0 !important;

    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    transform: translateY(100%);
}

/* from left-rebound */

.left-rebound-enter-from,
.left-rebound-leave-to {
    opacity: 0 !important;

    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    transform: translateX(-100vw);
}

/* from top */

.top-enter-from,
.top-leave-to {
    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    opacity: 0 !important;
}

.top-enter-from {
    transform: translateY(-100%);
}

.top-leave-to {
    transform: translateY(100%);
}

/* from right */

.right-enter-from,
.right-leave-to {
    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    opacity: 0 !important;
}

.right-enter-from {
    transform: translateX(100%);
}

.right-leave-to {
    transform: translateX(-100%);
}

/* from bottom */

.bottom-enter-from,
.bottom-leave-to {
    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    opacity: 0 !important;
}

.bottom-enter-from {
    transform: translateY(100%);
}

.bottom-leave-to {
    transform: translateY(-100%);
}

/* from left */

.left-enter-from,
.left-leave-to {
    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    opacity: 0 !important;
}

.left-enter-from {
    transform: translateX(-100vw);
}

.left-leave-to {
    transform: translateX(100vw);
}
</style>
