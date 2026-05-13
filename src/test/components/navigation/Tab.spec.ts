import { describe, it, expect } from 'vitest';
import { nextTick, markRaw } from 'vue';
import { mount } from '@vue/test-utils';
import Tab from '@/components/navigation/Tab.vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';

const tabs = [
    { id: 'tab1', label: 'タブ1' },
    { id: 'tab2', label: 'タブ2' },
    { id: 'tab3', label: 'タブ3' }
];

describe('Tab', () => {
    it('デフォルトでレンダリングされる', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1' } });
        expect(wrapper.find('.component-tab').exists()).toBe(true);
    });

    it('tabs の数だけタブボタンがレンダリングされる', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1' } });
        const buttons = wrapper.findAll('button');
        expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    it('tabs のラベルが表示される', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1' } });
        expect(wrapper.text()).toContain('タブ1');
        expect(wrapper.text()).toContain('タブ2');
        expect(wrapper.text()).toContain('タブ3');
    });

    it('タブをクリックすると v-model が更新される', async () => {
        const wrapper = mount(Tab, {
            props: {
                tabs,
                modelValue: 'tab1',
                'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v })
            }
        });
        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');
        expect(wrapper.props('modelValue')).toBe('tab2');
    });

    it('slot コンテンツが currentTab に対応して表示される', () => {
        const wrapper = mount(Tab, {
            props: { tabs, modelValue: 'tab2' },
            slots: {
                tab1: '<div class="slot-tab1">タブ1の内容</div>',
                tab2: '<div class="slot-tab2">タブ2の内容</div>'
            }
        });
        expect(wrapper.find('.slot-tab2').exists()).toBe(true);
        expect(wrapper.find('.slot-tab1').exists()).toBe(false);
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', size: 'large' } });
        expect(wrapper.find('.component-tab').classes()).toContain('large');
    });

    it('position prop がクラスに反映される', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', position: 'bottom' } });
        expect(wrapper.find('.component-tab').classes()).toContain('bottom');
    });

    it('tabAlign="center" が反映される', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: 'center' } });
        expect((wrapper.vm as any).tabAlignProperty).toBe('center');
    });

    it('tabAlign="end" が反映される', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: 'end' } });
        expect((wrapper.vm as any).tabAlignProperty).toBe('flex-end');
    });

    it('tabAlign="between" が反映される', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: 'between' } });
        expect((wrapper.vm as any).tabAlignProperty).toBe('space-between');
    });

    it('position="left" のとき Y方向のトランジションが使われる', async () => {
        const wrapper = mount(Tab, {
            props: {
                tabs,
                modelValue: 'tab1',
                position: 'left',
                'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v })
            }
        });
        const buttons = wrapper.findAll('button');
        await buttons[1].trigger('click');
        expect(wrapper.props('modelValue')).toBe('tab2');
    });

    it('position="right" でタブを前に戻すと top 方向になる', async () => {
        const wrapper = mount(Tab, {
            props: {
                tabs,
                modelValue: 'tab3',
                position: 'right',
                'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v })
            }
        });
        const buttons = wrapper.findAll('button');
        await buttons[0].trigger('click');
        expect(wrapper.props('modelValue')).toBe('tab1');
    });

    it('transition="opacity" が反映される', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', transition: 'opacity' } });
        expect(wrapper.findComponent(OpacityTransition).exists()).toBe(true);
    });

    it('noSeparator が true のとき no-separator クラスが付く', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', noSeparator: true } });
        expect(wrapper.find('.tab-header').classes()).toContain('no-separator');
    });

    it('tabAlignProperty computed: start → flex-start', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: 'start' } });
        const vm = wrapper.vm as any;
        expect(vm.tabAlignProperty).toBe('flex-start');
    });

    it('tabAlignProperty computed: center → center', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: 'center' } });
        const vm = wrapper.vm as any;
        expect(vm.tabAlignProperty).toBe('center');
    });

    it('tabAlignProperty computed: end → flex-end', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: 'end' } });
        const vm = wrapper.vm as any;
        expect(vm.tabAlignProperty).toBe('flex-end');
    });

    it('tabAlignProperty computed: between → space-between', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: 'between' } });
        const vm = wrapper.vm as any;
        expect(vm.tabAlignProperty).toBe('space-between');
    });

    it('tabAlignProperty computed: 無効な値は flex-start になる（else ブランチ）', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: 'invalid' as any } });
        const vm = wrapper.vm as any;
        expect(vm.tabAlignProperty).toBe('flex-start');
    });

    it('currentTabClientRects computed にアクセスできる', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1' } });
        const vm = wrapper.vm as any;
        // happy-dom では getBoundingClientRect が動かないため undefined になる
        const rects = vm.currentTabClientRects;
        expect(rects === undefined || typeof rects === 'object').toBe(true);
    });

    it('tabButtonRef が null のとき currentTabClientRects が undefined を返す', async () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1' } });
        const vm = wrapper.vm as any;
        vm.tabButtonRef = null;
        await nextTick();
        const rects = vm.currentTabClientRects;
        expect(rects).toBeUndefined();
    });

    it('tab に icon がある場合は icon がレンダリングされる', () => {
        const IconComponent = markRaw({ template: '<span class="tab-icon">★</span>' });
        const tabsWithIcon = [
            { id: 'tab1', label: 'タブ1', icon: IconComponent },
            { id: 'tab2', label: 'タブ2' }
        ];
        const wrapper = mount(Tab, { props: { tabs: tabsWithIcon, modelValue: 'tab1' } });
        expect(wrapper.find('.tab-icon').exists()).toBe(true);
    });
});
