<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Mis Reportes</h1>
        </div>
        <Tabs v-if="!isLoadingApp" :tabs="tabs" :icons="formIconNames" />
    </main>
</template>
<script setup>
import { ref, onMounted, markRaw } from 'vue';
import BaseForm from "@/components/forms/BaseForm.vue";
import BaseTable from "@/components/tables/BaseTable.vue";
import Tabs from '@/components/tabs/Tabs.vue';
import { useBusinessStore } from '@/stores/business';
import AppLoader from '@/components/loader/AppLoader.vue';
import Swal from "sweetalert2/dist/sweetalert2.js";

const formIconNames = ref(['IconReport', 'IconProject', 'IconSettings', 'IconArrowRounded', 'IconDocumentCheck', 'IconUsers', 'IconDownload', 'IconSurvey']);

const { generateCategorizacionEmployees } = useBusinessStore();

const isLoadingApp = ref(false);

const tabs = ref([
    {
        title: 'Reportes Proyecto',
        icon: 'IconProject',
        component: markRaw(BaseTable),
        props: {
            'table': 'misReportes',
            'icons-view': [],
            'show-search': true,
        }
    },
    {
        title: 'Reportes Generales Proyecto',
        icon: 'IconSurvey',
        component: markRaw(BaseTable),
        props: {
            'table': 'misReportesGeneralesProyectos',
            'icons-view': [],
            'show-search': true,
        }
    },
    {
        title: 'Reportes Generales',
        icon: 'IconReport',
        component: markRaw(BaseTable),
        props: {
            'table': 'misReportesGenerales',
            'icons-view': [],
            'show-search': true,
        }
    },
    {
        title: 'Descargar Reportes',
        icon: 'IconDownload',
        component: markRaw(BaseForm),
        props: {
            'icons-view': [],
            'type-form': 'reportesMisReportes',
            'action-selected': 'download_report_categorization',
            'row-selected': null,
        }
    },
])
</script>