import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import { ChevronRight } from 'lucide-vue-next';
import Breadcrumb from '@/components/navigation/Breadcrumb.vue';

const items = [
    { label: 'ホーム', to: '/' },
    { label: 'カテゴリ', to: '/category' },
    { label: '詳細', to: '/category/detail' }
];

const withCurrent = (testItem: Record<string, unknown>) => [
    testItem,
    { label: '現在のページ', to: '/current' }
];

describe('Breadcrumb', () => {
    it('items の数だけリンクがレンダリングされる', () => {
        const wrapper = mount(Breadcrumb, { props: { items } });
        expect(wrapper.findAll('.link')).toHaveLength(3);
    });

    it('items のラベルが表示される', () => {
        const wrapper = mount(Breadcrumb, { props: { items } });
        const links = wrapper.findAll('.link');
        expect(links[0].text()).toBe('ホーム');
        expect(links[1].text()).toBe('カテゴリ');
        expect(links[2].text()).toBe('詳細');
    });

    it('最後のアイテムに is-disabled クラスが付く', () => {
        const wrapper = mount(Breadcrumb, { props: { items } });
        const links = wrapper.findAll('.link');
        expect(links[0].classes()).not.toContain('is-disabled');
        expect(links[2].classes()).toContain('is-disabled');
    });

    it('title が表示される', () => {
        const wrapper = mount(Breadcrumb, { props: { items, title: 'サイト名' } });
        expect(wrapper.text()).toContain('サイト名');
    });

    it('icon を持つアイテムにアイコンが表示される', () => {
        const iconItems = [
            { label: 'ホーム', to: '/', icon: ChevronRight },
            { label: '詳細', to: '/detail' }
        ];
        const wrapper = mount(Breadcrumb, { props: { items: iconItems } });
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('セパレータがデフォルトで / になる', () => {
        const wrapper = mount(Breadcrumb, { props: { items } });
        const separators = wrapper.findAll('.separator');
        expect(separators[0].text()).toBe('/');
    });

    it('size prop がクラスに反映される', () => {
        const wrapper = mount(Breadcrumb, { props: { items, size: 'large' } });
        expect(wrapper.find('.component-breadcrumb').classes()).toContain('large');
    });

    it('blank が true のとき window.open が呼ばれる', async () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null as any);
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'リンク', to: '/test', blank: true }) }
        });
        await wrapper.find('a.link').trigger('click');
        expect(openSpy).toHaveBeenCalledWith('/test', '_blank', 'noopener,noreferrer');
        openSpy.mockRestore();
    });

    it('href が設定されているとき window.open が呼ばれる（blank: true）', async () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null as any);
        const wrapper = mount(Breadcrumb, {
            props: {
                items: withCurrent({
                    label: 'リンク',
                    to: '/test',
                    href: 'https://example.com',
                    blank: true
                })
            }
        });
        await wrapper.find('a.link').trigger('click');
        expect(openSpy).toHaveBeenCalledWith('https://example.com', '_blank', 'noopener,noreferrer');
        openSpy.mockRestore();
    });

    it('replace が true のとき location.replace が呼ばれる', async () => {
        const replaceSpy = vi.spyOn(window.location, 'replace').mockImplementation(() => {});
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'リンク', to: '/test', replace: true }) }
        });
        await wrapper.find('a.link').trigger('click');
        expect(replaceSpy).toHaveBeenCalledWith('/test');
        replaceSpy.mockRestore();
    });

    it('prefix slot が表示される', () => {
        const wrapper = mount(Breadcrumb, {
            props: { items },
            slots: { prefix: '<span class="pref">TOP</span>' }
        });
        expect(wrapper.find('.pref').exists()).toBe(true);
    });

    it('通常リンクをクリックすると遷移する', async () => {
        const hrefSpy = vi.spyOn(window.location, 'href', 'set');
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'テスト', to: '/test' }) }
        });
        await wrapper.find('a.link').trigger('click');
        expect(hrefSpy).toHaveBeenCalledWith('/test');
        hrefSpy.mockRestore();
    });

    it('router がある場合 router.push が呼ばれる', async () => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [{ path: '/', component: { template: '<div />' } }]
        });
        const pushSpy = vi.spyOn(router, 'push').mockResolvedValue(undefined as any);
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'テスト', to: '/' }) },
            global: { plugins: [router] }
        });
        await router.isReady();
        await wrapper.find('a.link').trigger('click');
        expect(pushSpy).toHaveBeenCalledWith('/');
        pushSpy.mockRestore();
    });

    it('router がある場合 replace=true のとき router.replace が呼ばれる', async () => {
        const router = createRouter({
            history: createMemoryHistory(),
            routes: [{ path: '/', component: { template: '<div />' } }]
        });
        const replaceSpy = vi.spyOn(router, 'replace').mockResolvedValue(undefined as any);
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'テスト', to: '/', replace: true }) },
            global: { plugins: [router] }
        });
        await router.isReady();
        await wrapper.find('a.link').trigger('click');
        expect(replaceSpy).toHaveBeenCalledWith('/');
        replaceSpy.mockRestore();
    });

    it('to も href もないアイテムをクリックすると何もしない', async () => {
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'テスト' }) }
        });
        await wrapper.find('a.link').trigger('click');
        expect(wrapper.find('.component-breadcrumb').exists()).toBe(true);
    });

    it('separator が Component のとき component が表示される', () => {
        const wrapper = mount(Breadcrumb, { props: { items, separator: ChevronRight } });
        expect(wrapper.find('.separator').exists()).toBe(true);
    });

    it('不正な URL（javascript:）を渡した場合は遷移しない', async () => {
        const hrefSpy = vi.spyOn(window.location, 'href', 'set');
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'XSS', to: 'javascript:alert(1)' }) }
        });
        await wrapper.find('a.link').trigger('click');
        expect(hrefSpy).not.toHaveBeenCalled();
        hrefSpy.mockRestore();
    });

    it('不正な URL の href 属性はサニタイズされる', () => {
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'XSS', to: 'javascript:alert(1)' }) }
        });
        expect(wrapper.find('a.link').attributes('href')).toBe('#');
    });

    it('不正な URL（javascript:）で blank=true の場合は window.open が呼ばれない', async () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null as any);
        const wrapper = mount(Breadcrumb, {
            props: {
                items: withCurrent({ label: 'XSS', to: 'javascript:alert(1)', blank: true })
            }
        });
        await wrapper.find('a.link').trigger('click');
        expect(openSpy).not.toHaveBeenCalled();
        openSpy.mockRestore();
    });

    it('nav 要素に aria-label が設定される', () => {
        const wrapper = mount(Breadcrumb, { props: { items } });
        const nav = wrapper.find('nav.component-breadcrumb');
        expect(nav.exists()).toBe(true);
        expect(nav.attributes('aria-label')).toBe('パンくずリスト');
    });

    it('最後のアイテムは span 要素で aria-current="page" が付く', () => {
        const wrapper = mount(Breadcrumb, { props: { items } });
        const links = wrapper.findAll('.link');
        const lastLink = links[links.length - 1];
        expect(lastLink.element.tagName).toBe('SPAN');
        expect(lastLink.attributes('aria-current')).toBe('page');
    });

    it('最後以外のアイテムは a 要素である', () => {
        const wrapper = mount(Breadcrumb, { props: { items } });
        const links = wrapper.findAll('.link');
        expect(links[0].element.tagName).toBe('A');
        expect(links[1].element.tagName).toBe('A');
    });

    it('a 要素に href が設定される', () => {
        const wrapper = mount(Breadcrumb, { props: { items } });
        const firstLink = wrapper.find('a.link');
        expect(firstLink.attributes('href')).toBe('/');
    });

    it('blank のとき a 要素に target と rel が設定される', () => {
        const wrapper = mount(Breadcrumb, {
            props: { items: withCurrent({ label: 'リンク', href: 'https://example.com', blank: true }) }
        });
        const link = wrapper.find('a.link');
        expect(link.attributes('target')).toBe('_blank');
        expect(link.attributes('rel')).toBe('noopener noreferrer');
    });
});
