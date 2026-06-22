<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useTheme } from 'minazuki-ui';
import 'playground-shared/styles/playground.css';

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
            <span class="pg-header-title">minazuki-ui playground (Vue 3)</span>
            <nav class="pg-nav">
                <RouterLink to="/">Home</RouterLink>
                <RouterLink to="/forms">Forms</RouterLink>
                <RouterLink to="/feedback">Feedback</RouterLink>
                <RouterLink to="/navigation">Navigation</RouterLink>
                <RouterLink to="/tokens">Tokens</RouterLink>
            </nav>
            <MiButton :variant="currentTheme === 'dark' ? 'primary' : 'secondary'" size="small" @click="toggleTheme">
                {{ currentTheme === 'dark' ? 'Light' : 'Dark' }} Mode
            </MiButton>
        </header>

        <main class="pg-main">
            <RouterView />
        </main>

        <MiNotifications />
    </div>
</template>
