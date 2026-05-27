import Notifications from '@/components/feedback/Notifications.vue';
import Button from '@/components/basic/Button.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import useNotification, { type MiNotificationOption } from '@/composables/useNotification';

const meta: Meta<MiNotificationOption> = {
    component: Notifications,
    render: (args: Args) => ({
        components: { Notifications, Button },
        setup() {
            const { addNotification } = useNotification();
            return {
                args,
                onSetNotification: () => {
                    const { variant, size, shape, position, noShadow, title, message, closeable, autoRemove } = args;
                    addNotification({ variant, size, shape, position, noShadow, title, message, closeable, autoRemove });
                }
            };
        },
        template: `
<Button @click="onSetNotification">Open Notifications</Button>
<Notifications />`
    }),
    args: {
        variant: 'secondary',
        size: 'medium',
        shape: 'normal',
        position: 'top-right',
        noShadow: false,
        title: '通知',
        message: 'テスト通知',
        closeable: false,
        autoRemove: true
    },
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger']
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        shape: {
            control: 'select',
            options: ['normal', 'no-radius', 'picture-frame']
        },
        position: {
            control: 'select',
            options: ['top-right', 'top-left', 'bottom-right', 'bottom-left']
        },
        noShadow: {
            control: 'boolean'
        },
        title: {
            control: 'text'
        },
        message: {
            control: 'text'
        },
        closeable: {
            control: 'boolean'
        },
        autoRemove: {
            control: 'boolean'
        }
    },
    tags: ['autodocs']
};

export default meta;
type Story = StoryObj<MiNotificationOption>;

export const Default: Story = {};

export const ParamsVariant: Story = {
    render: (args: Args) => ({
        components: { Notifications, Button },
        setup: () => {
            const { addNotification } = useNotification();
            return {
                args,
                onSetNotification: (param: MiNotificationOption) => {
                    addNotification({
                        ...param,
                        title: '通知',
                        message: 'テスト通知'
                    });
                },
                params: [
                    {
                        variant: 'primary'
                    },
                    {
                        variant: 'secondary'
                    },
                    {
                        variant: 'info'
                    },
                    {
                        variant: 'success'
                    },
                    {
                        variant: 'warning'
                    },
                    {
                        variant: 'danger'
                    }
                ]
            };
        },
        template: `
<div v-for="param in params" :key="param.variant">
    <Button :variant="param.variant" @click="onSetNotification(param)">Open Notifications({{param.variant}})</Button>
</div>
<Notifications />`
    })
};

export const ParamsSize: Story = {
    render: (args: Args) => ({
        components: { Notifications, Button },
        setup: () => {
            const { addNotification } = useNotification();
            return {
                args,
                onSetNotification: (param: MiNotificationOption) => {
                    addNotification({
                        ...param,
                        title: '通知',
                        message: 'テスト通知'
                    });
                },
                params: [
                    {
                        size: 'large'
                    },
                    {
                        size: 'medium'
                    },
                    {
                        size: 'small'
                    }
                ]
            };
        },
        template: `
<div v-for="param in params" :key="param.size">
    <Button @click="onSetNotification(param)">Open Notifications({{param.size}})</Button>
</div>
<Notifications />`
    })
};

export const ParamsShape: Story = {
    render: (args: Args) => ({
        components: { Notifications, Button },
        setup: () => {
            const { addNotification } = useNotification();
            return {
                args,
                onSetNotification: (param: MiNotificationOption) => {
                    addNotification({
                        ...param,
                        title: '通知',
                        message: 'テスト通知'
                    });
                },
                params: [
                    {
                        shape: 'normal'
                    },
                    {
                        shape: 'no-radius'
                    },
                    {
                        shape: 'picture-frame'
                    }
                ]
            };
        },
        template: `
<div v-for="param in params" :key="param.shape">
    <Button @click="onSetNotification(param)">Open Notifications({{param.shape}})</Button>
</div>
<Notifications />`
    })
};

export const ParamsPosition: Story = {
    render: (args: Args) => ({
        components: { Notifications, Button },
        setup: () => {
            const { addNotification } = useNotification();
            return {
                args,
                onSetNotification: (param: MiNotificationOption) => {
                    addNotification({
                        ...param,
                        title: '通知',
                        message: 'テスト通知'
                    });
                },
                params: [
                    {
                        position: 'top-left'
                    },
                    {
                        position: 'top-right'
                    },
                    {
                        position: 'bottom-right'
                    },
                    {
                        position: 'bottom-left'
                    }
                ]
            };
        },
        template: `
<div v-for="param in params" :key="param.position">
    <Button @click="onSetNotification(param)">Open Notifications({{param.position}})</Button>
</div>
<Notifications />`
    })
};

export const ParamsNoShadow: Story = {
    args: {
        noShadow: true
    }
};

export const ParamsCloseable: Story = {
    args: {
        closeable: true
    }
};

export const ParamsAutoRemove: Story = {
    args: {
        autoRemove: false
    }
};

export const TitleOnly: Story = {
    args: {
        variant: 'success',
        title: '通知',
        message: ''
    }
};

export const MessageOnly: Story = {
    args: {
        variant: 'success',
        title: '',
        message: 'メッセージ'
    }
};
