<script setup lang="ts">
withDefaults(
    defineProps<{
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
    <Transition mode="out-in" @before-enter="onTransitionStart" @after-leave="onTransitionEnd">
        <slot />
    </Transition>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    transition: opacity v-bind(duration) v-bind(easeFunction) v-bind(delay) !important;
}

.v-enter-from,
.v-leave-to {
    /* 親側のopacityと競合する場合があるため、こちらを優先とする */
    opacity: 0 !important;
}
</style>
