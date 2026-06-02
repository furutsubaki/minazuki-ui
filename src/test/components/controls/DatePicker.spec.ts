import { describe, it, expect } from 'vitest';
import { defineComponent, nextTick, h } from 'vue';
import { mount } from '@vue/test-utils';
import { z } from 'zod';
import { Form as VeeForm } from 'vee-validate';
import DatePicker from '@/components/controls/DatePicker.vue';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import { uniqueFieldName } from '@/test/utils/uniqueFieldName';

const VueDatePickerStub = defineComponent({
    name: 'VueDatePicker',
    props: ['modelValue', 'format', 'modelType', 'dayClass'],
    emits: ['update:modelValue'],
    template: '<div class="vue-datepicker-stub"></div>'
});

function mountDP(props: Record<string, unknown> = {}, options: Record<string, any> = {}) {
    return mount(DatePicker, {
        props,
        ...options,
        global: {
            components: { VueDatePicker: VueDatePickerStub },
            ...(options.global ?? {})
        }
    });
}

describe('DatePicker', () => {
    it('label が表示される', () => {
        const wrapper = mountDP({ label: '生年月日' });
        expect(wrapper.find('.label').text()).toBe('生年月日');
    });

    it.each([
        ['variant', 'danger'],
        ['shape', 'no-radius']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mountDP({ [prop]: value });
        expect(wrapper.find('.component-datepicker').classes()).toContain(value);
    });

    it('disabled が true のとき is-disabled クラスが付く', () => {
        const wrapper = mountDP({ disabled: true });
        expect(wrapper.find('.component-input-frame').classes()).toContain('is-disabled');
    });

    it.each([
        ['2024-01-06T12:00:00Z', 'saturday'],
        ['2024-01-07T12:00:00Z', 'sunday'],
        ['2024-01-08T12:00:00Z', '']
    ])('setDayClass は %s に %s を返す', (dateISO, expectedClass) => {
        const wrapper = mountDP();
        const dayClass = wrapper.findComponent({ name: 'VueDatePicker' }).props('dayClass') as (d: Date) => string;
        expect(dayClass(new Date(dateISO))).toBe(expectedClass);
    });

    it.each([
        [{ required: true }],
        [{ schema: z.string().min(1) }]
    ])('required/schema で isRequired が true になる', (extraProps) => {
        const wrapper = mountDP(extraProps);
        expect(wrapper.findComponent(FieldFrame).props('required')).toBe(true);
    });

    it('modelValue があるとき value に反映される（line 80-82 true ブランチ）', async () => {
        const wrapper = mountDP({ modelValue: '20240115' });
        await nextTick();
        expect(wrapper.findComponent({ name: 'VueDatePicker' }).props('modelValue')).toBe('20240115');
    });

    it('value 変更時に watch コールバックで model が更新される', async () => {
        const wrapper = mountDP({ modelValue: '' });
        const dp = wrapper.findComponent({ name: 'VueDatePicker' });
        dp.vm.$emit('update:modelValue', '20240320');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('vee-validate フォーム初期値がある場合 value は model で上書きされない', async () => {
        const fieldName = uniqueFieldName('dp-form-test');
        const wrapper = mount(
            h(VeeForm, { initialValues: { [fieldName]: '20240115' } }, {
                default: () => h(DatePicker, { name: fieldName, modelValue: '20241225' })
            }),
            {
                global: {
                    components: { VueDatePicker: VueDatePickerStub }
                }
            }
        );
        await nextTick();
        // value.value は '20240115'（フォーム初期値）→ value.value == null が false → line 81 をスキップ
        const dp = wrapper.findComponent(DatePicker).findComponent({ name: 'VueDatePicker' });
        expect(dp.props('modelValue')).toBe('20240115');
    });

    it('VueDatePicker から update:modelValue を受け取ると value が更新される', async () => {
        const wrapper = mountDP({ modelValue: '20240101' });
        const dp = wrapper.findComponent({ name: 'VueDatePicker' });
        dp.vm.$emit('update:modelValue', '20240501');
        await nextTick();
        expect(dp.props('modelValue')).toBe('20240501');
        const events = wrapper.emitted('update:modelValue') as unknown[][];
        expect(events[events.length - 1]).toEqual(['20240501']);
    });
});
