<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Feature Flags</h1>
        </div>
        <BaseTable :table="'featureFlags'" :icons-view="['IconFlag']" />
    </main>
</template>
<script setup>
import BaseTable from "@/components/tables/BaseTable.vue";
</script>