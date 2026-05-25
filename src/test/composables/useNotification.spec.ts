import { describe, it, expect, beforeEach } from 'vitest';
import useNotification from '@/composables/useNotification';

describe('useNotification', () => {
    const { notifications, notificationHeights, addNotification, removeNotification, setNotificationHeight } =
        useNotification();

    beforeEach(() => {
        notifications.value = [];
        notificationHeights.value = {};
    });

    it('addNotification が通知を追加する', () => {
        addNotification({ title: 'テスト', message: 'メッセージ' });
        expect(notifications.value).toHaveLength(1);
        expect(notifications.value[0].title).toBe('テスト');
        expect(notifications.value[0].message).toBe('メッセージ');
    });

    it('addNotification がデフォルト値を適用する', () => {
        addNotification({});
        const n = notifications.value[0];
        expect(n.variant).toBe('secondary');
        expect(n.size).toBe('medium');
        expect(n.position).toBe('top-right');
        expect(n.autoRemove).toBe(true);
    });

    it('addNotification が一意の key を付与する', () => {
        addNotification({});
        addNotification({});
        expect(notifications.value[0].key).not.toBe(notifications.value[1].key);
    });

    it('removeNotification が対象通知を削除する', () => {
        addNotification({ title: 'A' });
        const key = notifications.value[0].key;
        removeNotification(key);
        expect(notifications.value).toHaveLength(0);
    });

    it('removeNotification が存在しない key で何もしない', () => {
        addNotification({});
        removeNotification('non-existent');
        expect(notifications.value).toHaveLength(1);
    });

    it('setNotificationHeight が高さを保存する', () => {
        setNotificationHeight('key-1', 80);
        expect(notificationHeights.value['key-1']).toBe(80);
    });

    it('removeNotification が対応する高さも削除する', () => {
        addNotification({});
        const key = notifications.value[0].key;
        setNotificationHeight(key, 60);
        removeNotification(key);
        expect(notificationHeights.value[key]).toBeUndefined();
    });
});
