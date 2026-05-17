import { ref } from 'vue';
import Button from '@/components/basic/Button.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof Button> = {
    component: Button,
    render: (args: Args) => ({
        components: { Button },
        setup() {
            return { args };
        },
        template: '<Button v-bind="args">{{args.default}}</Button>'
    }),
    args: {
        default: 'ボタン'
    },
    argTypes: {
        // TODO: script setupに未対応のため二重定義
        variant: {
            options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger']
        },
        size: {
            options: ['small', 'medium', 'large']
        },
        shape: {
            options: ['normal', 'rounded', 'circle', 'square', 'skeleton']
        },
        onClick: { action: 'click' }
    }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({
            args,
            params: ref([
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
            ])
        }),
        template: `<Button v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.variant}}</Button>`
    })
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({
            args,
            params: ref([
                {
                    size: 'large'
                },
                {
                    size: 'medium'
                },
                {
                    size: 'small'
                }
            ])
        }),
        template: `<Button v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.size}}</Button>`
    })
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({
            args,
            params: ref([
                {
                    shape: 'normal'
                },
                {
                    shape: 'rounded'
                },
                {
                    shape: 'no-radius'
                },
                {
                    shape: 'circle'
                },
                {
                    shape: 'square'
                },
                {
                    shape: 'skeleton'
                },
                {
                    shape: 'link'
                }
            ])
        }),
        template: `<Button v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.shape}}</Button>`
    })
};

export const PropsReadonly: Story = {
    args: {
        readonly: true
    }
};
export const PropsDisabled: Story = {
    args: {
        disabled: true
    }
};

export const LongText: Story = {
    args: {
        default: '長いテキストのケース'
    }
};
