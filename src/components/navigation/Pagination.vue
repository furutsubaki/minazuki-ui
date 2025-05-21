<script setup lang="ts">
import { type Component, computed } from 'vue';
import Button from '@/components/basic/Button.vue';
import Frame from '@/components/frame/Frame.vue';
import PictureFrame from '@/components/frame/PictureFrame.vue';

export interface MiPaginationItem {
    label: string;
    icon: Component;
    to: string;
    isCurrent?: boolean;
}

// TODO: 設定でoverrideできるようにする
const PAGENATION_LIMIT = 9;
const PAGENATION_LIMIT_MOBILE = 5;

const currentPage = defineModel<number>({ default: 0 });
const props = withDefaults(
    defineProps<{
        /**
         *  最大ページ数
         */
        total: number;
        /**
         *  ページネーション自体の表示数
         */
        pagenationLimit?: number;
        /**
         *  ページネーション自体の表示数（モバイル用）
         */
        pagenationLimitMobile?: number;
        /**
         * サイズ
         */
        size?: 'small' | 'medium' | 'large';
        /**
         * 形状
         */
        shape?: 'normal' | 'picture-frame' | 'skeleton';
        /**
         * 影なしか
         */
        noShadow?: boolean;
        /**
         * 一つ前後に移動するボタンを表示するか
         */
        hidePrevNextButton?: boolean;
        /**
         * 最初と最後に移動するボタンを表示するか
         */
        hideFirstLastButton?: boolean;
    }>(),
    {
        pagenationLimit: PAGENATION_LIMIT,
        pagenationLimitMobile: PAGENATION_LIMIT_MOBILE,
        size: 'medium',
        shape: 'normal',
        noShadow: false,
        hidePrevNextButton: false,
        hideFirstLastButton: false
    }
);

const component = computed(() => {
    if (props.shape === 'picture-frame') {
        return PictureFrame;
    } else if (props.shape === 'normal') {
        return Frame;
    } else {
        return 'div';
    }
});

const pages = computed(() => {
    const originalPages = [...Array(props.total)].map((_, i) => ({
        num: i + 1
    }));

    if (!originalPages.length) {
        return [];
    }

    const clientWidth = document.body.clientWidth;

    const pagenationLimit = clientWidth > 600 ? props.pagenationLimit : props.pagenationLimitMobile;
    const PAGENATION_LIMIT_CALC = pagenationLimit / 2;
    const limitPrev = Math.max(currentPage.value - PAGENATION_LIMIT_CALC, 0);
    const limitNext = Math.min(currentPage.value + PAGENATION_LIMIT_CALC, props.total + 1);
    let pages = originalPages.filter((page) => {
        return limitPrev < page.num && limitNext > page.num;
    });

    if (props.total === 1) {
        const dummyArr = [...Array(4)].map(() => ({ num: 0 }));
        // 前後に追加
        pages = dummyArr.concat(pages);
        pages = pages.concat(dummyArr);
    } else if (pagenationLimit > pages.length) {
        // dummyを追加しないといけない
        const dummyCount = pagenationLimit - pages.length;
        const dummyArr = [...Array(dummyCount)].map(() => ({ num: 0 }));
        const index = Math.max(
            pages.findIndex((page) => page.num === currentPage.value),
            0
        );

        dummyArr.forEach((dummy) => {
            if (pagenationLimit / 2 < pages.length - index) {
                // 前に追加
                pages = [dummy].concat(pages);
            } else {
                // 後に追加
                pages = pages.concat([dummy]);
            }
        });
    }
    return pages;
});
const paginationPrev = computed(() => {
    let prevPage = currentPage.value - 1;
    if (prevPage === 0) {
        return undefined;
    }
    return prevPage;
});
const paginationNext = computed(() => {
    let nextPage = currentPage.value + 1;
    if (nextPage > props.total) {
        return undefined;
    }
    return nextPage;
});

const onClick = (page: number | undefined) => {
    if (typeof page === 'number') {
        currentPage.value = page;
    } else {
        return;
    }
};
</script>

