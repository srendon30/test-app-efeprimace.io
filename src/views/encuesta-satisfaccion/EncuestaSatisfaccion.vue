<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Encuesta Satisfacción</h1>
        </div>
        <p class="text-identity-dark my-6">F'C SAS, con el fin de conocer el grado de satisfacción que su empresa tiene con nuestra compañía, le solicitamos diligenciar la siguiente encuesta. Para la calificación, por favor tener en cuenta que 1 es la menor calificación y 5 la mayor. (5: Excelente; 4: Muy bien; 3: Aceptable; 2: Regular; 1: Bajo)</p>
        <BaseForm :type-form="'encuestaSatisfaccion'" :icons-view="[]" />
    </main>
</template>
<script setup>
import BaseForm from "@/components/forms/BaseForm.vue";
</script>