import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';

vi.mock('@unhead/vue', () => ({
    useHead: vi.fn()
}));

import { useHead } from '@unhead/vue';
import useTheme from '@/composables/useTheme';

const THEME_STYLE_ID = 'minazuki-theme-vars';

describe('useTheme', () => {
    beforeEach(() => {
        window.localStorage?.removeItem('themeId');
        document.documentElement.removeAttribute('data-theme');
        document.getElementById(THEME_STYLE_ID)?.remove();
    });

    it('currentTheme のデフォルト値が light になる', () => {
        const { currentTheme } = useTheme();
        expect(currentTheme.value).toBe('light');
    });

    it('overrideTheme で primitives が上書きされる', () => {
        const { themeConfig, overrideTheme } = useTheme();
        overrideTheme({
            primitives: { hues: { red: 20 } }
        });
        expect(themeConfig.value.primitives.hues.red).toBe(20);
    });

    it('overrideTheme で status の紐付けが変更される', () => {
        const { themeConfig, overrideTheme } = useTheme();
        overrideTheme({
            statuses: { brand: { hue: 'blue', chroma: 'blue' } }
        });
        expect(themeConfig.value.statuses.brand.hue).toBe('blue');
        expect(themeConfig.value.statuses.brand.chroma).toBe('blue');
    });

    it('overrideTheme で UI トークンが文字列で上書きされる', () => {
        const { themeConfig, overrideTheme } = useTheme();
        overrideTheme({
            ui: { textPrimary: '#333333' }
        });
        expect(themeConfig.value.ui.textPrimary.light).toBe('#333333');
        expect(themeConfig.value.ui.textPrimary.dark).toBe('#333333');
    });

    it('overrideTheme で UI トークンが light/dark ペアで上書きされる', () => {
        const { themeConfig, overrideTheme } = useTheme();
        overrideTheme({
            ui: { textPrimary: { light: '#111', dark: '#eee' } }
        });
        expect(themeConfig.value.ui.textPrimary.light).toBe('#111');
        expect(themeConfig.value.ui.textPrimary.dark).toBe('#eee');
    });

    it('setTheme("dark") で data-theme と CSS が設定される', () => {
        const { setTheme } = useTheme();
        setTheme('dark');
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
        expect(document.getElementById(THEME_STYLE_ID)).not.toBeNull();
    });

    it('生成される CSS に Primitive トークンが含まれる', () => {
        const { setTheme } = useTheme();
        setTheme('light');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--mi-red-400:');
        expect(style).toContain('--mi-neutral-50:');
    });

    it('生成される CSS に Status トークンが含まれる', () => {
        const { setTheme } = useTheme();
        setTheme('light');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-brand:');
        expect(style).toContain('--color-danger-alpha:');
    });

    it('生成される CSS に UI トークンの light-dark() が含まれる', () => {
        const { setTheme } = useTheme();
        setTheme('light');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:light-dark(');
    });

    it('生成される CSS に overlay トークンが含まれる', () => {
        const { setTheme } = useTheme();
        setTheme('light');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-overlay:light-dark(#00000066,#000000b3)');
    });

    it('生成される CSS に surface-alpha トークンが含まれる', () => {
        const { setTheme } = useTheme();
        setTheme('light');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-brand-surface-alpha:');
        expect(style).toContain('--color-danger-surface-alpha:');
    });

    it('生成される CSS に link トークンが blue ベースになっている', () => {
        const { setTheme } = useTheme();
        setTheme('light');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-link:light-dark(');
        expect(style).toContain('--color-link-alpha:light-dark(');
    });

    it('生成される CSS に後方互換エイリアスが含まれる', () => {
        const { setTheme } = useTheme();
        setTheme('light');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-status-brand:var(--color-brand)');
        expect(style).toContain('--color-theme-text-primary:var(--color-text-primary)');
        expect(style).toContain('--color-base-white:var(--mi-neutral-100)');
    });

    it('dark テーマでは [data-theme="dark"]{color-scheme:dark} が出力される', () => {
        const { setTheme } = useTheme();
        setTheme('dark');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('[data-theme="dark"]{color-scheme:dark}');
    });

    it('window が存在しない（SSR）環境でも setTheme が正常に完了する', () => {
        const { setTheme } = useTheme();

        const savedWindow = (globalThis as unknown as Record<string, unknown>).window;
        (globalThis as unknown as Record<string, unknown>).window = undefined;

        expect(() => setTheme('light')).not.toThrow();

        (globalThis as unknown as Record<string, unknown>).window = savedWindow;
    });

    it('window が存在しない（SSR）環境での currentTheme のデフォルト値は light', async () => {
        const savedWindow = (globalThis as unknown as Record<string, unknown>).window;
        (globalThis as unknown as Record<string, unknown>).window = undefined;

        vi.resetModules();
        vi.doMock('@unhead/vue', () => ({ useHead: vi.fn() }));
        const { default: freshUseTheme } = await import('@/composables/useTheme');
        const { currentTheme } = freshUseTheme();

        expect(currentTheme.value).toBe('light');

        (globalThis as unknown as Record<string, unknown>).window = savedWindow;
        vi.resetModules();
    });

    it('localStorage.themeId に値が入っている場合はその値が currentTheme の初期値になる', async () => {
        window.localStorage.setItem('themeId', 'dark');

        vi.resetModules();
        vi.doMock('@unhead/vue', () => ({ useHead: vi.fn() }));
        const { default: freshUseTheme } = await import('@/composables/useTheme');
        const { currentTheme } = freshUseTheme();

        expect(currentTheme.value).toBe('dark');

        window.localStorage.removeItem('themeId');
        vi.resetModules();
    });

    it('currentTheme を変更すると watch 経由で setTheme が呼ばれる', async () => {
        const { currentTheme } = useTheme();

        currentTheme.value = 'dark';
        await nextTick();

        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

        currentTheme.value = 'light';
    });

    it('SSR 環境（document が undefined）では currentTheme 変更時の watch が早期リターンする', async () => {
        const { currentTheme } = useTheme();

        const savedDocument = (globalThis as unknown as Record<string, unknown>).document;
        (globalThis as unknown as Record<string, unknown>).document = undefined;

        currentTheme.value = 'dark';
        await nextTick();

        (globalThis as unknown as Record<string, unknown>).document = savedDocument;
        expect(document.documentElement.getAttribute('data-theme')).toBeNull();

        currentTheme.value = 'light';
        await nextTick();
    });

    it('SSR 環境（document が undefined）では useHead でテーマが注入される', () => {
        const mockHead = vi.mocked(useHead);
        mockHead.mockClear();
        const { setTheme } = useTheme();

        const savedDocument = (globalThis as unknown as Record<string, unknown>).document;
        (globalThis as unknown as Record<string, unknown>).document = undefined;

        setTheme('dark');

        expect(mockHead).toHaveBeenCalled();
        const callArgs = mockHead.mock.calls[0][0] as Record<string, unknown>;
        expect((callArgs.htmlAttrs as Record<string, string>)?.['data-theme']).toBe('dark');
        expect(
            ((callArgs.style as Array<{ textContent: string }>)[0]).textContent
        ).toBeTruthy();

        (globalThis as unknown as Record<string, unknown>).document = savedDocument;
    });
});
