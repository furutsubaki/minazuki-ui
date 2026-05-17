import { describe, it, expect, vi, afterEach } from 'vitest';
import type { DirectiveBinding, Directive, VNode } from 'vue';
import useOutsideClick from '@/directives/useOutsideClick';

const mkBinding = <T>(value: T, oldValue: T | null = null): DirectiveBinding<T> => ({
    value,
    arg: undefined,
    modifiers: {},
    instance: null,
    dir: {} as Directive,
    oldValue
});

const nullVNode = null as unknown as VNode;

describe('useOutsideClick', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('要素の外側クリックでハンドラーが呼ばれる', () => {
        const handler = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, mkBinding({ handler, isActive: true, ignore: [] }), nullVNode, null);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, mkBinding(undefined), nullVNode, null);
        el.remove();
        outsideEl.remove();
    });

    it('isActive が false のとき外側クリックでハンドラーが呼ばれない', () => {
        const handler = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, mkBinding({ handler, isActive: false, ignore: [] }), nullVNode, null);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).not.toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, mkBinding(undefined), nullVNode, null);
        el.remove();
        outsideEl.remove();
    });

    it('updated でバインディング値が更新される', () => {
        const handler1 = vi.fn();
        const handler2 = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, mkBinding({ handler: handler1, isActive: true, ignore: [] }), nullVNode, null);
        vOutsideClick.updated!(
            el,
            mkBinding(
                { handler: handler2, isActive: true, ignore: [] },
                { handler: handler1, isActive: true, ignore: [] }
            ),
            nullVNode,
            null
        );

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler2).toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, mkBinding(undefined), nullVNode, null);
        el.remove();
        outsideEl.remove();
    });

    it('binding.value が関数のときハンドラーとして登録される', () => {
        const handler = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, mkBinding(handler), nullVNode, null);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, mkBinding(undefined), nullVNode, null);
        el.remove();
        outsideEl.remove();
    });

    it('ignore が Element のとき、その要素内クリックでハンドラーが呼ばれない', () => {
        const handler = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        const ignoreEl = document.createElement('button');
        document.body.appendChild(ignoreEl);

        vOutsideClick.mounted!(el, mkBinding({ handler, isActive: true, ignore: [ignoreEl] }), nullVNode, null);

        ignoreEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).not.toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, mkBinding(undefined), nullVNode, null);
        el.remove();
        ignoreEl.remove();
    });

    it('ignore が string セレクタのとき、その要素内クリックでハンドラーが呼ばれない', () => {
        const handler = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        const ignoreEl = document.createElement('span');
        ignoreEl.className = 'ignore-target';
        document.body.appendChild(ignoreEl);

        vOutsideClick.mounted!(el, mkBinding({ handler, isActive: true, ignore: ['.ignore-target'] }), nullVNode, null);

        ignoreEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).not.toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, mkBinding(undefined), nullVNode, null);
        el.remove();
        ignoreEl.remove();
    });

    it('updated で binding.value が関数のとき object ブランチをスキップし handler1 が維持される', () => {
        const handler1 = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, mkBinding({ handler: handler1, isActive: true, ignore: [] }), nullVNode, null);

        const newHandler = vi.fn();
        vOutsideClick.updated!(
            el,
            mkBinding(newHandler, { handler: handler1, isActive: true, ignore: [] }),
            nullVNode,
            null
        );

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler1).toHaveBeenCalled();
        expect(newHandler).not.toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, mkBinding(undefined), nullVNode, null);
        el.remove();
        outsideEl.remove();
    });

    it('updated で element が map にない場合は何もしない', () => {
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        expect(() =>
            vOutsideClick.updated!(
                el,
                mkBinding({ handler: vi.fn(), isActive: true, ignore: [] }),
                nullVNode,
                null
            )
        ).not.toThrow();

        el.remove();
    });

    it('binding.value が undefined のときデフォルトハンドラー（() => {}）が外側クリックで例外なく呼ばれる', () => {
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, mkBinding(undefined), nullVNode, null);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        expect(() => outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))).not.toThrow();

        vOutsideClick.beforeUnmount!(el, mkBinding(undefined), nullVNode, null);
        el.remove();
        outsideEl.remove();
    });
});
