import { defineRule } from 'vee-validate';
import { all } from '@vee-validate/rules';
import { initValidate } from 'minazuki-ui';

export default defineNuxtPlugin(() => {
    Object.entries(all).forEach(([name, rule]) => {
        defineRule(name, rule);
    });
    initValidate();
});
