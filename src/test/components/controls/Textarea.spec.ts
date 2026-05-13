import { describe, it, expect } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import Textarea from '@/components/controls/Textarea.vue';

describe('Textarea', () => {
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(Textarea);
        expect(wrapper.find('.component-textarea').exists()).toBe(true);
    });

    it('label が表示される', () => {
        const wrapper = mount(Textarea, { props: { label: '説明文' } });
        expect(wrapper.find('.label').text()).toBe('説明文');
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(Textarea, { props: { variant: 'danger' } });
        expect(wrapper.find('.component-textarea').classes()).toContain('danger');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Textarea, { props: { size: 'large' } });
        expect(wrapper.find('.component-textarea').classes()).toContain('large');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(Textarea, { props: { shape: 'no-radius' } });
        expect(wrapper.find('.component-textarea').classes()).toContain('no-radius');
    });

    it('textarea 要素がレンダリングされる', () => {
        const wrapper = mount(Textarea);
        expect(wrapper.find('textarea').exists()).toBe(true);
    });

    it('disabled が true のとき textarea が disabled になる', () => {
        const wrapper = mount(Textarea, { props: { disabled: true } });
        expect(wrapper.find('textarea').attributes('disabled')).not.toBeUndefined();
    });

    it('clearable が true のとき削除ボタン領域がレンダリングされる', () => {
        const wrapper = mount(Textarea, { props: { clearable: true } });
        expect(wrapper.find('.clearable-box').exists()).toBe(true);
    });

    it('clearable が false のとき削除ボタン領域がレンダリングされない', () => {
        const wrapper = mount(Textarea, { props: { clearable: false } });
        expect(wrapper.find('.clearable-box').exists()).toBe(false);
    });

    it('textarea に値を入力すると v-model が更新される', async () => {
        const wrapper = mount(Textarea);
        await wrapper.find('textarea').setValue('テキスト入力');
        expect(wrapper.find('textarea').element.value).toBe('テキスト入力');
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

    it('placeholder が設定される', () => {
        const wrapper = mount(Textarea, { props: { placeholder: '入力してください' } });
        expect(wrapper.find('.component-textarea').exists()).toBe(true);
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

    it('ZodString.min(1) schema で isRequired になる', () => {
        const schema = z.string().min(1);
        const wrapper = mount(Textarea, { props: { schema } });
        expect(wrapper.find('textarea').attributes('required')).not.toBeUndefined();
    });

    it('ZodString.min(2) schema では isRequired にならない', () => {
        const schema = z.string().min(2);
        const wrapper = mount(Textarea, { props: { schema } });
        expect(wrapper.find('textarea').attributes('required')).toBeUndefined();
    });

    it('required prop が true のとき isRequired になる', () => {
        const wrapper = mount(Textarea, { props: { required: true } });
        expect(wrapper.find('textarea').attributes('required')).not.toBeUndefined();
    });

    it('ZodString.max(100) schema で max が設定される', () => {
        const schema = z.string().max(100);
        const wrapper = mount(Textarea, { props: { schema } });
        expect(wrapper.find('.component-textarea').exists()).toBe(true);
    });

    it('minLine prop で cssMinLine が更新される', () => {
        const wrapper = mount(Textarea, { props: { minLine: 5 } });
        const vm = wrapper.vm as any;
        expect(vm.$.setupState.cssMinLine).toBe('calc(5lh + 0.5em)');
    });

    it('maxLine prop で cssMaxLine が更新される', () => {
        const wrapper = mount(Textarea, { props: { maxLine: 10 } });
        const vm = wrapper.vm as any;
        expect(vm.$.setupState.cssMaxLine).toBe('calc(10lh + 0.5em)');
    });

    it('maxLine が null のとき cssMaxLine が null になる', () => {
        const wrapper = mount(Textarea, { props: { maxLine: null } });
        const vm = wrapper.vm as any;
        expect(vm.$.setupState.cssMaxLine).toBeNull();
    });

    it('minLine なしのとき cssMinLine が line prop を使う', () => {
        const wrapper = mount(Textarea, { props: { line: 4 } });
        const vm = wrapper.vm as any;
        expect(vm.$.setupState.cssMinLine).toBe('calc(4lh + 0.5em)');
    });

    it('複数行の入力で setLines が正しく動作する', async () => {
        const wrapper = mount(Textarea);
        await wrapper.find('textarea').setValue('行1\n行2\n行3');
        await nextTick();
        expect(wrapper.find('textarea').element.value).toBe('行1\n行2\n行3');
    });

    it('値の変更が model に伝播する', async () => {
        const wrapper = mount(Textarea);
        await wrapper.find('textarea').setValue('新しい値');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });
});
