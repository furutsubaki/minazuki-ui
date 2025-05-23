import { ref } from 'vue';
import Modal from '@/components/feedback/Modal.vue';
import Button from '@/components/basic/Button.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof Modal> = {
    component: Modal,
    render: (args: Args) => ({
        components: { Modal, Button },
        setup() {
            return { args };
        },
        template: `
<Button @click="args.modelValue = true">Open Modal</Button>
<Modal v-bind="args">
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
</Modal>`
    }),
    args: {
        modelValue: false
    },
    argTypes: {
        // TODO: script setupに未対応のため二重定義
        onClosed: { action: 'closed' }
    }
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Modal, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    size: 'full',
                    modelValue: false
                },
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
<template v-for="param in params" :key="param.size">
    <Button @click="param.modelValue = true">Open Modal({{param.size}})</Button>
    <Modal v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Modal>
</template>`
    })
};

export const PropsIsFullSizeBySP: Story = {
    render: (args: Args) => ({
        components: { Modal, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    size: 'full',
                    isFullSizeBySp: true,
                    modelValue: false
                },
                {
                    size: 'large',
                    isFullSizeBySp: true,
                    modelValue: false
                },
                {
                    size: 'medium',
                    isFullSizeBySp: true,
                    modelValue: false
                },
                {
                    size: 'small',
                    isFullSizeBySp: true,
                    modelValue: false
                }
            ])
        }),
        template: `
<template v-for="param in params" :key="param.size">
    <Button @click="param.modelValue = true">Open Modal({{param.size}})</Button>
    <Modal v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Modal>
</template>`
    })
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Modal, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    shape: 'normal',
                    modelValue: false
                },
                {
                    shape: 'no-radius',
                    modelValue: false
                }
            ])
        }),
        template: `
<template v-for="param in params" :key="param.shape">
    <Button @click="param.modelValue = true">Open Modal({{param.shape}})</Button>
    <Modal v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Modal>
</template>`
    })
};

export const PropsTransitionFrom: Story = {
    render: (args: Args) => ({
        components: { Modal, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    transitionFrom: 'opacity',
                    modelValue: false
                },
                {
                    transitionFrom: 'top',
                    modelValue: false
                },
                {
                    transitionFrom: 'right',
                    modelValue: false
                },
                {
                    transitionFrom: 'bottom',
                    modelValue: false
                },
                {
                    transitionFrom: 'left',
                    modelValue: false
                }
            ])
        }),
        template: `
<template v-for="param in params" :key="param.transitionFrom">
    <Button @click="param.modelValue = true">Open Modal({{param.transitionFrom}})</Button>
    <Modal v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Modal>
</template>`
    })
};

export const PropsTitle: Story = {
    args: {
        title: 'Sample Modal'
    }
};

export const PropsCenter: Story = {
    args: {
        ...PropsTitle.args,
        center: true
    }
};

export const PropsPersistent: Story = {
    args: {
        persistent: true
    }
};
