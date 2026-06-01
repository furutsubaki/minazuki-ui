<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { useFormData, useNotification } from 'minazuki-ui';

const schema = z.object({
    name: z.string().min(1).max(50),
    email: z.string().min(1).email(),
    memo: z.string().max(200).optional()
});

const { handleSubmit, canSubmit, values } = useFormData(schema, {
    name: '',
    email: ''
});

const { addNotification } = useNotification();

const onSubmit = handleSubmit(() => {
    addNotification({
        variant: 'success',
        title: '送信完了',
        message: `名前: ${values.name} / メール: ${values.email}`,
        autoRemove: true
    });
});

const selectValue = ref<string>('');
const switchValue = ref(false);
const checkValue = ref(false);
const checkGroupValue = ref<string[]>([]);
const radioValue = ref<string>('');

const selectItems = [
    { label: 'オプション A', value: 'a' },
    { label: 'オプション B', value: 'b' },
    { label: 'オプション C', value: 'c' },
    { label: '無効項目', value: 'd', disabled: true }
];

const checkGroupItems = [
    { label: 'チェック 1', value: 'check1' },
    { label: 'チェック 2', value: 'check2' },
    { label: 'チェック 3', value: 'check3' }
];

const radioGroupItems = [
    { label: 'ラジオ A', value: 'ra' },
    { label: 'ラジオ B', value: 'rb' },
    { label: 'ラジオ C', value: 'rc' }
];
</script>

<template>
    <div>
        <section class="pg-section">
            <h2>Field（vee-validate + zod バリデーション）</h2>
            <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
                <MiField
                    name="name"
                    :schema="schema.shape.name"
                    label="名前"
                    placeholder="山田 太郎"
                />
                <MiField
                    name="email"
                    :schema="schema.shape.email"
                    label="メールアドレス"
                    placeholder="example@mail.com"
                />
                <MiField
                    name="memo"
                    label="メモ（任意）"
                    placeholder="自由記入欄"
                />
                <MiButton varaint="primary" :disabled="!canSubmit" @click="onSubmit">
                    送信
                </MiButton>
            </div>
        </section>

        <section class="pg-section">
            <h2>Select</h2>
            <div class="pg-row">
                <MiSelect
                    v-modevariantctValue"
                    :items="selectItems"
                    label="選択してください"
                    clearable
                    style="width: 240px;"
                />
                <span>選択値: {{ selectValue || '未選択' }}</span>
            </div>
        </section>

        <section class="pg-section">
            <h2>Switch</h2>
            <div class="pg-row">
                <MiSwitch v-model="switchValue">スイッチ</MiSwitch>
                <MiSwitch v-model="switchValue" variant="primary">Primary</MiSwitch>
                <MiSwitch v-model="switchValue" disabled>Disabled</MiSwitch>
                <span>値: {{ switchValue }}</span>
            </div>
        </section>

        <section class="pg-section">
            <h2>Checkbox / CheckboxGroup</h2>
            <div class="pg-row">
                <MiCheckbox v-model="checkValue">単体チェックボックス</MiCheckbox>
                <span>値: {{ checkValue }}</span>
            </div>
            <div class="pg-row" style="margin-top: 12px;">
                <MiCheckboxGroup v-model="checkGroupValue" :items="checkGroupItems" />
                <span>選択: {{ checkGroupValue }}</span>
            </div>
        </section>

        <section class="pg-section">
            <h2>Radio / RadioGroup</h2>
            <div class="pg-row">
                <MiRadioGroup v-model="radioValue" :items="radioGroupItems" />
                <span>選択: {{ radioValue || '未選択' }}</span>
            </div>
        </section>
    </div>
</template>
