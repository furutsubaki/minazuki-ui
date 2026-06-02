<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineOptions({ inheritAttrs: false });

const mounted = ref(false);
onMounted(() => {
    mounted.value = true;
});
</script>

<template>
    <Teleport to="body" :disabled="!mounted">
        <slot />
    </Teleport>
</template>
