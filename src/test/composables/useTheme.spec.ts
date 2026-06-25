import { describe, it, expect, vi, beforeEach } from 'vitest';
import { nextTick } from 'vue';

vi.mock('@unhead/vue', () => ({
    useHead: vi.fn()
}));

import { useHead } from '@unhead/vue';
import useTheme from '@/composables/useTheme';

const THEME_STYLE_ID = 'minazuki-theme-vars';

describe('useTheme', () => {
    const { themes } = useTheme();
    const initialThemesSnapshot = JSON.parse(JSON.stringify(themes.value));

    beforeEach(() => {
        window.localStorage?.removeItem('themeId');
        themes.value = JSON.parse(JSON.stringify(initialThemesSnapshot));
        document.body.removeAttribute('data-theme');
        document.getElementById(THEME_STYLE_ID)?.remove();
    });

    it('currentTheme のデフォルト値が light になる', () => {
        const { currentTheme } = useTheme();
        expect(currentTheme.value).toBe('light');
    });

    it('overrideTheme でカスタムテーマが追加される', () => {
        const { themes, overrideTheme } = useTheme();
        overrideTheme({
            custom: {
                theme: {
                    textPrimary: '#123456'
                }
            }
        });
        expect(themes.value.custom).toBeDefined();
    });

    it('overrideTheme で既存テーマが上書きされる', () => {
        const { themes, overrideTheme } = useTheme();
        overrideTheme({
            light: {
                theme: {
                    bgPrimary: '#ffffff'
                }
            }
        });
        expect(themes.value.light?.theme?.bgPrimary).toBe('#ffffff');
    });

    it('setTheme("dark") を呼ぶと dark テーマの CSS が生成される', () => {
        const { setTheme } = useTheme();
        setTheme('dark');
        expect(document.body.getAttribute('data-theme')).toBe('dark');
        expect(document.getElementById(THEME_STYLE_ID)).not.toBeNull();
    });

    it('# でも -- でも始まらないカラー値はそのまま CSS 変数に出力される', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            light: { theme: { textPrimary: 'transparent' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('transparent');

        themes.value = savedThemes;
    });

    it('joinThemeData が undefined の場合はその key をスキップする', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        // themes から theme キーを除去することで joinTheme['theme'] を undefined にする
        themes.value = { light: {}, dark: {} };

        setTheme('light');

        expect(document.body.getAttribute('data-theme')).toBe('light');

        themes.value = savedThemes;
    });

    it('window が存在しない（SSR）環境でも setTheme が正常に完了する', () => {
        const { setTheme } = useTheme();

        const savedWindow = (globalThis as any).window;
        (globalThis as any).window = undefined;

        expect(() => setTheme('light')).not.toThrow();
        expect(document.body.getAttribute('data-theme')).toBe('light');

        (globalThis as any).window = savedWindow;
    });

    it('window が存在しない（SSR）環境での currentTheme のデフォルト値は light', async () => {
        const savedWindow = (globalThis as any).window;
        (globalThis as any).window = undefined;

        vi.resetModules();
        vi.doMock('@unhead/vue', () => ({ useHead: vi.fn() }));
        const { default: freshUseTheme } = await import('@/composables/useTheme');
        const { currentTheme } = freshUseTheme();

        expect(currentTheme.value).toBe('light');

        (globalThis as any).window = savedWindow;
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

    it('末尾が cc の # 色は alpha 変換されずそのまま出力される', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = { light: { theme: { textPrimary: '#abcdefcc' } } };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-theme-text-primary:#abcdefcc;');
        expect(style).toContain('--color-theme-text-primary-alpha:#abcdefcc;');

        themes.value = savedThemes;
    });

    it('currentTheme を変更すると watch 経由で setTheme が呼ばれる', async () => {
        const { currentTheme } = useTheme();

        currentTheme.value = 'dark';
        await nextTick();

        expect(document.body.getAttribute('data-theme')).toBe('dark');

        currentTheme.value = 'light';
    });

    it('SSR 環境（document が undefined）では currentTheme 変更時の watch が早期リターンし data-theme が設定されない', async () => {
        const { currentTheme } = useTheme();

        const savedDocument = (globalThis as any).document;
        (globalThis as any).document = undefined;

        currentTheme.value = 'dark';
        await nextTick();

        (globalThis as any).document = savedDocument;
        expect(document.body.getAttribute('data-theme')).toBeNull();

        currentTheme.value = 'light';
        await nextTick();
    });

    it('SSR 環境（document が undefined）では useHead でテーマが注入される', () => {
        const mockHead = vi.mocked(useHead);
        mockHead.mockClear();
        const { setTheme } = useTheme();

        const savedDocument = (globalThis as any).document;
        (globalThis as any).document = undefined;

        setTheme('dark');

        expect(mockHead).toHaveBeenCalled();
        const callArgs = mockHead.mock.calls[0][0] as any;
        expect(callArgs.bodyAttrs?.['data-theme']).toBe('dark');
        expect(callArgs.style[0].textContent).toBeTruthy();

        (globalThis as any).document = savedDocument;
    });
});
