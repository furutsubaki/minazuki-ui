<script setup lang="ts">
import { ref } from 'vue';
import Button from '@/components/basic/Button.vue';
import Field from '@/components/controls/Field.vue';
import Textarea from '@/components/controls/Textarea.vue';
import Radio from '@/components/controls/Radio.vue';
import RadioGroup from '@/components/controls/RadioGroup.vue';
import Select from '@/components/controls/Select.vue';
import Autocomplete from '@/components/controls/Autocomplete.vue';
import Notifications from '@/components/feedback/Notifications.vue';
import useFormData from '@/composables/useFormData';
import useTheme from '@/composables/useTheme';
import useNotification from '@/composables/useNotification';
import z from 'zod';

const { currentTheme } = useTheme();
const themeItems = [
    {
        label: 'light',
        value: 'light'
    },
    {
        label: 'dark',
        value: 'dark'
    }
];

const initData = {
    input: 'w',
    textarea: '2',
    number: 7,
    radio: false,
    radioGroup: 'dog',
    select: 'dog'
};
const model = ref(initData);
const TEST_SCHEMA = z.object({
    input: z.string().min(1).max(100),
    textarea: z.string().min(1).max(100),
    number: z.coerce.number(),
    radio: z.literal(true),
    radioGroup: z.string().min(1),
    select: z.string().min(1)
});

const items = [
    {
        label: '犬',
        value: 'dog'
    },
    {
        label: '猫',
        value: 'cat'
    },
    {
        label: '兎',
        value: 'rabbit'
    }
];

const { canSubmit, resetForm, handleSubmit } = useFormData(TEST_SCHEMA, initData);
const { addNotification } = useNotification();

const onSubmit = handleSubmit((values) => {
    // eslint-disable-next-line no-console
    console.log(values);
});

const onSearch = (v: string) =>
    // eslint-disable-next-line no-console
    console.log(v);
const onSetNotification = (position: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left') => {
    addNotification({
        title: '通知',
        message: 'テスト通知',
        position
    });
};
</script>

<template>
    <main>
        <div class="flex">
            <h1>テスト vee-validate</h1>
            <Button :disabled="!canSubmit" @click="onSubmit">ゴーストボタン</Button>
            <Button @click="resetForm">reset</Button>
            <Radio :value="true" name="radio" :schema="TEST_SCHEMA.shape.radio">規約に同意</Radio>
            <RadioGroup
                name="radioGroup"
                :schema="TEST_SCHEMA.shape.radioGroup"
                :items="items"
                label="らべる"
            />
            <Select
                name="select"
                :schema="TEST_SCHEMA.shape.select"
                :items="items"
                position="top"
                label="らべる"
            />
            <Field
                name="input"
                label="Field"
                placeholder="ぷれーすほるだー"
                :schema="TEST_SCHEMA.shape.input"
            />
            <Textarea
                name="textarea"
                label="Textarea"
                placeholder="ぷれーすほるだー"
                :minLine="4"
                :schema="TEST_SCHEMA.shape.textarea"
            />
        </div>
        <div class="flex">
            <h1>テスト v-model</h1>
            <RadioGroup v-model="currentTheme" :items="themeItems" name="theme" label="テーマ" />
            <Radio :value="true" v-model="model.radio">規約に同意</Radio>
            <RadioGroup v-model="model.radioGroup" :items="items" label="らべる" />
            <Select v-model="model.select" :items="items" label="らべる" />
            <Autocomplete v-model="model.select" :items="items" label="らべる" />
            <Field label="Search" type="search" v-model="model.input" @search="onSearch" />
            {{ model }}
            <div style="display: flex;">
                <Button @click="onSetNotification('top-left')">通知↖</Button>
                <Button @click="onSetNotification('top-right')">通知↗</Button>
            </div>
            <div style="display: flex;">
                <Button @click="onSetNotification('bottom-left')">通知↙</Button>
                <Button @click="onSetNotification('bottom-right')">通知↘</Button>
            </div>
        </div>
    </main>
    <Notifications />
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
}

.flex {
    display: flex;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
}
</style>
