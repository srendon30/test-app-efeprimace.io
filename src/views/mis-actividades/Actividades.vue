<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Mis Actividades</h1>
        </div>
        <Tabs v-if="!isLoadingApp" :tabs="tabs" :icons="formIconNames" />
    </main>
</template>
<script setup>
import AppLoader from '@/components/loader/AppLoader.vue';
import Tabs from '@/components/tabs/Tabs.vue';
import BaseForm from "@/components/forms/BaseForm.vue";
import BaseTable from "@/components/tables/BaseTable.vue";
import { ref, onUnmounted, watch, onMounted, markRaw } from 'vue';
import { HttpError, showErrorMessage } from "@/helpers/errors";
import MisActividades from '@/views/mis-actividades/MisActividades.vue';

const isLoadingApp = ref(false);
const formIconNames = ref(['IconSettings', 'IconSurvey', 'IconDocumentCheck', 'IconUsers', 'IconDownload', 'IconList']);

const tabs = ref([
    {
        title: 'Actividades Proyectos',
        icon: 'IconList',
        component: markRaw(MisActividades),
        props: {}
    },
    {
        title: 'Actividades Generales Proyectos',
        icon: 'IconSurvey',
        component: markRaw(BaseForm),
        props: {
            'icons-view': [],
            'type-form': 'actividadesGeneralesProyectos',
            'row-selected': null,
        }
    },
    {
        title: 'Actividades Generales',
        icon: 'IconSurvey',
        component: markRaw(BaseForm),
        props: {
            'icons-view': [],
            'type-form': 'actividadesGenerales',
            'row-selected': null,
        }
    },
]);
</script>