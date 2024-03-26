import { ref } from 'vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';
import type { Meta, StoryObj } from '@storybook/vue3';

const meta: Meta<typeof PictureFrame> = {
    component: PictureFrame,
    render: (args) => ({
        components: { PictureFrame },
        setup() {
            return { args };
        },
        template:
            '<PictureFrame v-bind="args" style="width:250px; height: 250px;"><div style="width:100%; height: 100%;background-color: var(--color-theme-bg-secondary); display: flex;align-items: center; justify-content: center;">Contents</div></PictureFrame>'
    }),
    args: {},
    argTypes: {}
};

export default meta;
type Story = StoryObj<typeof PictureFrame>;

export const Default: Story = {};

export const PropsLayout: Story = {
    render: (args) => ({
        components: { PictureFrame },
        setup: () => ({
            args,
            params: ref([
                {
                    layout: 'pf-normal'
                },
                {
                    layout: 'pf-width'
                },
                {
                    layout: 'pf-height'
                },
                {
                    layout: 'pf-top'
                },
                {
                    layout: 'pf-right'
                },
                {
                    layout: 'pf-bottom'
                },
                {
                    layout: 'pf-left'
                }
            ])
        }),
        template:
            '<PictureFrame v-for="param in params" :key="param.layout" v-bind="{...args, ...param}" style="width:250px; height: 250px;"><div style="width:100%; height: 100%;background-color: var(--color-theme-bg-secondary); display: flex;align-items: center; justify-content: center;">{{param.layout}}</div></PictureFrame>'
    }),
    args: { ...Default.args }
};

export const PropsShape: Story = {
    render: (args) => ({
        components: { PictureFrame },
        setup: () => ({
            args,
            params: ref([
                {
                    shape: 'default'
                },
                {
                    shape: 'circle'
                }
            ])
        }),
        template:
            '<PictureFrame v-for="param in params" :key="param.shape" v-bind="{...args, ...param}" style="width:250px; height: 250px;"><div style="width:100%; height: 100%;background-color: var(--color-theme-bg-secondary); display: flex;align-items: center; justify-content: center;">{{param.shape}}</div></PictureFrame>'
    }),
    args: { ...Default.args }
};

export const PropsTag: Story = {
    args: {
        tag: 'div'
    }
};

export const PropsIsPading: Story = {
    args: {
        isPading: true
    }
};
