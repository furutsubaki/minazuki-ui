import { ref } from 'vue';
import Breadcrumb from '@/components/navigation/Breadcrumb.vue';
import type { Meta, StoryObj } from '@storybook/vue3';
import {
    ChevronRight as IconChevronRight,
    Home as IconHome,
    Leaf as IconLeaf
} from 'lucide-vue-next';

const meta: Meta<typeof Breadcrumb> = {
    component: Breadcrumb,
    render: (args) => ({
        components: { Breadcrumb, IconHome },
        setup() {
            return { args };
        },
        template: '<Breadcrumb v-bind="args" />'
    }),
    tags: ['autodocs'],
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
    render: (args) => ({
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
        template: `<Breadcrumb v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.size}}</Breadcrumb>`
    })
};

export const PropssSparator: Story = {
    args: {
        separator: IconChevronRight
    }
};

export const PropssTitle: Story = {
    args: {
        title: 'Dashboard'
    }
};

export const SlotPrefix: Story = {
    render: (args) => ({
        components: { Breadcrumb, IconHome },
        setup() {
            return { args };
        },
        template: '<Breadcrumb v-bind="args"><template #prefix><IconHome /></template></Breadcrumb>'
    })
};

export const SlotSuffix: Story = {
    render: (args) => ({
        components: { Breadcrumb, IconLeaf },
        setup() {
            return { args };
        },
        template: '<Breadcrumb v-bind="args"><template #suffix><IconLeaf /></template></Breadcrumb>'
    })
};
