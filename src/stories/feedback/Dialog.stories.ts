import { ref } from 'vue';
import Dialog from '@/components/feedback/Dialog.vue';
import Button from '@/components/basic/Button.vue';
import Progress from '@/components/feedback/Progress.vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { Play as IconPlay, Pause as IconPause, X as IconX } from '@lucide/vue';

const meta: Meta<typeof Dialog> = {
    component: Dialog,
    render: (args: Args) => ({
        components: { Dialog, Button },
        setup() {
            return { args };
        },
        template: `
<Button label="Open Dialog" @click="args.modelValue = true" />
<Dialog v-bind="args">
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    <template #footer>
        <Button label="Cancel" @click="args.modelValue = false" />
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
    <Button :variant="param.variant" :label="'Open Dialog(' + param.variant + ')'" @click="param.modelValue = true" />
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button label="Cancel" @click="param.modelValue = false" />
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
    <Button :label="'Open Dialog(' + param.size + ')'" @click="param.modelValue = true" />
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button label="Cancel" @click="param.modelValue = false" />
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
    <Button :label="'Open Dialog(' + param.shape + ')'" @click="param.modelValue = true" />
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button label="Cancel" @click="param.modelValue = false" />
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
    <Button :label="'Open Dialog(' + param.position + ')'" @click="param.modelValue = true" />
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button label="Cancel" @click="param.modelValue = false" />
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
    <Button :label="'Open Dialog(' + param.transitionFrom + ')'" @click="param.modelValue = true" />
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        <template #footer>
            <Button label="Cancel" @click="param.modelValue = false" />
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
    <Button :label="'Open Dialog' + (param.frameComponent ? ' by frame' : '')" @click="param.modelValue.value = true" />
    <Dialog v-bind="{...args, ...param}" v-model="param.modelValue.value">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </Dialog>
</template>`
    })
};


export const StoryPlayer: Story = {
    render: (args: Args) => ({
        components: { Dialog, Button, Progress },
        setup: () => ({ args, progressModel: 75, IconPlay, IconPause, IconX }),
        template: `
<Button label="Open Player" @click="args.modelValue = true" />
<Dialog v-bind="args">
    <Progress v-model="progressModel" variant="primary" shape="slim-line" no-text style="width: calc(100% + 18px);margin: 0 -9px;position: absolute; top:-8px;" />
    <div style="display: flex;gap: 8px;width:100%;">
        <div style="flex-grow: 1;">
            <div>Title</div><div>sample artist</div>
        </div>
        <div style="display: flex; align-items: center;justify-content: space-evenly;flex-grow: 1;">
            <Button shape="skeleton" :prefix-icon="IconPlay" aria-label="再生" />
            <Button shape="skeleton" :prefix-icon="IconPause" aria-label="一時停止" />
            <Button shape="skeleton" :prefix-icon="IconX" aria-label="閉じる" @click="args.modelValue = false" />
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
