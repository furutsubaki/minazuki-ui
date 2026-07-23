import type { App } from 'vue';
import MiDatePicker from '@/components/controls/DatePicker.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export { MiDatePicker, VueDatePicker };

export default {
    install(app: App) {
        app.component('MiDatePicker', MiDatePicker);
        app.component('VueDatePicker', VueDatePicker);
    }
};
