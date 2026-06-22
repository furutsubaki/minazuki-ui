import '@acab/reset.css';
import 'minazuki-ui/dist/style.css';
import '@vuepic/vue-datepicker/dist/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue';
import { createRouter, createWebHistory } from 'vue-router';
import { setupValidate } from 'playground-shared/validate';
import MinazukiUi from 'minazuki-ui';

import App from './App.vue';
import HomePage from 'playground-shared/pages/HomePage.vue';

setupValidate();

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: HomePage },
        { path: '/forms', component: () => import('playground-shared/pages/FormsPage.vue') },
        { path: '/feedback', component: () => import('playground-shared/pages/FeedbackPage.vue') },
        { path: '/navigation', component: () => import('playground-shared/pages/NavigationPage.vue') },
        { path: '/tokens', component: () => import('playground-shared/pages/TokensPage.vue') }
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
