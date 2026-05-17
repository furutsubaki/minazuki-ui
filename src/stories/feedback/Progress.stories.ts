import Progress from '@/components/feedback/Progress.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { Pen as IconPen } from 'lucide-vue-next';

const meta: Meta<typeof Progress> = {
    component: Progress,
    render: (args: Args) => ({
        components: { Progress, IconPen },
        setup() {
            return { args };
        },
        template: '<Progress v-bind="args" />'
    }),
    args: {
        modelValue: 10
    }
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Progress },
        setup: () => ({
            args,
            params: [
                {
                    variant: 'primary'
                },
                {
                    variant: 'secondary'
                },
                {
                    variant: 'info'
                },
                {
                    variant: 'success'
                },
                {
                    variant: 'warning'
                },
                {
                    variant: 'danger'
                }
            ]
        }),
        template: `<Progress v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" />`
    })
};

export const PropsSizeAndShape: Story = {
    render: (args: Args) => ({
        components: { Progress },
        setup: () => ({
            args,
            params: [
                {
                    size: 'large',
                    shape: 'line'
                },
                {
                    size: 'medium',
                    shape: 'line'
                },
                {
                    size: 'small',
                    shape: 'line'
                },
                {
                    size: 'large',
                    shape: 'slim-line'
                },
                {
                    size: 'medium',
                    shape: 'slim-line'
                },
                {
                    size: 'small',
                    shape: 'slim-line'
                },
                {
                    size: 'large',
                    shape: 'circle'
                },
                {
                    size: 'medium',
                    shape: 'circle'
                },
                {
                    size: 'small',
                    shape: 'circle'
                }
            ]
        }),
        template: `<Progress v-for="param in params" :key="param.size + '-' + params.shape" v-bind="{...args, ...param}" variant="info" />`
    })
};

export const PropsMax: Story = {
    args: {
        max: 1000
    }
};

export const PropsNoText: Story = {
    args: {
        noText: true
    }
};

export const CustomSlot: Story = {
    render: (args: Args) => ({
        components: { Progress, IconPen },
        setup() {
            return { args };
        },
        template: '<Progress v-bind="args"><IconPen /></Progress>'
    })
};
