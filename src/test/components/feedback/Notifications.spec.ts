import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Notifications from '@/components/feedback/Notifications.vue';
import useNotification from '@/composables/useNotification';

const { notifications, notificationHeights } = useNotification();

describe('Notifications', () => {
    beforeEach(() => {
        notifications.value = [];
        notificationHeights.value = {};
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('通知がない場合は何もレンダリングされない', () => {
        const wrapper = mount(Notifications);
        expect(wrapper.find('.component-notification').exists()).toBe(false);
    });

    it('通知がある場合は NotificationItem がレンダリングされる', () => {
        notifications.value = [
            {
                key: 'k1',
                variant: 'info' as const,
                size: 'medium' as const,
                position: 'top-right' as const,
                autoRemove: false,
                closeable: false,
                shape: 'normal' as const,
                noShadow: false,
                title: 'A',
                message: ''
            }
        ];
        const wrapper = mount(Notifications);
        expect(wrapper.find('.component-notification').exists()).toBe(true);
    });

    it('複数の通知が全てレンダリングされる', () => {
        notifications.value = [
            {
                key: 'k1',
                variant: 'info' as const,
                size: 'medium' as const,
                position: 'top-right' as const,
                autoRemove: false,
                closeable: false,
                shape: 'normal' as const,
                noShadow: false,
                title: 'A',
                message: ''
            },
            {
                key: 'k2',
                variant: 'success' as const,
                size: 'medium' as const,
                position: 'top-left' as const,
                autoRemove: false,
                closeable: false,
                shape: 'normal' as const,
                noShadow: false,
                title: 'B',
                message: ''
            }
        ];
        const wrapper = mount(Notifications);
        expect(wrapper.findAll('.component-notification')).toHaveLength(2);
    });
});
