<template>
  <div v-if="isAppReady" class="layout">
    <Sidebar v-if="!isMobile" :collapsed="isSidebarCollapsed" />
    <Navbar />
  </div>
</template>
<script setup>
import Navbar from "./Navbar.vue"
import Sidebar from "./Sidebar.vue"
import { useMainStore } from "@/stores/main"
import { useAuthStore } from "@/stores/auth"
import { storeToRefs } from 'pinia';

const { isSidebarCollapsed, isMobile } = storeToRefs(useMainStore())
const { isAppReady } = storeToRefs(useAuthStore())

</script>

<style>
.layout {
  display: flex;
}
</style>