import '@acab/reset.css';
import 'minazuki-ui/dist/style.css';
import '@vuepic/vue-datepicker/dist/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue';
import { createRouter, createWebHistory } from 'vue-router';
import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { init } from 'i18next';
import { z } from 'zod';
import { zodI18nMap } from 'zod-i18n-map';
import translation from 'zod-i18n-map/locales/ja/zod.json';
import MinazukiUi from 'minazuki-ui';

import App from './App.vue';
import HomeView from './views/HomeView.vue';

// vee-validate: 全ルール登録
Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule);
});

// i18next + zod 日本語化
init({
    lng: 'ja',
    resources: {
        ja: { zod: translation }
    }
});

const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    if (
        issue.code === z.ZodIssueCode.too_small &&
        issue.type === 'string' &&
        issue.minimum === 1
    ) {
        return { message: 'この項目は必須項目です。' };
    }
    return zodI18nMap(issue, ctx);
};
z.setErrorMap(customErrorMap);

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomeView },
        { path: '/forms', component: () => import('./views/FormsView.vue') },
        { path: '/feedback', component: () => import('./views/FeedbackView.vue') },
        { path: '/navigation', component: () => import('./views/NavigationView.vue') }
    ]
});

const app = createApp(App);
const pinia = createPinia();
const head = createHead();

app.use(pinia);
app.use(head);
app.use(router);
app.use(MinazukiUi);

app.mount('#app');
