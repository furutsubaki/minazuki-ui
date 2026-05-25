import Radio from '@/components/controls/Radio.vue';
import useFormData from '@/composables/useFormData';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { literal, object } from 'zod';

const TEST_SCHEMA = object({
    test: literal(true)
}).required();

const meta: Meta<typeof Radio> = {
    component: Radio,
    render: (args: Args) => ({
        components: { Radio },
        setup() {
            useFormData(TEST_SCHEMA, { test: false });
            return { args };
        },
        template: '<Radio v-bind="args">規約に同意</Radio>'
    }),
    args: {
        modelValue: false
    },
    argTypes: {
        // TODO: 現状lintエラーの回避策なし
        // @ts-ignore
        'onUpdate:modelValue': { action: 'onUpdate:modelValue' }
    }
};

export default meta;
type Story = StoryObj<typeof Radio>;

export const Default: Story = {
    args: {
        value: true
    }
};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Radio },
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
        template: `<Radio v-for="param in params" :key="param.variant" v-bind="{...args, ...param}">{{param.variant}}</Radio>`
    }),
    args: { ...Default.args }
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Radio },
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
        template: `<Radio v-for="param in params" :key="param.size" v-bind="{...args, ...param}">{{param.size}}</Radio>`
    }),
    args: { ...Default.args }
};

export const PropsLabel: Story = {
    args: {
        ...Default.args,
        modelValue: true,
        label: 'Radio'
    }
};

export const PropsRequired: Story = {
    args: {
        ...PropsLabel.args,
        required: true
    }
};

export const PropsRequiredByNotLabel: Story = {
    args: {
        required: true
    }
};

export const PropsDisabled: Story = {
    args: {
        ...Default.args,
        disabled: true
    }
};

export const Schema: Story = {
    args: {
        ...PropsLabel.args,
        name: 'test',
        schema: TEST_SCHEMA.shape.test
    }
};
