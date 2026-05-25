import { ref } from 'vue';
import BottomNav from '@/components/navigation/BottomNav.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import {
    Home as IconHome,
    Newspaper as IconNewspaper,
    Settings as IconSettings
} from 'lucide-vue-next';

const meta: Meta<typeof BottomNav> = {
    component: BottomNav,
    render: (args: Args) => ({
        components: { BottomNav, IconHome },
        setup() {
            return { args };
        },
        template: '<BottomNav v-bind="args" />'
    }),
    args: {
        items: [
            {
                label: 'Home',
                icon: IconHome,
                to: '',
                isCurrent: true
            },
            {
                label: 'Articles',
                icon: IconNewspaper,
                to: ''
            },
            {
                label: 'Config',
                icon: IconSettings,
                to: ''
            }
        ]
    },
    argTypes: {}
};

export default meta;
type Story = StoryObj<typeof BottomNav>;

export const Default: Story = {};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { BottomNav },
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
        template: `<BottomNav v-for="param in params" :key="param.size" v-bind="{...args, ...param}">{{param.size}}</BottomNav>`
    })
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { BottomNav },
        setup: () => ({
            args,
            params: ref([
                {
                    shape: 'default'
                },
                {
                    shape: 'picture-frame'
                }
            ])
        }),
        template: `<BottomNav v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.shape}}</BottomNav>`
    })
};

export const PropsNoShadow: Story = {
    args: {
        noShadow: true
    }
};

export const PropsCenter: Story = {
    args: {
        center: true
    }
};
