import { describe, expect, it, vi } from 'vitest';
import type { App } from 'vue';
import datepicker, { MiDatePicker, VueDatePicker } from '@/datepicker';

describe('datepicker エントリーポイント', () => {
    it('DatePicker コンポーネントを公開する', () => {
        expect(MiDatePicker).toBeDefined();
        expect(VueDatePicker).toBeDefined();
    });

    it('Vue プラグインとして両コンポーネントを登録する', () => {
        const component = vi.fn();

        datepicker.install({ component } as unknown as App);

        expect(component).toHaveBeenNthCalledWith(1, 'MiDatePicker', MiDatePicker);
        expect(component).toHaveBeenNthCalledWith(2, 'VueDatePicker', VueDatePicker);
    });
});