<template>
    <component :is="component" :noShadow="noShadow" class="component-pagination" :class="[size]">
        <ul class="pagination-list">
            <li
                v-if="!hideFirstLastButton"
                class="pagination-item prev-first"
                :class="{ 'is-disabled': currentPage === 1 }"
            >
                <Button shape="skeleton" class="pagination-item-button" @click="onClick(1)">
                    ≪
                </Button>
            </li>
            <li
                v-if="!hidePrevNextButton"
                class="pagination-item prev"
                :class="{ 'is-disabled': paginationPrev === undefined }"
            >
                <Button
                    shape="skeleton"
                    class="pagination-item-button"
                    @click="onClick(paginationPrev)"
                >
                    〈
                </Button>
            </li>
            <li
                v-for="(page, i) in pages"
                :key="i"
                class="pagination-item"
                :class="{
                    'is-current': page.num === currentPage
                }"
            >
                <Button
                    shape="skeleton"
                    v-if="page.num !== 0"
                    class="pagination-item-button"
                    @click="onClick(page.num)"
                >
                    {{ page.num }}
                </Button>
            </li>
            <li
                v-if="!hidePrevNextButton"
                class="pagination-item next"
                :class="{ 'is-disabled': paginationNext === undefined }"
            >
                <Button
                    shape="skeleton"
                    class="pagination-item-button"
                    @click="onClick(paginationNext)"
                >
                    〉
                </Button>
            </li>
            <li
                v-if="!hideFirstLastButton"
                class="pagination-item next-last"
                :class="{ 'is-disabled': currentPage === total }"
            >
                <Button shape="skeleton" class="pagination-item-button" @click="onClick(total)">
                    ≫
                </Button>
            </li>
        </ul>
    </component>
</template>

<style scoped>
.component-pagination {
    width: 100%;
    height: var(--c-pagination-size);
}

.pagination-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    word-break: keep-all;
    .pagination-item {
        position: relative;
        display: flex;
        gap: 0;
        align-items: center;
        justify-content: center;
        width: var(--c-pagination-size);
        height: var(--c-pagination-size);
        transition: opacity 0.2s;
        .pagination-item-button {
            width: 100%;
            height: 100%;
        }
        &.is-current {
            pointer-events: none;
            .pagination-item-button {
                color: red;
            }
        }
        &.is-disabled {
            visibility: hidden;
            opacity: 0;
            transition:
                opacity 0.2s,
                visibility 0s 0.2s;
        }
        .icon {
            width: calc(var(--c-pagination-font-size) * 2);
            height: 100%;
            transition:
                width 0.2s,
                height 0.2s;
        }
        .label {
            position: absolute;
            bottom: -1.5em;
            font-size: var(--font-size-small);
            line-height: 1;
            transition: bottom 0.2s;
        }
        &.is-current {
            color: var(--color-theme-text-primary);
            pointer-events: none;
            .icon {
                width: calc(var(--c-pagination-font-size) * 1.5);
                height: calc(var(--c-pagination-font-size) * 2.2);
            }
            .label {
                bottom: calc(var(--c-pagination-font-size) * 0.25);
            }
        }

        /* hover */
        @media (hover: hover) {
            &:hover {
                .icon {
                    width: calc(var(--c-pagination-font-size) * 1.5);
                    height: calc(var(--c-pagination-font-size) * 2.2);
                }
                .label {
                    bottom: calc(var(--c-pagination-font-size) * 0.25);
                }
            }
        }

        @media (hover: none) {
            &:active {
                .icon {
                    width: calc(var(--c-pagination-font-size) * 1.5);
                    height: calc(var(--c-pagination-font-size) * 2.2);
                }
                .label {
                    bottom: calc(var(--c-pagination-font-size) * 0.25);
                }
            }
        }
    }
}

/* ▼ size ▼ */

.large {
    --c-pagination-size: 56px;
    --c-pagination-font-size: var(--font-size-large);
}

.medium {
    --c-pagination-size: 48px;
    --c-pagination-font-size: var(--font-size-medium);
}

.small {
    --c-pagination-size: 40px;
    --c-pagination-font-size: var(--font-size-small);
}

/* ▲ size ▲ */
</style>
