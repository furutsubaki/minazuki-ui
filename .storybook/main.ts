import { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
    framework: {
        name: '@storybook/vue3-vite',
        options: {
            docgen: "vue-component-meta"
        },
    },

    stories: ['../src/**/*.stories.@(js|ts)'],
    addons: ['@storybook/addon-docs']
}

export default config
