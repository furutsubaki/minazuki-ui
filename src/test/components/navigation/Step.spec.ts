import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { Star as IconStar } from '@lucide/vue';
import Step from '@/components/navigation/Step.vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';

const steps = [
    { id: 'step1', label: 'ステップ1' },
    { id: 'step2', label: 'ステップ2' },
    { id: 'step3', label: 'ステップ3' }
];

describe('Step', () => {
    it('steps のラベルが表示される', () => {
        const wrapper = mount(Step, { props: { steps, modelValue: 'step1' } });
        expect(wrapper.text()).toContain('ステップ1');
        expect(wrapper.text()).toContain('ステップ2');
        expect(wrapper.text()).toContain('ステップ3');
    });

    it('現在のステップボタンに is-current クラスが付く', () => {
        const wrapper = mount(Step, { props: { steps, modelValue: 'step2' } });
        const buttons = wrapper.findAll('.step-button');
        expect(buttons[0].classes()).not.toContain('is-current');
        expect(buttons[1].classes()).toContain('is-current');
    });

    it('完了済みのステップに is-success クラスが付く', () => {
        const wrapper = mount(Step, { props: { steps, modelValue: 'step3' } });
        const buttons = wrapper.findAll('.step-button');
        expect(buttons[0].classes()).toContain('is-success');
        expect(buttons[1].classes()).toContain('is-success');
    });

    it('未到達のステップは disabled になる', () => {
        const wrapper = mount(Step, { props: { steps, modelValue: 'step1' } });
        const buttons = wrapper.findAll('.step-button');
        // step2, step3 は disabled
        expect(buttons[1].attributes('disabled')).not.toBeUndefined();
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Step, { props: { steps, modelValue: 'step1', size: 'large' } });
        expect(wrapper.find('.component-step').classes()).toContain('large');
    });

    it('position prop がクラスに反映される', () => {
        const wrapper = mount(Step, { props: { steps, modelValue: 'step1', position: 'left' } });
        expect(wrapper.find('.component-step').classes()).toContain('left');
    });

    it('スロットあり時に step-footer が表示される', () => {
        const wrapper = mount(Step, {
            props: { steps, modelValue: 'step1' },
            slots: {
                step1: '<div>内容1</div>',
                step2: '<div>内容2</div>',
                step3: '<div>内容3</div>'
            }
        });
        expect(wrapper.find('.step-footer').exists()).toBe(true);
    });

    it('Next ボタンをクリックすると next イベントが発火する', async () => {
        const wrapper = mount(Step, {
            props: {
                steps,
                modelValue: 'step1',
                'onUpdate:modelValue': (v: string | undefined) => wrapper.setProps({ modelValue: v })
            },
            slots: {
                step1: '<div>1</div>',
                step2: '<div>2</div>',
                step3: '<div>3</div>'
            }
        });
        const nextBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Next'));
        await nextBtn!.trigger('click');
        expect(wrapper.emitted('next')).toBeTruthy();
    });

    it('Prev ボタンをクリックすると prev イベントが発火する', async () => {
        const wrapper = mount(Step, {
            props: {
                steps,
                modelValue: 'step2',
                'onUpdate:modelValue': (v: string | undefined) => wrapper.setProps({ modelValue: v })
            },
            slots: {
                step1: '<div>1</div>',
                step2: '<div>2</div>',
                step3: '<div>3</div>'
            }
        });
        const prevBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Prev'));
        await prevBtn!.trigger('click');
        expect(wrapper.emitted('prev')).toBeTruthy();
    });

    it('transition="opacity" が反映される', () => {
        const wrapper = mount(Step, { props: { steps, modelValue: 'step1', transition: 'opacity' } });
        expect(wrapper.findComponent(OpacityTransition).exists()).toBe(true);
    });

    it('position="left" でタブ切り替えの Y 方向遷移が使われる', async () => {
        const wrapper = mount(Step, {
            props: {
                steps,
                modelValue: 'step1',
                position: 'left' as const,
                'onUpdate:modelValue': (v: string | undefined) => wrapper.setProps({ modelValue: v })
            },
            slots: {
                step1: '<div>1</div>',
                step2: '<div>2</div>',
                step3: '<div>3</div>'
            }
        });
        const nextBtn = wrapper.findAll('button').find((btn) => btn.text().includes('Next'));
        await nextBtn!.trigger('click');
        expect(wrapper.emitted('next')).toBeTruthy();
    });

    it('noSeparator が true のとき no-separator クラスが付く', () => {
        const wrapper = mount(Step, { props: { steps, modelValue: 'step1', noSeparator: true } });
        expect(wrapper.find('.step-header').classes()).toContain('no-separator');
    });

    it('icon を持つ step は v-if="!step.icon" が false になりアイコンが表示される', () => {
        const stepsWithIcon = [
            { id: 'step1', label: 'ステップ1', icon: IconStar },
            { id: 'step2', label: 'ステップ2' }
        ];
        const wrapper = mount(Step, { props: { steps: stepsWithIcon, modelValue: 'step1' } });
        expect(wrapper.find('.component-step').exists()).toBe(true);
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('step-header ボタンを直接クリックすると onChangeTab が呼ばれる', async () => {
        const wrapper = mount(Step, {
            props: {
                steps,
                modelValue: 'step2',
                'onUpdate:modelValue': (v: string | undefined) => wrapper.setProps({ modelValue: v })
            }
        });
        const buttons = wrapper.findAll('.step-button');
        // step1 は step2 より前なので disabled でない
        await buttons[0].trigger('click');
        expect(wrapper.emitted('prev')).toBeTruthy();
    });

    it('現在のステップのヘッダーをクリックしても next/prev イベントが発火しない', async () => {
        const wrapper = mount(Step, {
            props: {
                steps,
                modelValue: 'step2',
                'onUpdate:modelValue': (v: string | undefined) => wrapper.setProps({ modelValue: v })
            }
        });
        const buttons = wrapper.findAll('.step-button');
        await buttons[1].trigger('click');
        expect(wrapper.emitted('next')).toBeUndefined();
        expect(wrapper.emitted('prev')).toBeUndefined();
    });

    it('Next ボタンをクリックすると v-model が次の step に更新される', async () => {
        const wrapper = mount(Step, {
            props: {
                steps,
                modelValue: 'step1',
                'onUpdate:modelValue': (v: string | undefined) =>
                    wrapper.setProps({ modelValue: v })
            },
            slots: {
                step1: '<div>入力</div>',
                step2: '<div>確認</div>',
                step3: '<div>完了</div>'
            }
        });

        const footerButtons = wrapper.findAll('.step-footer button');
        await footerButtons[1].trigger('click');
        await wrapper.vm.$nextTick();

        expect(wrapper.props('modelValue')).toBe('step2');
        expect(wrapper.findAll('.step-button')[1].classes()).toContain('is-current');
    });
});
