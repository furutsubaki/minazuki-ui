import { ref } from 'vue';
import Tab from '@/components/navigation/Tab.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { Home as IconHome } from '@lucide/vue';

const meta: Meta<typeof Tab> = {
    component: Tab,
    render: (args: Args) => ({
        components: { Tab },
        setup() {
            return { args };
        },
        template: `
<Tab v-bind="args">
    <template #tab1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Tab>`
    }),
    args: {
        modelValue: 'tab1',
        tabs: [
            {
                id: 'tab1',
                label: 'Tab1',
                icon: IconHome
            },
            {
                id: 'tab2',
                label: 'Tab2'
            },
            {
                id: 'tab3',
                label: 'Tab3'
            }
        ]
    },
    argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const Default: Story = {};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Tab },
        setup: () => ({
            args,
            params: ref([
                {
                    size: 'large',
                    variant: 'info',
                    modelValue: 'tab1'
                },
                {
                    size: 'medium',
                    variant: 'info',
                    modelValue: 'tab1'
                },
                {
                    size: 'small',
                    variant: 'info',
                    modelValue: 'tab1'
                }
            ])
        }),
        template: `
<Tab v-for="param in params" :key="param.size" v-bind="{...args, ...param}" v-model="param.modelValue">
    <template #tab1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Tab>`
    })
};

export const PropsPosition: Story = {
    render: (args: Args) => ({
        components: { Tab },
        setup: () => ({
            args,
            params: ref([
                {
                    position: 'top',
                    modelValue: 'tab1'
                },
                {
                    position: 'right',
                    modelValue: 'tab1'
                },
                {
                    position: 'bottom',
                    modelValue: 'tab1'
                },
                {
                    position: 'left',
                    modelValue: 'tab1'
                }
            ])
        }),
        template: `
<Tab v-bind="{...args, ...param}" v-for="param in params" :key="param.position" v-model="param.modelValue">
    <template #tab1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Tab>`
    })
};

export const PropsTabAlign: Story = {
    render: (args: Args) => ({
        components: { Tab },
        setup: () => ({
            args,
            params: ref([
                {
                    tabAlign: 'start',
                    modelValue: 'tab1'
                },
                {
                    tabAlign: 'center',
                    modelValue: 'tab1'
                },
                {
                    tabAlign: 'end',
                    modelValue: 'tab1'
                },
                {
                    tabAlign: 'between',
                    modelValue: 'tab1'
                }
            ])
        }),
        template: `
<Tab v-bind="{...args, ...param}" v-for="param in params" :key="param.tabAlign" v-model="param.modelValue">
    <template #tab1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Tab>`
    })
};

export const PropsTransition: Story = {
    render: (args: Args) => ({
        components: { Tab },
        setup: () => ({
            args,
            params: ref([
                {
                    transition: 'translate',
                    modelValue: 'tab1'
                },
                {
                    transition: 'opacity',
                    modelValue: 'tab1'
                }
            ])
        }),
        template: `
<Tab v-bind="{...args, ...param}" v-for="param in params" :key="param.transition" v-model="param.modelValue">
    <template #tab1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #tab3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Tab>`
    })
};

export const PropsNoSeparator: Story = {
    args: {
        noSeparator: true
    }
};

export const NoSlot: Story = {
    render: (args: Args) => ({
        components: { Tab },
        setup: () => ({ args }),
        template: `<Tab v-bind="{...args}" />`
    })
};
