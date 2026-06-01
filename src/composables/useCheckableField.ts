import type { MaybeRefOrGetter } from 'vue';
import { useField } from 'vee-validate';

export function useCheckableField<T>(
    fieldName: MaybeRefOrGetter<string>,
    type: 'checkbox' | 'radio',
    checkedValue: T,
    uncheckedValue: T
) {
    const { value, checked, errors, handleChange, setTouched, meta } =
        useField<T>(fieldName, undefined, { type, checkedValue, uncheckedValue });

    const onFieldChange = (val: unknown) => {
        setTouched(true);
        handleChange(val);
    };

    return { value, checked, errors, meta, onFieldChange, setTouched };
}

export default useCheckableField;
