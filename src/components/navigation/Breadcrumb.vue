<script setup lang="ts">
import { type Component, getCurrentInstance } from 'vue';
import type { Router } from 'vue-router';
import { isSafeNavigationUrl } from '@/assets/ts/url';

export interface MiBreadcrumbItem {
    label?: string;
    icon?: Component;
    to?: string;
    replace?: boolean;
    href?: string;
    blank?: boolean;
}
withDefaults(
    defineProps<{
        /**
         * アイテム
         */
        items: MiBreadcrumbItem[];
        /**
         * セパレータ
         */
        separator?: string | Component;
        /**
         * タイトル
         */
        title?: string;
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
    }>(),
    {
        separator: '/',
        title: '',
        size: 'medium'
    }
);

const instance = getCurrentInstance()!;
const router = instance.appContext.config.globalProperties.$router as Router;
const safeHref = (item: MiBreadcrumbItem) => {
    const url = item.href ?? item.to ?? '#';
    return isSafeNavigationUrl(url) ? url : '#';
};
const onClick = (item: MiBreadcrumbItem) => {
    if (!item.href && !item.to) return;

    if (item.href || !item.to || !router) {
        // 通常の遷移
        const href = (item.href ?? item.to) as string;
        if (!isSafeNavigationUrl(href)) {
            // eslint-disable-next-line no-console
            console.warn(`[minazuki-ui] Unsafe navigation URL blocked: ${href}`);
            return;
        }
        if (item.blank) {
            window.open(href, '_blank', 'noopener,noreferrer');
        } else if (item.replace) {
            location.replace(href);
        } else {
            location.href = href;
        }
    } else {
        // routerによる遷移
        if (item.replace) {
            router.replace(item.to);
        } else {
            router.push(item.to);
        }
    }
};
</script>

<template>
    <nav class="component-breadcrumb" :class="[size]" aria-label="パンくずリスト">
        <slot name="prefix" />
        <template v-if="title">{{ title }}</template>
        <template v-for="(item, i) in items" :key="(item.to ?? '') + (item.href ?? '')">
            <span class="separator" v-if="i !== 0 || title"
                ><template v-if="typeof separator === 'string'">{{ separator }}</template
                ><component v-else :is="separator as any"
            /></span>
            <span
                v-if="items.length === i + 1"
                class="link is-disabled"
                aria-current="page"
                ><component :is="item.icon" v-if="item.icon" />{{ item.label }}</span
            >
            <a
                v-else
                class="link"
                :href="safeHref(item)"
                :target="item.blank ? '_blank' : undefined"
                :rel="item.blank ? 'noopener noreferrer' : undefined"
                @click.prevent="onClick(item)"
                ><component :is="item.icon" v-if="item.icon" />{{ item.label }}</a
            >
        </template>
        <slot name="suffix" />
    </nav>
</template>

<style scoped>
.component-breadcrumb {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    min-height: var(--c-breadcrumb-height);
    font-size: var(--c-breadcrumb-font-size);
    word-break: keep-all;
    .separator {
        font-size: var(--font-size-small);
    }
    .link {
        color: var(--color-link);
        text-decoration: none;
        cursor: pointer;
        transition: color 0.2s;

        @media (hover: hover) {
            /* PC */
            &:hover {
                color: var(--color-link-hover);
            }
        }

        @media (hover: none) {
            /* mobile */
            &:active {
                color: var(--color-link-hover);
            }
        }
        &.is-disabled {
            color: var(--color-text-primary);
            pointer-events: none;
            opacity: 0.5;
        }
    }
}

/* ▼ size ▼ */

.large {
    --c-breadcrumb-height: 40px;
    --c-breadcrumb-font-size: var(--font-size-medium);
}

.medium {
    --c-breadcrumb-height: 32px;
    --c-breadcrumb-font-size: var(--font-size-medium);
}

.small {
    --c-breadcrumb-height: 24px;
    --c-breadcrumb-font-size: var(--font-size-small);
}

/* ▲ size ▲ */
</style>
