<script setup lang="ts">
import { useTheme } from 'minazuki-ui';

const { currentTheme, setTheme } = useTheme();

const toggleTheme = () => {
    const next = currentTheme.value === 'light' ? 'dark' : 'light';
    currentTheme.value = next;
    setTheme(next);
};
</script>

<template>
    <div class="pg-layout">
        <header class="pg-header">
            <span class="pg-header-title">minazuki-ui playground (Nuxt 3)</span>
            <nav class="pg-nav">
                <NuxtLink to="/">Home</NuxtLink>
                <NuxtLink to="/forms">Forms</NuxtLink>
                <NuxtLink to="/feedback">Feedback</NuxtLink>
                <NuxtLink to="/navigation">Navigation</NuxtLink>
                <NuxtLink to="/tokens">Tokens</NuxtLink>
            </nav>
            <MiButton :variant="currentTheme === 'dark' ? 'primary' : 'secondary'" size="small" @click="toggleTheme">
                {{ currentTheme === 'dark' ? 'Light' : 'Dark' }} Mode
            </MiButton>
        </header>

        <main class="pg-main">
            <NuxtPage />
        </main>

        <MiNotifications />
    </div>
</template>
