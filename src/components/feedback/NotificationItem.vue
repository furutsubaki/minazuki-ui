<script setup lang="ts">
import { ref, onMounted } from 'vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';
import Frame from '@/components/frame/Frame.vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';
import Button from '@/components/basic/Button.vue';
import { computed } from 'vue';
import { sleep } from '@/assets/ts';
import {
    X as IconX,
    Info as IconInfo,
    CheckCircle2 as IconCheckCircle2,
    AlertTriangle as IconAlertTriangle,
    XOctagon as IconXOctagon
} from 'lucide-vue-next';
import useNotification, { type MiRequiredNotification } from '@/composables/useNotification';

const props = defineProps<{
    notification: MiRequiredNotification;
}>();
const emit = defineEmits<{
    /**
     * 閉じた
     */
    closed: [];
}>();

type FrameShape = 'normal' | 'no-radius' | 'circle';
const component = computed(() => {
    if (props.notification.shape === 'picture-frame') {
        return PictureFrame;
    } else {
        return Frame;
    }
});

const flg = ref(false);
const { notifications, removeNotification } = useNotification();

// 表示位置調整
const transitionFrom = computed(() => {
    if (props.notification.position.split('-')[1] === 'right') {
        return 'right-rebound';
    } else if (props.notification.position.split('-')[1] === 'left') {
        return 'left-rebound';
    } else {
        return undefined;
    }
});
const positionY = props.notification.position.split('-')[0] as 'top' | 'bottom';
const positionX = props.notification.position.split('-')[1] as 'right' | 'left';
const POSITION_GAP = 16;
const positionStyle = computed(() => {
    const filteredPositions = notifications.value.filter(
        (notification) =>
            notification.position.includes(positionY) && notification.position.includes(positionX)
    );
    const currentPositionIndex = filteredPositions.findIndex(
        (notification) => notification.key === props.notification.key
    );
    const filteredNotificationNodes = Array.from(
        document.querySelectorAll(
            `[data-notification-x="${positionX}"][data-notification-y="${positionY}"]`
        )
    ) as HTMLElement[];
    let filteredNotificationCurrentNodeIndex = filteredNotificationNodes.findIndex(
        (node) => node.dataset.notificationKey === props.notification.key
    );
    filteredNotificationCurrentNodeIndex =
        filteredNotificationCurrentNodeIndex !== -1
            ? filteredNotificationCurrentNodeIndex
            : filteredNotificationNodes.length;
    const filteredNotificationPreHeight = filteredNotificationNodes.reduce(
        (all, node, i) =>
            i < filteredNotificationCurrentNodeIndex
                ? all + node.getBoundingClientRect().height
                : all,
        0
    );
    const positionYGap = (currentPositionIndex + 1) * POSITION_GAP + filteredNotificationPreHeight;
    return `${positionY}: ${positionYGap}px; ${positionX}: ${POSITION_GAP}px`;
});

// transition状態
const transitioning = ref(false);
const isShowing = computed(() => {
    if (flg.value) {
        return true;
    } else {
        return transitioning.value;
    }
});

const onClose = async () => {
    flg.value = false;
    await onClosed();
};
const onClosed = async () => {
    if (isShowing.value) {
        await sleep(100);
        onClosed();
    } else {
        removeNotification(props.notification.key);
        emit('closed');
    }
};

onMounted(async () => {
    flg.value = true;

    if (props.notification.autoRemove) {
        await sleep(5000);
        onClose();
    }
});
</script>

<template>
    <OpacityTransition
        @transition-start="transitioning = true"
        @transition-end="transitioning = false"
    >
        <div v-show="flg" class="component-notification">
            <TranslateTransition
                :from="transitionFrom"
                @transition-start="transitioning = true"
                @transition-end="transitioning = false"
            >
                <component
                    :is="component"
                    :data-notification-x="positionX"
                    :data-notification-y="positionY"
                    :data-notification-key="notification.key"
                    v-show="flg"
                    class="notification"
                    :class="[notification.variant, notification.size]"
                    :style="positionStyle"
                    :noShadow="notification.noShadow"
                    :shape="notification.shape as FrameShape"
                >
                    <div class="notification-inner">
                        <IconInfo v-if="notification.variant === 'info'" class="icon" />
                        <IconCheckCircle2
                            v-else-if="notification.variant === 'success'"
                            class="icon"
                        />
                        <IconAlertTriangle
                            v-else-if="notification.variant === 'warning'"
                            class="icon"
                        />
                        <IconXOctagon v-else-if="notification.variant === 'danger'" class="icon" />
                        <div class="box">
                            <div v-if="notification.title" class="title">
                                {{ notification.title }}
                            </div>
                            <div v-if="notification.message" class="message">
                                {{ notification.message }}
                            </div>
                        </div>
                        <Button
                            v-if="notification.closeable"
                            shape="skeleton"
                            class="closeable-box"
                            @click="onClose"
                        >
                            <IconX />
                        </Button>
                    </div>
                </component>
            </TranslateTransition>
        </div>
    </OpacityTransition>
</template>

<style scoped>
.component-notification {
    z-index: 10000;
}

.notification {
    position: fixed;
    width: var(--c-notification-item-width);
    margin: auto;
    pointer-events: initial;
    transition:
        top 0.2s,
        bottom 0.2s,
        border-color 0.2s,
        opacity 0.2s;
    .notification-inner {
        display: flex;
        gap: 8px;
        align-items: flex-start;
        justify-content: center;
        padding: 8px;
        background-color: var(--color-theme-bg-primary);
        .icon {
            flex-shrink: 0;
            width: calc(var(--font-size-medium) * 1.8);
            height: calc(var(--font-size-medium) * 1.8);
            color: var(--color-theme-bg-primary);
            fill: var(--c-notification-item-icon-color);
        }
        .box {
            position: relative;
            display: flex;
            flex-grow: 1;
            flex-direction: column;
            gap: 8px;
            > div:first-child {
                display: flex;
                align-items: center;
                height: calc(var(--font-size-medium) * 1.8);
            }
            .title {
                font-size: var(--font-size-large);
                font-weight: bold;
            }
            .message {
                font-size: var(--font-size-medium);
                white-space: pre-wrap;
            }
        }
        .closeable-box {
            flex-shrink: 0;
        }
    }
}

/* ▼ variant ▼ */

.primary {
    --c-notification-item-border-color: var(--color-status-brand);
    --c-notification-item-icon-color: var(--color-status-brand);
}

.secondary {
    --c-notification-item-border-color: var(--color-theme-border);
    --c-notification-item-icon-color: var(--color-theme-border);
}

.info {
    --c-notification-item-border-color: var(--color-status-info);
    --c-notification-item-icon-color: var(--color-status-info);
}

.success {
    --c-notification-item-border-color: var(--color-status-success);
    --c-notification-item-icon-color: var(--color-status-success);
}

.warning {
    --c-notification-item-border-color: var(--color-status-warning);
    --c-notification-item-icon-color: var(--color-status-warning);
}

.danger {
    --c-notification-item-border-color: var(--color-status-danger);
    --c-notification-item-icon-color: var(--color-status-danger);
}

/* ▲ variant ▲ */

/* ▼ size ▼ */

.large {
    --c-notification-item-width: clamp(320px, 40vw, 480px);
}

.medium {
    --c-notification-item-width: clamp(240px, 32vw, 360px);
}

.small {
    --c-notification-item-width: clamp(200px, 24vw, 300px);
}

/* ▲ size ▲ */
</style>
