import { describe, it, expect, vi, beforeAll } from 'vitest';
import { nextTick, h, defineComponent } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { z } from 'zod';
import { Form as VeeForm } from 'vee-validate';
import Field from '@/components/controls/Field.vue';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import useFormData from '@/composables/useFormData';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

// validate() は fire-and-forget のため、複数マイクロタスク + マクロタスクを消化して
// バリデーション結果が DOM に反映されるまで待つ
const settleValidation = async () => {
    for (let i = 0; i < 6; i++) {
        await flushPromises();
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
};

describe('Field', () => {
    beforeAll(async () => {
        await import('@/components/controls/DatePicker.vue');
    });

    it('label が表示される', () => {
        const wrapper = mount(Field, { props: { label: 'メールアドレス' } });
        expect(wrapper.find('.label').text()).toBe('メールアドレス');
    });

    it.each([
        ['variant', 'danger'],
        ['size', 'large'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Field, { props: { [prop]: value } });
        expect(wrapper.find('.component-input').classes()).toContain(value);
    });

    it('type="password" のとき password フィールドがレンダリングされる', () => {
        const wrapper = mount(Field, { props: { type: 'password' } });
        const input = wrapper.find('input');
        expect(input.attributes('type')).toBe('password');
    });

    it('clearable が true のとき削除ボタン領域がレンダリングされる', () => {
        const wrapper = mount(Field, { props: { clearable: true } });
        expect(wrapper.find('.icon-box').exists()).toBe(true);
    });

    it('prefix が表示される', () => {
        const wrapper = mount(Field, { props: { prefix: '¥' } });
        const prefixEl = wrapper.find('.prefix-suffix');
        expect(prefixEl.exists()).toBe(true);
        expect(prefixEl.text()).toBe('¥');
    });

    it('suffix が表示される', () => {
        const wrapper = mount(Field, { props: { suffix: '円' } });
        const suffixEls = wrapper.findAll('.prefix-suffix');
        expect(suffixEls.some(el => el.text() === '円')).toBe(true);
    });

    it('disabled が true のとき input が disabled になる', () => {
        const wrapper = mount(Field, { props: { disabled: true } });
        expect(wrapper.find('input').attributes('disabled')).not.toBeUndefined();
    });

    it('type="date" のとき button.input がレンダリングされる', () => {
        const wrapper = mount(Field, { props: { type: 'date' } });
        expect(wrapper.find('button.input').exists()).toBe(true);
    });

    it.each([
        ['date'],
        ['time']
    ])('type="%s" のとき .icon-box.always-visible が表示される', (type) => {
        const wrapper = mount(Field, { props: { type: type as any } });
        expect(wrapper.find('.icon-box.always-visible').exists()).toBe(true);
    });

    it.each([
        ['time', 'time'],
        ['number', 'tel']
    ])('type="%s" のとき input の type が %s になる', (type, expectedType) => {
        const wrapper = mount(Field, { props: { type: type as any } });
        expect(wrapper.find('input').attributes('type')).toBe(expectedType);
    });

    it('type="search" のとき 検索アイコン領域がレンダリングされる', () => {
        const wrapper = mount(Field, { props: { type: 'search' } });
        expect(wrapper.find('.icon-box').exists()).toBe(true);
    });

    it('placeholder が FieldFrame に表示される', () => {
        const wrapper = mount(Field, { props: { placeholder: '入力してください' } });
        expect(wrapper.find('.placeholder').text()).toBe('（例：入力してください）');
    });

    it('modelValue が設定されたとき値が反映される', async () => {
        const wrapper = mount(Field, { props: { modelValue: 'テスト値' } });
        await nextTick();
        const input = wrapper.find('input');
        expect(input.element.value).toBe('テスト値');
    });

    it('input にフォーカスすると is-focus クラスが付く', async () => {
        const wrapper = mount(Field);
        await wrapper.find('input').trigger('focus');
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
    });

    it('input から blur すると is-focus クラスが消える', async () => {
        const wrapper = mount(Field);
        await wrapper.find('input').trigger('focus');
        await wrapper.find('input').trigger('blur');
        expect(wrapper.find('.component-input').classes()).not.toContain('is-focus');
    });

    it.each([
        [{ required: true }, true],
        [{ schema: z.string().min(1) }, true],
        [{ schema: z.string().min(2) }, false]
    ])('required/schema で isRequired が制御される', (props, shouldBeRequired) => {
        const wrapper = mount(Field, { props: props as any });
        const required = wrapper.find('input').attributes('required');
        if (shouldBeRequired) {
            expect(required).not.toBeUndefined();
        } else {
            expect(required).toBeUndefined();
        }
    });

    it('ZodString.max(10) schema で max が設定される', () => {
        const schema = z.string().max(10);
        const wrapper = mount(Field, { props: { schema } });
        expect(wrapper.findComponent(FieldFrame).props('maxLength')).toBe(10);
    });

    it('formatter prop が設定されると入力値に適用される', async () => {
        const formatter = vi.fn((v: string) => (v ?? '').toUpperCase());
        const wrapper = mount(Field, { props: { formatter } });
        await wrapper.find('input').setValue('hello');
        await nextTick();
        expect(formatter).toHaveBeenCalled();
    });

    it('clearable で値がある状態でクリアアイコンをクリックすると値がリセットされる', async () => {
        const wrapper = mount(Field, { props: { clearable: true, modelValue: '初期値' } });
        await nextTick();
        const clearSvg = wrapper.find('.icon-box:not(.always-visible) svg');
        expect(clearSvg.exists()).toBe(true);
        await clearSvg.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['']);
    });

    it('type="date" のとき DatePicker ボタンをクリックすると is-focus になる', async () => {
        const wrapper = mount(Field, { props: { type: 'date' } });
        await wrapper.find('button.input').trigger('click');
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
    });

    it('type="search" のとき検索アイコンをクリックすると search イベントが emit される', async () => {
        const wrapper = mount(Field, { props: { type: 'search' } });
        await wrapper.find('.icon-box.always-visible svg').trigger('click');
        expect(wrapper.emitted('search')).toBeTruthy();
    });

    it('input に値を入力すると v-model が更新される', async () => {
        const wrapper = mount(Field);
        await wrapper.find('input').setValue('新しい値');
        expect(wrapper.find('input').element.value).toBe('新しい値');
    });

    it('onHidePassword を呼ぶと input type が password に戻る', async () => {
        const wrapper = mount(Field, { props: { type: 'password', modelValue: 'secret' } });
        await nextTick();
        const svgs1 = wrapper.findAll('.icon-box svg');
        const eyeOffSvg = svgs1.find((svg) => (svg.element as HTMLElement).style.display !== 'none');
        await eyeOffSvg!.trigger('click');
        await nextTick();
        expect(wrapper.find('input').attributes('type')).toBe('text');
        const svgs2 = wrapper.findAll('.icon-box svg');
        const eyeSvg = svgs2.find((svg) => (svg.element as HTMLElement).style.display !== 'none');
        await eyeSvg!.trigger('click');
        await nextTick();
        expect(wrapper.find('input').attributes('type')).toBe('password');
    });

    it('type="date" のとき IntersectionObserver コールバックが右下方向に要素を配置する', async () => {
        let intersectCallback: ((entries: IntersectionObserverEntry[]) => void) | undefined;
        vi.stubGlobal('IntersectionObserver', vi.fn(function (callback: (entries: IntersectionObserverEntry[]) => void) {
            intersectCallback = callback;
            return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        await wrapper.find('button.input').trigger('click');
        await flushPromises();
        // elementCenterX=10000, elementCenterY=10000 → isRight=true, isBottom=true
        const mockEntry = {
            isIntersecting: false,
            boundingClientRect: { top: 9999, bottom: 10001, left: 9999, right: 10001 }
        };
        intersectCallback!([mockEntry as any]);
        const datePicker = wrapper.find('.component-datepicker').element as HTMLElement;
        expect(datePicker.style.left).toBe('');
        expect(datePicker.style.right).toBe('0px');
        expect(datePicker.style.top).toBe('');
        expect(datePicker.style.bottom).toBe('100%');
        vi.unstubAllGlobals();
    });

    it('type="date" のとき IntersectionObserver コールバックが左上方向に要素を配置する', async () => {
        let intersectCallback: ((entries: IntersectionObserverEntry[]) => void) | undefined;
        vi.stubGlobal('IntersectionObserver', vi.fn(function (callback: (entries: IntersectionObserverEntry[]) => void) {
            intersectCallback = callback;
            return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        await wrapper.find('button.input').trigger('click');
        await flushPromises();
        // elementCenterX=-10000, elementCenterY=-10000 → isLeft=true, isTop=true
        const mockEntry = {
            isIntersecting: false,
            boundingClientRect: { top: -10001, bottom: -9999, left: -10001, right: -9999 }
        };
        intersectCallback!([mockEntry as any]);
        const datePicker = wrapper.find('.component-datepicker').element as HTMLElement;
        expect(datePicker.style.left).toBe('0px');
        expect(datePicker.style.right).toBe('');
        expect(datePicker.style.top).toBe('100%');
        expect(datePicker.style.bottom).toBe('');
        vi.unstubAllGlobals();
    });

    it('type="date" のとき IntersectionObserver コールバックが intersecting のとき何もしない', async () => {
        let intersectCallback: ((entries: IntersectionObserverEntry[]) => void) | undefined;
        vi.stubGlobal('IntersectionObserver', vi.fn(function (callback: (entries: IntersectionObserverEntry[]) => void) {
            intersectCallback = callback;
            return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        await wrapper.find('button.input').trigger('click');
        await flushPromises();
        const datePicker = wrapper.find('.component-datepicker').element as HTMLElement;
        datePicker.style.cssText = 'left: 1px; right: 2px; top: 3px; bottom: 4px;';
        const mockEntry = { isIntersecting: true, boundingClientRect: { top: 0, bottom: 0, left: 0, right: 0 } };
        intersectCallback!([mockEntry as any]);
        expect(datePicker.style.left).toBe('1px');
        expect(datePicker.style.right).toBe('2px');
        expect(datePicker.style.top).toBe('3px');
        expect(datePicker.style.bottom).toBe('4px');
        vi.unstubAllGlobals();
    });

    it('type="date" の DatePicker 要素生成前に IntersectionObserver が通知しても何もしない', () => {
        let intersectCallback: ((entries: IntersectionObserverEntry[]) => void) | undefined;
        vi.stubGlobal('IntersectionObserver', vi.fn(function (callback: (entries: IntersectionObserverEntry[]) => void) {
            intersectCallback = callback;
            return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        const mockEntry = {
            isIntersecting: false,
            boundingClientRect: { top: 0, bottom: 0, left: 0, right: 0 }
        };

        expect(() => intersectCallback!([mockEntry as any])).not.toThrow();

        wrapper.unmount();
        vi.unstubAllGlobals();
    });

    it('type="date" のとき onCloseDatePicker を呼ぶと isFocus が false になり disconnect される', async () => {
        const mockDisconnect = vi.fn();
        vi.stubGlobal('IntersectionObserver', vi.fn(function () {
            return {
                observe: vi.fn(),
                disconnect: mockDisconnect,
                unobserve: vi.fn()
            };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        await wrapper.find('button.input').trigger('click');
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
        const vm = wrapper.vm as any;
        vm.onCloseDatePicker();
        await nextTick();
        expect(wrapper.find('.component-input').classes()).not.toContain('is-focus');
        expect(mockDisconnect).toHaveBeenCalled();
        vi.unstubAllGlobals();
    });

    it('type="date" のとき unmount で IntersectionObserver.unobserve が呼ばれる', async () => {
        const mockObserve = vi.fn();
        const mockUnobserve = vi.fn();
        vi.stubGlobal('IntersectionObserver', vi.fn(function () {
            return {
                observe: mockObserve,
                disconnect: vi.fn(),
                unobserve: mockUnobserve
            };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        await flushPromises();
        await wrapper.find('button.input').trigger('click');
        await flushPromises();
        await nextTick();
        expect(mockObserve).toHaveBeenCalled();
        wrapper.unmount();
        expect(mockUnobserve).toHaveBeenCalled();
        vi.unstubAllGlobals();
    });

    it('displayFormatter と displayParser が設定されると値が変換される', async () => {
        const displayFormatter = vi.fn((v: string) => (v ?? '').toUpperCase());
        const displayParser = vi.fn((v: string) => (v ?? '').toLowerCase());
        const wrapper = mount(Field, { props: { displayFormatter, displayParser } });
        await wrapper.find('input').setValue('hello');
        await nextTick();
        expect(displayFormatter).toHaveBeenCalled();
        expect(displayParser).toHaveBeenCalled();
    });

    it('modelValue が空文字のとき value が空文字になる', async () => {
        const wrapper = mount(Field, { props: { modelValue: '' } });
        await nextTick();
        expect(wrapper.find('input').element.value).toBe('');
    });

    it('vee-validate フォーム初期値が設定済みの場合 value は model で上書きされない', async () => {
        const fieldName = uniqueFieldName('field-form-test');
        const wrapper = mount(
            h(VeeForm, { initialValues: { [fieldName]: '初期値' } }, {
                default: () => h(Field, { name: fieldName, modelValue: '別の値' })
            })
        );
        await nextTick();
        expect(wrapper.findComponent(Field).find('input').element.value).toBe('初期値');
    });

    it('onCloseDatePicker は isFocus が false のとき早期 return する', async () => {
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        const vm = wrapper.vm as any;
        // isFocus はデフォルト false のまま呼ぶ → 早期 return
        vm.onCloseDatePicker();
        await nextTick();
        expect(wrapper.find('.component-input').classes()).not.toContain('is-focus');
    });

    it('onCloseDatePicker は type が date 以外のとき早期 return する', async () => {
        const wrapper = mount(Field, { props: { type: 'text' } });
        await nextTick();
        const vm = wrapper.vm as any;
        vm.isFocus = true;
        await nextTick();
        // type !== 'date' → 早期 return → isFocus は true のまま
        vm.onCloseDatePicker();
        await nextTick();
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
    });

    it('type="date" のとき datePickerScrollObserver が undefined でも onDateButonClick がエラーにならない', async () => {
        vi.stubGlobal('IntersectionObserver', vi.fn(function () {
            return {
                observe: vi.fn(),
                disconnect: vi.fn(),
                unobserve: vi.fn()
            };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        const vm = wrapper.vm as any;
        vm.datePickerScrollObserver = undefined;
        await wrapper.find('button.input').trigger('click');
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
        vi.unstubAllGlobals();
    });

    it('type="date" のとき datePickerScrollObserver が undefined のとき onCloseDatePicker は disconnect しない', async () => {
        vi.stubGlobal('IntersectionObserver', vi.fn(function () {
            return {
                observe: vi.fn(),
                disconnect: vi.fn(),
                unobserve: vi.fn()
            };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        await wrapper.find('button.input').trigger('click');
        expect(wrapper.find('.component-input').classes()).toContain('is-focus');
        const vm = wrapper.vm as any;
        vm.datePickerScrollObserver = undefined;
        vm.onCloseDatePicker();
        await nextTick();
        expect(wrapper.find('.component-input').classes()).not.toContain('is-focus');
        vi.unstubAllGlobals();
    });

    it.each([
        ['text'],
        ['date']
    ])('type="%s" のとき unmount でエラーが起きない', (type) => {
        const wrapper = mount(Field, { props: { type: type as any } });
        expect(() => wrapper.unmount()).not.toThrow();
    });

    it('type="date" のとき datePickerScrollObserver が undefined でも unmount でエラーが起きない', async () => {
        vi.stubGlobal('IntersectionObserver', vi.fn(function () {
            return {
                observe: vi.fn(),
                disconnect: vi.fn(),
                unobserve: vi.fn()
            };
        }));
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        const vm = wrapper.vm as any;
        vm.datePickerScrollObserver = undefined;
        expect(() => wrapper.unmount()).not.toThrow();
        vi.unstubAllGlobals();
    });

    it('type="date" のとき IntersectionObserver コールバックが isLeft/isRight/isTop/isBottom いずれでもない場合エラーにならない', async () => {
        let intersectCallback: ((entries: IntersectionObserverEntry[]) => void) | undefined;
        vi.stubGlobal('IntersectionObserver', vi.fn(function (callback: (entries: IntersectionObserverEntry[]) => void) {
            intersectCallback = callback;
            return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
        }));
        // innerWidth/innerHeight を 0 にすることで isLeft/isRight/isTop/isBottom がすべて false になる
        vi.stubGlobal('innerWidth', 0);
        vi.stubGlobal('innerHeight', 0);
        const wrapper = mount(Field, { props: { type: 'date' } });
        await nextTick();
        await wrapper.find('button.input').trigger('click');
        await flushPromises();
        // centerX=0, centerY=0, window.innerWidth=0, window.innerHeight=0
        // → isLeft=false, isRight=false, isTop=false, isBottom=false
        const mockEntry = {
            isIntersecting: false,
            boundingClientRect: { top: 0, bottom: 0, left: 0, right: 0 }
        };
        const datePicker = wrapper.find('.component-datepicker').element as HTMLElement;
        datePicker.style.cssText = 'left: 1px; right: 2px; top: 3px; bottom: 4px;';
        intersectCallback!([mockEntry as any]);
        expect(datePicker.style.left).toBe('1px');
        expect(datePicker.style.right).toBe('2px');
        expect(datePicker.style.top).toBe('3px');
        expect(datePicker.style.bottom).toBe('4px');
        vi.unstubAllGlobals();
    });

    it('type="date" で modelValue が設定されると日付がフォーマットされて表示される', async () => {
        const wrapper = mount(Field, { props: { type: 'date', modelValue: '20240115' } });
        await nextTick();
        expect(wrapper.find('button.input span').text()).not.toBe('');
    });

    it('type="date" のとき DatePicker が update:modelValue を emit すると value が更新される', async () => {
        const wrapper = mount(Field, { props: { type: 'date' } });
        await flushPromises();
        await wrapper.find('button.input').trigger('click');
        await flushPromises();
        await nextTick();
        await flushPromises();
        await flushPromises();
        await nextTick();
        const datePicker = wrapper.findComponent({ name: 'DatePicker' });
        await datePicker.vm.$emit('update:modelValue', '20240115');
        await nextTick();
        expect(wrapper.find('button.input span').text()).not.toBe('');
    });

    describe('useFormData 連携時のバリデーション挙動', () => {
        const schema = z.object({ field: z.string().min(1) });
        const mountWithForm = (extraAttrs = '', initialValues?: Record<string, unknown>) => {
            const Host = defineComponent({
                components: { Field },
                setup() {
                    const form = useFormData(schema as never, initialValues as never);
                    return { form };
                },
                template: `<Field name="field" ${extraAttrs} />`
            });
            const wrapper = mount(Host);
            const form = (wrapper.vm as { form: ReturnType<typeof useFormData> }).form;
            return { wrapper, form };
        };

        it('resetForm() 後に未入力バリデーションエラーが復活しない（#784）', async () => {
            const { wrapper, form } = mountWithForm();
            await nextTick();

            // 有効な値を入力（エラーなし）
            await wrapper.find('input').setValue('入力値');
            await settleValidation();
            expect(wrapper.find('.error').exists()).toBe(false);

            // resetForm() で空に戻る。echo による再バリデートでエラーが復活しないこと
            form.resetForm();
            await settleValidation();
            expect(wrapper.find('input').element.value).toBe('');
            expect(wrapper.find('.error').exists()).toBe(false);
        });

        it('入力後にクリアすると未入力エラーが表示される', async () => {
            const { wrapper } = mountWithForm();
            await nextTick();

            await wrapper.find('input').setValue('a');
            await settleValidation();
            expect(wrapper.find('.error').exists()).toBe(false);

            await wrapper.find('input').setValue('');
            await settleValidation();
            expect(wrapper.find('.error').exists()).toBe(true);
        });

        it('送信でエラー表示後、有効値を入力するとエラーが解消し送信可能になる', async () => {
            const { wrapper, form } = mountWithForm();
            await nextTick();

            // 未入力で送信 → Required 表示・送信不可
            await form.handleSubmit(() => {})();
            await settleValidation();
            expect(wrapper.find('.error').exists()).toBe(true);
            expect(form.canSubmit.value).toBe(false);

            // 有効値を入力 → エラー解消・送信可能
            await wrapper.find('input').setValue('入力値');
            await settleValidation();
            expect(wrapper.find('.error').exists()).toBe(false);
            expect(form.canSubmit.value).toBe(true);
        });

        it('clearable のクリアで未入力エラーが表示される', async () => {
            const { wrapper } = mountWithForm('clearable');
            await nextTick();

            await wrapper.find('input').setValue('入力値');
            await settleValidation();
            await wrapper.find('.icon-box:not(.always-visible) svg').trigger('click');
            await settleValidation();
            expect(wrapper.find('input').element.value).toBe('');
            expect(wrapper.find('.error').exists()).toBe(true);
        });
    });

});
