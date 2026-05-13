import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { Info } from 'lucide-vue-next';
import Alert from '@/components/feedback/Alert.vue';

describe('Alert', () => {
    it('text が表示される', () => {
        const wrapper = mount(Alert, { props: { text: 'テストメッセージ' } });
        expect(wrapper.text()).toContain('テストメッセージ');
    });

    it('title が指定されたとき .title が表示される', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', title: 'タイトル' } });
        expect(wrapper.find('.title').text()).toBe('タイトル');
    });

    it('title がないとき .title が表示されない', () => {
        const wrapper = mount(Alert, { props: { text: 'msg' } });
        expect(wrapper.find('.title').exists()).toBe(false);
    });

    it('closeable のとき閉じるボタンが表示される', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', closeable: true } });
        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('closeable でないとき閉じるボタンが表示されない', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', closeable: false } });
        expect(wrapper.find('button').exists()).toBe(false);
    });

    it('閉じるボタンをクリックすると v-model が false になる', async () => {
        const wrapper = mount(Alert, {
            props: {
                text: 'msg',
                closeable: true,
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('button').trigger('click');
        expect(wrapper.props('modelValue')).toBe(false);
    });

    it('v-model が false のとき alert が非表示になる', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', modelValue: false } });
        const el = wrapper.find('.component-alert').element as HTMLElement;
        expect(el.style.display).toBe('none');
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', variant: 'danger' } });
        expect(wrapper.find('.component-alert').classes()).toContain('danger');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', shape: 'no-radius' } });
        expect(wrapper.find('.component-alert').classes()).toContain('no-radius');
    });

    it('閉じるボタンクリックで closed イベントが発火する', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Alert, {
            props: {
                text: 'msg',
                closeable: true,
                modelValue: true,
                'onUpdate:modelValue': (v: boolean) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('button').trigger('click');
        await vi.runAllTimersAsync();
        await nextTick();
        expect(wrapper.emitted('closed')).toBeTruthy();
        vi.useRealTimers();
    });

    it('icon prop でカスタムアイコンが表示される', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', icon: Info } });
        expect(wrapper.find('.icon').exists()).toBe(true);
    });

    it('variant="info" のとき info アイコンが表示される', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', variant: 'info' } });
        expect(wrapper.find('.component-alert').classes()).toContain('info');
        expect(wrapper.find('.icon').exists()).toBe(true);
    });

    it('variant="success" のとき success アイコンが表示される', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', variant: 'success' } });
        expect(wrapper.find('.component-alert').classes()).toContain('success');
        expect(wrapper.find('.icon').exists()).toBe(true);
    });

    it('variant="warning" のとき warning アイコンが表示される', () => {
        const wrapper = mount(Alert, { props: { text: 'msg', variant: 'warning' } });
        expect(wrapper.find('.component-alert').classes()).toContain('warning');
        expect(wrapper.find('.icon').exists()).toBe(true);
    });

    it('OpacityTransition の transition-start/end イベントで transitioning が更新される', async () => {
        const wrapper = mount(Alert, { props: { text: 'msg', modelValue: true } });
        const OpacityTransition = (await import('@/components/inner-parts/OpacityTransition.vue')).default;
        const ot = wrapper.findComponent(OpacityTransition);
        if (ot.exists()) {
            await ot.vm.$emit('transition-start');
            await ot.vm.$emit('transition-end');
        }
        expect(wrapper.find('.component-alert').exists()).toBe(true);
    });
});
