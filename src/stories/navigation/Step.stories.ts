import { ref } from 'vue';
import Step from '@/components/navigation/Step.vue';
import type { Args, Meta, StoryObj } from '@storybook/vue3-vite';
import { Home as IconHome } from '@lucide/vue';

const meta: Meta<typeof Step> = {
    component: Step,
    render: (args: Args) => ({
        components: { Step },
        setup() {
            return { args };
        },
        template: `
<Step v-bind="args" @prev="args.modelValue = $event" @next="args.modelValue = $event">
    <template #step1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #step2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #step3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Step>`
    }),
    args: {
        modelValue: 'step1',
        steps: [
            {
                id: 'step1',
                label: 'Step1',
                icon: IconHome
            },
            {
                id: 'step2',
                label: 'Step2'
            },
            {
                id: 'step3',
                label: 'Step3'
            }
        ]
    },
    argTypes: {}
};

export default meta;
type Story = StoryObj<typeof Step>;

export const Default: Story = {};

export const PropsSize: Story = {
    render: (args: Args) => ({
        components: { Step },
        setup: () => ({
            args,
            params: ref([
                {
                    size: 'large',
                    variant: 'info',
                    modelValue: 'step1'
                },
                {
                    size: 'medium',
                    variant: 'info',
                    modelValue: 'step1'
                },
                {
                    size: 'small',
                    variant: 'info',
                    modelValue: 'step1'
                }
            ])
        }),
        template: `
<Step v-for="param in params" :key="param.size" v-bind="{...args, ...param}" v-model="param.modelValue" @prev="param.modelValue = $event" @next="param.modelValue = $event">
    <template #step1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #step2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #step3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Step>`
    })
};

export const PropsPosition: Story = {
    render: (args: Args) => ({
        components: { Step },
        setup: () => ({
            args,
            params: ref([
                {
                    position: 'top',
                    modelValue: 'step1'
                },
                {
                    position: 'right',
                    modelValue: 'step1'
                },
                {
                    position: 'bottom',
                    modelValue: 'step1'
                },
                {
                    position: 'left',
                    modelValue: 'step1'
                }
            ])
        }),
        template: `
<Step v-bind="{...args, ...param}" v-for="param in params" :key="param.position" v-model="param.modelValue" @prev="param.modelValue = $event" @next="param.modelValue = $event">
    <template #step1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #step2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #step3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Step>`
    })
};

export const PropsTransition: Story = {
    render: (args: Args) => ({
        components: { Step },
        setup: () => ({
            args,
            params: ref([
                {
                    transition: 'translate',
                    modelValue: 'step1'
                },
                {
                    transition: 'opacity',
                    modelValue: 'step1'
                }
            ])
        }),
        template: `
<Step v-bind="{...args, ...param}" v-for="param in params" :key="param.transition" v-model="param.modelValue" @prev="param.modelValue = $event" @next="param.modelValue = $event">
    <template #step1>
        1.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #step2>
        2.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
    <template #step3>
        3.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </template>
</Step>`
    })
};

export const PropsNoSeparator: Story = {
    args: {
        noSeparator: true
    }
};

export const NoSlot: Story = {
    render: (args: Args) => ({
        components: { Step },
        setup: () => ({ args }),
        template: `<Step v-bind="{...args}" />`
    })
};
