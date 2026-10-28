/*
 * ==================================================
 * File Name    composables/useFormData.ts
 * Description  バリデーション
 * ==================================================
 */

import { computed } from 'vue';
import { useForm, type GenericObject } from 'vee-validate';
import type { z } from 'zod';
import type { PartialDeep } from 'type-fest';
import { toTypedSchema } from '@/assets/ts/zodTypedSchema';

// ルートの z.preprocess() は入力型が unknown になるため、その場合はフォーム値を GenericObject として扱う
type FormInput<S extends z.ZodType> = z.input<S> extends GenericObject ? z.input<S> : GenericObject;

// フォーム値の型 T は従来どおり initialValues から推論する。未チェックの Checkbox（literal(true) に false）のように、
// 初期値はスキーマの入力型を満たさないことがあるため、スキーマの型には縛らない
export default function <S extends z.ZodType<GenericObject, unknown>, T extends GenericObject = FormInput<S>>(
    schema: S,
    initialValues: PartialDeep<T>
) {
    const params: { [key: string]: unknown } = {
        validationSchema: toTypedSchema(schema as unknown as z.ZodType<z.output<S>, T>)
    };
    if (initialValues) {
        params.initialValues = initialValues;
    }
    const { handleSubmit, meta, isSubmitting, resetForm, values, setFieldValue, setValues } =
        useForm<T, z.output<S>>(params);

    const canSubmit = computed(() => !!meta.value.valid && !isSubmitting.value);
    return { handleSubmit, canSubmit, resetForm, values: values as T, setFieldValue, setValues };
}
