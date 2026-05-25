import { ref } from 'vue';
import FieldFrame from '@/components/inner-parts/FieldFrame.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof FieldFrame> = {
    component: FieldFrame,
    render: (args: Args) => ({
        components: { FieldFrame },
        setup() {
            return { args };
        },
        template: '<FieldFrame v-bind="args" />'
    }),
    args: {},
    argTypes: {}
};

export default meta;
type Story = StoryObj<typeof FieldFrame>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { FieldFrame },
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
        template: `<FieldFrame v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" :label="param.variant" />`
    }),
    args: { ...Default.args }
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { FieldFrame },
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
        template: `<FieldFrame v-for="param in params" :key="param.size" v-bind="{...args, ...param}" :label="param.size" />`
    }),
    args: { ...Default.args }
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { FieldFrame },
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
                }
            ])
        }),
        template: `<FieldFrame v-for="param in params" :key="param.shape" v-bind="{...args, ...param}" :label="param.shape" />`
    }),
    args: { ...Default.args }
};

export const PropsLabel: Story = {
    args: {
        label: '名前'
    }
};

export const PropsPlaceholder: Story = {
    args: {
        ...PropsLabel.args,
        placeholder: '山田 太郎'
    }
};

export const PropsRequired: Story = {
    args: {
        ...PropsLabel.args,
        required: true
    }
};

export const PropsDisabled: Story = {
    args: {
        ...PropsLabel.args,
        disabled: true
    }
};

export const TextCounter: Story = {
    args: {
        ...PropsLabel.args,
        value: 'test',
        maxLength: 100
    }
};

export const FocusAndInputed: Story = {
    args: {
        ...PropsLabel.args,
        isFocus: true
    }
};

export const Erorrs: Story = {
    args: {
        ...PropsLabel.args,
        errors: ['エラーテキスト', 'エラーテキスト2']
    }
};
