<template>
    <main>
        <AppLoader v-if="isLoadingApp" />
        <div class="wrapper flex items-center justify-center mb-10">
            <h1 class="text-2xl text-identity-dark dark:text-gray-300">Respuestas Encuesta Satisfacción</h1>
        </div>
        <BaseTable :table="'respuestasEncuestaSatisfaccion'" :icons-view="['IconSurvey']" :bar-actions="barActions"
            @dynamicEvent="handleDynamicEvent" />
        <!-- Modal para acciones -->
        <Modal :is-modal-open="isActionModalOpen" @close-modal="closeActionModal" max-height="max-entity-height"
            max-width="max-w-5xl">
            <template #icon>
                <component :class="['w-9 h-9']" :is="actionsIcon(actionSelected)" />
            </template>
            <template #title>
                <h3 class="text-lg font-medium leading-6 text-gray-800 capitalize dark:text-white" id="modal-title">
                    {{ modalActionTitle }}
                </h3>
            </template>
            <template #content>
                <BaseForm :type-form="typeTableForm" :action-selected="actionSelected"
                    @close-modal="closeActionModal" />
            </template>
        </Modal>
    </main>
</template>
<script setup>
import AppLoader from '@/components/loader/AppLoader.vue';
import BaseTable from "@/components/tables/BaseTable.vue";
import Modal from "@/components/helpers/Modal.vue"
import BaseForm from "@/components/forms/BaseForm.vue";
import { useBusinessStore } from '@/stores/business';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ref, defineAsyncComponent } from 'vue';

const { downloadAllAnswersSurvey } = useBusinessStore();
const isLoadingApp = ref(false);
const isActionModalOpen = ref(false);

const actionSelected = ref('');
const modalActionTitle = ref('')
const typeTableForm = ref('')

const barActions = [
    {
        title: 'Descargar Todo',
        emit: 'downloadAnswersSurvey',
        tooltip: 'Descargar todas las respuestas de la encuesta',
    },
    {
        title: 'Descargar con Filtro',
        emit: 'downloadFilteredAnswersSurvey',
        tooltip: 'Descargar respuestas de la encuesta con filtro',
    }
]
const handleDynamicEvent = ({ eventName, payload }) => {

    if (eventsMapped[eventName]) {
        eventsMapped[eventName](payload);
        return;
    }
    console.log(`No se encontró un manejador para el evento: ${eventName}`);
}

const eventsMapped = {
    'downloadAnswersSurvey': (payload) => {
        console.log('Descargar respuestas de la encuesta', payload);
        downloadAnswersSurvey(payload);
    },
    'downloadFilteredAnswersSurvey': (payload) => {
        console.log('Descargar respuestas de la encuesta con filtro', payload);
        actionSelected.value = 'download_filtered_answers_survey';
        modalActionTitle.value = 'Descargar Respuestas con Filtro';
        typeTableForm.value = 'filteredAnswersSurvey';
        isActionModalOpen.value = true;
    },
}

const downloadAnswersSurvey = async () => {
    try {
        Swal.fire({
            position: 'center',
            title: '¿Estás seguro?',
            text: '¿Deseas descargar todas las respuestas de la encuesta?',
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
                try {
                    await downloadAllAnswersSurvey();
                } catch (error) {
                    console.error('Error downloading all answers:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron descargar las respuestas de la encuesta.',
                    });
                    isLoadingApp.value = false;
                    return;
                }
                isLoadingApp.value = false;
            }
            if (result.isDismissed) {
                console.log('Descarga de respuestas cancelada');
                isLoadingApp.value = false;
            }
        });

    } catch (error) {
        console.error('Error downloading all answers:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron descargar las respuestas de la encuesta.',
        });
    }
};

const actionsIconMap = {
    download_filtered_answers_survey: 'IconDownload',
};
const actionsIcon = (action) => {
    const iconName = getActionIcon(action)
    return defineAsyncComponent(() => import(`@/components/icons/${iconName}.vue`));
}
const getActionIcon = (action) => {
    return actionsIconMap[action] || 'IconWarning'
}
const closeActionModal = () => {
    isActionModalOpen.value = false;
    actionSelected.value = '';
    modalActionTitle.value = '';
    typeTableForm.value = '';
}
</script>