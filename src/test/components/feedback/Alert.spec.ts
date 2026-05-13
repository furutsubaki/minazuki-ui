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

    it.each([
        [{ variant: 'danger' }, 'danger'],
        [{ shape: 'no-radius' }, 'no-radius']
    ])('prop がクラスに反映される', (props, expectedClass) => {
        const wrapper = mount(Alert, { props: { text: 'msg', ...props } });
        expect(wrapper.find('.component-alert').classes()).toContain(expectedClass);
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

    it.each([
        ['info'],
        ['success'],
        ['warning']
    ])('variant="%s" のときクラスが付きアイコンが表示される', (variant) => {
        const wrapper = mount(Alert, { props: { text: 'msg', variant } });
        expect(wrapper.find('.component-alert').classes()).toContain(variant);
        expect(wrapper.find('.icon').exists()).toBe(true);
    });

});

