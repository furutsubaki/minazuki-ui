import Autocomplete from '@/components/controls/Autocomplete.vue';
import useFormData from '@/composables/useFormData';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { string, object } from 'zod';

const TEST_SCHEMA = object({
    test: string().max(50).min(1)
}).required();

const meta: Meta<typeof Autocomplete> = {
    component: Autocomplete,
    render: (args: Args) => ({
        components: { Autocomplete },
        setup() {
            useFormData(TEST_SCHEMA, { test: 'ヤマダ タロウ' });
            return { args };
        },
        template: '<Autocomplete v-bind="args" />'
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
type Story = StoryObj<typeof Autocomplete>;

export const Default: Story = {
    args: {
        items: [
            { label: '犬', value: 'dog', ruby: 'いぬ' },
            { label: '猫', value: 'cat', ruby: 'ねこ' },
            { label: '兎', value: 'rabbit', ruby: 'うさぎ' }
        ]
    }
};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Autocomplete },
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
        template: `<Autocomplete v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" :label="param.variant" />`
    }),
    args: { ...Default.args }
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Autocomplete },
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
        template: `<Autocomplete v-for="param in params" :key="param.size" v-bind="{...args, ...param}" :label="param.size" />`
    }),
    args: { ...Default.args }
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Autocomplete },
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
        template: `<Autocomplete v-for="param in params" :key="param.shape" v-bind="{...args, ...param}" :label="param.shape" />`
    }),
    args: { ...Default.args }
};

export const PropsLabel: Story = {
    args: {
        ...Default.args,
        label: 'Autocomplete'
    }
};

export const PropsPrefixSuffix: Story = {
    render: (args: Args) => ({
        components: { Autocomplete },
        setup: () => ({
            args,
            params: [
                {
                    prefix: 'prefix',
                    suffix: ''
                },
                {
                    prefix: 'prefix',
                    suffix: 'suffix'
                },
                {
                    prefix: '',
                    suffix: 'suffix'
                }
            ]
        }),
        template: `<Autocomplete v-for="param in params" :key="param.prefix + '-' + param.suffix" v-bind="{...args, ...param}" :label="[param.prefix, param.suffix].join('')" />`
    }),
    args: {
        ...Default.args
    }
};

export const PropsPosition: Story = {
    render: (args: Args) => ({
        components: { Autocomplete },
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
        template: `<Autocomplete v-for="param in params" :key="param.position" v-bind="{...args, ...param}" :label="param.position" />`
    }),
    args: {
        ...Default.args
    }
};

export const PropsClearable: Story = {
    args: {
        ...PropsLabel.args,
        clearable: true
    }
};

export const PropsPlaceholder: Story = {
    args: {
        ...PropsLabel.args,
        placeholder: 'イッヌもネッコもいい',
        prefix: 'Uo･ｪ･oU'
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

export const PropsSchema: Story = {
    args: {
        ...PropsLabel.args,
        name: 'test',
        schema: TEST_SCHEMA.shape.test,
        placeholder: '山田 太郎'
    }
};
