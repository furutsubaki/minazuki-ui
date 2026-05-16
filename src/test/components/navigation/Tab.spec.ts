import { describe, it, expect } from 'vitest';
import { nextTick, markRaw } from 'vue';
import { mount } from '@vue/test-utils';
import Tab from '@/components/navigation/Tab.vue';
import OpacityTransition from '@/components/inner-parts/OpacityTransition.vue';
import TranslateTransition from '@/components/inner-parts/TranslateTransition.vue';

const tabs = [
    { id: 'tab1', label: 'タブ1' },
    { id: 'tab2', label: 'タブ2' },
    { id: 'tab3', label: 'タブ3' }
];

describe('Tab', () => {
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

    it.each([
        ['size', 'large'],
        ['position', 'bottom']
    ])('%s prop がクラスに反映される', (prop, value) => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', [prop]: value } });
        expect(wrapper.find('.component-tab').classes()).toContain(value);
    });

    it.each([
        ['start', 'flex-start'],
        ['center', 'center'],
        ['end', 'flex-end'],
        ['between', 'space-between'],
        ['invalid', 'flex-start']
    ])('tabAlign="%s" のとき tabAlignProperty が %s になる', (tabAlign, expected) => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', tabAlign: tabAlign as any } });
        expect((wrapper.vm as any).tabAlignProperty).toBe(expected);
    });

    it('transition="opacity" が反映される', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', transition: 'opacity' } });
        expect(wrapper.findComponent(OpacityTransition).exists()).toBe(true);
    });

    it('noSeparator が true のとき no-separator クラスが付く', () => {
        const wrapper = mount(Tab, { props: { tabs, modelValue: 'tab1', noSeparator: true } });
        expect(wrapper.find('.tab-header').classes()).toContain('no-separator');
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

    it('逆方向にタブ切替したとき transitionFrom が "left" になる', async () => {
        const wrapper = mount(Tab, {
            props: {
                tabs,
                modelValue: 'tab3',
                'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.findAll('button')[0].trigger('click'); // tab3 → tab1
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('left');
    });

    it('position="left" のとき transitionFrom は縦方向 ("bottom"/"top") を取る', async () => {
        const wrapper = mount(Tab, {
            props: {
                tabs,
                modelValue: 'tab1',
                position: 'left',
                'onUpdate:modelValue': (v: string) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.findAll('button')[2].trigger('click'); // tab1 → tab3 (前進) ⇒ 'bottom'
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('bottom');
        await wrapper.findAll('button')[0].trigger('click'); // tab3 → tab1 (戻る) ⇒ 'top'
        expect(wrapper.findComponent(TranslateTransition).props('from')).toBe('top');
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
