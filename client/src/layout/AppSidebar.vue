<script setup>
import AppMenu from './AppMenu.vue';
</script>

<template>
    <div class="layout-sidebar" style="left: 0rem; border-radius: 0;">
        <app-menu></app-menu>
    </div>
</template>

<style scoped>
    .layout-sidebar {
        position: fixed;
    width: 20rem;
    height: calc(100vh);
    z-index: 999;
    overflow-y: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    top: 3rem;
    transition: transform var(--layout-section-transition-duration), left var(--layout-section-transition-duration);
    background-color: var(--surface-overlay);
    border-radius: var(--content-border-radius);
    padding: 0.5rem 1.5rem;
    }
</style>
