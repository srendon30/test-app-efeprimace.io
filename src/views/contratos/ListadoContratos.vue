<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Listado Contratos</h1>
        </div>
        <div v-if="isFeatureActive('list_contratos_access')" class="wrapper flex items-center justify-center">
            <BaseTable :table="'contratos'" :icons-view="['IconList']" />
        </div>
        <div v-else>
            <NoAccessFeatureFlag description="Acceso a la lista de contratos no disponible temporalmente." />
        </div>
    </main>
</template>
<script setup>
import BaseTable from "@/components/tables/BaseTable.vue";
import NoAccessFeatureFlag from "@/components/helpers/NoAccessFeatureFlag.vue";
import { useFeatureFlagsStore } from '@/stores/featureFlags';
const { isFeatureActive } = useFeatureFlagsStore();
</script>