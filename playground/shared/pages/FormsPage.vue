<script setup lang="ts">
import { ref } from 'vue';
import { z } from 'zod';
import { useFormData, useNotification } from 'minazuki-ui';

const schema = z.object({
    name: z.string().min(1).max(50),
    email: z.string().min(1).email(),
    memo: z.string().max(200).optional(),
    homepage: z.string().url().or(z.literal(''))
});

const { handleSubmit, canSubmit, values } = useFormData(schema, {
    name: '',
    email: '',
    homepage: ''
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
const textareaValue = ref('');
const textareaDisabledValue = ref('あらかじめ入力された値');
const autocompleteValue = ref('');
const autocompleteTopValue = ref('');
const datePickerValue = ref('');

const selectItems = [
    { label: 'オプション A', value: 'a' },
    { label: 'オプション B', value: 'b' },
    { label: 'オプション C', value: 'c' },
    { label: '無効項目', value: 'd', disabled: true }
];

const autocompleteItems = [
    { label: 'りんご', value: 'apple', ruby: 'りんご' },
    { label: 'みかん', value: 'mikan', ruby: 'みかん' },
    { label: 'ぶどう', value: 'grape', ruby: 'ぶどう' },
    { label: 'バナナ', value: 'banana', ruby: 'ばなな' },
    { label: 'いちご', value: 'strawberry', ruby: 'いちご' },
    { label: '無効項目', value: 'disabled', disabled: true }
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
                <!-- ZodUnion (string().url().or(literal(''))) を schema に渡す例 -->
                <MiField
                    name="homepage"
                    :schema="schema.shape.homepage"
                    type="url"
                    label="ホームページ（任意）"
                    placeholder="https://example.com"
                />
                <MiButton variant="primary" :disabled="!canSubmit" @click="onSubmit">
                    送信
                </MiButton>
            </div>
        </section>

        <section class="pg-section">
            <h2>Select</h2>
            <div class="pg-row">
                <MiSelect
                    v-model="selectValue"
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

        <section class="pg-section">
            <h2>Textarea</h2>
            <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
                <MiTextarea
                    v-model="textareaValue"
                    label="メモ"
                    placeholder="自由に入力してください"
                    clearable
                    :line="3"
                    :min-line="2"
                    :max-line="6"
                />
                <MiTextarea
                    v-model="textareaDisabledValue"
                    label="Disabled"
                    placeholder="無効状態"
                    disabled
                />
                <span>値: {{ textareaValue || '（未入力）' }}</span>
            </div>
        </section>

        <section class="pg-section">
            <h2>Autocomplete</h2>
            <div style="display: flex; flex-direction: column; gap: 12px; max-width: 400px;">
                <MiAutocomplete
                    v-model="autocompleteValue"
                    :items="autocompleteItems"
                    label="果物を選択"
                    placeholder="キーワードで絞り込み"
                    clearable
                />
                <MiAutocomplete
                    v-model="autocompleteTopValue"
                    :items="autocompleteItems"
                    label="上方向に展開（position=top）"
                    placeholder="キーワードで絞り込み"
                    position="top"
                    clearable
                />
                <span>下方向: {{ autocompleteValue || '未選択' }} / 上方向: {{ autocompleteTopValue || '未選択' }}</span>
            </div>
        </section>

        <section class="pg-section">
            <h2>DatePicker</h2>
            <div class="pg-row" style="align-items: flex-start; flex-wrap: wrap; gap: 24px;">
                <div>
                    <p style="margin-bottom: 8px;">デフォルト（日本語表示）</p>
                    <MiDatePicker v-model="datePickerValue" label="日付を選択" />
                </div>
                <div>
                    <p style="margin-bottom: 8px;">スラッシュ区切り</p>
                    <MiDatePicker
                        v-model="datePickerValue"
                        label="日付を選択"
                        format="YYYY/MM/DD"
                    />
                </div>
                <div>
                    <p style="margin-bottom: 8px;">Disabled</p>
                    <MiDatePicker v-model="datePickerValue" label="日付を選択" disabled />
                </div>
            </div>
            <span>値: {{ datePickerValue || '未選択' }}</span>
        </section>
    </div>
</template>
