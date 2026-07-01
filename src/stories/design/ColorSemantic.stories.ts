import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, h, computed } from 'vue';
import {
    type ColorStep,
    type NeutralStep,
    STATUS_NAMES,
    SEMANTIC_SUFFIXES,
    SEMANTIC_STEP_MAP,
    DEFAULT_HUES,
    DEFAULT_STATUSES,
    computeStatusColor,
    computeNeutralColor,
    computePrimitiveColor
} from '@/assets/ts/colors';
import type { MiSemanticUI, UITokenPair } from '@/composables/useTheme';

const cellStyle = (bg: string, textColor: string): Record<string, string> => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 4px',
    backgroundColor: bg,
    color: textColor,
    fontSize: '11px',
    fontFamily: 'monospace',
    lineHeight: '1.4',
    minHeight: '72px',
    textAlign: 'center'
});

const headerStyle: Record<string, string> = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px 4px',
    fontSize: '11px',
    fontWeight: '700',
    fontFamily: 'monospace',
    color: 'var(--color-text-secondary)',
    backgroundColor: 'var(--color-bg-secondary)',
    textTransform: 'capitalize'
};

const suffixLabels = ['(base)', ...SEMANTIC_SUFFIXES, 'surface-alpha'] as const;

const DEFAULT_UI_PAIRS: { key: keyof MiSemanticUI; label: string; pair: UITokenPair }[] = [
    { key: 'textPrimary', label: 'text-primary', pair: { light: 'var(--mi-neutral-700)', dark: 'var(--mi-neutral-50)' } },
    { key: 'textSecondary', label: 'text-secondary', pair: { light: 'var(--mi-neutral-600)', dark: 'var(--mi-neutral-300)' } },
    { key: 'textDisabled', label: 'text-disabled', pair: { light: 'var(--mi-neutral-400)', dark: 'var(--mi-neutral-500)' } },
    { key: 'placeholder', label: 'placeholder', pair: { light: 'var(--mi-neutral-400)', dark: 'var(--mi-neutral-500)' } },
    { key: 'bgSurface', label: 'bg-surface', pair: { light: 'var(--mi-neutral-50)', dark: 'var(--mi-neutral-900)' } },
    { key: 'bgPrimary', label: 'bg-primary', pair: { light: 'var(--mi-neutral-100)', dark: 'var(--mi-neutral-800)' } },
    { key: 'bgSecondary', label: 'bg-secondary', pair: { light: 'var(--mi-neutral-200)', dark: 'var(--mi-neutral-700)' } },
    { key: 'bgTertiary', label: 'bg-tertiary', pair: { light: 'var(--mi-neutral-300)', dark: 'var(--mi-neutral-600)' } },
    { key: 'bgSelect', label: 'bg-select', pair: { light: 'brand-alpha', dark: 'brand-alpha' } },
    { key: 'overlay', label: 'overlay', pair: { light: '#00000066', dark: '#000000b3' } },
    { key: 'border', label: 'border', pair: { light: 'var(--mi-neutral-300)', dark: 'var(--mi-neutral-600)' } },
    { key: 'borderStrong', label: 'border-strong', pair: { light: 'var(--mi-neutral-400)', dark: 'var(--mi-neutral-500)' } },
    { key: 'shadow', label: 'shadow', pair: { light: 'var(--mi-neutral-800)', dark: 'var(--mi-neutral-900)' } },
    { key: 'link', label: 'link', pair: { light: 'var(--mi-blue-400)', dark: 'var(--mi-blue-300)' } },
    { key: 'linkHover', label: 'link-hover', pair: { light: 'var(--mi-blue-500)', dark: 'var(--mi-blue-200)' } }
];

function resolveVarToHex(ref: string): string {
    if (ref.startsWith('#')) return ref;

    const neutralMatch = ref.match(/^var\(--mi-neutral-(\d+)\)$/);
    if (neutralMatch) {
        return computeNeutralColor(Number(neutralMatch[1]) as NeutralStep).hex;
    }
    const hueMatch = ref.match(/^var\(--mi-(\w+)-(\d+)\)$/);
    if (hueMatch) {
        const [, hue, step] = hueMatch;
        const def = DEFAULT_HUES[hue as keyof typeof DEFAULT_HUES];
        if (def) return computePrimitiveColor(def, Number(step) as ColorStep).hex;
    }
    if (ref === 'brand-alpha') {
        const brandDef = DEFAULT_STATUSES.brand;
        return computeStatusColor(brandDef, DEFAULT_HUES, 400).hex + 'cc';
    }
    return '#888';
}

