import { ref } from 'vue';
import Avatar from '@/components/basic/Avatar.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { Smile as IconSmile } from 'lucide-vue-next';
import imgPath from '@/assets/logo.png';

const meta: Meta<typeof Avatar> = {
    component: Avatar,
    render: (args: Args) => ({
        components: { Avatar },
        setup() {
            return { args };
        },
        template: '<Avatar v-bind="args" />'
    }),
    args: {}
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Avatar },
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
        template: `<Avatar v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.size}}</Avatar>`
    })
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Avatar },
        setup: () => ({
            args,
            params: ref([
                {
                    shape: 'circle'
                },
                {
                    shape: 'square'
                },
                {
                    shape: 'no-radius'
                },
                {
                    shape: 'skeleton'
                }
            ])
        }),
        template: `<Avatar v-for="param in params" :key="param.shape" v-bind="{...args, ...param}">{{param.shape}}</Avatar>`
    })
};

export const PropsColor: Story = {
    args: {
        color: 'var(--color-status-brand)'
    }
};
export const PropsIcon: Story = {
    args: {
        icon: IconSmile
    }
};

export const PropsImage: Story = {
    args: {
        image: imgPath
    }
};

export const Slots: Story = {
    render: (args: Args) => ({
        components: { Avatar },
        setup() {
            return { args };
        },
        template: '<Avatar v-bind="args">Slots</Avatar>'
    })
};

export const Overlapping: Story = {
    render: (args: Args) => ({
        components: { Avatar },
        setup() {
            return { args };
        },
        template: `<div style="display: flex;">
    <Avatar v-bind="args" v-for="i in [...Array(5).keys()]" :style="\`position: absolute; left: \${i * 24}px; outline-color: var(--color-theme-bg-primary)\`" />
</div>`
    }),
    args: {
        icon: IconSmile
    }
};
