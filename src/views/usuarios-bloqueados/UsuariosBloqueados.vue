<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Usuarios Bloqueados</h1>
        </div>
        <Tabs v-if="!isLoadingApp" :tabs="tabs" :icons="formIconNames" @dynamicEvent="handleDynamicEvent" />
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

const formIconNames = ref(['IconSettings', 'IconExperience', 'IconDocumentCheck', 'IconUsers', 'IconDownload']);

const isLoadingApp = ref(false);

const tabs = ref([
    {
        title: 'Usuarios Bloqueados',
        icon: 'IconUsers',
        component: markRaw(BaseTable),
        props: {
            'table': 'usuariosBloqueados',
            'icons-view': [],
            'show-search': true,
            'bar-actions': []
        }
    },
    {
        title: 'Reportes',
        icon: 'IconDownload',
        component: markRaw(BaseForm),
        props: {
            'icons-view': [],
            'type-form': 'reportesUsuariosBloqueados',
            'action-selected': 'download_report_categorization',
            'row-selected': null,
        }
    },
])

const handleDynamicEvent = ({ eventName, payload }) => {

    if (eventsMapped[eventName]) {
        eventsMapped[eventName](payload);
        return;
    }
    console.log(`No se encontró un manejador para el evento: ${eventName}`);
}

const eventsMapped = {
}
</script>