const SemanticGrid = defineComponent({
    name: 'SemanticGrid',
    setup() {
        const statusData = computed(() =>
            STATUS_NAMES.map((name) => {
                const def = DEFAULT_STATUSES[name];
                const base = computeStatusColor(def, DEFAULT_HUES, 400);
                const suffixes = SEMANTIC_SUFFIXES.map((suffix) => {
                    const step = SEMANTIC_STEP_MAP[suffix];
                    const color = computeStatusColor(def, DEFAULT_HUES, step);
                    const varName = suffix === 'alpha'
                        ? `--color-${name}-alpha`
                        : `--color-${name}-${suffix}`;
                    const hex = suffix === 'alpha' ? `${color.hex}cc` : color.hex;
                    return { suffix, hex, varName, L: color.L };
                });
                const surfaceColor = computeStatusColor(def, DEFAULT_HUES, 100);
                const surfaceAlpha = {
                    suffix: 'surface-alpha' as const,
                    hex: `${surfaceColor.hex}80`,
                    varName: `--color-${name}-surface-alpha`,
                    L: surfaceColor.L
                };
                return {
                    name,
                    base: { hex: base.hex, varName: `--color-${name}`, L: base.L },
                    suffixes: [...suffixes, surfaceAlpha]
                };
            })
        );

        const uiResolved = computed(() =>
            DEFAULT_UI_PAIRS.map(({ label, pair }) => ({
                label,
                lightHex: resolveVarToHex(pair.light),
                darkHex: resolveVarToHex(pair.dark)
            }))
        );

        return () => {
            const cols = `80px repeat(${suffixLabels.length}, 1fr)`;

            const colHeaders = [
                h('div', { style: headerStyle }, ''),
                ...suffixLabels.map((l) =>
                    h('div', { style: headerStyle }, l)
                )
            ];

            const statusRows = statusData.value.flatMap(({ name, base, suffixes }) => [
                h('div', { style: headerStyle }, name),
                h('div', { style: cellStyle(base.hex, base.L > 0.6 ? '#222' : '#fff') }, [
                    h('div', { style: { fontWeight: '600' } }, base.varName),
                    h('div', base.hex)
                ]),
                ...suffixes.map(({ hex, varName, L }) =>
                    h('div', { style: cellStyle(hex, L > 0.6 ? '#222' : '#fff') }, [
                        h('div', { style: { fontWeight: '600' } }, varName),
                        h('div', hex)
                    ])
                )
            ]);

            const resolved = uiResolved.value;

            const uiTokenSection = h('section', [
                h('h2', {
                    style: {
                        fontSize: '16px',
                        fontWeight: '700',
                        marginBottom: '12px',
                        color: 'var(--color-text-primary)'
                    }
                }, 'UI Tokens (light-dark)'),
                h('div', {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px'
                    }
                }, [
                    createThemePreview('light', resolved),
                    createThemePreview('dark', resolved)
                ])
            ]);

            return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '32px' } }, [
                h('section', [
                    h('h2', {
                        style: {
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '12px',
                            color: 'var(--color-text-primary)'
                        }
                    }, 'Status Tokens (5 statuses × 8 variants)'),
                    h('div', {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: cols,
                            gap: '1px',
                            backgroundColor: 'var(--color-border)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)'
                        }
                    }, [...colHeaders, ...statusRows])
                ]),
                uiTokenSection
            ]);
        };
    }
});

interface ResolvedUIToken {
    label: string;
    lightHex: string;
    darkHex: string;
}

function createThemePreview(
    theme: 'light' | 'dark',
    resolved: ResolvedUIToken[]
) {
    const bgColor = theme === 'light' ? '#f2f2f2' : '#383838';
    const textColor = theme === 'light' ? '#4d4d4d' : '#fbfbfb';
    const borderColor = theme === 'light' ? '#d0d0d0' : '#555';

    return h('div', {
        style: {
            backgroundColor: bgColor,
            borderRadius: '8px',
            padding: '16px',
            border: `1px solid ${borderColor}`
        }
    }, [
        h('h3', {
            style: {
                fontSize: '13px',
                fontWeight: '700',
                marginBottom: '12px',
                color: textColor,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }
        }, theme),
        ...resolved.map(({ label, lightHex, darkHex }) => {
            const hex = theme === 'light' ? lightHex : darkHex;
            return h('div', {
                style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 8px'
                }
            }, [
                h('div', {
                    style: {
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        backgroundColor: hex,
                        border: `1px solid ${borderColor}`,
                        flexShrink: '0'
                    }
                }),
                h('div', {
                    style: {
                        fontFamily: 'monospace',
                        fontSize: '11px',
                        color: textColor,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1px'
                    }
                }, [
                    h('span', { style: { fontWeight: '600' } }, `--color-${label}`),
                    h('span', { style: { opacity: '0.7', fontSize: '10px' } }, hex)
                ])
            ]);
        })
    ]);
}

const meta: Meta = {
    title: 'Design/Color Semantic',
    component: SemanticGrid,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Semantic カラートークン。Status 系（brand/info/success/warning/danger）の全段階 + UI トークンの Light/Dark プレビュー'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        components: { SemanticGrid },
        template: '<SemanticGrid />'
    })
};
