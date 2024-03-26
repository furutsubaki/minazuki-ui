import '@acab/reset.css';
import '@/assets/css/variables.css';
import '@/assets/css/style.css';
import '@/assets/css/override.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import useValidate from '@/plugins/init-validate';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import vClickOutside from 'click-outside-vue3';
import useTheme from '@/composables/useTheme';

const app = createApp(App);

app.use(createPinia());
app.use(vClickOutside);
app.use(useTheme);
app.component('VueDatePicker', VueDatePicker);

useValidate();

const { currentTheme, setTheme } = useTheme();
// 初期style設定
setTheme(currentTheme.value);

app.mount('#app');
