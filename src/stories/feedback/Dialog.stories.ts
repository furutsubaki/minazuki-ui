import { ref } from 'vue';
import Dialog from '@/components/feedback/Dialog.vue';
import Button from '@/components/basic/Button.vue';
import Progress from '@/components/feedback/Progress.vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3';
import { Play as IconPlay, Pause as IconPause, X as IconX } from 'lucide-vue-next';

const meta: Meta<typeof Dialog> = {
    component: Dialog,
    render: (args: Args) => ({
        components: { Dialog, Button },
        setup() {
            return { args };
        },
        template: `
<Button @click="args.modelValue = true">Open Dialog</Button>
<Dialog v-bind="args">
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    <template #footer>
        <Button @click="args.modelValue = false">Cancel</Button>
    </template>
</Dialog>`
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
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Dialog, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    variant: 'primary',
                    modelValue: false
                },
                {
                    variant: 'secondary',
                    modelValue: false
                },
                {
                    variant: 'info',
                    modelValue: false
                },
                {
                    variant: 'success',
                    modelValue: false
                },
                {
                    variant: 'warning',
                    modelValue: false
                },
                {
                    variant: 'danger',
                    modelValue: false
                }
            ])
        }),
        template: `
<template v-for="param in params" :key="param.variant">
    <Button :variant="param.variant" @click="param.modelValue = true">Open Dialog({{param.variant}})</Button>
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button @click="param.modelValue = false">Cancel</Button>
        </template>
    </Dialog>
</template>`
    })
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Dialog, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    size: 'full',
                    variant: 'info',
                    modelValue: false
                },
                {
                    size: 'large',
                    variant: 'info',
                    modelValue: false
                },
                {
                    size: 'medium',
                    variant: 'info',
                    modelValue: false
                },
                {
                    size: 'small',
                    variant: 'info',
                    modelValue: false
                }
            ])
        }),
        template: `
<template v-for="param in params" :key="param.size">
    <Button @click="param.modelValue = true">Open Dialog({{param.size}})</Button>
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button @click="param.modelValue = false">Cancel</Button>
        </template>
    </Dialog>
</template>`
    })
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Dialog, Button },
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
    <Button @click="param.modelValue = true">Open Dialog({{param.shape}})</Button>
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button @click="param.modelValue = false">Cancel</Button>
        </template>
    </Dialog>
</template>`
    })
};

export const PropsPosition: Story = {
    render: (args: Args) => ({
        components: { Dialog, Button },
        setup: () => ({
            args,
            params: ref([
                {
                    position: 'center',
                    modelValue: false
                },
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
<template v-for="param in params" :key="param.position">
    <Button @click="param.modelValue = true">Open Dialog({{param.position}})</Button>
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button @click="param.modelValue = false">Cancel</Button>
        </template>
    </Dialog>
</template>`
    })
};

export const PropsTransitionFrom: Story = {
    render: (args: Args) => ({
        components: { Dialog, Button },
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
    <Button @click="param.modelValue = true">Open Dialog({{param.transitionFrom}})</Button>
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button @click="param.modelValue = false">Cancel</Button>
        </template>
    </Dialog>
</template>`
    })
};

export const PropsTitle: Story = {
    args: {
        title: 'Sample Dialog'
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

export const PropsSeamless: Story = {
    args: {
        seamless: true
    }
};

export const PropsFrameComponent: Story = {
    render: (args: Args) => ({
        components: { Dialog, Button },
        setup: () => ({
            args,
            params: [
                {
                    modelValue: ref(false)
                },
                {
                    frameComponent: PictureFrame,
                    modelValue: ref(false)
                },
            ]
        }),
        template: `
<template v-for="param in params" :key="param.frameComponent">
    <Button @click="param.modelValue.value = true">Open Dialog{{param.frameComponent ? ' by frame' : ''}}</Button>
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue.value">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Dialog>
</template>`
    })
};


export const StoryPlayer: Story = {
    render: (args: Args) => ({
        components: { Dialog, Button, Progress, IconPlay, IconPause, IconX },
        setup: () => ({ args, progressModel: 75 }),
        template: `
<Button @click="args.modelValue = true">Open Player</Button>
<Dialog v-bind="args">
    <Progress v-model="progressModel" variant="primary" shape="slim-line" no-text style="width: calc(100% + 18px);margin: 0 -9px;position: absolute; top:-8px;" />
    <div style="display: flex;gap: 8px;width:100%;">
        <div style="flex-grow: 1;">
            <div>Title</div><div>sample artist</div>
        </div>
        <div style="display: flex; align-items: center;justify-content: space-evenly;flex-grow: 1;">
            <Button shape="skeleton"><IconPlay style="width: 24px; height:24px;" /></Button>
            <Button shape="skeleton"><IconPause style="width: 24px; height:24px;" /></Button>
            <Button shape="skeleton" @click="args.modelValue = false"><IconX style="width: 24px; height:24px;" /></Button>
        </div>
    </div>
</Dialog>`
    }),
    args: {
        size: 'small',
        position: 'top',
        seamless: true,
        transitionFrom: 'top'
    }
};
