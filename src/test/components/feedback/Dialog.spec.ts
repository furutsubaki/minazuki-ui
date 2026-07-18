import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick } from 'vue';
import { flushPromises, mount } from '@vue/test-utils';
import Dialog from '@/components/feedback/Dialog.vue';

describe('Dialog', () => {
    afterEach(() => {
        vi.useRealTimers();
        document.documentElement.style.overflow = '';
    });

    it('v-model が true のとき dialog が open になる', async () => {
        mount(Dialog, { props: { modelValue: true }, attachTo: document.body });
        await flushPromises();
        const dialog = document.querySelector('.component-dialog') as HTMLDialogElement;
        expect(dialog?.open).toBe(true);
    });

    it('v-model が false のとき dialog が open にならない', () => {
        const wrapper = mount(Dialog, { props: { modelValue: false } });
        const dialog = wrapper.find('.component-dialog').element as HTMLDialogElement;
        expect(dialog.open).toBe(false);
    });

    it('title が指定されたとき .title が表示される', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, title: 'テストタイトル' } });
        expect(wrapper.find('.title').text()).toBe('テストタイトル');
    });

    it('title がないとき .title が表示されない', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true } });
        expect(wrapper.find('.title').exists()).toBe(false);
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Dialog, { props: { modelValue: true, [prop]: value } });
        expect(wrapper.find('.dialog').classes()).toContain(value);
    });

    it('slot コンテンツが表示される', () => {
        const wrapper = mount(Dialog, {
            props: { modelValue: true },
            slots: { default: '<p class="content">内容</p>' }
        });
        expect(wrapper.find('.content').exists()).toBe(true);
    });

    it('footer slot が表示される', () => {
        const wrapper = mount(Dialog, {
            props: { modelValue: true },
            slots: { footer: '<button>OK</button>' }
        });
        expect(wrapper.find('.footer').exists()).toBe(true);
    });

    it.each([
        ['top', 'from-top'],
        ['right', 'from-right'],
        ['bottom', 'from-bottom'],
        ['left', 'from-left']
    ])('transitionFrom="%s" が dialog に %s クラスとして反映される', (transitionFrom, expectedClass) => {
        const wrapper = mount(Dialog, { props: { modelValue: true, transitionFrom: transitionFrom as any } });
        expect(wrapper.find('.component-dialog').classes()).toContain(expectedClass);
    });

    it('transitionFrom が opacity のとき方向クラスが付かない', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, transitionFrom: 'opacity' } });
        const classes = wrapper.find('.component-dialog').classes();
        expect(classes).not.toContain('from-top');
        expect(classes).not.toContain('from-right');
        expect(classes).not.toContain('from-bottom');
        expect(classes).not.toContain('from-left');
    });

    it('seamless prop のとき is-seamless クラスが付く', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, seamless: true } });
        expect(wrapper.find('.component-dialog').classes()).toContain('is-seamless');
    });

    it('seamless のとき show() が使われる', async () => {
        const showSpy = vi.spyOn(HTMLDialogElement.prototype, 'show');
        const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
        mount(Dialog, { props: { modelValue: true, seamless: true } });
        await nextTick();
        expect(showSpy).toHaveBeenCalled();
        expect(showModalSpy).not.toHaveBeenCalled();
        showSpy.mockRestore();
        showModalSpy.mockRestore();
    });

    it('seamless でないとき showModal() が使われる', async () => {
        const showModalSpy = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
        mount(Dialog, { props: { modelValue: true } });
        await nextTick();
        expect(showModalSpy).toHaveBeenCalled();
        showModalSpy.mockRestore();
    });

    it('backdrop クリックで closed イベントが発火する', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-dialog');
        await dialog.trigger('click');
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });

    it('persistent のとき backdrop クリックで閉じない', async () => {
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                persistent: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-dialog');
        await dialog.trigger('click');
        expect(wrapper.props('modelValue')).toBe(true);
    });

    it('persistent のとき cancel イベントで閉じない', async () => {
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                persistent: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-dialog');
        await dialog.trigger('cancel');
        expect(wrapper.props('modelValue')).toBe(true);
    });

    it('persistent でないとき cancel で閉じる', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-dialog');
        await dialog.trigger('cancel');
        expect(wrapper.props('modelValue')).toBe(false);
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });

    it('seamless のとき backdrop クリックで閉じない', async () => {
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                seamless: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-dialog');
        await dialog.trigger('click');
        expect(wrapper.props('modelValue')).toBe(true);
    });

    it.each([
        ['info'],
        ['success'],
        ['warning'],
        ['danger']
    ])('variant="%s" のときクラスが付く', (variant) => {
        const wrapper = mount(Dialog, { props: { modelValue: true, variant: variant as any } });
        expect(wrapper.find('.dialog').classes()).toContain(variant);
    });

    it.each([
        ['center'],
        ['top'],
        ['right'],
        ['bottom'],
        ['left']
    ])('position="%s" のときクラスが dialog-panel に付く', (position) => {
        const wrapper = mount(Dialog, { props: { modelValue: true, position: position as any } });
        expect(wrapper.find('.dialog-panel').classes()).toContain(position);
    });

    it('center prop のとき is-center クラスが付く', () => {
        const wrapper = mount(Dialog, { props: { modelValue: true, center: true } });
        expect(wrapper.find('.dialog').classes()).toContain('is-center');
    });

    it('v-model が false → true に変わると overflow が hidden になる', async () => {
        const wrapper = mount(Dialog, { props: { modelValue: false } });
        await wrapper.setProps({ modelValue: true });
        await nextTick();
        expect(document.documentElement.style.overflow).toBe('hidden');
    });

    it('seamless のとき overflow が hidden にならない', async () => {
        mount(Dialog, { props: { modelValue: true, seamless: true } });
        await nextTick();
        expect(document.documentElement.style.overflow).not.toBe('hidden');
    });

    it('v-model が true → false で overflow が解除される', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await nextTick();
        expect(document.documentElement.style.overflow).toBe('hidden');
        await wrapper.setProps({ modelValue: false });
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('unmount 時に overflow がリセットされる', async () => {
        const wrapper = mount(Dialog, { props: { modelValue: true } });
        await nextTick();
        expect(document.documentElement.style.overflow).toBe('hidden');
        wrapper.unmount();
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('dialog-panel のクリックは backdrop クリックとして扱われない', async () => {
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.dialog-panel').trigger('click');
        expect(wrapper.props('modelValue')).toBe(true);
    });

    it('閉じるアニメーション中に開くと close がキャンセルされる', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        const dialog = wrapper.find('.component-dialog').element as HTMLDialogElement;
        await wrapper.setProps({ modelValue: false });
        await wrapper.setProps({ modelValue: true });
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeFalsy();
        expect(dialog.open).toBe(true);
    });

    it('二重 close が防がれる', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.setProps({ modelValue: false });
        await wrapper.setProps({ modelValue: false });
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        const closedEvents = wrapper.emitted('closed');
        expect(closedEvents).toBeTruthy();
        expect(closedEvents!.length).toBe(1);
    });

    it('閉じアニメーション中に unmount すると closeTimeout がクリアされる', async () => {
        vi.useFakeTimers();
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.setProps({ modelValue: false });
        wrapper.unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();
        expect(document.documentElement.style.overflow).toBe('');
        clearTimeoutSpy.mockRestore();
    });

    it('閉じた状態で unmount しても安全に処理される', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.setProps({ modelValue: false });
        await vi.advanceTimersByTimeAsync(300);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
        wrapper.unmount();
    });

    it('transition duration が 0 でないとき duration + 50 で閉じる', async () => {
        vi.useFakeTimers();
        vi.spyOn(window, 'getComputedStyle').mockReturnValue({
            transitionDuration: '300ms',
            transitionDelay: '0ms'
        } as unknown as CSSStyleDeclaration);
        const wrapper = mount(Dialog, {
            props: {
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.setProps({ modelValue: false });
        await vi.advanceTimersByTimeAsync(349);
        expect(wrapper.emitted('closed')).toBeFalsy();
        await vi.advanceTimersByTimeAsync(1);
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
    });
});
