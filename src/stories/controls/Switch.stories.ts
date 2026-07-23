import Switch from '@/components/controls/Switch.vue';
import useFormData from '@/composables/useFormData';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { literal, object } from 'zod';
import { X as IconX, Check as IconCheck } from '@lucide/vue';

const TEST_SCHEMA = object({
    test: literal(true)
}).required();

const meta: Meta<typeof Switch> = {
    component: Switch,
    render: (args: Args) => ({
        components: { Switch },
        setup() {
            useFormData(TEST_SCHEMA, { test: false });
            return { args };
        },
        template: '<Switch v-bind="args">{{ args.default }}</Switch>'
    }),
    args: {
        modelValue: false,
        default: '規約に同意'
    },
    argTypes: {
        // TODO: 現状lintエラーの回避策なし
        // @ts-ignore
        'onUpdate:modelValue': { action: 'onUpdate:modelValue' }
    }
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    args: {
        value: true
    }
};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Switch },
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
        template: `<Switch v-for="param in params" :key="param.variant" v-bind="{...args, ...param}">{{param.variant}}</Switch>`
    }),
    args: { ...Default.args }
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Switch },
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
        template: `<Switch v-for="param in params" :key="param.size" v-bind="{...args, ...param}">{{param.size}}</Switch>`
    }),
    args: { ...Default.args }
};

export const PropsLabel: Story = {
    args: {
        ...Default.args,
        modelValue: true,
        label: 'Switch'
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

export const PropsSlot: Story = {
    args: {
        ...Default.args
    },
    render: (args: Args) => ({
        components: { Switch, IconX, IconCheck },
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
        template: `
<Switch v-for="param in params" :key="param.variant" v-bind="{...args, ...param}">
    {{param.variant}}
    <template #switchIconTrue>
        <IconCheck />
    </template>
    <template #switchIconFalse>
        <IconX />
    </template>
</Switch>`
    })
};

export const Schema: Story = {
    args: {
        ...PropsLabel.args,
        name: 'test',
        schema: TEST_SCHEMA.shape.test
    }
};
