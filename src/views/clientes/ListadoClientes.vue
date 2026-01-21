<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Listado Clientes</h1>
        </div>
        <BaseTable :table="'clientes'" :icons-view="['IconList']" />
    </main>
</template>
<script setup>
import BaseTable from "@/components/tables/BaseTable.vue";
</script>