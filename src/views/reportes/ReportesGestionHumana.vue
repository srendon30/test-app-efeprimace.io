<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Reportes GH</h1>
        </div>
        <BaseForm :type-form="'reportesGH'" :icons-view="['IconReport']" :action-selected="'download_reporte_gh'" />
    </main>
</template>
<script setup>
import BaseForm from "@/components/forms/BaseForm.vue";
</script>