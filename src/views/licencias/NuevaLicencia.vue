<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Nueva Licencia</h1>
        </div>
        <BaseForm :type-form="'licencia'" :icons-view="['IconPlus']" />
    </main>
</template>
<script setup>
import BaseForm from "@/components/forms/BaseForm.vue";
</script>