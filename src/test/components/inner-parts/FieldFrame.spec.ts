import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';

describe('FieldFrame', () => {
    it('slot コンテンツが表示される', () => {
        const wrapper = mount(FieldFrame, { slots: { default: '<input />' } });
        expect(wrapper.find('input').exists()).toBe(true);
    });

    it('label が表示される', () => {
        const wrapper = mount(FieldFrame, { props: { label: 'メールアドレス' } });
        expect(wrapper.find('.label').text()).toBe('メールアドレス');
    });

    it.each([
        [{ required: true }, 'is-required'],
        [{ disabled: true }, 'is-disabled'],
        [{ variant: 'danger' as const }, 'danger'],
        [{ size: 'large' as const }, 'large'],
        [{ shape: 'no-radius' as const }, 'no-radius']
    ])('prop がクラスに反映される', (props, expectedClass) => {
        const wrapper = mount(FieldFrame, { props: props as any });
        expect(wrapper.find('.component-input-frame').classes()).toContain(expectedClass);
    });

    it('isErrorMessage が true のときエラーメッセージが表示される', () => {
        const wrapper = mount(FieldFrame, {
            props: { isErrorMessage: true, errors: ['入力が必要です', '文字数超過'] }
        });
        const errors = wrapper.findAll('.error');
        expect(errors).toHaveLength(2);
        expect(errors[0].text()).toBe('入力が必要です');
        expect(errors[1].text()).toBe('文字数超過');
    });

    it('isErrorMessage が false のときエラーが表示されない', () => {
        const wrapper = mount(FieldFrame, {
            props: { isErrorMessage: false, errors: ['入力が必要です'] }
        });
        expect(wrapper.find('.error').exists()).toBe(false);
    });

    it('value があるとき is-inputed クラスが付く', () => {
        const wrapper = mount(FieldFrame, { props: { value: 'テスト入力' } });
        expect(wrapper.find('.component-input-frame').classes()).toContain('is-inputed');
    });
});
