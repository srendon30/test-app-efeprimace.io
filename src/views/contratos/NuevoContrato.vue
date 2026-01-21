<template>
    <main>
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Nuevo Contrato</h1>
        </div>
        <div v-if="isFeatureActive('new_contrato_access')" class="wrapper flex items-center justify-center">
            <BaseForm :type-form="'contrato'" :icons-view="['IconContract']" />
        </div>
        <div v-else>
            <NoAccessFeatureFlag description="Acceso al nuevo contrato no disponible temporalmente." />
        </div>
    </main>
</template>
<script setup>
import BaseForm from "@/components/forms/BaseForm.vue";
import NoAccessFeatureFlag from "@/components/helpers/NoAccessFeatureFlag.vue";
import { useFeatureFlagsStore } from '@/stores/featureFlags';
const { isFeatureActive } = useFeatureFlagsStore();
</script>