<script setup lang="ts">
import TeleportRoot from '@/components/inner-parts/TeleportRoot.vue';
import useNotification from '@/composables/useNotification';
import NotificationItem from '@/components/feedback/NotificationItem.vue';

const { notifications } = useNotification();
</script>

<template>
    <TeleportRoot>
        <NotificationItem
            v-for="notification in notifications"
            :key="notification.key"
            :notification="notification"
        />
    </TeleportRoot>
</template>
