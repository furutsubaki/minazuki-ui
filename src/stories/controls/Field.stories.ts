import Field from '@/components/controls/Field.vue';
import useFormData from '@/composables/useFormData';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { string, object } from 'zod';
import { formatLocaleString, parseLocaleString } from '@/assets/ts/formatter';

const TEST_SCHEMA = object({
    test: string().max(50).min(1)
}).required();

const meta: Meta<typeof Field> = {
    component: Field,
    render: (args: Args) => ({
        components: { Field },
        setup() {
            useFormData(TEST_SCHEMA, { test: 'ヤマダ タロウ' });
            return { args };
        },
        template: '<Field v-bind="args" />'
    }),
    args: {
        modelValue: ''
    },
    argTypes: {
        // TODO: 現状lintエラーの回避策なし
        // @ts-ignore
        'onUpdate:modelValue': { action: 'onUpdate:modelValue' },
        onSearch: { action: 'search' }
    }
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Field },
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
        template: `<Field v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" :label="param.variant" />`
    }),
    args: { ...Default.args }
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Field },
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
        template: `<Field v-for="param in params" :key="param.size" v-bind="{...args, ...param}" :label="param.size" />`
    }),
    args: { ...Default.args }
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Field },
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
        template: `<Field v-for="param in params" :key="param.shape" v-bind="{...args, ...param}" :label="param.shape" />`
    }),
    args: { ...Default.args }
};

export const PropsLabel: Story = {
    args: {
        label: 'Field'
    }
};

export const PropsPrefixSuffix: Story = {
    render: (args: Args) => ({
        components: { Field },
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
        template: `<Field v-for="param in params" :key="param.prefix + '-' + param.suffix" v-bind="{...args, ...param}" :label="[param.prefix, param.suffix].join('')" />`
    }),
    args: {
        ...Default.args
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
    args: { ...Default.args, disabled: true }
};
export const PropsType: Story = {
    render: (args: Args) => ({
        components: { Field },
        setup: () => ({
            args,
            params: [
                {
                    type: 'text'
                },
                {
                    type: 'email'
                },
                {
                    type: 'password'
                },
                {
                    type: 'time'
                },
                {
                    type: 'date'
                },
                {
                    type: 'number'
                },
                {
                    type: 'tel'
                },
                {
                    type: 'search'
                },
                {
                    type: 'url'
                }
            ]
        }),
        template: `<Field v-for="param in params" :key="param.type" v-bind="{...args, ...param}" :label="param.type" />`
    }),
    args: { ...Default.args }
};

export const DisplayFormatterCurrency: Story = {
    args: {
        ...PropsClearable.args,
        type: 'number',
        label: '金額',
        placeholder: 'データは数値になります',
        prefix: '￥',
        displayFormatter: (v: string) => formatLocaleString(v),
        displayParser: (v: string) => parseLocaleString(v)
    }
};

export const FormatterTel: Story = {
    args: {
        ...PropsClearable.args,
        type: 'tel',
        label: '電話番号',
        placeholder: 'ハイフンを入れてください',
        formatter: (v: string) => v.replace(/[^0-9-]/g, '')
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
