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
                neutrals: {
                    textPrimary: '#123456'
                }
            }
        });
        expect(themes.value.custom).toBeDefined();
    });

    it('overrideTheme で既存テーマの neutrals が上書きされる', () => {
        const { themes, overrideTheme } = useTheme();
        overrideTheme({
            light: {
                neutrals: {
                    bgPrimary: '#ffffff'
                }
            }
        });
        expect(themes.value.light?.neutrals?.bgPrimary).toBe('#ffffff');
    });

    it('setTheme("dark") を呼ぶと dark テーマの CSS が生成される', () => {
        const { setTheme } = useTheme();
        setTheme('dark');
        expect(document.body.getAttribute('data-theme')).toBe('dark');
        expect(document.getElementById(THEME_STYLE_ID)).not.toBeNull();
    });

    it('# でも -- でも始まらない neutrals 値はそのまま CSS 変数に出力される', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            ...themes.value,
            light: { ...themes.value.light, neutrals: { ...themes.value.light.neutrals, textPrimary: 'transparent' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:transparent;');

        themes.value = savedThemes;
    });

    it('カスタムテーマ未指定の primitives/roles は light の値にフォールバックする', () => {
        const { themes, overrideTheme, setTheme } = useTheme();

        overrideTheme({
            custom: { neutrals: { textPrimary: '#123456' } }
        });
        expect(themes.value.custom).toEqual({ neutrals: { textPrimary: '#123456' } });

        setTheme('custom');
        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        // primitives/roles は light からフォールバックして合成される
        expect(style).toContain('--color-text-primary:#123456;');
        expect(style).toContain('--color-brand:#38a391;');
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
        themes.value = {
            ...themes.value,
            light: { ...themes.value.light, neutrals: { ...themes.value.light.neutrals, textPrimary: '#abcdefcc' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:#abcdefcc;');
        expect(style).toContain('--color-text-primary-alpha:#abcdefcc;');

        themes.value = savedThemes;
    });

    it('3桁hex(#rgb)の neutrals 上書きは6桁に展開されてから alpha 変換される', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            ...themes.value,
            light: { ...themes.value.light, neutrals: { ...themes.value.light.neutrals, textPrimary: '#fff' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:#ffffff;');
        expect(style).toContain('--color-text-primary-alpha:#ffffffcc;');

        themes.value = savedThemes;
    });

    it('4桁hex(#rgba)の neutrals 上書きは8桁に展開されてそのまま出力される', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            ...themes.value,
            light: { ...themes.value.light, neutrals: { ...themes.value.light.neutrals, textPrimary: '#f0f8' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:#ff00ff88;');
        expect(style).toContain('--color-text-primary-alpha:#ff00ff88;');

        themes.value = savedThemes;
    });

    it('-- プレフィックスの neutrals 上書きは var() 参照に変換される', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            ...themes.value,
            light: { ...themes.value.light, neutrals: { ...themes.value.light.neutrals, textPrimary: '--color-base-red' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:var(--color-base-red);');
        expect(style).toContain('--color-text-primary-alpha:var(--color-base-red-alpha);');

        themes.value = savedThemes;
    });

    it('-- プレフィックスかつ -alpha 終端の neutrals 上書きは alpha も同じ var() を参照する', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            ...themes.value,
            light: { ...themes.value.light, neutrals: { ...themes.value.light.neutrals, textPrimary: '--color-base-red-alpha' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:var(--color-base-red-alpha);');
        expect(style).toContain('--color-text-primary-alpha:var(--color-base-red-alpha);');

        themes.value = savedThemes;
    });

    it('oklch() を直接指定した neutrals 上書きは alpha 値が自動生成される', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            ...themes.value,
            light: { ...themes.value.light, neutrals: { ...themes.value.light.neutrals, textPrimary: 'oklch(0.5 0.1 200)' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:oklch(0.5 0.1 200);');
        expect(style).toContain('--color-text-primary-alpha:oklch(0.5 0.1 200 / 80%);');

        themes.value = savedThemes;
    });

    it('既に alpha 付き oklch() を neutrals に指定した場合はそのまま出力される', () => {
        const { themes, setTheme } = useTheme();

        const savedThemes = themes.value;
        themes.value = {
            ...themes.value,
            light: { ...themes.value.light, neutrals: { ...themes.value.light.neutrals, textPrimary: 'oklch(0.5 0.1 200 / 50%)' } }
        };

        setTheme('light');

        const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
        expect(style).toContain('--color-text-primary:oklch(0.5 0.1 200 / 50%);');
        expect(style).toContain('--color-text-primary-alpha:oklch(0.5 0.1 200 / 50%);');

        themes.value = savedThemes;
    });

    describe('Layer 1: Primitives', () => {
        it('hue/chroma/lightness/chromaScale が CSS 変数として出力される', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--mi-hue-red:25;');
            expect(style).toContain('--mi-hue-teal:180;');
            expect(style).toContain('--mi-chroma-red:0.22;');
            expect(style).toContain('--mi-l-base:0.65;');
            expect(style).toContain('--mi-l-emphasis:0.55;');
            expect(style).toContain('--mi-c-scale-full:1;');
            expect(style).toContain('--mi-c-scale-tint:0.15;');
        });

        it('light と dark で lightness スケールの値が異なる', () => {
            const { setTheme } = useTheme();

            setTheme('light');
            const lightStyle = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(lightStyle).toContain('--mi-l-emphasis:0.55;');

            setTheme('dark');
            const darkStyle = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(darkStyle).toContain('--mi-l-emphasis:0.7;');
        });
    });

    describe('Layer 2: Role エイリアス', () => {
        it('role ごとに --mi-hue-{role} / --mi-chroma-{role} の間接参照が出力される', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--mi-hue-brand:var(--mi-hue-teal);');
            expect(style).toContain('--mi-chroma-brand:var(--mi-chroma-teal);');
            expect(style).toContain('--mi-hue-danger:var(--mi-hue-red);');
            expect(style).toContain('--mi-hue-link:var(--mi-hue-orange);');
        });
    });

    describe('Layer 3: 明度ラダー展開（hex フォールバック）', () => {
        it('role は surface/subtle/muted/base/emphasis/strong/alpha の7段階を生成する', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--color-brand-surface:#e8f5f2;');
            expect(style).toContain('--color-brand-subtle:#bad5ce;');
            expect(style).toContain('--color-brand-muted:#84bbaf;');
            expect(style).toContain('--color-brand:#38a391;');
            expect(style).toContain('--color-brand-emphasis:#008474;');
            expect(style).toContain('--color-brand-strong:#006757;');
            expect(style).toContain('--color-brand-alpha:#38a391cc;');
        });

        it('danger/info/success/warning/link も同様にラダー展開される', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--color-danger:#f94144;');
            expect(style).toContain('--color-danger-emphasis:#d40924;');
            expect(style).toContain('--color-info:#65a33c;');
            expect(style).toContain('--color-success:#3a93e6;');
            expect(style).toContain('--color-warning:#efcc36;');
            expect(style).toContain('--color-link:#d3721e;');
        });

        it('warning は lightnessOffset によりラダー全体の明度が底上げされる', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            // base の L は 0.65+0.2=0.85。surface/subtle は 0.96/0.85 + 0.2 がクランプされ同値になる
            expect(style).toContain('--color-warning-surface:#fdf9e7;');
            expect(style).toContain('--color-warning-subtle:#fff9d5;');
            expect(style).toContain('--color-warning-muted:#ffefa4;');
            expect(style).toContain('--color-warning-emphasis:#ceab00;');
            expect(style).toContain('--color-warning-strong:#ae8c00;');
            expect(style).toContain('--color-warning-alpha:#efcc36cc;');
            expect(style).toContain(
                '--color-warning:oklch(clamp(0.02, calc(var(--mi-l-base) + 0.2), 0.98) calc(var(--mi-chroma-warning) * var(--mi-c-scale-full)) var(--mi-hue-warning));'
            );
        });

        it('dark テーマでは emphasis/strong が base より明るくなる', () => {
            const { setTheme } = useTheme();
            setTheme('dark');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--color-brand:#3c9182;');
            expect(style).toContain('--color-brand-emphasis:#5db0a0;');
            expect(style).toContain('--color-brand-strong:#77cab9;');
        });

        it('@supports ブロックに primitive var() を合成した oklch() が出力される', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('@supports (color: oklch(0 0 0))');
            expect(style).toContain(
                '--color-brand:oklch(var(--mi-l-base) calc(var(--mi-chroma-brand) * var(--mi-c-scale-full)) var(--mi-hue-brand));'
            );
            expect(style).toContain(
                '--color-brand-alpha:oklch(var(--mi-l-base) var(--mi-chroma-brand) var(--mi-hue-brand) / 80%);'
            );
        });
    });

    describe('拡張色（role 非依存）', () => {
        it('green/cyan/indigo/purple/pink は base + alpha のみ生成される', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--color-green:#31a773;');
            expect(style).toContain('--color-green-alpha:#31a773cc;');
            expect(style).toContain('--color-pink:#c967ac;');
            // ラダー展開はされない
            expect(style).not.toContain('--color-green-emphasis');
            expect(style).not.toContain('--color-green-surface');
        });
    });

    describe('後方互換エイリアス', () => {
        it('--color-status-* が新トークンを参照する', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--color-status-brand:var(--color-brand);');
            expect(style).toContain('--color-status-brand-alpha:var(--color-brand-alpha);');
            expect(style).toContain('--color-status-danger:var(--color-danger);');
        });

        it('--color-theme-* が新トークンを参照する', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--color-theme-text-primary:var(--color-text-primary);');
            expect(style).toContain('--color-theme-bg-primary:var(--color-bg-primary);');
            expect(style).toContain('--color-theme-border:var(--color-border);');
            expect(style).toContain('--color-theme-link:var(--color-link);');
            expect(style).toContain('--color-theme-link-hover:var(--color-link-emphasis);');
        });

        it('--color-base-* の有彩色が role/拡張色を参照する', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--color-base-red:var(--color-danger);');
            expect(style).toContain('--color-base-orange:var(--color-link);');
            expect(style).toContain('--color-base-blue:var(--color-success);');
            expect(style).toContain('--color-base-green:var(--color-green);');
        });

        it('--color-base-* の無彩色は静的な hex がそのまま出力される', () => {
            const { setTheme } = useTheme();
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--color-base-white:#f7f7f7;');
            expect(style).toContain('--color-base-white-alpha:#f7f7f7cc;');
            expect(style).toContain('--color-base-black:#2d2d2d;');
        });
    });

    describe('primitives override の波及', () => {
        it('hue を上書きすると role の合成色（hex フォールバック）が変わる', () => {
            const { themes, overrideTheme, setTheme } = useTheme();

            overrideTheme({
                light: { primitives: { hues: { teal: 250 } } }
            });
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            // hue だけ blue(250) 相当に変えても chroma は teal のまま(0.1)なので、
            // 既定値とは異なる新しい hex に変わる（success の hex とは一致しない）
            expect(style).toContain('--mi-hue-teal:250;');
            expect(style).toContain('--color-brand:#5e93ca;');
            expect(style).not.toContain('--color-brand:#38a391;');

            themes.value = JSON.parse(JSON.stringify(initialThemesSnapshot));
        });

        it('lightness.base を上書きすると複数 role の base 段階が一括で変わる', () => {
            const { themes, overrideTheme, setTheme } = useTheme();

            overrideTheme({
                light: { primitives: { lightness: { base: 0.5 } } }
            });
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--mi-l-base:0.5;');
            // base の明度が変わったことで hex フォールバックも brand/danger 双方で変化する
            expect(style).not.toContain('--color-brand:#38a391;');
            expect(style).not.toContain('--color-danger:#f94144;');

            themes.value = JSON.parse(JSON.stringify(initialThemesSnapshot));
        });

        it('roles の紐付けを変えると役割の色が別の hue/chroma を参照する', () => {
            const { themes, overrideTheme, setTheme } = useTheme();

            overrideTheme({
                light: { roles: { brand: { hue: 'blue', chroma: 'blue' } } }
            });
            setTheme('light');

            const style = document.getElementById(THEME_STYLE_ID)?.textContent ?? '';
            expect(style).toContain('--mi-hue-brand:var(--mi-hue-blue);');
            expect(style).toContain('--color-brand:#3a93e6;');

            themes.value = JSON.parse(JSON.stringify(initialThemesSnapshot));
        });
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
