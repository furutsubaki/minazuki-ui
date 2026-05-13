import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@unhead/vue', () => ({
    useHead: vi.fn()
}));

import { useHead } from '@unhead/vue';
import useTheme from '@/composables/useTheme';

describe('useTheme', () => {
    const { themes } = useTheme();
    const initialThemesSnapshot = JSON.parse(JSON.stringify(themes.value));

    beforeEach(() => {
        (globalThis as any).localStorage?.removeItem('themeId');
        themes.value = JSON.parse(JSON.stringify(initialThemesSnapshot));
    });

    it('currentTheme のデフォルト値が light になる', () => {
        const { currentTheme } = useTheme();
        expect(currentTheme.value).toBe('light');
    });

    it('baseTheme が base と status を持つ', () => {
        const { baseTheme } = useTheme();
        expect(baseTheme.base).toBeDefined();
        expect(baseTheme.status).toBeDefined();
    });

    it('themes が light と dark を含む', () => {
        const { themes } = useTheme();
        expect(themes.value.light).toBeDefined();
        expect(themes.value.dark).toBeDefined();
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
        expect((themes.value.light as any).theme?.bgPrimary).toBe('#ffffff');
    });

    it('setTheme を呼ぶと useHead が呼ばれる', () => {
        const mockHead = vi.mocked(useHead);
        mockHead.mockClear();
        const { setTheme } = useTheme();
        setTheme('light');
        expect(mockHead).toHaveBeenCalled();
    });

    it('setTheme("dark") を呼ぶと dark テーマの CSS が生成される', () => {
        const mockHead = vi.mocked(useHead);
        mockHead.mockClear();
        const { setTheme } = useTheme();
        setTheme('dark');
        expect(mockHead).toHaveBeenCalled();
        const callArgs = mockHead.mock.calls[0][0] as any;
        expect(callArgs.bodyAttrs?.['data-theme']).toBe('dark');
    });

    it('# でも -- でも始まらないカラー値はそのまま CSS 変数に出力される', () => {
        const mockHead = vi.mocked(useHead);
        mockHead.mockClear();
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            light: { theme: { textPrimary: 'transparent' } as any }
        };

        setTheme('light');

        const callArgs = mockHead.mock.calls[0][0] as any;
        const style: string = callArgs.style[0].textContent;
        expect(style).toContain('transparent');

        themes.value = savedThemes;
    });

    it('joinThemeData が undefined の場合はその key をスキップする', () => {
        const mockHead = vi.mocked(useHead);
        mockHead.mockClear();
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        // themes から theme キーを除去することで joinTheme['theme'] を undefined にする
        themes.value = { light: {}, dark: {} };

        setTheme('light');

        expect(mockHead).toHaveBeenCalled();

        themes.value = savedThemes;
    });

    it('localStorage が存在しない場合は setTheme で localStorage を操作しない', () => {
        const mockHead = vi.mocked(useHead);
        mockHead.mockClear();
        const { setTheme } = useTheme();

        const savedLocalStorage = (globalThis as any).localStorage;
        (globalThis as any).localStorage = undefined;

        setTheme('light');

        expect(mockHead).toHaveBeenCalled();

        (globalThis as any).localStorage = savedLocalStorage;
    });

    it('localStorage が存在しない環境での currentTheme のデフォルト値は light', async () => {
        const savedLocalStorage = (globalThis as any).localStorage;
        (globalThis as any).localStorage = undefined;

        vi.resetModules();
        vi.doMock('@unhead/vue', () => ({ useHead: vi.fn() }));
        const { default: freshUseTheme } = await import('@/composables/useTheme');
        const { currentTheme } = freshUseTheme();

        expect(currentTheme.value).toBe('light');

        (globalThis as any).localStorage = savedLocalStorage;
        vi.resetModules();
    });
});
