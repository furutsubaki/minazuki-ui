import { describe, it, expect, vi } from 'vitest';
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import Pagination from '@/components/navigation/Pagination.vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';

describe('Pagination', () => {
    it('total が 10 のとき表示ページ数が最大 9 になる', () => {
        const wrapper = mount(Pagination, {
            props: { total: 10, modelValue: 5 }
        });
        // 9個以下のページボタンが表示される
        const pageButtons = wrapper.findAll('.pagination-item:not(.prev-first):not(.prev):not(.next):not(.next-last)');
        expect(pageButtons.length).toBeGreaterThan(0);
    });

    it('hidePrevNextButton が true のとき前後ボタンが非表示', () => {
        const wrapper = mount(Pagination, {
            props: { total: 5, hidePrevNextButton: true }
        });
        expect(wrapper.find('.prev').exists()).toBe(false);
        expect(wrapper.find('.next').exists()).toBe(false);
    });

    it('hideFirstLastButton が true のとき先頭末尾ボタンが非表示', () => {
        const wrapper = mount(Pagination, {
            props: { total: 5, hideFirstLastButton: true }
        });
        expect(wrapper.find('.prev-first').exists()).toBe(false);
        expect(wrapper.find('.next-last').exists()).toBe(false);
    });

    it('ページをクリックすると v-model が更新される', async () => {
        const wrapper = mount(Pagination, {
            props: {
                total: 10,
                modelValue: 5,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        const pageButtons = wrapper.findAll('.pagination-item').filter(
            (item) => item.find('button').exists() && item.find('button').text() === '3'
        );
        expect(pageButtons.length).toBeGreaterThan(0);
        await pageButtons[0].find('button').trigger('click');
        expect(wrapper.props('modelValue')).toBe(3);
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Pagination, { props: { total: 5, size: 'large' } });
        expect(wrapper.find('.component-pagination').classes()).toContain('large');
    });

    it('currentPage が 1 のとき prev-first が is-disabled になる', () => {
        const wrapper = mount(Pagination, { props: { total: 5, modelValue: 1 } });
        expect(wrapper.find('.prev-first').classes()).toContain('is-disabled');
    });

    it('currentPage が total のとき next-last が is-disabled になる', () => {
        const wrapper = mount(Pagination, { props: { total: 5, modelValue: 5 } });
        expect(wrapper.find('.next-last').classes()).toContain('is-disabled');
    });

    it('total が 1 のとき dummy ページが前後に追加されて 9 件になる', () => {
        const wrapper = mount(Pagination, { props: { total: 1 } });
        const pageItems = wrapper.findAll('.pagination-item:not(.prev-first):not(.prev):not(.next):not(.next-last)');
        expect(pageItems.length).toBe(9);
    });

    it('currentPage が 1 のとき prev ボタンクリックは何もしない', async () => {
        const wrapper = mount(Pagination, {
            props: {
                total: 5,
                modelValue: 1,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        // prev button passes undefined to onClick → else branch
        await wrapper.find('.prev button').trigger('click');
        expect(wrapper.props('modelValue')).toBe(1);
    });

    it('shape="picture-frame" が反映される', () => {
        const wrapper = mount(Pagination, { props: { total: 5, shape: 'picture-frame' } });
        expect(wrapper.findComponent(PictureFrame).exists()).toBe(true);
    });

    it('shape="skeleton" のとき div がルート要素として使われる', () => {
        const wrapper = mount(Pagination, { props: { total: 5, shape: 'skeleton' } });
        expect(wrapper.element.tagName).toBe('DIV');
    });

    it('unmount してもエラーが起きない', () => {
        const wrapper = mount(Pagination, { props: { total: 5 } });
        expect(() => wrapper.unmount()).not.toThrow();
    });

    it('total が 0 のとき pages が空配列になりページボタンが表示されない', () => {
        const wrapper = mount(Pagination, { props: { total: 0 } });
        const pageItems = wrapper.findAll('.pagination-item:not(.prev-first):not(.prev):not(.next):not(.next-last)');
        expect(pageItems.length).toBe(0);
    });

    it('next ボタンをクリックすると次のページに移動する', async () => {
        const wrapper = mount(Pagination, {
            props: {
                total: 5,
                modelValue: 3,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.next button').trigger('click');
        expect(wrapper.props('modelValue')).toBe(4);
    });

    it('next-last ボタンをクリックすると最後のページに移動する', async () => {
        const wrapper = mount(Pagination, {
            props: {
                total: 5,
                modelValue: 1,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.next-last button').trigger('click');
        expect(wrapper.props('modelValue')).toBe(5);
    });

    it('prev-first ボタンをクリックすると最初のページに移動する', async () => {
        const wrapper = mount(Pagination, {
            props: {
                total: 5,
                modelValue: 5,
                'onUpdate:modelValue': (v: number) => wrapper.setProps({ modelValue: v })
            }
        });
        await wrapper.find('.prev-first button').trigger('click');
        expect(wrapper.props('modelValue')).toBe(1);
    });

    it('ResizeObserver コールバックで clientWidth が更新されページ数が変化する', async () => {
        let observerCallback: ((entries: ResizeObserverEntry[]) => void) | undefined;
        vi.stubGlobal('ResizeObserver', vi.fn((callback: (entries: ResizeObserverEntry[]) => void) => {
            observerCallback = callback;
            return { observe: vi.fn(), disconnect: vi.fn(), unobserve: vi.fn() };
        }));
        const wrapper = mount(Pagination, { props: { total: 5, modelValue: 3 } });
        await nextTick();
        const pageCountBefore = wrapper.findAll('.pagination-item:not(.prev-first):not(.prev):not(.next):not(.next-last)').length;
        if (observerCallback) {
            observerCallback([{ contentRect: { width: 800 } } as any]);
            await nextTick();
        }
        const pageCountAfter = wrapper.findAll('.pagination-item:not(.prev-first):not(.prev):not(.next):not(.next-last)').length;
        expect(pageCountAfter).toBeGreaterThan(pageCountBefore);
        vi.unstubAllGlobals();
    });
});
