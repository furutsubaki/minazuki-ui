import { ref } from 'vue';
import Drawer from '@/components/feedback/Drawer.vue';
import Button from '@/components/basic/Button.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof Drawer> = {
    component: Drawer,
    render: (args: Args) => ({
        components: { Drawer, Button },
        setup() {
            return { args };
        },
        template: `
<Button @click="args.modelValue = true">Open Drawer</Button>
<Drawer v-bind="args">
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
</Drawer>`
    }),
    args: {
        modelValue: false,
        position: 'right'
    },
    argTypes: {
        // TODO: script setupに未対応のため二重定義
        onClosed: { action: 'closed' }
    }
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Drawer, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    size: 'large',
                    modelValue: false
                },
                {
                    size: 'medium',
                    modelValue: false
                },
                {
                    size: 'small',
                    modelValue: false
                }
            ])
        }),
        template: `
<div v-for="param in params" :key="param.size">
    <Button @click="param.modelValue = true">Open Drawer({{param.size}})</Button>
    <Drawer v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Drawer>
</div>`
    })
};

export const PropsPosition: Story = {
    render: (args: Args) => ({
        components: { Drawer, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    position: 'top',
                    modelValue: false
                },
                {
                    position: 'right',
                    modelValue: false
                },
                {
                    position: 'bottom',
                    modelValue: false
                },
                {
                    position: 'left',
                    modelValue: false
                }
            ])
        }),
        template: `
<div v-for="param in params" :key="param.position">
    <Button @click="param.modelValue = true">Open Drawer({{param.position}})</Button>
    <Drawer v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Drawer>
</div>`
    })
};

export const PropsCenter: Story = {
    render: (args: Args) => ({
        components: { Drawer, Button },
        setup() {
            return { args };
        },
        template: `
<Button @click="args.modelValue = true">Open Drawer</Button>
<Drawer v-bind="args">
    <template #header>center is header</template>
    <template #footer>center is footer</template>
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
</Drawer>`
    }),
    args: {
        center: true
    }
};

export const PropsCloseable: Story = {
    args: {
        closeable: true
    }
};

export const PropsPersistent: Story = {
    args: {
        persistent: true
    }
};

export const PropsSeamless: Story = {
    args: {
        closeable: true,
        seamless: true
    }
};
