import { ref } from 'vue';
import Breadcrumb from '@/components/navigation/Breadcrumb.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import {
    ChevronRight as IconChevronRight,
    Home as IconHome,
    Leaf as IconLeaf
} from '@lucide/vue';

const meta: Meta<typeof Breadcrumb> = {
    component: Breadcrumb,
    render: (args: Args) => ({
        components: { Breadcrumb, IconHome },
        setup() {
            return { args };
        },
        template: '<Breadcrumb v-bind="args" />'
    }),
    args: {
        items: [
            {
                icon: IconHome,
                to: ''
            },
            {
                label: 'articles',
                to: ''
            },
            {
                label: '20240201',
                to: ''
            }
        ]
    },
    argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Breadcrumb },
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
        template: `<Breadcrumb v-for="param in params" :key="param.size" v-bind="{...args, ...param}">{{param.size}}</Breadcrumb>`
    })
};

export const PropsSparator: Story = {
    args: {
        separator: IconChevronRight
    }
};

export const PropsTitle: Story = {
    args: {
        title: 'Dashboard'
    }
};

export const SlotPrefix: Story = {
    render: (args: Args) => ({
        components: { Breadcrumb, IconHome },
        setup() {
            return { args };
        },
        template: '<Breadcrumb v-bind="args"><template #prefix><IconHome /></template></Breadcrumb>'
    })
};

export const SlotSuffix: Story = {
    render: (args: Args) => ({
        components: { Breadcrumb, IconLeaf },
        setup() {
            return { args };
        },
        template: '<Breadcrumb v-bind="args"><template #suffix><IconLeaf /></template></Breadcrumb>'
    })
};
