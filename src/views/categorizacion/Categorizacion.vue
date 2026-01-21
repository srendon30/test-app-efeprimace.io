<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Categorización</h1>
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

const formIconNames = ref(['IconSettings', 'IconArrowRounded', 'IconDocumentCheck', 'IconUsers', 'IconDownload']);

const { generateCategorizacionEmployees } = useBusinessStore();

const isLoadingApp = ref(false);

const tabs = ref([
    {
        title: 'Generar',
        icon: 'IconArrowRounded',
        component: markRaw(BaseForm),
        props: {
            'icons-view': [],
            'type-form': 'categorizacion',
            'row-selected': null,
        }
    },
    {
        title: 'Resultados',
        icon: 'IconDocumentCheck',
        component: markRaw(Tabs),
        props: {
            'tabs': [
                {
                    title: 'Resultados Internos',
                    icon: 'IconResponse',
                    component: markRaw(BaseTable),
                    props: {
                        'table': 'resultadosCategorizacionInterna',
                        'icons-view': [],
                        'show-search': true,
                    }
                },
                {
                    title: 'Resultados Externos',
                    icon: 'IconUsers',
                    component: markRaw(BaseTable),
                    props: {
                        'table': 'resultadosCategorizacionExterna',
                        'icons-view': [],
                        'show-search': true,
                    }
                }
            ],
            'icons': ['IconResponse', 'IconUsers'],
        }
    },
    {
        title: 'Relación Empleados',
        icon: 'IconUsers',
        component: markRaw(BaseTable),
        props: {
            'table': 'relacionCategorizacionEmpleados',
            'icons-view': [],
            'show-search': true,
            'bar-actions': [
                {
                    title: 'Generar Categorización',
                    emit: 'generateCategorizacion',
                    tooltip: 'Generar Categorización para todos los empleados',
                }
            ]
        }
    },
    {
        title: 'Competencias',
        icon: 'IconSettings',
        childs: [
            {
                title: 'Categorias',
                icon: 'IconSettings',
                component: markRaw(BaseTable),
                props: {
                    'table': 'configuracionCategorizacion',
                    'icons-view': [],
                    'show-search': false,
                }
            },
            {
                title: 'Educación',
                icon: 'IconSettings',
                component: markRaw(BaseTable),
                props: {
                    'table': 'categorizacionEducacion',
                    'icons-view': [],
                    'show-search': false,
                }
            },
            {
                title: 'Formación',
                icon: 'IconSettings',
                component: markRaw(BaseTable),
                props: {
                    'table': 'categorizacionFormacion',
                    'icons-view': [],
                    'show-search': false,
                }
            },
            {
                title: 'Experiencia',
                icon: 'IconSettings',
                component: markRaw(BaseTable),
                props: {
                    'table': 'categorizacionExperiencia',
                    'icons-view': [],
                    'show-search': false,
                }
            },
        ]
    },
    {
        title: 'Salarios Base',
        icon: 'IconSettings',
        component: markRaw(BaseTable),
        props: {
            'table': 'salariosBase',
            'icons-view': [],
            'show-search': false,
        }
    },
    {
        title: 'Reportes',
        icon: 'IconDownload',
        component: markRaw(BaseForm),
        props: {
            'icons-view': [],
            'type-form': 'reportesCategorizacion',
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
    'generateCategorizacion': (payload) => {
        console.log('Generar Categorización con payload:', payload);
        generateCategorizacion(payload);
    },
}

const generateCategorizacion = async (payload) => {
    Swal.fire({
        position: 'center',
        title: '¿Estás seguro?',
        text: 'Esta acción generará una categorización para todos los empleados (Ingeniería, Dibujo, Cantidades de Obra, Protección Sísmica, Desarrollo de Software).',
        icon: 'warning',
        showCancelButton: true,
        cancelButtonColor: 'gray',
        cancelButtonText: 'Cancelar',
        showConfirmButton: true,
        confirmButtonColor: '#EC7522',
        confirmButtonText: 'Generar',
        timer: null,
        allowOutsideClick: false,
        showCloseButton: true,
    }).then(async (result) => {
        if (result.isConfirmed) {
            isLoadingApp.value = true;
            const response = await generateCategorizacionEmployees()

            console.log('Respuesta de la generación de categorización:', response);
            if (response.status === 'success') {
                Swal.fire({
                    title: 'Categorización Generada',
                    text: response.message,
                    icon: 'success',
                    confirmButtonColor: '#EC7522',
                });
            }
            isLoadingApp.value = false;
        }

        if (result.isDismissed) {
            console.log('Generación de categorización cancelada');
            isLoadingApp.value = false;
        }
    })
}
</script>