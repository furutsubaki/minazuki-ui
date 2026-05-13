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

    it('required が true のとき is-required クラスが付く', () => {
        const wrapper = mount(FieldFrame, { props: { required: true } });
        expect(wrapper.find('.component-input-frame').classes()).toContain('is-required');
    });

    it('disabled が true のとき is-disabled クラスが付く', () => {
        const wrapper = mount(FieldFrame, { props: { disabled: true } });
        expect(wrapper.find('.component-input-frame').classes()).toContain('is-disabled');
    });

    it('variant prop がクラスに反映される', () => {
        const wrapper = mount(FieldFrame, { props: { variant: 'danger' } });
        expect(wrapper.find('.component-input-frame').classes()).toContain('danger');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(FieldFrame, { props: { size: 'large' } });
        expect(wrapper.find('.component-input-frame').classes()).toContain('large');
    });

    it('shape prop がクラスに反映される', () => {
        const wrapper = mount(FieldFrame, { props: { shape: 'no-radius' } });
        expect(wrapper.find('.component-input-frame').classes()).toContain('no-radius');
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
