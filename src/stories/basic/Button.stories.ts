import { ref } from 'vue';
import Button from '@/components/basic/Button.vue';
import { Star as IconStar, Download as IconDownload } from 'lucide-vue-next';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';

const meta: Meta<typeof Button> = {
    component: Button,
    render: (args: Args) => ({
        components: { Button },
        setup() {
            return { args };
        },
        template: '<Button v-bind="args" />'
    }),
    args: {
        label: 'ボタン'
    },
    argTypes: {
        // TODO: script setupに未対応のため二重定義
        variant: {
            options: ['primary', 'secondary', 'info', 'success', 'warning', 'danger']
        },
        size: {
            options: ['small', 'medium', 'large']
        },
        shape: {
            options: ['normal', 'rounded', 'circle', 'square', 'skeleton', 'link']
        },
        onClick: { action: 'click' }
    }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const PropsVariant: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({
            args,
            params: ref([
                { variant: 'primary' },
                { variant: 'secondary' },
                { variant: 'info' },
                { variant: 'success' },
                { variant: 'warning' },
                { variant: 'danger' }
            ])
        }),
        template: `<Button v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" :label="param.variant" />`
    })
};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({
            args,
            params: ref([
                { size: 'large' },
                { size: 'medium' },
                { size: 'small' }
            ])
        }),
        template: `<Button v-for="param in params" :key="param.size" v-bind="{...args, ...param}" :label="param.size" />`
    })
};

export const PropsShape: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({
            args,
            params: ref([
                { shape: 'normal' },
                { shape: 'rounded' },
                { shape: 'no-radius' },
                { shape: 'circle' },
                { shape: 'square' },
                { shape: 'skeleton' },
                { shape: 'link' }
            ])
        }),
        template: `<Button v-for="param in params" :key="param.shape" v-bind="{...args, ...param}" :label="param.shape" />`
    })
};

export const PropsReadonly: Story = {
    args: {
        readonly: true
    }
};
export const PropsDisabled: Story = {
    args: {
        disabled: true
    }
};

export const LongText: Story = {
    args: {
        label: '長いテキストのケース'
    }
};

export const PrefixIcon: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({ args, IconDownload }),
        template: '<Button v-bind="args" :prefix-icon="IconDownload" label="ダウンロード" />'
    })
};

export const SuffixIcon: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({ args, IconStar }),
        template: '<Button v-bind="args" :suffix-icon="IconStar" label="お気に入り" />'
    })
};

export const StatusAutoIcon: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({
            args,
            params: ref([
                { variant: 'info', label: 'Info' },
                { variant: 'success', label: 'Success' },
                { variant: 'warning', label: 'Warning' },
                { variant: 'danger', label: 'Danger' }
            ])
        }),
        template: `<Button v-for="param in params" :key="param.variant" v-bind="{...args, ...param}" />`
    })
};

export const PrefixIconOverride: Story = {
    render: (args: Args) => ({
        components: { Button },
        setup: () => ({ args, IconStar }),
        template: '<Button v-bind="args" variant="danger" :prefix-icon="IconStar" label="カスタムアイコン" />'
    })
};
