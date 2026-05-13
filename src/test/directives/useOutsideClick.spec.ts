import { describe, it, expect, vi, afterEach } from 'vitest';
import useOutsideClick from '@/directives/useOutsideClick';

describe('useOutsideClick', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('vOutsideClick ディレクティブが返される', () => {
        const { vOutsideClick } = useOutsideClick();
        expect(vOutsideClick).toBeDefined();
        expect(typeof vOutsideClick.mounted).toBe('function');
        expect(typeof vOutsideClick.beforeUnmount).toBe('function');
        expect(typeof vOutsideClick.updated).toBe('function');
    });

    it('要素の外側クリックでハンドラーが呼ばれる', () => {
        const handler = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, {
            value: { handler, isActive: true, ignore: [] },
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
        el.remove();
        outsideEl.remove();
    });

    it('isActive が false のとき外側クリックでハンドラーが呼ばれない', () => {
        const handler = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, {
            value: { handler, isActive: false, ignore: [] },
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).not.toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
        el.remove();
        outsideEl.remove();
    });

    it('updated でバインディング値が更新される', () => {
        const handler1 = vi.fn();
        const handler2 = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, {
            value: { handler: handler1, isActive: true, ignore: [] },
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any);

        vOutsideClick.updated!(el, {
            value: { handler: handler2, isActive: true, ignore: [] },
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: { handler: handler1, isActive: true, ignore: [] }
        } as any, null as any, null as any);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler2).toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
        el.remove();
        outsideEl.remove();
    });

    it('binding.value が関数のときハンドラーとして登録される', () => {
        const handler = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, {
            value: handler,
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
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

        vOutsideClick.mounted!(el, {
            value: { handler, isActive: true, ignore: [ignoreEl] },
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any);

        ignoreEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).not.toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
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

        vOutsideClick.mounted!(el, {
            value: { handler, isActive: true, ignore: ['.ignore-target'] },
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any);

        ignoreEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler).not.toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
        el.remove();
        ignoreEl.remove();
    });

    it('binding.value が undefined のとき neither function nor object ブランチを通る', () => {
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        expect(() => vOutsideClick.mounted!(el, {
            value: undefined,
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any)).not.toThrow();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
        el.remove();
    });

    it('updated で binding.value が関数のとき object ブランチをスキップし handler1 が維持される', () => {
        const handler1 = vi.fn();
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, {
            value: { handler: handler1, isActive: true, ignore: [] },
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any);

        const newHandler = vi.fn();
        vOutsideClick.updated!(el, {
            value: newHandler,
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: { handler: handler1, isActive: true, ignore: [] }
        } as any, null as any, null as any);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        expect(handler1).toHaveBeenCalled();
        expect(newHandler).not.toHaveBeenCalled();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
        el.remove();
        outsideEl.remove();
    });

    it('updated で element が map にない場合は何もしない', () => {
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        expect(() => vOutsideClick.updated!(el, {
            value: { handler: vi.fn(), isActive: true, ignore: [] },
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any)).not.toThrow();

        el.remove();
    });

    it('binding.value が undefined のときデフォルトハンドラー（() => {}）が外側クリックで例外なく呼ばれる', () => {
        const { vOutsideClick } = useOutsideClick();
        const el = document.createElement('div');
        document.body.appendChild(el);

        vOutsideClick.mounted!(el, {
            value: undefined,
            arg: undefined,
            modifiers: {},
            instance: null,
            dir: vOutsideClick as any,
            oldValue: undefined
        } as any, null as any, null as any);

        const outsideEl = document.createElement('div');
        document.body.appendChild(outsideEl);
        expect(() => outsideEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))).not.toThrow();

        vOutsideClick.beforeUnmount!(el, {} as any, null as any, null as any);
        el.remove();
        outsideEl.remove();
    });
});
