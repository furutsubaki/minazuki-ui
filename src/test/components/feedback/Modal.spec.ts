import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Modal from '@/components/feedback/Modal.vue';

describe('Modal', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.documentElement.style.overflow = '';
    });

    it('v-model が true のとき modal が open になる', () => {
        const wrapper = mount(Modal, { props: { modelValue: true } });
        const dialog = wrapper.find('.component-modal').element as HTMLDialogElement;
        expect(dialog.open).toBe(true);
    });

    it('v-model が false のとき modal が open にならない', () => {
        const wrapper = mount(Modal, { props: { modelValue: false } });
        const dialog = wrapper.find('.component-modal').element as HTMLDialogElement;
        expect(dialog.open).toBe(false);
    });

    it('title が指定されたとき .title が表示される', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, title: 'テストタイトル' } });
        expect(wrapper.find('.title').text()).toBe('テストタイトル');
    });

    it('title がないとき .title が表示されない', () => {
        const wrapper = mount(Modal, { props: { modelValue: true } });
        expect(wrapper.find('.title').exists()).toBe(false);
    });

    it.each([
        ['size', 'large'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Modal, { props: { modelValue: true, [prop]: value } });
        expect(wrapper.find('.modal').classes()).toContain(value);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Modal, {
            props: { modelValue: true },
            slots: { default: '<p class="content">内容</p>' }
        });
        expect(wrapper.find('.content').exists()).toBe(true);
    });

    it('閉じるボタンをクリックすると v-model が false になる', async () => {
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.closeable-box').trigger('click');
        expect(wrapper.props('modelValue')).toBe(false);
    });

    it('閉じるボタンクリックで closed イベントが発火する', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.closeable-box').trigger('click');
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });

    it.each([
        ['top', 'from-top'],
        ['right', 'from-right'],
        ['bottom', 'from-bottom'],
        ['left', 'from-left']
    ])('transitionFrom="%s" が modal に %s クラスとして反映される', (transitionFrom, expectedClass) => {
        const wrapper = mount(Modal, { props: { modelValue: true, transitionFrom: transitionFrom as any } });
        expect(wrapper.find('.component-modal').classes()).toContain(expectedClass);
    });

    it('transitionFrom が opacity のとき方向クラスが付かない', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, transitionFrom: 'opacity' } });
        const classes = wrapper.find('.component-modal').classes();
        expect(classes).not.toContain('from-top');
        expect(classes).not.toContain('from-right');
        expect(classes).not.toContain('from-bottom');
        expect(classes).not.toContain('from-left');
    });

    it('backdrop クリックで closed イベントが発火する', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-modal');
        await dialog.trigger('click');
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });

    it('persistent のとき backdrop クリックで閉じない', async () => {
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                persistent: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-modal');
        await dialog.trigger('click');
        expect(wrapper.props('modelValue')).toBe(true);
    });

    it('persistent のとき cancel イベントで閉じない', async () => {
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                persistent: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-modal');
        await dialog.trigger('cancel');
        expect(wrapper.props('modelValue')).toBe(true);
    });

    it('persistent でないとき cancel で閉じる', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-modal');
        await dialog.trigger('cancel');
        expect(wrapper.props('modelValue')).toBe(false);
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });

    it('center prop のとき is-center クラスが付く', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, center: true } });
        expect(wrapper.find('.modal').classes()).toContain('is-center');
    });

    it('isFullSizeBySp prop のとき is-full-size-by-sp クラスが付く', () => {
        const wrapper = mount(Modal, { props: { modelValue: true, isFullSizeBySp: true } });
        expect(wrapper.find('.modal').classes()).toContain('is-full-size-by-sp');
    });

    it('v-model が false → true に変わると overflow が hidden になる', async () => {
        const wrapper = mount(Modal, { props: { modelValue: false } });
        await wrapper.setProps({ modelValue: true });
        expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('v-model が true → false で overflow が解除される', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        expect(document.documentElement.style.overflow).toBe('hidden');
        await wrapper.setProps({ modelValue: false });
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('unmount 時に overflow がリセットされる', () => {
        const wrapper = mount(Modal, { props: { modelValue: true } });
        expect(document.documentElement.style.overflow).toBe('hidden');
        wrapper.unmount();
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('modal-panel のクリックは backdrop クリックとして扱われない', async () => {
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.modal-panel').trigger('click');
        expect(wrapper.props('modelValue')).toBe(true);
    });

    it('showModal() が使用される', () => {
        const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
        mount(Modal, { props: { modelValue: true } });
        expect(showModalSpy).toHaveBeenCalled();
        showModalSpy.mockRestore();
    });

    it('閉じるアニメーション中に開くと close がキャンセルされる', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Modal, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-modal').element as HTMLDialogElement;
        await wrapper.setProps({ modelValue: false });
        await wrapper.setProps({ modelValue: true });
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeFalsy();
        expect(dialog.open).toBe(true);
    });
});
