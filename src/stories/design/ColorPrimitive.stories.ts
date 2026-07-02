import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { defineComponent, h, computed } from 'vue';
import {
    HUE_NAMES,
    COLOR_STEPS,
    NEUTRAL_STEPS,
    DEFAULT_HUES,
    computePrimitiveColor,
    computeNeutralColor
} from '@/assets/ts/colors';

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

const PrimitiveGrid = defineComponent({
    name: 'PrimitiveGrid',
    setup() {
        const hueData = computed(() =>
            HUE_NAMES.map((name) => ({
                name,
                steps: COLOR_STEPS.map((step) => {
                    const { hex, oklch, L } = computePrimitiveColor(DEFAULT_HUES[name], step);
                    return { step, hex, oklch, L, varName: `--mi-${name}-${step}` };
                })
            }))
        );

        const neutralData = computed(() =>
            NEUTRAL_STEPS.map((step) => {
                const { hex, oklch, L } = computeNeutralColor(step);
                return { step, hex, oklch, L, varName: `--mi-neutral-${step}` };
            })
        );

        return () => {
            const gridColumns = `80px repeat(${COLOR_STEPS.length}, 1fr)`;

            const hueRows = hueData.value.flatMap(({ name, steps }) => [
                h('div', { style: headerStyle }, name),
                ...steps.map(({ hex, oklch, L, varName }) =>
                    h('div', { style: cellStyle(hex, L > 0.6 ? '#222' : '#fff') }, [
                        h('div', { style: { fontWeight: '600' } }, varName),
                        h('div', hex),
                        h('div', { style: { opacity: '0.7', fontSize: '10px' } }, oklch)
                    ])
                )
            ]);

            const stepHeaders = [
                h('div', { style: headerStyle }, ''),
                ...COLOR_STEPS.map((step) =>
                    h('div', { style: headerStyle }, String(step))
                )
            ];

            const neutralColumns = `80px repeat(${NEUTRAL_STEPS.length}, 1fr)`;
            const neutralHeaders = [
                h('div', { style: headerStyle }, ''),
                ...NEUTRAL_STEPS.map((step) =>
                    h('div', { style: headerStyle }, String(step))
                )
            ];

            const neutralRow = [
                h('div', { style: headerStyle }, 'neutral'),
                ...neutralData.value.map(({ hex, oklch, L, varName }) =>
                    h('div', { style: cellStyle(hex, L > 0.6 ? '#222' : '#fff') }, [
                        h('div', { style: { fontWeight: '600' } }, varName),
                        h('div', hex),
                        h('div', { style: { opacity: '0.7', fontSize: '10px' } }, oklch)
                    ])
                )
            ];

            return h('div', { style: { display: 'flex', flexDirection: 'column', gap: '32px' } }, [
                h('section', [
                    h('h2', {
                        style: {
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '12px',
                            color: 'var(--color-text-primary)'
                        }
                    }, 'Hue Colors (10 × 7 steps)'),
                    h('div', {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: gridColumns,
                            gap: '1px',
                            backgroundColor: 'var(--color-border)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)'
                        }
                    }, [...stepHeaders, ...hueRows])
                ]),
                h('section', [
                    h('h2', {
                        style: {
                            fontSize: '16px',
                            fontWeight: '700',
                            marginBottom: '12px',
                            color: 'var(--color-text-primary)'
                        }
                    }, 'Neutral (10 steps)'),
                    h('div', {
                        style: {
                            display: 'grid',
                            gridTemplateColumns: neutralColumns,
                            gap: '1px',
                            backgroundColor: 'var(--color-border)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid var(--color-border)'
                        }
                    }, [...neutralHeaders, ...neutralRow])
                ])
            ]);
        };
    }
});

const meta: Meta = {
    title: 'Design/Color Primitive',
    component: PrimitiveGrid,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'OKLCH ベースの Primitive カラーパレット。10 色相 × 7 明度ステップ + 無彩色 10 ステップ'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        components: { PrimitiveGrid },
        template: '<PrimitiveGrid />'
    })
};
