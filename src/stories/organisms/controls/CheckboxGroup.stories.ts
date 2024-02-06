import CheckboxGroup from '@/components/organisms/controls/CheckboxGroup.vue';
import useFormData from '@/composables/useFormData';
import type { Meta, StoryObj } from '@storybook/vue3';
import { string, object } from 'zod';

const TEST_SCHEMA = object({
    test: string().array().min(1)
}).required();

const meta: Meta<typeof CheckboxGroup> = {
    component: CheckboxGroup,
    render: (args) => ({
        components: { CheckboxGroup },
        setup() {
            useFormData(TEST_SCHEMA, { test: ['dog'] });
            return { args };
        },
        template: '<CheckboxGroup v-bind="args" />'
    }),
    tags: ['autodocs'],
    args: {
        modelValue: []
    },
    argTypes: {
        // TODO: 現状lintエラーの回避策なし
        // @ts-ignore
        'onUpdate:modelValue': { action: 'onUpdate:modelValue' }
    }
};

export default meta;
type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
    args: {
        items: [
            { label: '犬', value: 'dog' },
            { label: '猫', value: 'cat' },
            { label: '兎', value: 'rabbit' }
        ]
    }
};

export const Label: Story = {
    args: {
        ...Default.args,
        modelValue: ['dog'],
        label: '好きな動物'
    }
};

export const Disabled: Story = {
    args: {
        ...Label.args,
        disabled: true
    }
};

export const Item_Disabled: Story = {
    args: {
        ...Label.args,
        items: [
            ...Label.args!.items!,
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
        ...Label.args,
        name: 'test',
        schema: TEST_SCHEMA.shape.test,
        items: [
            ...Label.args!.items!,
            {
                label: '未入力',
                value: ''
            }
        ]
    }
};