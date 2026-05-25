import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import Textarea from '@/components/controls/Textarea.vue';

describe('Textarea', () => {
    it('label が表示される', () => {
        const wrapper = mount(Textarea, { props: { label: '説明文' } });
        expect(wrapper.find('.label').text()).toBe('説明文');
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Textarea, { props: { [prop]: value } });
        expect(wrapper.find('.component-textarea').classes()).toContain(value);
    });

    it('disabled が true のとき textarea が disabled になる', () => {
        const wrapper = mount(Textarea, { props: { disabled: true } });
        expect(wrapper.find('textarea').attributes('disabled')).not.toBeUndefined();
    });

    it.each([
        [true, true],
        [false, false]
    ])('clearable=%s のとき削除ボタン領域の表示が %s になる', (clearable, shouldExist) => {
        const wrapper = mount(Textarea, { props: { clearable } });
        expect(wrapper.find('.clearable-box').exists()).toBe(shouldExist);
    });

    it('textarea に値を入力すると v-model が更新されて update:modelValue が emit される', async () => {
        const wrapper = mount(Textarea);
        await wrapper.find('textarea').setValue('テキスト入力');
        expect(wrapper.find('textarea').element.value).toBe('テキスト入力');
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('clearable で値がある状態でクリアボタンをクリックすると値がリセットされる', async () => {
        const wrapper = mount(Textarea, { props: { clearable: true } });
        await wrapper.find('textarea').setValue('テキスト');
        await nextTick();
        const clearSvg = wrapper.find('.clearable-box svg');
        await clearSvg.trigger('click');
        await nextTick();
        expect(wrapper.find('textarea').element.value).toBe('');
    });

    it('placeholder が FieldFrame に表示される', () => {
        const wrapper = mount(Textarea, { props: { placeholder: '入力してください' } });
        expect(wrapper.find('.placeholder').text()).toBe('（例：入力してください）');
    });

    it('modelValue が設定されたとき初期値が textarea に反映される', async () => {
        const wrapper = mount(Textarea, { props: { modelValue: '初期テキスト' } });
        await nextTick();
        expect(wrapper.find('textarea').element.value).toBe('初期テキスト');
    });

    it('textarea にフォーカスすると is-focus クラスが付く', async () => {
        const wrapper = mount(Textarea);
        await wrapper.find('textarea').trigger('focus');
        expect(wrapper.find('.component-textarea').classes()).toContain('is-focus');
    });

    it('textarea から blur すると is-focus クラスが消える', async () => {
        const wrapper = mount(Textarea);
        await wrapper.find('textarea').trigger('focus');
        await wrapper.find('textarea').trigger('blur');
        expect(wrapper.find('.component-textarea').classes()).not.toContain('is-focus');
    });

    it.each([
        [{ schema: z.string().min(1) }, true],
        [{ schema: z.string().min(2) }, false],
        [{ required: true }, true]
    ])('required/schema で required 属性が制御される', (props, shouldBeRequired) => {
        const wrapper = mount(Textarea, { props: props as any });
        const requiredAttr = wrapper.find('textarea').attributes('required');
        if (shouldBeRequired) {
            expect(requiredAttr).not.toBeUndefined();
        } else {
            expect(requiredAttr).toBeUndefined();
        }
    });

    it.each([
        [{ minLine: 5 }, 'cssMinLine', 'calc(5lh + 0.5em)'],
        [{ maxLine: 10 }, 'cssMaxLine', 'calc(10lh + 0.5em)'],
        [{ maxLine: null }, 'cssMaxLine', null],
        [{ line: 4 }, 'cssMinLine', 'calc(4lh + 0.5em)']
    ])('行数 prop で css 変数が更新される', (props, stateKey, expectedValue) => {
        const wrapper = mount(Textarea, { props: props as any });
        expect((wrapper.vm as any).$.setupState[stateKey]).toBe(expectedValue);
    });
});
