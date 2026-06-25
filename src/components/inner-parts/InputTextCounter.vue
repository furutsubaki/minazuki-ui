<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        text: string | undefined;
        max: number;
    }>(),
    {}
);
const currentTextCount = computed(() => props.text?.length || 0);
</script>

<template>
    <span class="component-counter" :class="{ 'is-error': currentTextCount > max }"
        >{{ currentTextCount }}/{{ max }}</span
    >
</template>

<style scoped>
.component-counter {
    font-size: var(--font-size-small);
    &.is-error {
        color: var(--color-status-danger);
    }
}
</style>
