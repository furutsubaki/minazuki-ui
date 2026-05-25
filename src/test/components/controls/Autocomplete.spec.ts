import { describe, it, expect, vi, afterEach } from 'vitest';
import { nextTick, h } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { Form as VeeForm } from 'vee-validate';
import Autocomplete from '@/components/controls/Autocomplete.vue';
import FieldAccordionList from '@/components/inner-parts/FieldAccordionList.vue';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

const items = [
    { label: 'りんご', value: 'apple' },
    { label: 'バナナ', value: 'banana' },
    { label: 'チェリー', value: 'cherry', disabled: true }
];

describe('Autocomplete', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('label が表示される', () => {
        const wrapper = mount(Autocomplete, { props: { items, label: '検索' } });
        expect(wrapper.find('.label').text()).toBe('検索');
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Autocomplete, { props: { items, [prop]: value } });
        expect(wrapper.find('.component-input').classes()).toContain(value);
    });

    it('disabled が true のとき input が disabled になる', () => {
        const wrapper = mount(Autocomplete, { props: { items, disabled: true } });
        expect(wrapper.find('input').attributes('disabled')).not.toBeUndefined();
    });

    it('clearable が true のとき削除ボタン領域がレンダリングされる', () => {
        const wrapper = mount(Autocomplete, { props: { items, clearable: true } });
        expect(wrapper.find('.clearable-box').exists()).toBe(true);
    });

    it('input にフォーカスすると is-focus クラスが付く', async () => {
        const wrapper = mount(Autocomplete, { props: { items } });
        await wrapper.find('input').trigger('focus');
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
    });

    it('入力値でアイテムが絞り込まれる', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Autocomplete, { props: { items } });
        await wrapper.find('input').setValue('りんご');
        vi.advanceTimersByTime(200);
        await nextTick();
        expect(wrapper.findComponent(FieldAccordionList).props('items')).toHaveLength(1);
    });

    it('初期値がリスト外の場合は値がクリアされる', async () => {
        const wrapper = mount(Autocomplete, { props: { items, modelValue: 'not-exist' } });
        await nextTick();
        expect(wrapper.find('input').element.value).toBe('');
    });

    it('match カスタム関数が使われる', async () => {
        vi.useFakeTimers();
        const matchFn = vi.fn().mockReturnValue(true);
        const wrapper = mount(Autocomplete, { props: { items, match: matchFn } });
        await wrapper.find('input').setValue('x');
        vi.advanceTimersByTime(200);
        await nextTick();
        expect(matchFn).toHaveBeenCalled();
    });

    it('カタカナで検索すると variants.some により絞り込まれる', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Autocomplete, { props: { items } });
        await wrapper.find('input').setValue('リンゴ');
        vi.advanceTimersByTime(200);
        await nextTick();
        expect(wrapper.findComponent(FieldAccordionList).props('items')).toHaveLength(1);
    });

    it('input blur で target が inputRef の内側のとき早期 return する', async () => {
        const wrapper = mount(Autocomplete, { props: { items } });
        await wrapper.find('input').trigger('focus');
        // @blur="onBlur" → event.target = input (inside inputRef) → early return
        await wrapper.find('input').trigger('blur');
        // early return means isFocus is NOT reset to false
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
    });

    it('clearable で値がある状態でクリアボタンをクリックすると value がリセットされる', async () => {
        const wrapper = mount(Autocomplete, { props: { items, clearable: true, modelValue: 'apple' } });
        await nextTick();
        expect(wrapper.find('input').element.value).toBe('apple');
        await wrapper.find('.clearable-box svg').trigger('click');
        await nextTick();
        expect(wrapper.find('input').element.value).toBe('');
    });

    it('onBlur で target が inputRef の外のとき isFocus が false になる', async () => {
        const wrapper = mount(Autocomplete, { props: { items } });
        await wrapper.find('input').trigger('focus');
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
        const externalDiv = document.createElement('div');
        document.body.appendChild(externalDiv);
        (wrapper.vm as any).onBlur({ target: externalDiv });
        await nextTick();
        expect(wrapper.find('.component-input').classes()).not.toContain('is-focus');
        externalDiv.remove();
    });

    it('onBlur でリスト外の値のとき value がリセットされる', async () => {
        const wrapper = mount(Autocomplete, { props: { items } });
        await wrapper.find('input').setValue('not-in-list');
        await nextTick();
        const externalDiv = document.createElement('div');
        document.body.appendChild(externalDiv);
        (wrapper.vm as any).onBlur({ target: externalDiv });
        await nextTick();
        expect(wrapper.find('input').element.value).toBe('');
        externalDiv.remove();
    });

    it('FieldAccordionList の change イベントで onChange が呼ばれ value が更新される', async () => {
        const wrapper = mount(Autocomplete, { props: { items } });
        const accordionList = wrapper.findComponent(FieldAccordionList);
        await accordionList.vm.$emit('change', 'apple');
        await nextTick();
        expect(wrapper.find('input').element.value).toBe('apple');
    });

    it('FieldAccordionList の update:modelValue イベントで isFocus が更新される', async () => {
        const wrapper = mount(Autocomplete, { props: { items } });
        await wrapper.find('input').trigger('focus');
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
        const accordionList = wrapper.findComponent(FieldAccordionList);
        await accordionList.vm.$emit('update:modelValue', false);
        await nextTick();
        expect(wrapper.find('.component-input').classes()).not.toContain('is-focus');
    });

    it('prefix が表示される', () => {
        const wrapper = mount(Autocomplete, { props: { items, prefix: '¥' } });
        expect(wrapper.find('.prefix-suffix').exists()).toBe(true);
    });

    it('suffix が表示される', () => {
        const wrapper = mount(Autocomplete, { props: { items, suffix: '円' } });
        const suffixEls = wrapper.findAll('.prefix-suffix');
        expect(suffixEls.some(el => el.text() === '円')).toBe(true);
    });

    it('ruby を持つアイテムで variants に ruby の変換が含まれる', async () => {
        vi.useFakeTimers();
        const rubyItems = [{ label: 'りんご', value: 'apple', ruby: 'リンゴ' }];
        const wrapper = mount(Autocomplete, { props: { items: rubyItems } });
        await wrapper.find('input').setValue('りんご');
        vi.advanceTimersByTime(200);
        await nextTick();
        expect(wrapper.findComponent(FieldAccordionList).props('items')).toHaveLength(1);
    });

    it('onBlur でリスト内の値のとき value がリセットされない', async () => {
        const wrapper = mount(Autocomplete, { props: { items, modelValue: 'apple' } });
        await nextTick();
        const externalDiv = document.createElement('div');
        document.body.appendChild(externalDiv);
        (wrapper.vm as any).onBlur({ target: externalDiv });
        await nextTick();
        expect(wrapper.find('input').element.value).toBe('apple');
        externalDiv.remove();
    });

    it('ZodString.min(1) schema で isRequired になる（schemaChunks?.some() 分岐）', () => {
        const schema = z.string().min(1);
        const wrapper = mount(Autocomplete, { props: { items, schema } });
        expect(wrapper.find('input').attributes('required')).not.toBeUndefined();
    });

    it('value が null のとき debouncedSearchValue が空文字になる（v ?? "" 分岐）', async () => {
        vi.useFakeTimers();
        const wrapper = mount(Autocomplete, { props: { items } });
        const vm = wrapper.vm as any;
        vm.value = null;
        await nextTick();
        vi.advanceTimersByTime(200);
        await nextTick();
        expect(vm.debouncedSearchValue).toBe('');
    });

    it('ruby だけにマッチするとき item.ruby?.includes() が true になる', async () => {
        vi.useFakeTimers();
        const rubyItems = [{ label: 'りんご', value: 'apple', ruby: 'リンゴ' }];
        const wrapper = mount(Autocomplete, { props: { items: rubyItems } });
        // 'ゴ' は label 'りんご' にも value 'apple' にも含まれない
        // ruby 'リンゴ' にのみ含まれるため ruby?.includes が true になる
        await wrapper.find('input').setValue('ゴ');
        vi.advanceTimersByTime(200);
        await nextTick();
        expect(wrapper.findComponent(FieldAccordionList).props('items')).toHaveLength(1);
    });

    it('ZodString.max(10) schema で max computed が 10 を返す', () => {
        const schema = z.string().max(10);
        const wrapper = mount(Autocomplete, { props: { items, schema } });
        expect(wrapper.findComponent(FieldFrame).props('maxLength')).toBe(10);
    });

    it('アンマウント時に debounce タイマーが clearTimeout される', () => {
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
        const wrapper = mount(Autocomplete, { props: { items } });
        wrapper.unmount();
        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
    });

    it('vee-validate フォーム初期値が設定済みの場合 value は model で上書きされない', async () => {
        const fieldName = uniqueFieldName('ac-form-test');
        const wrapper = mount(
            h(VeeForm, { initialValues: { [fieldName]: 'apple' } }, {
                default: () => h(Autocomplete, { items, name: fieldName, modelValue: 'banana' })
            })
        );
        await nextTick();
        expect(wrapper.findComponent(Autocomplete).find('input').element.value).toBe('apple');
    });
});
