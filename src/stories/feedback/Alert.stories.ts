import Alert from '@/components/feedback/Alert.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import { Pen as IconPen } from 'lucide-vue-next';

const meta: Meta<typeof Alert> = {
    component: Alert,
    render: (args) => ({
        components: { Alert },
        setup() {
            return { args };
        },
        template: '<Alert v-bind="args" />'
    }),
    args: {
        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    },
    argTypes: {
        // TODO: script setupに未対応のため二重定義
        onClosed: { action: 'closed' }
    }
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args) => ({
        components: { Alert },
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
        template: `<Alert v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" :title="param.variant" />`
    })
};

export const PropsShape: Story = {
    render: (args) => ({
        components: { Alert },
        setup: () => ({
            args,
            params: [
                {
                    shape: 'normal'
                },
                {
                    shape: 'no-radius'
                }
            ]
        }),
        template: `<Alert v-for="param in params" :key="param.shape" v-bind="{...args, ...param}" :title="param.shape" />`
    })
};

export const PropsIcon: Story = {
    args: {
        icon: IconPen
    }
};
export const PropsTitle: Story = {
    args: {
        title: 'Sample Alert'
    }
};

export const PropsCloseable: Story = {
    args: {
        closeable: true
    }
};
