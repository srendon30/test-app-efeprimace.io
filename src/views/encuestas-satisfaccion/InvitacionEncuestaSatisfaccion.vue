<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Invitar Encuesta Satisfacción</h1>
        </div>
        <BaseTable :table="'invitacionesEncuestaSatisfaccion'" :icons-view="['IconSurvey']" />
    </main>
</template>
<script setup>
import BaseTable from "@/components/tables/BaseTable.vue";
</script>