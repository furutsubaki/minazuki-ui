/*
 * ==================================================
 * File Name    plugins/Notification.ts
 * Description  通知
 * ==================================================
 */

import { ref } from 'vue';

export interface MiNotificationOption {
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
    shape?: 'normal' | 'no-radius' | 'picture-frame';
    /**
     * 位置
     */
    position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
    /**
     * 影なしか
     */
    noShadow?: boolean;
    /**
     * タイトル
     */
    title?: string;
    /**
     * メッセージ
     */
    message?: string;
    /**
     * 閉じるボタン（NOTE: 本項目とautoRemoveを両方ともfalseにすると通知を消せなくなります）
     */
    closeable?: boolean;
    /**
     * 自動削除（NOTE: 本項目とcloseableを両方ともfalseにすると通知を消せなくなります）
     */
    autoRemove?: boolean;
}

export interface MiRequiredNotification extends Required<MiNotificationOption> {
    key: string;
}

// global state
const notifications = ref<MiRequiredNotification[]>([]);

export default function () {
    const defaultOption: MiRequiredNotification = {
        key: '',
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        position: 'top-right',
        noShadow: false,
        title: '',
        message: '',
        closeable: false,
        autoRemove: true
    };

    const addNotification = (option: MiNotificationOption) => {
        const newNotification = {
            ...defaultOption,
            key: Math.random().toString(),
            ...structuredClone(option)
        };
        notifications.value.push(newNotification);
    };
    const removeNotification = (key: string) => {
        const targetIndex = notifications.value.findIndex((option) => option.key === key);
        if (targetIndex !== -1) {
            notifications.value.splice(targetIndex, 1);
        }
    };

    return { notifications, addNotification, removeNotification };
}
