import Badge from '@/components/feedback/Badge.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof Badge> = {
    component: Badge,
    render: (args: Args) => ({
        components: { Badge },
        setup() {
            return { args };
        },
        template: '<Badge v-bind="args">テキスト</Badge>'
    }),
    args: {
        content: '10'
    }
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Badge },
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
        template: `<Badge v-for="param in params" :key="param.variant" v-bind="{...args, ...param}">{{param.variant}}</Badge>`
    })
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Badge },
        setup: () => ({
            args,
            params: [
                {
                    shape: 'normal'
                },
                {
                    shape: 'dot'
                }
            ]
        }),
        template: `<Badge v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.shape}}</Badge>`
    })
};

export const PropsInline: Story = {
    args: {
        inline: true
    }
};

export const ContentOver99: Story = {
    args: {
        content: 1000
    }
};
