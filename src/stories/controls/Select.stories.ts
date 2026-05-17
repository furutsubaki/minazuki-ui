import Select from '@/components/controls/Select.vue';
import useFormData from '@/composables/useFormData';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { string, object } from 'zod';

const TEST_SCHEMA = object({
    test: string().min(1)
}).required();

const meta: Meta<typeof Select> = {
    component: Select,
    render: (args: Args) => ({
        components: { Select },
        setup() {
            useFormData(TEST_SCHEMA, { test: 'dog' });
            return { args };
        },
        template: '<Select v-bind="args" />'
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
type Story = StoryObj<typeof Select>;

export const Default: Story = {
    args: {
        items: [
            { label: '犬', value: 'dog' },
            { label: '猫', value: 'cat' },
            { label: '兎', value: 'rabbit' }
        ]
    }
};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Select },
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
        template: `<Select v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" :label="param.variant" />`
    }),
    args: { ...Default.args }
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Select },
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
        template: `<Select v-for="param in params" :key="param.size" v-bind="{...args, ...param}" :label="param.size" />`
    }),
    args: { ...Default.args }
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Select },
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
        template: `<Select v-for="param in params" :key="param.shape" v-bind="{...args, ...param}" :label="param.shape" />`
    }),
    args: { ...Default.args }
};

export const PropsPosition: Story = {
    render: (args: Args) => ({
        components: { Select },
        setup: () => ({
            args,
            params: [
                {
                    position: 'button'
                },
                {
                    position: 'top'
                }
            ]
        }),
        template: `<Select v-for="param in params" :key="param.position" v-bind="{...args, ...param}" :label="param.position" />`
    }),
    args: {
        ...Default.args
    }
};

export const PropsLabel: Story = {
    args: {
        ...Default.args,
        modelValue: 'dog',
        label: 'Select'
    }
};

export const PropsClearable: Story = {
    args: {
        ...Default.args,
        clearable: true
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

export const ItemDisabled: Story = {
    args: {
        ...Default.args,
        items: [
            ...Default.args!.items!,
            {
                label: '烏',
                value: 'crow',
                disabled: true
            }
        ]
    }
};

export const Schema: Story = {
    args: {
        ...PropsLabel.args,
        name: 'test',
        schema: TEST_SCHEMA.shape.test,
        items: [
            ...PropsLabel.args!.items!,
            {
                label: '未入力',
                value: ''
            }
        ]
    }
};
