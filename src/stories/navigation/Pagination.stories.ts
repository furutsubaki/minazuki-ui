import { ref } from 'vue';
import Pagination from '@/components/navigation/Pagination.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof Pagination> = {
    component: Pagination,
    render: (args: Args) => ({
        components: { Pagination },
        setup() {
            return { args };
        },
        template: '<Pagination v-bind="args" />'
    }),
    args: {
        modelValue: 1,
        total: 50
    },
    argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Pagination },
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
        template: `<Pagination v-for="param in params" :key="param.size" v-bind="{...args, ...param}">{{param.size}}</Pagination>`
    })
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Pagination },
        setup: () => ({
            args,
            params: ref([
                {
                    shape: 'default'
                },
                {
                    shape: 'picture-frame'
                },
                {
                    shape: 'skeleton'
                }
            ])
        }),
        template: `<Pagination v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.shape}}</Pagination>`
    })
};

export const PropsNoShadow: Story = {
    args: {
        noShadow: true
    }
};

export const PropsHidePrevNextButton: Story = {
    args: {
        hidePrevNextButton: true
    }
};

export const PropsHideFirstLastButton: Story = {
    args: {
        hideFirstLastButton: true
    }
};
