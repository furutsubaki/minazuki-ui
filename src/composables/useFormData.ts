/*
 * ==================================================
 * File Name    composables/useFormData.ts
 * Description  バリデーション
 * ==================================================
 */

import { computed } from 'vue';
import { useForm, type GenericObject } from 'vee-validate';
import type { ZodEffects, ZodObject, ZodRawShape } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import type { PartialDeep } from 'type-fest';

export default function <T extends GenericObject>(
    schema: ZodEffects<ZodObject<ZodRawShape>> | ZodObject<ZodRawShape>,
    initialValues: PartialDeep<T>
) {
    const params: { [key: string]: unknown } = {
        validationSchema: toTypedSchema(schema)
    };
    if (initialValues) {
        params.initialValues = initialValues;
    }
    const { handleSubmit, meta, isSubmitting, resetForm, values, setFieldValue, setValues } =
        useForm<T>(params);

    const canSubmit = computed(() => !!meta.value.valid && !isSubmitting.value);
    return { handleSubmit, canSubmit, resetForm, values: values as T, setFieldValue, setValues };
}
