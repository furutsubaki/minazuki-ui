import Rating from '@/components/feedback/Rating.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof Rating> = {
    component: Rating,
    render: (args: Args) => ({
        components: { Rating },
        setup() {
            return { args };
        },
        template: '<Rating v-bind="args" />'
    }),
    args: {
        modelValue: 3
    }
    // argTypes: {
    //     // TODO: 現状lintエラーの回避策なし
    //     // @ts-ignore
    //     'onUpdate:modelValue': { action: 'onUpdate:modelValue' }
    // }
};

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Rating },
        setup: () => ({
            args,
            params: [
                {
                    variant: 'dynamic'
                },
                {
                    variant: 'flat'
                }
            ]
        }),
        template: `<Rating v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" />`
    })
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Rating },
        setup: () => ({
            args,
            params: [
                {
                    size: 'large'
                },
                {
                    size: 'medium'
                },
                {
                    size: 'small'
                }
            ]
        }),
        template: `<Rating v-for="param in params" :key="param.size" v-bind="{...args, ...param}" />`
    })
};

export const PropsLength: Story = {
    args: {
        length: 3
    }
};
export const PropsHalf: Story = {
    args: {
        half: true
    }
};

export const PropsClearable: Story = {
    args: {
        clearable: true
    }
};

export const PropsReadonly: Story = {
    args: {
        readonly: true
    }
};
