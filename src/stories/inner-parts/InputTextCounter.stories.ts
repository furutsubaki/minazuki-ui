import InputTextCounter from '@/components/inner-parts/InputTextCounter.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof InputTextCounter> = {
    component: InputTextCounter,
    render: (args: Args) => ({
        components: { InputTextCounter },
        setup() {
            return { args };
        },
        template: '<InputTextCounter v-bind="args" />'
    }),
    tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof InputTextCounter>;

export const Default: Story = {
    args: {
        text: '入力文字',
        max: 50
    }
};
