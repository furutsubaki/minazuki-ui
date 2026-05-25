import Textarea from '@/components/controls/Textarea.vue';
import useFormData from '@/composables/useFormData';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { string, object } from 'zod';

const TEST_SCHEMA = object({
    test: string().max(50).min(1)
}).required();

const meta: Meta<typeof Textarea> = {
    component: Textarea,
    render: (args: Args) => ({
        components: { Textarea },
        setup() {
            useFormData(TEST_SCHEMA, { test: 'ヤマダ タロウ' });
            return { args };
        },
        template: '<Textarea v-bind="args" />'
    }),
    args: {
        modelValue: ''
    },
    argTypes: {
        // TODO: 現状lintエラーの回避策なし
        // @ts-ignore
        'onUpdate:modelValue': { action: 'onUpdate:modelValue' }
    }
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Textarea },
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
        template: `<Textarea v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" :label="param.variant" />`
    }),
    args: { ...Default.args }
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Textarea },
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
        template: `<Textarea v-for="param in params" :key="param.size" v-bind="{...args, ...param}" :label="param.size" />`
    }),
    args: { ...Default.args }
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Textarea },
        setup: () => ({
            args,
            params: [
                {
                    shape: 'normal'
                },
                {
                    shape: 'rounded'
                },
                {
                    shape: 'no-radius'
                }
            ]
        }),
        template: `<Textarea v-for="param in params" :key="param.shape" v-bind="{...args, ...param}" :label="param.shape" />`
    }),
    args: { ...Default.args }
};

export const PropsLabel: Story = {
    args: {
        label: 'Textarea'
    }
};

export const PropsClearable: Story = {
    args: {
        clearable: true
    }
};

export const PropsPlaceholder: Story = {
    args: {
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
        ...Default.args,
        disabled: true
    }
};

export const PropsLine: Story = {
    args: {
        line: 5
    }
};

export const PropsMinLine: Story = {
    args: {
        minLine: 1
    }
};

export const PropsMaxLine: Story = {
    args: {
        maxLine: 5
    }
};

export const Schema: Story = {
    args: {
        ...PropsLabel.args,
        name: 'test',
        schema: TEST_SCHEMA.shape.test,
        placeholder: '山田 太郎'
    }
};
