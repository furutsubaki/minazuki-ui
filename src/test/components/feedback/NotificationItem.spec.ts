import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import NotificationItem from '@/components/feedback/NotificationItem.vue';
import useNotification from '@/composables/useNotification';
import Frame from '@/components/frame/Frame.vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import {
    Info,
    CheckCircle2,
    AlertTriangle,
    XOctagon
} from '@lucide/vue';

const { notifications, notificationHeights } = useNotification();

const baseNotification = {
    key: 'test-key',
    variant: 'info' as const,
    size: 'medium' as const,
    position: 'top-right' as const,
    autoRemove: false,
    closeable: true,
    shape: 'normal' as const,
    noShadow: false,
    title: 'テストタイトル',
    message: 'テストメッセージ'
};

describe('NotificationItem', () => {
    beforeEach(() => {
        notifications.value = [baseNotification];
        notificationHeights.value = {};
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it.each([
        ['.title', 'テストタイトル'],
        ['.message', 'テストメッセージ']
    ])('%s が表示される', (selector, expected) => {
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        expect(wrapper.find(selector).text()).toBe(expected);
    });

    it('closeable のとき閉じるボタンが表示される', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, closeable: true } }
        });
        expect(wrapper.find('.closeable-box').exists()).toBe(true);
    });

    it('closeable が false のとき閉じるボタンが表示されない', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, closeable: false } }
        });
        expect(wrapper.find('.closeable-box').exists()).toBe(false);
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, variant: 'danger' as const } }
        });
        expect(wrapper.find('.notification').classes()).toContain('danger');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, size: 'large' as const } }
        });
        expect(wrapper.find('.notification').classes()).toContain('large');
    });

    it('autoRemove が true のとき 5秒後に自動で閉じる', async () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, autoRemove: true } }
        });
        await vi.advanceTimersByTimeAsync(5000);
        await vi.runAllTimersAsync();
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });

    it('autoRemove が false のとき 5秒経過しても自動で閉じない', async () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await vi.advanceTimersByTimeAsync(6000);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeFalsy();
    });

    it('shape="picture-frame" のとき PictureFrame コンポーネントが使われる', () => {
        const notification = { ...baseNotification, shape: 'picture-frame' as any };
        notifications.value = [notification];
        const wrapper = mount(NotificationItem, {
            props: { notification }
        });
        expect(wrapper.findComponent(PictureFrame).exists()).toBe(true);
        expect(wrapper.findComponent(Frame).exists()).toBe(false);
    });

    it('shape が picture-frame でないとき Frame コンポーネントが使われる', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        expect(wrapper.findComponent(Frame).exists()).toBe(true);
        expect(wrapper.findComponent(PictureFrame).exists()).toBe(false);
    });

    it('shape="no-radius" のとき Frame に shape が渡される', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, shape: 'no-radius' as const } }
        });
        expect(wrapper.findComponent(Frame).props('shape')).toBe('no-radius');
    });

    it('noShadow=true のとき Frame に noShadow が渡される', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, noShadow: true } }
        });
        expect(wrapper.findComponent(Frame).props('noShadow')).toBe(true);
    });

    it.each([
        ['top-right', 'right-rebound'],
        ['top-left', 'left-rebound'],
        ['top-center', undefined]
    ])('position="%s" のとき transitionFrom が正しく設定される', (position, expectedFrom) => {
        const notification = { ...baseNotification, key: `${position}-key`, position: position as any };
        notifications.value = [notification];
        const wrapper = mount(NotificationItem, {
            props: { notification }
        });
        expect((wrapper.vm as any).transitionFrom).toBe(expectedFrom);
    });

    it('positionStyle が正しい CSS を生成する（top-right 単独）', async () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await nextTick();
        const style = wrapper.find('.notification').attributes('style') ?? '';
        expect(style).toContain('top: 16px');
        expect(style).toContain('right: 16px');
    });

    it('positionStyle の ?? 0 フォールバック: 高さ未登録の先行通知を 0 として計算する', async () => {
        const noHeightNotification = { ...baseNotification, key: 'no-height-key' };
        notifications.value = [noHeightNotification, baseNotification];
        notificationHeights.value = {};
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await nextTick();
        const style = wrapper.find('.notification').attributes('style') ?? '';
        expect(style).toContain('top: 32px');
        expect(style).toContain('right: 16px');
    });

    it('複数の通知が同じ位置にある場合 positionStyle の reduce が実行される', async () => {
        const firstNotification = { ...baseNotification, key: 'first-key' };
        notifications.value = [firstNotification, baseNotification];
        notificationHeights.value = { 'first-key': 100 };
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await nextTick();
        const style = wrapper.find('.notification').attributes('style') ?? '';
        expect(style).toContain('top: 132px');
        expect(style).toContain('right: 16px');
    });

    it('positionStyle が bottom-left 位置で正しく bottom/left を使う', async () => {
        const notification = {
            ...baseNotification,
            key: 'bottom-left-key',
            position: 'bottom-left' as const
        };
        notifications.value = [notification];
        const wrapper = mount(NotificationItem, {
            props: { notification }
        });
        await nextTick();
        const style = wrapper.find('.notification').attributes('style') ?? '';
        expect(style).toContain('bottom: 16px');
        expect(style).toContain('left: 16px');
    });

    it('mount 後に flg が true になり isShowing が true を返す', async () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await nextTick();
        const vm = wrapper.vm as any;
        expect(vm.isShowing).toBe(true);
    });

    it('ResizeObserver コールバックで notificationHeight が更新される', async () => {
        let observerCallback: ((entries: ResizeObserverEntry[]) => void) | undefined;
        vi.stubGlobal('ResizeObserver', vi.fn(function (callback: (entries: ResizeObserverEntry[]) => void) {
            observerCallback = callback;
            return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
        }));
        mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await nextTick();
        if (observerCallback) {
            observerCallback([{ contentRect: { height: 80 } } as any]);
            await nextTick();
        }
        expect(observerCallback).toBeDefined();
        vi.unstubAllGlobals();
    });

    it('アンマウント時に ResizeObserver が disconnect される', async () => {
        const disconnectFn = vi.fn();
        vi.stubGlobal('ResizeObserver', vi.fn(function () {
            return {
                observe: vi.fn(),
                disconnect: disconnectFn,
                unobserve: vi.fn()
            };
        }));
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await nextTick();
        wrapper.unmount();
        expect(disconnectFn).toHaveBeenCalled();
        vi.unstubAllGlobals();
    });

    it.each([
        ['info', Info],
        ['success', CheckCircle2],
        ['warning', AlertTriangle],
        ['danger', XOctagon]
    ])('variant="%s" のとき対応アイコンが表示される', (variant, IconComponent) => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, variant: variant as any } }
        });
        expect(wrapper.findComponent(IconComponent).exists()).toBe(true);
    });

    it.each([
        ['primary'],
        ['secondary']
    ])('variant="%s" のときアイコンが表示されない', (variant) => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, variant: variant as any } }
        });
        expect(wrapper.findAll('.icon')).toHaveLength(0);
    });

    it('title がない場合 title 要素が表示されない', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, title: undefined } as any }
        });
        expect(wrapper.find('.title').exists()).toBe(false);
    });

    it('message がない場合 message 要素が表示されない', () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, message: undefined } as any }
        });
        expect(wrapper.find('.message').exists()).toBe(false);
    });

    it('OpacityTransition の transition-start/end イベントで transitioning が更新される', async () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        const ot = wrapper.findComponent(OpacityTransition);
        const vm = wrapper.vm as any;

        await ot.vm.$emit('transitionStart');
        await nextTick();
        expect(vm.transitioning).toBe(true);

        await ot.vm.$emit('transitionEnd');
        await nextTick();
        expect(vm.transitioning).toBe(false);
    });

    it('isShowing: flg=false かつ transitioning=true のとき true を返す', async () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await nextTick();
        const vm = wrapper.vm as any;

        vm.flg = false;
        vm.transitioning = true;
        await nextTick();
        expect(vm.isShowing).toBe(true);

        vm.transitioning = false;
        await nextTick();
        expect(vm.isShowing).toBe(false);
    });

    it('閉じるボタンクリックで通知が削除され closed イベントが発火する', async () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: { ...baseNotification, closeable: true } }
        });
        await nextTick();
        await wrapper.find('.closeable-box').trigger('click');
        await vi.runAllTimersAsync();
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
        expect(notifications.value.find((n) => n.key === 'test-key')).toBeUndefined();
    });

    it('onClosed: isShowing が true のとき sleep して再帰する', async () => {
        const wrapper = mount(NotificationItem, {
            props: { notification: baseNotification }
        });
        await nextTick();
        const vm = wrapper.vm as any;

        // flg=true の状態で onClosed を直接呼ぶ → if(isShowing) ブランチに入る
        vm.onClosed();
        // flg を false にして次の onClosed 再帰呼び出しで isShowing=false にする
        vm.flg = false;
        await vi.advanceTimersByTimeAsync(100);
        await vi.runAllTimersAsync();
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
        expect(notifications.value.find((n) => n.key === 'test-key')).toBeUndefined();
    });
});
