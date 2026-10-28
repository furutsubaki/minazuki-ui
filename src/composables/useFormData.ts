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

// フォーム値の型はスキーマの入力型を基準にする。初期値から推論すると null が null 型に固定されるため。
// ただし未チェックの Checkbox（literal(true) に false）のように初期値がスキーマの型を満たさないフィールドは、初期値の型も足す
type FormValues<V, I> = {
    [K in keyof V]: K extends keyof I ? (Exclude<I[K], undefined> extends V[K] ? V[K] : V[K] | I[K]) : V[K];
};

export default function <S extends z.ZodType<GenericObject, unknown>, I extends GenericObject = PartialDeep<FormInput<S>>>(
    schema: S,
    initialValues: I
) {
    type T = FormValues<FormInput<S>, I>;
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
